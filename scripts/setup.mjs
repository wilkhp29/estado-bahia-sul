import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {randomBytes,scryptSync} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
if(existsSync('.env.local')){console.error('.env.local já existe. Não foi sobrescrito. Consulte docs/v1-operacao.md.');process.exit(1);}
const terminal=createInterface({input:stdin,output:stdout});
const email=(await terminal.question('E-mail do administrador: ')).trim().toLowerCase();
terminal.close();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){console.error('Informe um e-mail válido.');process.exit(1);}
mkdirSync('private',{recursive:true,mode:0o700});
const password=randomBytes(24).toString('base64url');const salt=randomBytes(16).toString('hex');
const key=randomBytes(32).toString('hex');
writeFileSync('.env.local',`SITE_URL=http://localhost:3000\nDATABASE_PATH=private/bahia.sqlite\nDATA_ENCRYPTION_KEY=${key}\nADMIN_EMAIL=${email}\nADMIN_PASSWORD_HASH=${salt}:${scryptSync(password,salt,64).toString('hex')}\nDATA_CONTROLLER="José Carlos Guilherme Santos — Professor Guilherme"\nPRIVACY_EMAIL=\nPRIVACY_REVIEWED=false\nCOLLECTION_ENABLED=false\nRETENTION_DAYS=365\n`,{mode:0o600,flag:'wx'});
writeFileSync('private/acesso-admin.txt',`Acesso local: http://localhost:3000/admin\nE-mail: ${email}\nSenha: ${password}\n\nGuarde em um gerenciador de senhas. Não compartilhe este arquivo. A coleta permanece desativada.\n`,{mode:0o600,flag:'wx'});
console.log('Configuração local criada. Credencial em private/acesso-admin.txt. Nenhum segredo foi exibido. Reinicie o servidor.');
