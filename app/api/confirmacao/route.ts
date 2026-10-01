import { cookies } from 'next/headers';
import { sameOrigin, limited, clientKey } from '../../../lib/security';
import { confirmParticipation } from '../../../lib/participation';
import { json, readJson } from '../../../lib/http';
export async function POST(request: Request) {
    if (!sameOrigin(request))
        return json({ error: 'Origem não permitida.' }, 403);
    if (await limited('confirm:' + clientKey(request), 30, 60000))
        return json({ error: 'Aguarde um minuto.' }, 429);
    try {
        const { token } = await readJson(request);
        if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token))
            return json({ error: 'Link inválido.' }, 400);
        const confirmed = await confirmParticipation(token);
        if (!confirmed)
            return json({ error: 'Link expirado ou já utilizado. Solicite um novo envio pelo formulário.' }, 400);
        (await cookies()).set('bahia_participant', confirmed.manage, { httpOnly: true, sameSite: 'strict', secure: process.env.SITE_URL?.startsWith('https://'), maxAge: 30 * 86400, path: '/' });
        return json({ certificate: confirmed.certificate, manage: confirmed.manage });
    }
    catch {
        return json({ error: 'Não foi possível confirmar. Tente novamente.' }, 503);
    }
}
