'use client';
import Link from 'next/link';
import InnerLayout from '../components/InnerLayout';
export default function ErrorPage({reset}:{reset:()=>void}){return <InnerLayout><section className="state-page" role="alert"><h1>Não foi possível carregar esta página.</h1><p>O serviço pode estar temporariamente indisponível. Tente carregar novamente ou consulte a ajuda. Esta mensagem não confirma envio ou alteração de dados.</p><div className="state-actions"><button className="button-primary" onClick={reset}>Tentar novamente</button><Link href="/ajuda">Abrir ajuda</Link><Link href="/">Voltar ao início</Link></div></section></InnerLayout>}
