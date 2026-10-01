import { cookies } from 'next/headers';
import { sameOrigin } from '../../../../lib/security';
import { withdraw } from '../../../../lib/participation';
import { json, readJson } from '../../../../lib/http';
export async function POST(request: Request) { if (!sameOrigin(request))
    return json({ error: 'Origem não permitida.' }, 403); try {
    const { token } = await readJson(request);
    if (typeof token !== 'string' || !await withdraw(token))
        return json({ error: 'Chave de gerenciamento inválida.' }, 400);
    (await cookies()).delete('bahia_participant');
    return json({ message: 'Participação excluída. O certificado foi invalidado e o contador atualizado.' });
}
catch {
    return json({ error: 'Não foi possível excluir agora.' }, 503);
} }
