import { cookies } from 'next/headers';
import { z } from 'zod';
import { authenticated, SESSION_COOKIE } from '../../../../lib/auth';
import { db, audit, cleanup, transaction } from '../../../../lib/store';
import { hash, randomToken, adminCredentialsMatch, sameOrigin, limited, clientKey, csv, decrypt } from '../../../../lib/security';
import { json, readJson } from '../../../../lib/http';
import type { Participant } from '../../../../lib/participation';
import dataset from '../../../../data/territory.json';
import {contentSchema,saveContent} from '../../../../lib/editorial';
export async function POST(request: Request, { params }: {
    params: Promise<{
        action: string;
    }>;
}) {
    if (!sameOrigin(request))
        return json({ error: 'Origem não permitida.' }, 403);
    const { action } = await params;
    try {
        if (action === 'login') {
            if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH)
                return json({ error: 'Acesso ainda não configurado. Execute npm run setup no servidor.' }, 503);
            if (await limited('login:' + clientKey(request), 10, 15 * 60000))
                return json({ error: 'Muitas tentativas. Aguarde 15 minutos.' }, 429);
            const payload = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) }).safeParse(await readJson(request));
            if (!payload.success || !adminCredentialsMatch(payload.data.email, payload.data.password)) {
                await audit('admin.login_failed', 'Credencial inválida');
                return json({ error: 'E-mail ou senha inválidos.' }, 401);
            }
            await cleanup();
            const token = randomToken();
            await db().prepare('INSERT INTO sessions VALUES(?,?)').run(hash(token), Date.now() + 8 * 3600000);
            (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: process.env.SITE_URL?.startsWith('https://'), path: '/', maxAge: 8 * 3600 });
            await audit('admin.login', 'Administrador');
            return json({ ok: true });
        }
        if (!await authenticated())
            return json({ error: 'Entre novamente no painel.' }, 401);
        if (action === 'logout') {
            const jar = await cookies();
            const token = jar.get(SESSION_COOKIE)?.value;
            if (token)
                await db().prepare('DELETE FROM sessions WHERE hash=?').run(hash(token));
            jar.delete(SESSION_COOKIE);
            await audit('admin.logout', 'Administrador');
            return json({ ok: true });
        }
        if (action === 'export') {
            const payload = z.object({ mode: z.enum(['aggregate', 'personal']), purpose: z.string().trim().min(15).max(300), acknowledged: z.literal(true) }).safeParse(await readJson(request));
            if (!payload.success)
                return json({ error: 'Informe uma justificativa com ao menos 15 caracteres e confirme o uso responsável.' }, 400);
            const { mode, purpose } = payload.data;
            const rows: unknown[][] = mode === 'aggregate' ? [['Município', 'Código IBGE', 'Participações confirmadas']] : [['Nome', 'Email', 'Município', 'Código IBGE', 'Situação', 'Newsletter autorizada', 'Consentimento', 'Cadastro', 'Confirmação']];
            const count = Number((await db().prepare('SELECT COUNT(*) AS n FROM participants').get() as {
                n: number;
            }).n);
            if (count > 50000)
                return json({ error: 'Volume acima do limite de exportação. Solicite um processamento administrativo dedicado.' }, 422);
            // Audit before making any data downloadable; no personal values are stored in audit.
            await transaction(async () => {
                await audit('admin.export', JSON.stringify({ mode, purpose, count }));
                if (mode === 'aggregate') {
                    for (const r of await db().prepare("SELECT municipality,COUNT(*) AS total FROM participants WHERE status='verified' GROUP BY municipality ORDER BY municipality").all()) {
                        rows.push([dataset.municipalities.find(m => m.id === r.municipality)?.name || r.municipality, r.municipality, r.total]);
                    }
                }
                else {
                    for (const r of await db().prepare('SELECT * FROM participants ORDER BY created_at DESC').all() as unknown as Participant[]) {
                        rows.push([decrypt(r.name), decrypt(r.email), dataset.municipalities.find(m => m.id === r.municipality)?.name || r.municipality, r.municipality, r.status === 'verified' ? 'Confirmada' : 'Pendente', r.newsletter ? 'Sim' : 'Não', r.consent_version, new Date(r.created_at).toISOString(), r.verified_at ? new Date(r.verified_at).toISOString() : '']);
                    }
                }
            });
            return new Response(csv(rows), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="bahia-do-sul-${mode}-${new Date().toISOString().slice(0, 10)}.csv"`, 'Cache-Control': 'no-store' } });
        }
        if (action === 'content') {
            const parsed = contentSchema.safeParse(await readJson(request));
            if (!parsed.success)
                return json({ error: 'Preencha título, texto e fonte HTTPS válida.' }, 400);
            const id = await saveContent(parsed.data);
            return json({ ok: true, id });
        }
        if (action === 'delete') {
            const { id, purpose } = await readJson(request);
            if (typeof id !== 'string' || typeof purpose !== 'string' || purpose.trim().length < 15 || purpose.length > 300)
                return json({ error: 'Informe o registro e uma justificativa de pelo menos 15 caracteres.' }, 400);
            await transaction(async () => { const result = await db().prepare('DELETE FROM participants WHERE id=?').run(id); if (!result.changes)
                throw new Error('not_found'); await audit('admin.participant_deleted', JSON.stringify({ id, purpose })); });
            return json({ ok: true });
        }
        return json({ error: 'Operação inexistente.' }, 404);
    }
    catch {
        return json({ error: 'A operação não foi concluída. Confira os campos e tente novamente.' }, 400);
    }
}
