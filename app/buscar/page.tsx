import Link from 'next/link';
import InnerLayout from '../../components/InnerLayout';
import { publicPages } from '../../lib/site';
import dataset from '../../data/territory.json';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Buscar no portal | Bahia do Sul', robots: { index: false, follow: false } };
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : '';
  const needle = normalize(query);
  const pages = query ? publicPages.filter(page => normalize(page.title + ' ' + page.description).includes(needle)) : publicPages.slice(1, 5);
  const municipalities = query ? dataset.municipalities.filter(m => m.id && normalize(m.name).includes(needle)) : [];
  return <InnerLayout><article className="reading portal-search"><h1>O que você quer conhecer?</h1><p className="page-lead">Busque páginas do projeto ou municípios. Você pode escrever sem acentos.</p>
    <form action="/buscar" role="search"><label htmlFor="portal-query">Buscar no portal</label><div className="portal-search-field"><input id="portal-query" name="q" type="search" maxLength={100} defaultValue={query} placeholder="Projeto, Guilherme, Ilhéus…"/><button className="button-primary" type="submit">Buscar</button></div></form>
    <h2>{query ? `Resultados para “${query}”` : 'Por onde começar'}</h2>
    {!pages.length && !municipalities.length && <div className="empty-state"><p>Nenhum resultado encontrado. Tente uma palavra mais curta ou confira o nome do município.</p><Link href="/territorio">Explorar todos os municípios</Link></div>}
    {!!pages.length && <ul className="portal-search-results">{pages.map(page => <li key={page.path}><Link href={page.path}>{page.title}</Link><p>{page.description}</p></li>)}</ul>}
    {!!municipalities.length && <section><h2>Municípios</h2><p>{municipalities.length} resultado(s) no território em estudo.</p><ul className="portal-search-results">{municipalities.slice(0, 30).map(m => <li key={m.id}><Link href={`/territorio?municipio=${m.id}`}>{m.name}</Link><p>Consultar município e fontes no mapa.</p></li>)}</ul>{municipalities.length > 30 && <Link href="/territorio">Ver todos no mapa</Link>}</section>}
  </article></InnerLayout>;
}
