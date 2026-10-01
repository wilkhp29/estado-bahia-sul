'use client';
import {useState} from 'react';
import {ArrowUpRight} from 'lucide-react';
import {highlights,regionColors,checkedAt} from '../data/highlights';

export function MunicipalityHighlight({id}:{id:string|null}) {
  const item=highlights.find(h=>h.id===id);
  return <div className="municipal-highlight">{item?<><span>{item.tag}</span><h4>{item.title}</h4><p>{item.description}</p><a href={item.url} target="_blank" rel="noreferrer">Fonte: {item.source} ↗</a><small>Consultado em {checkedAt}</small></>:<p>O Observatório organiza as referências territoriais e econômicas deste município por tema, fonte e ano.</p>}</div>;
}

export default function TerritoryHighlights(){
 const [region,setRegion]=useState('Extremo Sul');
 return <section id="destaques" className="territory-highlights" aria-labelledby="highlights-title"><div className="highlights-heading"><div><p className="r-eyebrow green">CONHEÇA O QUE NOS TORNA ÚNICOS</p><h2 id="highlights-title">Cada região, novas descobertas.</h2></div><p>Natureza, cultura e vocações locais.<br/>Destaques documentados, com fontes para explorar.</p></div><div className="highlight-regions" role="group" aria-label="Filtrar destaques por região">{Object.keys(regionColors).map(r=><button key={r} aria-pressed={region===r} onClick={()=>setRegion(r)}><i style={{background:regionColors[r]}}/>{r}</button>)}</div><div className="highlight-results" aria-live="polite">{highlights.filter(h=>h.region===region).map(h=><article key={h.id}><div className="highlight-kicker">{h.name}<span>{h.tag}</span></div><h3>{h.title}</h3><p>{h.description}</p><div className="highlight-links"><a href={`/territorio?municipio=${h.id}`}>Conhecer no mapa <ArrowUpRight size={14}/></a><a href={h.url} target="_blank" rel="noreferrer">{h.source} ↗</a></div></article>)}</div><p className="highlights-note">Seleção inicial: 11 municípios com destaques pesquisados · Não é um ranking · Regiões editoriais provisórias · Fontes consultadas em {checkedAt}.</p></section>;
}
