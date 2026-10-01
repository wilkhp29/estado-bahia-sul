import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import EconomicTopics from '../../components/EconomicTopics';
import InnerLayout from '../../components/InnerLayout';
import ProjectDocument from '../../components/ProjectDocument';
import { highlights } from '../../data/highlights';
import { indexingEnabled, publicMetadata, publicPages } from '../../lib/site';
import { db } from '../../lib/store';

const sections: Record<string, { title: string; intro: string }> = {
  projeto: { title: 'Conheça o projeto Bahia do Sul', intro: 'Um espaço para explorar o território, consultar fontes e acompanhar uma proposta de desenvolvimento regional. A composição territorial apresentada é uma lista de estudo, não uma divisão administrativa oficial.' },
  economia: { title: 'Economia que nasce do território', intro: 'Cacau, café, turismo, patrimônio e serviços compõem as vocações econômicas apresentadas pelo projeto. O Observatório organizará produção, emprego, empresas e PIB com fonte, ano e metodologia.' },
  mineracao: { title: 'Mineração com informação verificável', intro: 'O Observatório apresentará ocorrências, recursos, reservas, projetos e produção em categorias distintas, com fonte e metodologia para cada informação.' },
  historia: { title: 'Da proposta ao debate público', intro: 'Esta seção organiza os antecedentes, os marcos documentais e os participantes contemporâneos do debate sobre Bahia do Sul.' },
  estudos: { title: 'Estudos e pesquisas', intro: 'Conhecimento aberto, organizado por autoria, contexto, metodologia e referência. Análises, dados oficiais e posições do projeto são identificados em suas próprias categorias.' },
  documentos: { title: 'Acervo documental', intro: 'Documentos com procedência para acompanhar o debate e consultar as fontes originais.' },
  noticias: { title: 'Notícias do projeto', intro: 'Atualizações publicadas pela equipe com fontes e data. Nenhuma notícia é gerada para preencher a página.' },
  fontes: { title: 'Fontes e metodologia', intro: 'Cada informação precisa de origem e contexto. A lista original foi preservada; correspondência cadastral não significa aprovação da composição territorial.' },
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const entry = sections[section];
  const editorial = ['estudos','documentos'].includes(section)
    ? await db().prepare('SELECT 1 FROM content WHERE kind=? AND published=1 LIMIT 1').get(section)
    : null;
  const eligible = publicPages.some(page => page.path === '/' + section) || Boolean(editorial);
  return entry
    ? { ...publicMetadata('/' + section, entry.title, entry.intro), ...(!eligible || !indexingEnabled() ? { robots: { index: false, follow: true } } : {}) }
    : { title: 'Bahia do Sul', robots: { index: false, follow: false } };
}

type ContentEntry = { id: string; title: string; body: string; source: string; updated_at: number };

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = sections[section];
  if (!entry) notFound();

  const list = ['noticias', 'estudos', 'documentos'].includes(section)
    ? await db().prepare('SELECT * FROM content WHERE kind=? AND published=1 ORDER BY updated_at DESC').all(section) as ContentEntry[]
    : [];

  return <InnerLayout>{section === 'projeto' ? <ProjectDocument /> : <article className="reading">
    <h1>{entry.title}</h1>
    <p className="page-lead">{entry.intro}</p>

    {section === 'historia' && <>
      <h2>Como ocorre uma alteração territorial</h2>
      <p>O artigo 18, § 3º, da Constituição Federal prevê consulta à população diretamente interessada por plebiscito e aprovação do Congresso Nacional por lei complementar para os processos territoriais nele descritos. Este resumo não substitui análise jurídica do caso concreto.</p>
      <a href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" target="_blank" rel="noreferrer">Consultar a Constituição Federal, artigo 18 ↗</a>
      <h2>O projeto e seus participantes</h2>
      <p>O documento apresentado pela equipe reúne sua narrativa histórica. A atuação contemporânea de Professor Guilherme tem página própria, com atribuição das informações e canal público para acompanhamento.</p>
      <p><Link href="/projeto#luta">Ler a história apresentada no projeto</Link></p>
      <p><Link href="/historia/professor-guilherme">Conhecer Professor Guilherme</Link></p>
      <h2>Documentos antes de cronologias</h2>
      <p>A linha do tempo reúne datas, marcos e autoria com seus documentos de referência.</p>
      <Link href="/documentos">Consultar acervo →</Link>
    </>}

    {section === 'mineracao' && <>
      <h2>Onde consultar</h2>
      <p>O SIGMINE permite consultar processos minerários. Um processo não comprova, por si só, reserva economicamente explorável.</p>
      <a href="https://www.gov.br/anm/pt-br/assuntos/exploracao-mineral/sistemas-de-exploracao-mineral" target="_blank" rel="noreferrer">Consultar SIGMINE / ANM ↗</a>
      <p>O Observatório organizará as informações minerais por município, categoria e fonte documental.</p>
    </>}

    {section === 'economia' && <EconomicTopics />}

    {section === 'fontes' && <>
      <div className="source-list">{highlights.map(highlight => <section key={highlight.id}>
        <h2>{highlight.name}: {highlight.title}</h2>
        <p>{highlight.description}</p>
        <a href={highlight.url} target="_blank" rel="noreferrer">{highlight.source} ↗</a>
      </section>)}</div>
      <h2>Validação territorial</h2>
      <p>Limites municipais obtidos da API de malhas do IBGE. Geometria simplificada para visualização, inadequada para cálculo de área. Agrupamento nas seis regiões não é regionalização oficial.</p>
      <a href="https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios" target="_blank" rel="noreferrer">Cadastro municipal do IBGE ↗</a>
    </>}

    {['noticias', 'estudos', 'documentos'].includes(section) && (list.length
      ? list.map(item => <section key={item.id} className="editorial-entry">
        <h2>{item.title}</h2>
        <time>{new Date(item.updated_at).toLocaleDateString('pt-BR')}</time>
        <div className="plain-content">{item.body}</div>
        <a href={item.source} target="_blank" rel="noreferrer">Consultar fonte original ↗</a>
      </section>)
      : <div className="empty-state">
        <h2>Publicações do projeto</h2>
        <p>Esta seção organiza conteúdos por autoria, data e referências. Explore também os destaques territoriais e suas fontes.</p>
        <Link href="/territorio">Conhecer os municípios →</Link>
      </div>)}
  </article>}</InnerLayout>;
}
