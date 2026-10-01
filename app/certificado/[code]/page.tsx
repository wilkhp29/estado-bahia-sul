import Image from 'next/image';
import QRCode from 'qrcode';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { db } from '../../../lib/store';
import { managedParticipant } from '../../../lib/participation';
import { decrypt } from '../../../lib/security';
import InnerLayout from '../../../components/InnerLayout';
import PrintButton from '../../../components/PrintButton';
import dataset from '../../../data/territory.json';
export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };
export default async function Page({ params }: {
    params: Promise<{
        code: string;
    }>;
}) { const { code } = await params; if (!/^[a-f0-9]{64}$/.test(code))
    notFound(); const record = await db().prepare("SELECT id,verified_at FROM participants WHERE certificate=? AND status='verified'").get(code) as {
    id: string;
    verified_at: number;
} | undefined; if (!record)
    notFound(); const token = (await cookies()).get('bahia_participant')?.value; const owner = token ? await managedParticipant(token) : null; const canView = owner?.id === record.id; const verifyUrl = new URL('/certificado/' + code, process.env.SITE_URL || 'http://localhost:3000').href; const qr = await QRCode.toDataURL(verifyUrl, { width: 180, margin: 2, color: { dark: '#052e50', light: '#ffffff' } }); return <InnerLayout><section className="certificate"><p>BAHIA DO SUL</p><h1>Certificado simbólico<br />de participação</h1>{canView ? <><h2>{decrypt(owner!.name)}</h2><p>Este certificado registra simbolicamente a participação de {decrypt(owner!.name)} na construção pública e colaborativa do projeto Bahia do Sul.</p><p>{dataset.municipalities.find(m => m.id === owner!.municipality)?.name} · Bahia</p></> : <><h2>Registro confirmado</h2><p>A existência deste certificado está confirmada. Os dados do participante são privados e não são exibidos a visitantes.</p></>}<p>Confirmação em {new Date(record.verified_at).toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' })}</p><Image className="certificate-qr" unoptimized src={qr} width={150} height={150} alt="QR Code para verificar este certificado sem divulgar os dados do participante"/><code className="certificate-code">{code}</code><p className="certificate-disclaimer">Certificado simbólico e comemorativo, sem valor jurídico, eleitoral, governamental ou patrimonial.</p>{canView && <PrintButton />}</section></InnerLayout>; }
