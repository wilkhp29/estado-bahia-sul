'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import territory from '../data/territory.json';
import imageManifest from '../data/municipality-images.json';
import MunicipalityVisual from './MunicipalityVisual';

const municipalities = territory.municipalities;
const intervalMs = 6500;

export default function MunicipalityCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const municipality = municipalities[index];
  const image = imageManifest.results.find(item => item.ibgeCode === municipality.id)?.image ?? null;
  const hasMapSelection = Boolean(municipality.id && !municipality.review);
  const mapUrl = useMemo(() => hasMapSelection ? `/territorio?municipio=${municipality.id}` : '/territorio', [hasMapSelection, municipality.id]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const timer = window.setInterval(() => setIndex(current => (current + 1) % municipalities.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion]);

  function move(step: number) {
    setIndex(current => (current + step + municipalities.length) % municipalities.length);
  }

  return <section className="municipality-carousel" aria-labelledby="municipality-carousel-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
    <div className="municipality-carousel-heading">
      <div>
        <p className="r-eyebrow green">UM TERRITÓRIO DE MUITAS CIDADES</p>
        <h2 id="municipality-carousel-title">Conheça os municípios</h2>
      </div>
      <p>Uma janela para as cidades e paisagens do território em estudo.</p>
    </div>

    <div className="municipality-carousel-slide" aria-live={paused || reducedMotion ? 'polite' : 'off'}>
      <MunicipalityVisual municipality={municipality} image={image} priority={index === 0} />
      <div className="municipality-carousel-copy">
        <span className="municipality-carousel-index">{String(index + 1).padStart(2, '0')} <i/> {String(municipalities.length).padStart(3, '0')}</span>
        <h3>{municipality.name}</h3>
        <p>{image ? 'Uma paisagem de ' + municipality.name + ', no território em estudo.' : 'Conheça ' + municipality.name + ' no mapa e na composição territorial do projeto.'}</p>
        <Link href={mapUrl}>Ver no mapa <ArrowRight size={17} aria-hidden="true"/></Link>
      </div>
    </div>

    <div className="municipality-carousel-controls" aria-label="Controles do carrossel">
      <button type="button" onClick={() => move(-1)} aria-label="Município anterior"><ArrowLeft size={18}/></button>
      <span aria-hidden="true">{String(index + 1).padStart(2, '0')} / {municipalities.length}</span>
      <button type="button" onClick={() => move(1)} aria-label="Próximo município"><ArrowRight size={18}/></button>
      <button type="button" className="carousel-motion-toggle" onClick={() => { setPaused(value => !value); setReducedMotion(false); }} aria-label={paused || reducedMotion ? 'Iniciar rotação automática' : 'Pausar rotação automática'}>
        {paused || reducedMotion ? <Play size={16}/> : <Pause size={16}/>}<span>{paused || reducedMotion ? 'Reproduzir' : 'Pausar'}</span>
      </button>
    </div>
  </section>;
}
