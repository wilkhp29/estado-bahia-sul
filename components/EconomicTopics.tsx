import Link from 'next/link';
import {highlights, checkedAt} from '../data/highlights';
const topics=[
  {id:'agricultura',title:'Agricultura e Pecuária',intro:'O Observatório organizará as cadeias do cacau, café, pecuária e demais atividades com indicadores municipais, fonte e ano de referência.',ids:['2913606','2932705','2902906']},
  {id:'turismo',title:'Turismo e patrimônio',intro:'Conheça referências de natureza, patrimônio e cultura. Esta seleção não é um ranking de destinos.',ids:['2906907','2925303','2903904','2921906','2926707']},
  {id:'industria',title:'Indústria e Comércio',intro:'O Observatório reunirá produção, emprego, empresas e infraestrutura logística em séries municipais com origem e período identificados.',ids:[]},
  {id:'educacao',title:'Educação e Inovação',intro:'O Observatório organizará instituições, pesquisas e indicadores educacionais por município, nível de ensino e ano.',ids:[]},
  {id:'ambiente',title:'Meio Ambiente',intro:'As referências abaixo descrevem áreas de conservação. Elas não são uma avaliação de impacto ambiental da proposta territorial.',ids:['2906907','2905404','2905800']},
];
export default function EconomicTopics(){return <><nav className="help-topics" aria-label="Temas da economia">{topics.map(t=><a key={t.id} href={'#'+t.id}>{t.title}</a>)}</nav><div className="source-list">{topics.map(t=><section key={t.id} id={t.id}><h2>{t.title}</h2><p>{t.intro}</p>{highlights.filter(h=>t.ids.includes(h.id)).map(h=><section key={h.id}><h3>{h.name}: {h.title}</h3><p>{h.description}</p><a href={h.url} target="_blank" rel="noreferrer">Fonte: {h.source} ↗</a><p className="field-help">Referência consultada em {checkedAt}.</p></section>)}</section>)}</div><Link href="/fontes">Conferir todas as fontes e a metodologia</Link></>}
