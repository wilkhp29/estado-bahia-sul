import { cookies } from 'next/headers';
import { db } from './store';
import { hash } from './security';
export const SESSION_COOKIE = 'bahia_admin';
export async function authenticated() { const token = (await cookies()).get(SESSION_COOKIE)?.value; if (!token || !/^[a-f0-9]{64}$/.test(token))
    return false; return !!await db().prepare('SELECT hash FROM sessions WHERE hash=? AND expires_at>?').get(hash(token), Date.now()); }
