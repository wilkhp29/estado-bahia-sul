import Link from 'next/link';
import type { Metadata } from 'next';
import InnerLayout from '../../components/InnerLayout';
import {publishedNews} from '../../lib/editorial';
import {indexingEnabled,publicMetadata} from '../../lib/site';
import {ArrowRight, Newspaper} from 'lucide-react';
export const dynamic='force-dynamic';
export async function generateMetadata():Promise<Metadata>{
 const news=await publishedNews();
 return {...publicMetadata('/noticias','Notícias e publicações','Acompanhe notícias, iniciativas e publicações do projeto Bahia do Sul, com data e referências para consultar as informações.'),...(news.length===0||!indexingEnabled()?{robots:{index:false,follow:true}}:{})};
}
export default async function Page(){const news=await publishedNews();return <InnerLayout className="news-portal"><div className="news-page"><header className="news-intro"><span className="news-icon" aria-hidden="true"><Newspaper size={22}/></span><p className="portal-eyebrow">ACOMPANHE O PROJETO</p><h1>Notícias</h1><p className="page-lead">Informação, iniciativas e novidades sobre o Bahia do Sul.</p></header>{news.length?<div className="news-list" aria-label="Publicações">{news.map(item=><article className="news-card" key={item.id}><div className="news-card-meta"><span>Bahia do Sul</span><time dateTime={new Date(item.updated_at).toISOString()}>{new Date(item.updated_at).toLocaleDateString('pt-BR')}</time></div><h2><Link href={`/noticias/${item.id}`}>{item.title}</Link></h2><p>{item.body.slice(0,240)}{item.body.length>240?'…':''}</p><Link className="news-read-link" href={`/noticias/${item.id}`}>Ler notícia <ArrowRight size={17} aria-hidden="true"/></Link></article>)}</div>:<section className="news-empty"><span className="news-empty-index">01 <i/></span><div><p className="portal-eyebrow">EM BREVE</p><h2>Uma nova seção para acompanhar o projeto.</h2><p>As notícias serão publicadas aqui após revisão da equipe. Enquanto isso, conheça a proposta e explore o território.</p><Link href="/projeto" className="news-read-link">Conhecer o projeto <ArrowRight size={17} aria-hidden="true"/></Link></div></section>}</div></InnerLayout>}
