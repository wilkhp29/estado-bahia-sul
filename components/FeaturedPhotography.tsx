'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useRef} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import photography from '../data/featured-photography.json';

type Photograph = typeof photography.resources[number] | typeof photography.cities[number];
function Credits({photo}:{photo:Photograph}) {
 return <details className="photo-credits"><summary>Créditos da fotografia</summary><p><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a>. Enquadramento de exibição adaptado.</p></details>;
}

export function CityPhotography() {
 const rail=useRef<HTMLDivElement>(null);
 function move(direction:number) {
  const element=rail.current;
  if(element) element.scrollBy({left:direction*element.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 }
 return <section className="city-photography" aria-labelledby="city-photography-title">
  <div className="photography-heading"><div><h2 id="city-photography-title">Cidades que fazem parte desta história</h2><p>Conheça as paisagens e o patrimônio dos municípios.</p></div><div className="photography-controls"><button onClick={()=>move(-1)} aria-label="Ver cidades anteriores"><ArrowLeft size={20}/></button><button onClick={()=>move(1)} aria-label="Ver próximas cidades"><ArrowRight size={20}/></button></div></div>
  <div ref={rail} className="city-photo-rail" role="region" aria-label="Fotografias de 13 municípios; role para explorar" tabIndex={0}>
   {photography.cities.map(photo=><figure key={photo.ibgeCode}><Link href={`/territorio?municipio=${photo.ibgeCode}`}><Image unoptimized src={photo.imageUrl} alt={photo.alt} width={960} height={640} loading="lazy"/><h3>{photo.name}</h3></Link><figcaption><Credits photo={photo}/></figcaption></figure>)}
  </div>
 </section>;
}

export function ResourcePhotography() {
 return <section className="resource-photography" aria-labelledby="resource-photography-title"><h3 id="resource-photography-title">Riquezas naturais e minerais</h3><div className="resource-photo-grid">{photography.resources.map(photo=><figure key={photo.title} className={photo.kind==='mineral'?'mineral-photograph':undefined}><Image unoptimized src={photo.imageUrl} alt={photo.alt} width={960} height={640} loading="lazy"/><figcaption><h3>{photo.title}</h3><p>{photo.caption}</p><Credits photo={photo}/></figcaption></figure>)}</div><p className="resource-photo-note">As fotografias minerais mostram amostras identificadas por sua procedência, não estimativas de reservas ou de valor econômico.</p></section>;
}
