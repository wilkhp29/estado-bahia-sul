'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import MunicipalityVisual from './MunicipalityVisual';
import { MunicipalityHighlight } from './TerritoryHighlights';

type Municipality = { id: string | null; name: string; region: string | null; review: boolean };
type Photo = Parameters<typeof MunicipalityVisual>[0]['image'];

export default function MobileMunicipalityDock({ municipality, image, onClose }: {
  municipality: Municipality;
  image?: Photo;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [mapNearby, setMapNearby] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dockRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const atlas = document.querySelector('.atlas');
    if (!atlas) return;
    const observer = new IntersectionObserver(([entry]) => setMapNearby(entry.isIntersecting), { rootMargin: '120px 0px' });
    observer.observe(atlas);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mounted && mapNearby) dockRef.current?.focus({ preventScroll: true });
  }, [mounted, mapNearby, municipality.id, municipality.name]);

  if (!mounted || !mapNearby) return null;

  return createPortal(
    <section ref={dockRef} tabIndex={-1} className={`mobile-map-dock${expanded ? ' is-expanded' : ''}`} aria-label={`Município selecionado: ${municipality.name}`} aria-live="polite">
      <div className="mobile-map-dock-summary">
        <div className="mobile-map-dock-photo"><MunicipalityVisual municipality={municipality} image={image} /></div>
        <div className="mobile-map-dock-place">
          <span>NO MAPA</span>
          <strong>{municipality.name}</strong>
          <small>{municipality.region ?? 'Região a conferir'}</small>
        </div>
        <button type="button" className="mobile-map-dock-toggle" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>
          {expanded ? <ChevronDown size={19} /> : <ChevronUp size={19} />}
          <span>{expanded ? 'Recolher' : 'Detalhes'}</span>
        </button>
        <button type="button" className="mobile-map-dock-close" aria-label={`Fechar seleção de ${municipality.name}`} onClick={onClose}><X size={19} /></button>
      </div>
      {expanded && <div className="mobile-map-dock-details">
        <dl>
          <div><dt>Código IBGE</dt><dd>{municipality.id ?? 'Não localizado'}</dd></div>
          <div><dt>Conferência</dt><dd>{municipality.review ? 'Revisão necessária' : 'Nome encontrado'}</dd></div>
          <div><dt>Observatório</dt><dd>Indicadores municipais organizados por fonte, ano e metodologia.</dd></div>
        </dl>
        <MunicipalityHighlight id={municipality.id} />
      </div>}
    </section>,
    document.body,
  );
}
