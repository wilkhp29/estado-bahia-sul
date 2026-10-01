import Link from 'next/link';
import Image from 'next/image';
import presentation from '../data/client-presentation.json';
import {ResourcePhotography} from './FeaturedPhotography';

const subheadings = new Set(['Missão','Visão','Valores','MOVISUL – Movimento Pró-Criação do Estado Bahia do Sul','A Bahia é grande — e profundamente desigual','A distância que separa do progresso','Saúde que não chega','Educação sem perspectiva','Riqueza que sai — e não volta','Eixos de Desenvolvimento','Exemplos que deram certo','Todos ganham','✅ Governo perto do povo','✅ Recursos investidos no próprio território','✅ Agregação de valor — riqueza que fica','✅ Representação própria']);
const images:Record<string,{src:string;alt:string}> = {
  cacau:{src:'/images/cacauzinho-cacau.webp',alt:'Cacauzinho apresentando frutos de cacau.'},
  'o-que-vai-melhorar':{src:'/images/cafezinho-cafe.webp',alt:'Cafezinho entre plantas de café.'},
};

export default function ClientPresentation() {
 return <>{presentation.sections.filter(section => !['inicio','menu'].includes(section.id)).map(section => {
   const tableStart=section.lines.findIndex(line => line.startsWith('Indicador\t'));
   const tableEnd=tableStart < 0 ? -1 : section.lines.findIndex((line,index) => index > tableStart && !line.includes('\t'));
   const rows=tableStart < 0 ? [] : section.lines.slice(tableStart,tableEnd < 0 ? undefined : tableEnd).map(line => line.split('\t'));
   return <section key={section.id} id={section.id} className={`movisul-section movisul-${section.id}`} aria-labelledby={`${section.id}-title`}>
     <header><h2 id={`${section.id}-title`}>{section.title}</h2>{images[section.id] && <figure><Image src={images[section.id].src} alt={images[section.id].alt} width={1536} height={1024} sizes="(max-width: 900px) 100vw, 35vw"/></figure>}</header>
     <div className="movisul-copy">
       {['viabilidade','base-legal'].includes(section.id) && <p className="movisul-attribution">Texto do MOVISUL, reproduzido conforme enviado. {section.id === 'viabilidade' ? 'Os números e cenários abaixo são apresentados pelo movimento; não constituem validação independente de viabilidade.' : 'Esta é a apresentação do movimento, não um parecer jurídico. A criação de um Estado depende de plebiscito e aprovação do Congresso Nacional por lei complementar.'}</p>}
       {section.lines.map((line,index) => {
         if (index === tableStart) return <div key={index} className="movisul-table" role="region" aria-label="Tabela comparativa apresentada pelo MOVISUL" tabIndex={0}><table><caption>Comparativo do documento do MOVISUL</caption><thead><tr>{rows[0].map(cell => <th key={cell} scope="col">{cell}</th>)}</tr></thead><tbody>{rows.slice(1).map((row,i) => <tr key={i}>{row.map((cell,j) => j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
         if (tableStart >= 0 && index > tableStart && (tableEnd < 0 || index < tableEnd)) return null;
         if(subheadings.has(line)) return <h3 key={index}>{line}</h3>;
         if(line === '🔗 estadobahiadosul.com.br/livro') return <Link key={index} className="basic-button" href="/livro">{line}</Link>;
         if(line === '✍️ Assine como Coautor(a) e Fundador(a) Simbólico(a)') return <p key={index}><Link className="movisul-inline-link" href="/livro">{line}</Link></p>;
         return <p key={index} className={section.id === 'sonho' && /^(Época|19\d\d|20\d\d)/.test(line) ? 'movisul-milestone' : undefined}>{line}</p>;
       })}
     </div>
     {section.id === 'viabilidade' && <ResourcePhotography/>}
   </section>;
 })}</>;
}
