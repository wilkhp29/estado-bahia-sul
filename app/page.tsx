import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight, Map} from 'lucide-react';
import HomeHeader from '../components/HomeHeader';
import HomeMap from '../components/HomeMap';
import MascotCarousel from '../components/MascotCarousel';
import ProfessorPortrait from '../components/ProfessorPortrait';
import {CityPhotography, ResourcePhotography} from '../components/FeaturedPhotography';
import {candidate} from '../data/candidate';
import presentation from '../data/client-presentation.json';
import territory from '../data/territory.json';
import {publishedNews} from '../lib/editorial';
import {publicMetadata} from '../lib/site';
import './homepage.css';

export const dynamic = 'force-dynamic';
export const metadata = publicMetadata('/', 'Bahia do Sul — conheça o território', 'Conheça o território, explore os municípios, consulte os dados e entenda a proposta Bahia do Sul.');

function OrganizationStructuredData(){
  const graph={
    '@context':'https://schema.org',
    '@graph':[
      {'@type':'Organization','@id':'https://estadobahiadosul.com.br/#organization','name':'Movimento Pró-Criação Bahia do Sul','url':'https://estadobahiadosul.com.br/','description':'Portal do projeto Bahia do Sul, com informações territoriais, história, fontes e participação. Não é um órgão governamental.','logo':{'@type':'ImageObject','url':'https://estadobahiadosul.com.br/images/logo-bahia-do-sul-v2.png'}},
      {'@type':'WebSite','@id':'https://estadobahiadosul.com.br/#website','name':'Bahia do Sul','url':'https://estadobahiadosul.com.br/','inLanguage':'pt-BR','publisher':{'@id':'https://estadobahiadosul.com.br/#organization'}},
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(graph).replace(/</g,'\\u003c')}}/>;
}

const municipalityCount = territory.municipalities.length;
const matchedCount = territory.municipalities.filter(item => item.matched && !item.review).length;
const reviewCount = municipalityCount - matchedCount;
const sourceSection = (id:string) => presentation.sections.find(section => section.id === id)!;
const homeCopy = sourceSection('inicio').lines;
const aboutCopy = sourceSection('quem-somos').lines;
const cacaoCopy = sourceSection('cacau').lines;
const participationCopy = sourceSection('participe').lines;
const improvementHeadings = sourceSection('o-que-vai-melhorar').lines.filter(line => line.startsWith('✅ '));
const firstSentence = (text:string) => text.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ?? text;

