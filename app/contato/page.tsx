import Link from 'next/link';
import InnerLayout from '../../components/InnerLayout';
import { publicConfig } from '../../lib/config';
import { publicMetadata } from '../../lib/site';
export const metadata=publicMetadata('/contato','Contato','Fale com o projeto Bahia do Sul sobre participação e privacidade. Consulte o canal público de contato, conheça a política de privacidade e encontre informações institucionais.');
export default function Contato(){const {privacyEmail}=publicConfig();return <InnerLayout><article className="reading movisul-contact"><h1>Contato</h1><p>Para assuntos sobre participação e seus dados, fale com o responsável pelo tratamento pelo canal de privacidade:</p><p><a href={`mailto:${privacyEmail}`}>{privacyEmail}</a></p><Link className="basic-button" href="/privacidade">Consultar a política de privacidade</Link><p>As formas de participação no projeto estão reunidas no portal.</p><Link className="basic-button" href="/participar">Participe</Link></article></InnerLayout>;}
