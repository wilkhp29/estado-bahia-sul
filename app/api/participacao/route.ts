import { collectionReady } from '../../../lib/config';
import { sameOrigin, limited, clientKey, emailHash } from '../../../lib/security';
import { participantSchema, prepareParticipation } from '../../../lib/participation';
import { sendVerification } from '../../../lib/mail';
import { cleanup } from '../../../lib/store';
import { json, readJson } from '../../../lib/http';
export const runtime = 'nodejs';
export async function POST(request: Request) {
    if (!sameOrigin(request))
        return json({ error: 'Origem não permitida.' }, 403);
    if (!collectionReady())
        return json({ error: 'A coleta ainda não foi habilitada. Nenhum dado foi recebido.' }, 503);
    try {
        await cleanup();
        if (await limited('petition:' + clientKey(request), 10, 3600000))
            return json({ error: 'Muitas tentativas. Tente novamente em uma hora.' }, 429);
        const parsed = participantSchema.safeParse(await readJson(request));
        if (!parsed.success)
            return json({ error: 'Revise os campos, o município e o consentimento.' }, 400);
        const input = parsed.data;
        const challenge = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET!, response: input.captcha }), signal: AbortSignal.timeout(10000) });
        const result = await challenge.json();
        if (!result.success || result.hostname !== new URL(process.env.SITE_URL!).hostname || result.action !== 'petition')
            return json({ error: 'Verificação de segurança expirada. Recarregue a página e tente novamente.' }, 400);
        if (await limited('email:' + emailHash(input.email), 3, 3600000))
            return json({ message: 'Se houver uma participação pendente, confira seu e-mail. Você pode tentar novamente em uma hora.' });
        const prepared = await prepareParticipation(input);
        if (prepared)
            await sendVerification(prepared.email, prepared.token, prepared.name, prepared.municipality);
        return json({ message: 'Se o endereço ainda precisa de confirmação, enviamos um link válido por 24 horas. Confira também o spam. Apoios já confirmados não são duplicados.' });
    }
    catch {
        return json({ error: 'Não foi possível concluir o envio. Nenhum apoio foi contado. Tente novamente mais tarde.' }, 503);
    }
}
