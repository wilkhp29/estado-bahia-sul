import { publicMetadata } from '../../../lib/site';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import ProfessorPortrait from '../../../components/ProfessorPortrait';
import SharePage from '../../../components/SharePage';
import { candidate, candidateTrajectory, projectPriorities } from '../../../data/candidate';

export const metadata = publicMetadata(candidate.path, 'Professor Guilherme e o Bahia do Sul', candidate.presentation);

export default function ProfessorPage() {
  return <div className="project-journey candidate-page">
    <SiteHeader/>
    <main id="conteudo" tabIndex={-1}>
      <nav className="story-breadcrumb" aria-label="Caminho da página"><Link href="/">Bahia do Sul</Link><span aria-hidden="true">/</span><span aria-current="page">Professor Guilherme</span></nav>
      <section className="story-profile" aria-labelledby="candidate-title">
        <div className="story-profile-copy"><h1 id="candidate-title">Professor<br/>Guilherme.</h1><p className="story-profile-lead">Candidato a deputado federal pela Bahia.</p><p>{candidate.presentation}</p><p className="candidate-identification">Perfil publicado: {candidate.election.party} · nº {candidate.election.number} · eleições {candidate.election.year}. <a href={candidate.source.url} target="_blank" rel="noreferrer">Conferir fonte</a></p><div className="story-actions"><a className="story-button story-button-primary" href="#proposta">Conhecer a proposta <ArrowRight size={18} aria-hidden="true"/></a><a className="story-text-link" href="#participar">Como participar <ArrowRight size={18} aria-hidden="true"/></a>{candidate.channels[0] && <a className="story-text-link" href={candidate.channels[0].url} target="_blank" rel="noreferrer">Acompanhar no Instagram <ExternalLink size={16} aria-hidden="true"/></a>}</div></div>
        <figure className="story-profile-portrait"><ProfessorPortrait/><figcaption>{candidate.fullName}<a href={candidate.source.url} target="_blank" rel="noreferrer">Foto e perfil: Opera Mundi <ExternalLink size={14} aria-hidden="true"/></a></figcaption></figure>
      </section>
      <div className="candidate-profile-number"><strong>{candidate.election.number}</strong><span>Candidato a deputado federal<br/>{candidate.election.party} · Bahia · {candidate.election.year}</span></div>
      <nav className="story-page-nav" aria-label="Nesta página"><a href="#trajetoria">Trajetória</a><a href="#relacao">Relação com o projeto</a><a href="#proposta">Pauta de desenvolvimento</a><a href="#duvidas">Perguntas importantes</a><a href="#participar">Participar</a></nav>
      <section className="story-chapter" id="trajetoria" aria-labelledby="public-trajectory-title">
        <div><h2 id="public-trajectory-title">Educação, participação<br/>e debate regional.</h2><p>Marcos da trajetória encontrados em registros públicos e na imprensa. Consulte a fonte de cada informação.</p><p>Fontes consultadas em 20/09/2026.</p></div>
        <ol className="candidate-timeline">{candidateTrajectory.map(item => <li key={item.year}><time dateTime={item.year}>{item.year}</time><div><h3>{item.title}</h3><p>{item.text}</p><a href={item.url} target="_blank" rel="noreferrer">{item.source} <ExternalLink size={14} aria-hidden="true"/></a></div></li>)}</ol>
      </section>
      <section className="story-chapter" id="relacao" aria-labelledby="trajectory-title">
        <div><h2 id="trajectory-title">Uma ideia coletiva.<br/>Uma participação para conhecer.</h2></div>
        <div><p>O debate sobre uma nova organização territorial tem antecedentes que ultrapassam a atuação de qualquer participante. Na história contemporânea apresentada pelo projeto, Professor Guilherme está associado à mobilização pelo Bahia do Sul.</p><p>O documento do projeto atribui a ele a fundação do MOVISUL em 2018. Esse registro é apresentado como relato do projeto; a documentação histórica complementar segue em conferência.</p><Link className="story-text-link" href="/projeto#luta">Ler a história apresentada no documento <ArrowRight size={18} aria-hidden="true"/></Link>
          <details className="story-source"><summary>Identificação pública e candidatura</summary><p>{candidate.fullName} é identificado pelo Opera Mundi como candidato a {candidate.election.office}, pelo {candidate.election.party}, número {candidate.election.number}, nas eleições de {candidate.election.year}.</p><a href={candidate.source.url} target="_blank" rel="noreferrer">Conferir o perfil publicado <ExternalLink size={14} aria-hidden="true"/></a><p>Consulta à fonte: {candidate.source.checkedAt}.</p></details>
        </div>
      </section>
      <section className="story-agenda" id="proposta" aria-labelledby="agenda-title">
        <div className="story-agenda-heading"><h2 id="agenda-title">O desenvolvimento<br/>que está em debate.</h2><p>A pauta do Bahia do Sul reúne estes temas. São propostas do documento do projeto, que você pode conhecer e avaliar.</p></div>
        <div className="story-priorities">{projectPriorities.map(priority => <article key={priority.anchor}><h3>{priority.title}</h3><p>{priority.text}</p><Link className="story-text-link" href={`/projeto#${priority.anchor}`}>Explorar este tema <ArrowRight size={18} aria-hidden="true"/></Link></article>)}</div>
        <p className="story-agenda-note">A criação de um Estado e seus efeitos dependem de estudos, debate público e decisões institucionais. A proposta também precisa considerar custos e transição administrativa.</p>
      </section>
      <section className="story-chapter" id="duvidas" aria-labelledby="questions-title">
        <div><h2 id="questions-title">Antes de decidir,<br/>entenda os caminhos.</h2><p>Informação para avaliar o projeto e a participação política com clareza.</p></div>
        <div className="story-questions">
          <details open><summary>Qual é a ligação deste site com Guilherme?</summary><p>Este é um portal de apresentação do Bahia do Sul e de promoção política de Professor Guilherme. Os argumentos do projeto e a participação do candidato fazem parte da proposta editorial do site.</p></details>
          <details><summary>Eleger um candidato cria um novo Estado?</summary><p>A eleição de um candidato não cria, por si só, um Estado. O processo envolve a consulta e a aprovação previstas na Constituição. Conheça a explicação e as fontes sobre o caminho institucional.</p><Link className="story-text-link" href="/historia">Entender o processo <ArrowRight size={18} aria-hidden="true"/></Link></details>
          <details><summary>Apoiar o projeto significa apoiar o candidato?</summary><p>Você pode conhecer e apoiar o projeto sem declarar apoio eleitoral a Guilherme. O abaixo-assinado registra uma manifestação sobre o Bahia do Sul. Sua decisão de voto é pessoal.</p></details>
          <details><summary>O cadastro do abaixo-assinado será usado na campanha?</summary><p>O consentimento do abaixo-assinado cobre o registro da participação no projeto. Receber comunicação de campanha exige uma escolha específica, separada. Nenhuma adesão eleitoral é registrada por visitar esta página.</p><Link className="story-text-link" href="/privacidade">Consultar a privacidade <ArrowRight size={18} aria-hidden="true"/></Link></details>
        </div>
      </section>
      <section className="story-participate" id="participar" aria-labelledby="participate-title">
        <div><h2 id="participate-title">A conversa continua<br/>com você.</h2><p>Conheça os argumentos, compartilhe esta apresentação e ajude outras pessoas a participar do debate.</p><SharePage path={candidate.path} title="Professor Guilherme e o Bahia do Sul"/></div>
        <div className="story-participation-options"><div><h3>Apoiar o projeto Bahia do Sul</h3><p>Leia o abaixo-assinado e entenda o significado da participação.</p><Link className="story-text-link" href="/participar/abaixo-assinado">Conhecer o abaixo-assinado <ArrowRight size={18} aria-hidden="true"/></Link></div><div><h3>Acompanhar Guilherme</h3>{candidate.channels.length ? <ul>{candidate.channels.map(channel => <li key={channel.url}><a className="story-text-link" href={channel.url} target="_blank" rel="noreferrer">{channel.label} <ExternalLink size={16} aria-hidden="true"/></a></li>)}</ul> : <p>Os canais oficiais e a agenda de encontros serão publicados aqui após confirmação pela equipe.</p>}</div></div>
      </section>
      {candidate.video && <section className="story-video" aria-label={candidate.video.title}><h2>{candidate.video.title}</h2><video controls preload="metadata" src={candidate.video.src}/><details><summary>Ler a transcrição</summary><p>{candidate.video.transcript}</p></details></section>}
      <div className="story-document-links"><Link href="/projeto">Ler o projeto completo <ArrowRight size={18} aria-hidden="true"/></Link><a href={candidate.source.url} target="_blank" rel="noreferrer">Conferir perfil e origem do retrato <ExternalLink size={18} aria-hidden="true"/></a></div>
    </main>
    <SiteFooter/>
  </div>;
}
