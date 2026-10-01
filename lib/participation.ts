import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import dataset from '../data/territory.json';
import { db, transaction, audit } from './store';
import { encrypt, decrypt, emailHash, hash, randomToken } from './security';
import { consentVersion } from './config';
const ids = new Set(dataset.municipalities.filter(m => m.id && !m.review).map(m => m.id));
export const participantSchema = z.object({ name: z.string().trim().min(3).max(120).refine(v => !/[\u0000-\u001f]/.test(v)), email: z.email().max(254).transform(v => v.trim().toLowerCase()), municipality: z.string().refine(v => ids.has(v), 'Selecione um município validado.'), consent: z.literal(true), newsletter: z.boolean().default(false), website: z.string().max(0).default(''), captcha: z.string().min(1) });
export type Participant = {
    id: string;
    name: string;
    email: string;
    municipality: string;
    status: 'pending' | 'verified';
    newsletter: number;
    consent_version: string;
    created_at: number;
    verified_at: number | null;
    certificate: string | null;
    manage_hash: string | null;
};
export async function prepareParticipation(input: z.infer<typeof participantSchema>) {
    return await transaction(async () => {
        const d = db();
        let participant = await d.prepare('SELECT * FROM participants WHERE email_hash=?').get(emailHash(input.email)) as Participant | undefined;
        // Do not alter already verified data through an unauthenticated duplicate request.
        if (participant?.status === 'verified')
            return null;
        const now = Date.now();
        const id = participant?.id || randomUUID();
        if (!participant) {
            await d.prepare('INSERT INTO participants(id,name,email,email_hash,municipality,status,newsletter,consent_version,created_at) VALUES(?,?,?,?,?,\'pending\',?,?,?)').run(id, encrypt(input.name), encrypt(input.email), emailHash(input.email), input.municipality, Number(input.newsletter), consentVersion, now);
        }
        else {
            await d.prepare('UPDATE participants SET name=?,municipality=?,newsletter=?,consent_version=? WHERE id=?').run(encrypt(input.name), input.municipality, Number(input.newsletter), consentVersion, id);
        }
        await d.prepare('DELETE FROM tokens WHERE participant_id=?').run(id);
        const token = randomToken();
        await d.prepare('INSERT INTO tokens VALUES(?,?,?)').run(hash(token), id, now + 86400000);
        participant = await d.prepare('SELECT * FROM participants WHERE id=?').get(id) as Participant;
        return { token, email: decrypt(participant.email), name: decrypt(participant.name), municipality: dataset.municipalities.find(m => m.id === participant.municipality)!.name };
    });
}
export async function confirmParticipation(token: string) { return await transaction(async () => { const d = db(); const row = await d.prepare('SELECT participant_id FROM tokens WHERE hash=? AND expires_at>?').get(hash(token), Date.now()) as {
    participant_id: string;
} | undefined; if (!row)
    return null; const certificate = randomToken(); const manage = randomToken(); const changed = await d.prepare("UPDATE participants SET status='verified',verified_at=?,certificate=?,manage_hash=? WHERE id=? AND status='pending'").run(Date.now(), certificate, hash(manage), row.participant_id); await d.prepare('DELETE FROM tokens WHERE participant_id=?').run(row.participant_id); if (!changed.changes)
    return null; await audit('participation.confirmed', row.participant_id); return { certificate, manage }; }); }
export async function managedParticipant(token: string) { if (!/^[a-f0-9]{64}$/.test(token))
    return null; return await db().prepare("SELECT * FROM participants WHERE manage_hash=? AND status='verified'").get(hash(token)) as Participant | undefined; }
export async function withdraw(token: string) { return await transaction(async () => { const p = await managedParticipant(token); if (!p)
    return false; await db().prepare('DELETE FROM participants WHERE id=?').run(p.id); await audit('participation.deleted', p.id); return true; }); }
