import { createHash, createHmac, createCipheriv, createDecipheriv, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { db } from './store';
export const randomToken = () => randomBytes(32).toString('hex');
export const hash = (value: string) => createHash('sha256').update(value).digest('hex');
function key() { const k = process.env.DATA_ENCRYPTION_KEY || ''; if (!/^[a-f0-9]{64}$/i.test(k))
    throw new Error('Chave de proteção não configurada'); return Buffer.from(k, 'hex'); }
export function emailHash(email: string) { return createHmac('sha256', key()).update(email.toLowerCase().trim()).digest('hex'); }
export function encrypt(value: string) { const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', key(), iv); const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]); return [iv, cipher.getAuthTag(), encrypted].map(b => b.toString('base64url')).join('.'); }
export function decrypt(value: string) { const [iv, tag, data] = value.split('.').map(v => Buffer.from(v, 'base64url')); const decipher = createDecipheriv('aes-256-gcm', key(), iv); decipher.setAuthTag(tag); return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8'); }
export function passwordMatches(password: string) { const value = process.env.ADMIN_PASSWORD_HASH || ''; const [salt, encoded] = value.split(':'); if (!salt || !encoded || password.length > 256)
    return false; const expected = Buffer.from(encoded, 'hex'); const actual = scryptSync(password, salt, 64); return expected.length === actual.length && timingSafeEqual(expected, actual); }
export function adminCredentialsMatch(email: string, password: string) {
    const configuredEmail = process.env.ADMIN_EMAIL || '';
    const emailMatches = timingSafeEqual(
        createHash('sha256').update(email.trim().toLowerCase()).digest(),
        createHash('sha256').update(configuredEmail.trim().toLowerCase()).digest(),
    );
    const passwordMatchesConfigured = passwordMatches(password);
    return !!configuredEmail && emailMatches && passwordMatchesConfigured;
}
export async function limited(key: string, max: number, windowMs: number) { const now = Date.now(); const row = await db().prepare('INSERT INTO limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN limits.expires_at<? THEN 1 ELSE limits.count+1 END,expires_at=CASE WHEN limits.expires_at<? THEN ? ELSE limits.expires_at END RETURNING count').get(key, now + windowMs, now, now, now + windowMs) as {
    count: number;
}; return row.count > max; }
export function sameOrigin(request: Request) {
 const origin=request.headers.get('origin');
 const allowed=[new URL(process.env.SITE_URL||'http://localhost:3000').origin];
 if(process.env.ADDITIONAL_SITE_ORIGIN)allowed.push(new URL(process.env.ADDITIONAL_SITE_ORIGIN).origin);
 return origin!==null&&allowed.includes(origin);
}
export function clientKey(request: Request) { return process.env.TRUST_PROXY === 'true' ? hash((request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()) : 'shared'; }
export function csv(rows: unknown[][]) { return '\uFEFF' + rows.map(row => row.map(value => { let s = String(value ?? ''); if (/^[\s]*[=+@\-\t\r\n]/.test(s))
    s = "'" + s; return '"' + s.replaceAll('"', '""') + '"'; }).join(';')).join('\r\n'); }
