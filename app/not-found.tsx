import Link from 'next/link';
import InnerLayout from '../components/InnerLayout';
export default function NotFound(){return <InnerLayout><section className="state-page"><h1>Esta página não foi encontrada.</h1><p>O endereço pode ter mudado ou estar incompleto. Você pode voltar ao início, buscar um município ou consultar a ajuda.</p><div className="state-actions"><Link className="button-primary" href="/">Voltar ao início</Link><Link href="/territorio">Buscar município</Link><Link href="/ajuda">Abrir ajuda</Link></div></section></InnerLayout>}
