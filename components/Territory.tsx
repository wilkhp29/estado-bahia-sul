'use client';

import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { geoMercator, geoPath } from 'd3-geo';
import type { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { ArrowUpRight, Check, Info, MapPin, Minus, Plus, RotateCcw, Search, X } from 'lucide-react';
import dataset from '../data/territory.json';
import TerritoryHighlights, { MunicipalityHighlight } from './TerritoryHighlights';
import MunicipalityVisual, { getMunicipalityImage } from './MunicipalityVisual';
import MobileMunicipalityDock from './MobileMunicipalityDock';
import { regionColors as colors } from '../data/highlights';
import { normalizeMunicipality as normalize, selectedMunicipality } from '../lib/map-state';

const names = Object.keys(colors);
type Municipality = (typeof dataset.municipalities)[number];
const shapes = dataset.territory as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
const projection = geoMercator().fitExtent([[60, 45], [740, 590]], shapes);
const path = geoPath(projection);

export default function Territory() {
  const params = useSearchParams();
  const rawRegion = params.get('regiao');
  const region = rawRegion && names.includes(rawRegion) ? rawRegion : null;
  const query = params.get('busca') ?? '';
  const municipalityId = params.get('municipio');
  const pendingName = params.get('entrada');
  const selected = selectedMunicipality(dataset.municipalities, municipalityId, pendingName);
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  function update(values: Record<string, string | null>, replace = false) {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const url = '/territorio' + (next.size ? '?' + next.toString() : '');
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  }

  const setQuery = (value: string) => update({ busca: value, municipio: null, entrada: null }, true);
  const setRegion = (value: string | null) => update({ regiao: value, municipio: null, entrada: null });
  const setSelected = (value: Municipality | null) => update({ municipio: value?.id ?? null, entrada: value && !value.id ? value.name : null });
  const filtered = useMemo(
    () => dataset.municipalities.filter(municipality => (!region || municipality.region === region) && normalize(municipality.name).includes(normalize(query))),
    [query, region],
  );
  const visibleIds = new Set(filtered.map(municipality => municipality.id));

  return <section id="territorio" className="territory">
    <div className="section-heading">
      <div><h2>Muitos lugares.<br /><em>Um novo olhar.</em></h2></div>
      <p>Do litoral ao interior, explore os municípios da lista em estudo. Escolha uma região ou encontre a sua cidade.</p>
      <div className="list-count"><strong>173</strong><span>entradas na lista original</span></div>
    </div>

    <div className="atlas">
      <div className="map-toolbar">
        <span><MapPin size={17} /> Território em estudo</span>
        <label className="search"><Search size={18} /><input ref={searchRef} aria-label="Buscar município" placeholder="Encontre seu município" value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="Limpar busca" onClick={() => setQuery('')}><X size={16} /></button>}</label>
      </div>

      <div className="atlas-body">
        <div className="map-area">
          <svg viewBox="0 0 800 640" role="img" aria-label="Mapa dos municípios encontrados no cadastro IBGE. Use a lista ao lado para selecionar por teclado.">
            <defs><clipPath id="map-clip"><rect width="800" height="640" /></clipPath></defs>
            <g clipPath="url(#map-clip)">
              <g transform={`translate(${400 * (1 - zoom)},${320 * (1 - zoom)}) scale(${zoom})`}>
                {dataset.context.features.map(feature => <path key={feature.properties.codarea} d={path(feature as unknown as GeoJSON.Feature) ?? ''} fill="#203f43" stroke="#355358" strokeWidth={.6} />)}
                {dataset.territory.features.map(feature => {
                  const municipality = feature.properties;
                  return <path key={municipality.id} d={path(feature as unknown as GeoJSON.Feature) ?? ''} fill={selected?.id === municipality.id ? '#fff5c9' : colors[municipality.region!] ?? '#9ca7a6'} fillOpacity={visibleIds.has(municipality.id) ? 1 : .18} stroke={selected?.id === municipality.id ? '#ffffff' : '#dbecdf'} strokeWidth={selected?.id === municipality.id ? 2 : .65} vectorEffect="non-scaling-stroke" className="municipal-shape" onMouseEnter={() => setHover(municipality.name)} onMouseLeave={() => setHover('')} onClick={() => setSelected(municipality)}><title>{`${municipality.name} — ${municipality.region} (agrupamento provisório)`}</title></path>;
                })}
              </g>
            </g>
            <text x="115" y="73" className="map-label">BAHIA</text>
            <text x="657" y="442" className="ocean-label" transform="rotate(-76 657 442)">OCEANO ATLÂNTICO</text>
            <text x="333" y="615" className="map-label">MINAS GERAIS</text>
            <text x="645" y="588" className="map-label">ES</text>
          </svg>
          <div className="north">N<span>↑</span></div>
          <div className="map-tools">
            <button aria-label="Ampliar mapa" disabled={zoom >= 2} onClick={() => setZoom(Math.min(2, zoom + .25))}><Plus size={18} /></button>
            <button aria-label="Reduzir mapa" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - .25))}><Minus size={18} /></button>
            <button aria-label="Restaurar mapa" onClick={() => { setZoom(1); update({ regiao: null, busca: null, municipio: null, entrada: null }); }}><RotateCcw size={17} /></button>
          </div>
          <div className="map-caption"><span className="map-dot" />{hover || selected?.name || 'Selecione um município para conhecer'}</div>
          <a className="attribution" href={dataset.geometrySource} target="_blank" rel="noreferrer">Limites: IBGE · projeção Mercator ↗</a>
        </div>

        <aside className={`map-sidebar${selected ? ' has-selection' : ''}`}>
          <div className="region-header"><h3>Seis regiões,<br />muitas histórias.</h3><button onClick={() => setRegion(null)} className={!region ? 'active-all' : ''}>Ver todas</button></div>
          <div className="region-list">{names.map(name => <button key={name} aria-pressed={region === name} onClick={() => setRegion(region === name ? null : name)}><i style={{ background: colors[name] }} /><span>{name}</span>{region === name ? <Check size={15} /> : <ArrowUpRight size={14} />}</button>)}</div>
          <p className="region-note"><Info size={14} /> Regiões territoriais propostas pelo projeto.</p>

          {selected && <div className="municipality-detail" aria-live="polite">
            <button className="close-detail" aria-label="Fechar detalhes" onClick={() => setSelected(null)}><X size={17} /></button>
            <span className="detail-label">MUNICÍPIO SELECIONADO</span>
            <h3>{selected.name}</h3>
            <p>{selected.region ?? 'Região a conferir'}</p>
            <MunicipalityVisual municipality={selected} image={getMunicipalityImage(selected.id)} />
            <dl>
              <div><dt>Código IBGE</dt><dd>{selected.id ?? 'Não localizado'}</dd></div>
              <div><dt>Conferência</dt><dd>{selected.review ? 'Revisão necessária' : 'Nome encontrado'}</dd></div>
              <div><dt>Observatório</dt><dd>Indicadores municipais organizados por fonte, ano e metodologia</dd></div>
            </dl>
            <MunicipalityHighlight id={selected.id} />
          </div>}
          <div className="municipality-list">
            <h4 aria-live="polite">{query ? 'Resultado da busca' : 'Explore os municípios'} <span>{filtered.length}</span></h4>
            <div className="list-scroll">{filtered.length ? filtered.map(municipality => <button key={municipality.name} onClick={() => setSelected(municipality)}><span>{municipality.name}{municipality.review && <small>Revisão pendente</small>}</span><ArrowUpRight size={13} /></button>) : <p>Nenhum município encontrado. Tente outro nome, limpe a busca ou selecione “Ver todas” para remover o filtro de região.</p>}</div>
          </div>
        </aside>
      </div>

      {selected && <MobileMunicipalityDock municipality={selected} image={getMunicipalityImage(selected.id)} onClose={() => { setSelected(null); window.requestAnimationFrame(() => searchRef.current?.focus()); }} />}

      <div className="atlas-footer"><span><Info size={15} /> Limites reais; composição territorial em estudo.</span></div>
    </div>

    <div className="data-strip">
      <div><h3>O território em números</h3><p>O Observatório organizará indicadores municipais por fonte, ano e metodologia.</p></div>
      {['População', 'PIB agregado', 'Área territorial'].map(label => <div key={label}><span>{label}</span><strong>Série municipal</strong><small>Publicação com período e metodologia identificados</small></div>)}
    </div>
    <TerritoryHighlights />
  </section>;
}
