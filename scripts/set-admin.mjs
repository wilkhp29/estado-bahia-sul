import { chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, scryptSync } from 'node:crypto';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const envPath = '.env.local';
let env = readFileSync(envPath, 'utf8');
const terminal = createInterface({ input: stdin, output: stdout });
const email = (await terminal.question('E-mail do administrador: ')).trim().toLowerCase();
terminal.close();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('Informe um e-mail válido.');
  process.exit(1);
}

function readHidden(prompt) {
  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const onData = (chunk) => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\u0003') {
          stdin.off('data', onData);
          stdin.setRawMode(false);
          stdout.write('\n');
          reject(new Error('Operação cancelada.'));
          return;
        }
        if (char === '\r' || char === '\n') {
          stdin.off('data', onData);
          stdin.setRawMode(false);
          stdin.pause();
          stdout.write('\n');
          resolve(value);
          return;
        }
        if (char === '\u007f' || char === '\b') value = value.slice(0, -1);
        else if (char >= ' ' && char !== '\u007f') value += char;
      }
    };
    stdin.on('data', onData);
  });
}

let password;
try {
  password = await readHidden('Nova senha (não será exibida): ');
} catch {
  console.error('Operação cancelada.');
  process.exit(1);
}
if (password.length < 12 || password.length > 256) {
  console.error('A senha deve ter entre 12 e 256 caracteres.');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
password = '';
for (const [name, value] of [['ADMIN_EMAIL', email], ['ADMIN_PASSWORD_HASH', passwordHash]]) {
  const line = new RegExp(`^${name}=.*$`, 'm');
  env = line.test(env) ? env.replace(line, `${name}=${value}`) : `${env.trimEnd()}\n${name}=${value}\n`;
}
writeFileSync(envPath, env, { mode: 0o600 });
chmodSync(envPath, 0o600);
writeFileSync('private/acesso-admin.txt', `Acesso local: ${process.env.SITE_URL || 'http://localhost:3000'}/admin\nE-mail: ${email}\nA senha está armazenada como hash em .env.local.\n`, { mode: 0o600 });
console.log('Acesso administrativo atualizado. Senha armazenada somente como hash; reinicie o servidor.');
