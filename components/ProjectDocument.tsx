import Link from 'next/link';
import { ArrowRight, BookOpen, Check, FileText, Scale } from 'lucide-react';
import { comparisonRows, nationalComparisons, projectDocumentNotice, projectSections } from '../data/project-document';

export default function ProjectDocument() {
  return <article className="project-document reading">
    <header className="project-document-hero">
      <h1>Por que criar um novo Estado</h1>
      <p className="page-lead">Uma leitura editorial do documento recebido pelo projeto: origem, território, economia, história e participação pública.</p>
      <div className="project-document-notice"><FileText size={20}/><p>{projectDocumentNotice}</p></div>
      <nav className="project-document-index" aria-label="Índice da proposta">
        {projectSections.map(section => <a key={section.id} href={`#${section.id}`}>{section.eyebrow.replace(/^\w+ · /, '')}</a>)}
      </nav>
    </header>

    {projectSections.map(section => <section key={section.id} id={section.id} className="project-document-section" aria-labelledby={`${section.id}-title`}>
      <div className="project-document-section-heading">
        <p className="r-eyebrow green">{section.eyebrow}</p>
      </div>
      <h2 id={`${section.id}-title`}>{section.title}</h2>
      <div className="project-document-copy">
        <div>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        {section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}><Check size={17}/><span>{bullet}</span></li>)}</ul>}
      </div>
    </section>)}

    <section className="project-comparison" aria-labelledby="comparison-title">
      <div className="project-document-section-heading"><p className="r-eyebrow green">QUADRO COMPARATIVO</p></div>
      <h2 id="comparison-title">Bahia do Sul em comparação</h2>
      <p className="project-section-intro">Os valores abaixo são estimativas apresentadas no documento do projeto. O Observatório organizará cada indicador com fonte, ano, metodologia, municípios incluídos e revisão independente.</p>
      <div className="project-table-wrap" role="region" aria-labelledby="comparison-title" tabIndex={0}><table><caption>Estimativas e referências apresentadas no documento do projeto</caption><thead><tr><th scope="col">Indicador</th><th scope="col">Bahia do Sul</th><th scope="col">Espírito Santo</th><th scope="col">Bahia atual</th></tr></thead><tbody>{comparisonRows.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
      <div className="project-source-line"><BookOpen size={17}/><span>No Observatório, cada indicador será apresentado com fonte, ano e metodologia.</span></div>
    </section>

    <section className="project-comparison project-national-comparison" aria-labelledby="national-title">
      <div className="project-document-section-heading"><p className="r-eyebrow green">EXPERIÊNCIAS NACIONAIS</p></div>
      <h2 id="national-title">Quando dividir foi apresentado como somar</h2>
      <p className="project-section-intro">O documento cita estas experiências como referência. O Observatório organizará comparações por período, contexto e indicadores documentados.</p>
      <ul className="project-national-list">{nationalComparisons.map(item => <li key={item}><span>{item}</span><ArrowRight size={18}/></li>)}</ul>
    </section>

    <section className="project-legal-note" aria-labelledby="legal-title">
      <div><Scale size={24}/><div><p className="r-eyebrow green">PROCESSO INSTITUCIONAL</p><h2 id="legal-title">O projeto seguirá as etapas constitucionais aplicáveis</h2></div></div>
      <p>O projeto orienta sua tramitação pela Constituição Federal e pelas etapas institucionais aplicáveis. O artigo 18, § 3º, é uma referência para o debate; a condução do processo seguirá análise jurídica especializada e os ritos definidos pelo Congresso Nacional.</p>
      <Link className="r-button outline" href="/historia">Consultar processo e fontes <ArrowRight size={18}/></Link>
    </section>

    <section className="project-document-cta" aria-labelledby="cta-title">
      <p className="r-eyebrow green">DEPOIS DE CONHECER</p>
      <h2 id="cta-title">Conheça a proposta. Participe do projeto.</h2>
      <p>A participação é voluntária e simbólica. Não é voto, plebiscito, referendo ou criação jurídica de um Estado.</p>
      <div className="project-cta-actions"><Link className="r-button forest" href="/territorio">Explorar o território <ArrowRight size={18}/></Link><Link className="r-button outline" href="/participar/abaixo-assinado">Conhecer o abaixo-assinado <ArrowRight size={18}/></Link></div>
    </section>
  </article>;
}