export default async function Page(){
  const news = await publishedNews();
  return <div className="bs-home">
    <OrganizationStructuredData/>
    <div className="bs-site-frame">
      <HomeHeader/>
      <main id="conteudo" tabIndex={-1}>
        <section className="bs-hero" id="inicio" aria-labelledby="bs-hero-title">
          <Image className="bs-hero-image" src="/images/hero-youth-bahia.webp" alt="Cena ilustrativa de jovens adultos conversando em uma rua do litoral ao entardecer." fill priority sizes="(max-width: 760px) 100vw, 1920px"/>
          <div className="bs-hero-shade" aria-hidden="true"/>
          <div className="bs-hero-content">
            <h1 id="bs-hero-title"><span>{homeCopy[1].split(' DESTA ')[0]}</span><span>DESTA {homeCopy[1].split(' DESTA ')[1]}</span></h1>
            <p className="bs-hero-lead">{homeCopy[0]}</p>
            <div className="bs-hero-actions"><Link href="/participar" className="bs-button bs-button-yellow">Quero participar <ArrowRight size={18}/></Link><Link href="/territorio" className="bs-hero-secondary"><Map size={18}/> Explore o mapa</Link></div>
            <p className="bs-hero-trust">Participação voluntária e simbólica <span aria-hidden="true">·</span> Confirmação por e-mail</p>
          </div>
        </section>

        <section className="bs-editorial-grid" id="explore" aria-label="Conheça o Bahia do Sul">
          <article className="bs-editorial-story"><h2>Quem somos</h2><p>{firstSentence(aboutCopy[1])}</p><Link className="bs-text-link" href="/projeto">Conheça o projeto <ArrowRight size={16}/></Link><Link className="bs-story-image" href="/historia" aria-label="Explorar a história do Sul da Bahia"><Image src="/images/jornada-coast.webp" alt="Paisagem costeira da região sul da Bahia" width={1200} height={650} sizes="(max-width: 760px) 100vw, 28vw"/></Link></article>
          <article className="bs-editorial-data"><h2>A nação do cacau</h2><p>{firstSentence(cacaoCopy[0])}</p><h3>Dados e viabilidade</h3><div className="bs-count"><strong>{municipalityCount}</strong><span>entradas na lista inicial</span></div><p className="bs-panel-note">{matchedCount} correspondências nominais identificadas; {reviewCount} entradas permanecem em revisão. Lista do projeto, ainda não validada como divisão oficial.</p><Link className="bs-text-link" href="/territorio">Explorar território <ArrowRight size={16}/></Link></article>
          <article className="bs-editorial-benefits"><h2>O que vai melhorar?</h2><p className="bs-position-label">EXPECTATIVAS APRESENTADAS PELO MOVIMENTO</p><ul className="bs-priority-list">{improvementHeadings.map(title=><li key={title}>{title.replace(/^✅\s*/, '')}</li>)}</ul><Link className="bs-text-link" href="/projeto#o-que-vai-melhorar">Conheça a proposta <ArrowRight size={16}/></Link></article>
          <aside className="bs-founder-panel"><h2>Faça parte desta história</h2><p>{participationCopy[0]}</p><Link className="bs-button bs-button-yellow" href="/participar">Conheça a participação <ArrowRight size={18}/></Link><small>A participação é simbólica; o status da coleta é informado no formulário.</small></aside>
        </section>

        <section className="bs-cities" id="municipios"><div className="bs-section-topline"><div><p className="bs-panel-label">CIDADES DO TERRITÓRIO</p><h2>Conheça cada lugar.</h2><p>Explore paisagens e referências municipais.</p></div><Link href="/territorio" className="bs-text-link">Todos os municípios <ArrowRight size={17}/></Link></div><CityPhotography/></section>

        <section className="bs-map-section" aria-labelledby="bs-map-title"><div className="bs-map-copy"><p className="bs-panel-label">EXPLORE</p><h2 id="bs-map-title">Um mapa para chegar mais perto.</h2><p>Selecione uma área e consulte as informações disponíveis sobre o território.</p><p className="bs-panel-note">A lista inicial inclui {municipalityCount} entradas; {matchedCount} correspondem nominalmente ao cadastro consultado e {reviewCount} continuam em revisão.</p><Link className="bs-button bs-button-green" href="/territorio">Abrir mapa interativo <ArrowRight size={18}/></Link></div><div className="bs-map-preview"><HomeMap/></div></section>

        <section className="bs-section bs-cacao" id="riquezas"><div className="bs-section-heading"><p className="bs-panel-label">NATUREZA E ECONOMIA</p><h2>Cacau, costa e Mata Atlântica.</h2><p>Conheça atividades e recursos documentados, com autoria, licença e procedência consultáveis.</p></div><ResourcePhotography/><Link href="/economia" className="bs-text-link">Conheça a economia do território <ArrowRight size={17}/></Link></section>

        <section className="bs-mascots" aria-labelledby="bs-mascots-title"><div className="bs-mascots-heading"><p className="bs-panel-label">CACAUZINHO E CAFEZINHO</p><h2 id="bs-mascots-title">Uma apresentação do nosso território.</h2></div><MascotCarousel/></section>

        <section className="bs-process" id="processo"><div><p className="bs-panel-label">CAMINHO INSTITUCIONAL</p><h2>Como a proposta pode avançar.</h2><p>Conheça os estudos, a participação pública e os procedimentos previstos na Constituição e na legislação.</p><Link href="/processo-legal" className="bs-button bs-button-light">Entenda o processo institucional <ArrowRight size={18}/></Link></div><ol><li><span>01</span>História, dados e estudos</li><li><span>02</span>Debate e participação pública</li><li><span>03</span>Procedimentos constitucionais</li><li><span>04</span>Consulta popular e Congresso Nacional</li></ol></section>

        <section className="bs-contemporary" id="projeto-hoje"><figure><ProfessorPortrait/><figcaption>Retrato: Opera Mundi</figcaption></figure><div><p className="bs-panel-label">BAHIA DO SUL HOJE</p><h2>Um projeto construído por muitas pessoas.</h2><p>Professor Guilherme participa da iniciativa contemporânea. Conheça sua trajetória e suas posições, diferenciadas das informações territoriais e históricas.</p><p className="bs-candidate-id">Candidato a deputado federal · Bahia · 2026<br/><strong>{candidate.election.party} · nº {candidate.election.number}</strong> · <a href={candidate.source.url} target="_blank" rel="noreferrer">Conferir referência</a></p><Link href="/historia/professor-guilherme" className="bs-text-link">Conheça sua participação <ArrowRight size={17}/></Link></div></section>

        <section className="bs-news" id="noticias"><div className="bs-section-topline"><div><p className="bs-panel-label">ACOMPANHE</p><h2>Notícias e publicações.</h2></div><Link href="/noticias" className="bs-text-link">Ver notícias <ArrowRight size={17}/></Link></div>{news.length ? <div className="bs-news-list">{news.slice(0,3).map(item=><article key={item.id}><time dateTime={new Date(item.updated_at).toISOString()}>{new Date(item.updated_at).toLocaleDateString('pt-BR')}</time><h3><Link href={`/noticias/${item.id}`}>{item.title}</Link></h3><p>{item.body.slice(0,180)}{item.body.length>180?'…':''}</p><Link href={`/noticias/${item.id}`} className="bs-text-link">Ler publicação <ArrowRight size={15}/></Link></article>)}</div> : <p className="bs-news-empty">As publicações aprovadas pela equipe aparecerão aqui.</p>}</section>
      </main>
      <footer className="bs-footer"><div><Link href="/" className="bs-footer-brand">Bahia do Sul</Link><p>Portal do projeto e de consulta territorial. Não é um órgão governamental.</p></div><nav aria-label="Links institucionais"><Link href="/projeto">O projeto</Link><Link href="/territorio">Território</Link><Link href="/economia">Economia</Link><Link href="/historia">História</Link><Link href="/documentos">Documentos</Link><Link href="/privacidade">Privacidade</Link><Link href="/contato">Contato</Link></nav><p className="bs-footer-signature">Território · história · participação <span className="creator-credit-inline">· Criação do site: <a href="https://www.instagram.com/wilkhp29/" target="_blank" rel="noreferrer">William Santos</a></span></p></footer>
    </div>
    <Link className="bs-mobile-cta" href="/participar">Participar <ArrowRight size={18}/></Link>
  </div>;
}
