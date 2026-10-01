import Link from 'next/link';
import {LayoutDashboard,Newspaper,Users,ArrowUpRight,Plus} from 'lucide-react';
import {authenticated} from '../lib/auth';
import {db} from '../lib/store';
import {participationSummary,type ContentItem} from '../lib/editorial';
import {collectionReady} from '../lib/config';
import AdminLogin from './AdminLogin';
import {Logout} from './AdminActions';
import NewsManager from './NewsManager';
import dataset from '../data/territory.json';
import '../app/admin/dashboard.css';

export const dynamic='force-dynamic';
export const metadata={title:'Painel de gestão | Bahia do Sul',robots:{index:false,follow:false}};
const tabs=[{id:'overview',label:'Visão geral',icon:LayoutDashboard},{id:'news',label:'Notícias',icon:Newspaper},{id:'signatures',label:'Assinaturas',icon:Users}];
export default async function AdminDashboard({searchParams}:{searchParams:Promise<{tab?:string}>}){
 if(!await authenticated()) return <div className="management login-management"><Link href="/" className="management-brand">Bahia do Sul</Link><AdminLogin configured={!!process.env.ADMIN_EMAIL&&!!process.env.ADMIN_PASSWORD_HASH}/><Link href="/">Voltar ao site</Link></div>;
 const params=await searchParams;
 const active=tabs.some(t=>t.id===params.tab)?params.tab!:'overview';
 const summary=await participationSummary();
 const news=(await db().prepare("SELECT * FROM content WHERE kind='noticias' ORDER BY updated_at DESC").all()).map(row=>({...row})) as ContentItem[];
 const published=news.filter(n=>n.published).length;
 const enabled=collectionReady();
 return <div className="management"><a className="skip-link" href="#management-main">Pular para o conteúdo</a><header className="management-top"><Link className="management-brand" href="/admin">Bahia do Sul <span>Gestão do portal</span></Link><div><Link href="/" target="_blank">Ver site <ArrowUpRight size={16}/></Link><Logout/></div></header><div className="management-layout"><aside className="management-sidebar"><nav aria-label="Gestão do portal">{tabs.map(({id,label,icon:Icon})=><Link key={id} href={`/admin?tab=${id}`} aria-current={id===active?'page':undefined}><Icon size={19}/>{label}</Link>)}</nav><p>Acesso restrito</p><Link href="/admin/registros">Registros, privacidade e auditoria</Link></aside><main id="management-main" className="management-main">
 <div className="management-heading"><div><h1>{tabs.find(t=>t.id===active)!.label}</h1><p>{active==='news'?'Prepare o texto, confira a prévia e publique no blog.':active==='signatures'?'Acompanhe as confirmações do livro de participação.':'Notícias e participação, em um só lugar.'}</p></div>{active!=='news'&&<Link className="management-primary" href="/admin?tab=news"><Plus size={18}/>Nova notícia</Link>}</div>
 {active==='news'?<NewsManager items={news}/>:<>
 <dl className="management-metrics"><div><dt>Assinaturas verificadas</dt><dd>{summary.verified.toLocaleString('pt-BR')}</dd><small>Com e-mail confirmado</small></div><div><dt>Aguardando confirmação</dt><dd>{summary.pending.toLocaleString('pt-BR')}</dd><small>Fora do total público</small></div><div><dt>Municípios representados</dt><dd>{summary.municipalities.toLocaleString('pt-BR')}</dd><small>Com assinatura verificada</small></div></dl>
 <section className="management-notice"><strong>{enabled?'Recebimento de assinaturas habilitado':'Recebimento de assinaturas desativado'}</strong><p>{enabled?'Novas participações entram na contagem pública após confirmação do e-mail.':'A abertura depende da configuração de e-mail, proteção contra abuso e revisão de privacidade. Os totais acima são os registros reais existentes.'}</p></section>
 <div className="management-panels"><section><h2>{active==='overview'?'Publicação de notícias':'Resumo das assinaturas'}</h2>{active==='overview'?<><p><strong>{published}</strong> publicada(s) · <strong>{news.length-published}</strong> rascunho(s)</p><p>Rascunhos ficam apenas no painel. Publicações aparecem automaticamente no blog.</p><Link href="/admin?tab=news">Gerenciar notícias →</Link></>:<><p>{summary.total.toLocaleString('pt-BR')} cadastro(s) no banco.</p><p>{summary.recent.toLocaleString('pt-BR')} confirmação(ões) nos últimos 7 dias.</p><p>Pendentes não representam assinaturas verificadas. Os dados não constituem pesquisa de opinião.</p><Link href="/admin?tab=signatures">Atualizar contagem</Link></>}</section><section><h2>Por município</h2>{summary.regions.length?<div className="management-table"><table><caption>Somente assinaturas verificadas</caption><thead><tr><th scope="col">Município</th><th scope="col">Assinaturas</th></tr></thead><tbody>{summary.regions.map(r=><tr key={r.municipality}><td>{dataset.municipalities.find(m=>m.id===r.municipality)?.name||r.municipality}</td><td>{r.total.toLocaleString('pt-BR')}</td></tr>)}</tbody></table></div>:<p className="management-empty">Quando a primeira assinatura for confirmada, a distribuição por município aparecerá aqui.</p>}</section></div>
 <p className="management-privacy">Esta visão mostra apenas totais. Dados pessoais e operações de privacidade ficam na área restrita de registros.</p>
 </>}
 </main></div></div>;
}
