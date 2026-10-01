'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';

const slides = [
  {name:'Os mascotes', title:'Prazer, Cacauzinho e Cafezinho!', text:'Dois personagens para apresentar a cultura e as riquezas da nossa terra.', image:'/images/mascotes-bahia-do-sul.webp', alt:'Cacauzinho e Cafezinho com chapéus, botas e bolsas Bahia do Sul diante de uma paisagem litorânea ilustrada.'},
  {name:'Cacauzinho', title:'Olá, eu sou o Cacauzinho!', text:'Do fruto às sementes, quero apresentar o universo do cacau e sua ligação com a nossa região. Vamos conhecer essa história juntos?', image:'/images/cacauzinho-cacau.webp', alt:'Cacauzinho em um cacaual, segurando um fruto e apresentando um cacau aberto com sementes sobre uma mesa.'},
  {name:'Cafezinho', title:'E eu sou o Cafezinho!', text:'Entre os cafezais e os frutos maduros, convido você a conhecer o café, seus sabores e as histórias da nossa terra.', image:'/images/cafezinho-cafe.webp', alt:'Cafezinho entre plantas de café, com uma cesta de frutos vermelhos e um gesto de boas-vindas.'},
];

export default function MascotCarousel() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold:.3});
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener('change', update); observer.disconnect(); };
  }, []);
  const rotating = playing && !reduced && visible && !hovered;
  useEffect(() => {
    if (!rotating) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [rotating]);
  const select = (next:number) => { setPlaying(false); setIndex((next + slides.length) % slides.length); };
  const slide = slides[index];
  return <div ref={root} className="mascot-carousel" role="region" aria-roledescription="carrossel" aria-label="Apresentação de Cacauzinho e Cafezinho" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={event => { if (!(event.target instanceof HTMLElement && event.target.closest('[data-rotation]'))) setPlaying(false); }} onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); select(index + (event.key === 'ArrowRight' ? 1 : -1)); }
  }}>
    <figure className="basic-mascots">
      {slides.map((item,i) => <Image key={item.image} src={item.image} alt={item.alt} style={{display:index === i ? 'block' : 'none'}} aria-hidden={index !== i} width={1536} height={1024} priority={i === 0} loading={i === 0 ? undefined : 'eager'} sizes="(max-width: 760px) 100vw, 58vw"/>)}
      <figcaption aria-live={playing && !reduced ? 'off' : 'polite'} aria-atomic="true"><div key={index} className="mascot-slide" role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}`}><h2>{slide.title}</h2><p>{slide.text}</p></div></figcaption>
    </figure>
    <div className="mascot-controls" aria-label="Controles dos mascotes">
      <button type="button" aria-label="Apresentação anterior" onClick={() => select(index - 1)}><ChevronLeft size={20}/></button>
      <div className="mascot-selectors">{slides.map((item,i) => <button type="button" key={item.name} aria-label={`Mostrar ${item.name}`} aria-pressed={index === i} onClick={() => select(i)}><span aria-hidden="true"/></button>)}</div>
      <button type="button" aria-label="Próxima apresentação" onClick={() => select(index + 1)}><ChevronRight size={20}/></button>
      {!reduced && <button type="button" data-rotation className="mascot-play" onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pausar apresentações' : 'Reproduzir apresentações'}>{playing ? <Pause size={17}/> : <Play size={17}/>}<span>{playing ? 'Pausar' : 'Reproduzir'}</span></button>}
    </div>
  </div>;
}
