import Link from 'next/link';
import {geoMercator,geoPath} from 'd3-geo';
import type {FeatureCollection} from 'geojson';
import dataset from '../data/territory.json';
import {regionColors} from '../data/highlights';

// Render paths on the server: the homepage does not ship the GeoJSON to the browser.
export default function HomeMap(){
 const projection=geoMercator().fitExtent([[45,12],[277,222]],dataset.territory as unknown as FeatureCollection);
 const path=geoPath(projection);
 return <div className="r-map-preview live-home-map"><a className="map-skip" href="#depois-do-mapa">Pular mapa e consultar os números</a><Link className="home-map-open" href="/territorio">Buscar município ou explorar a lista</Link><svg viewBox="0 0 322 234" aria-label="Municípios do território em estudo, com limites reais do IBGE"><defs><clipPath id="home-map-clip"><rect width="322" height="234" rx="8"/></clipPath></defs><g clipPath="url(#home-map-clip)">{dataset.context.features.map(f=><path key={f.properties.codarea} d={path(f as unknown as GeoJSON.Feature)??''} fill="#193e41" stroke="#41605b" strokeWidth=".3"/>)}{dataset.territory.features.map(f=><a key={f.properties.id} href={`/territorio?municipio=${f.properties.id}`} aria-label={`Conhecer ${f.properties.name} no mapa`}><path d={path(f as unknown as GeoJSON.Feature)??''} fill={regionColors[f.properties.region!]??'#82958f'} stroke="#e2f1df" strokeWidth=".45"/><title>{`${f.properties.name} — ${f.properties.region}`}</title></a>)}</g><text x="32" y="28" fill="#c8dad7" fontSize="12">BA</text><text x="288" y="211" fill="#c8dad7" fontSize="10">ES</text></svg><div className="home-map-legend" aria-label="Legenda das seis regiões">{Object.entries(regionColors).map(([name,color])=><span key={name}><i style={{background:color}}/>{name}</span>)}</div><Link className="home-map-open" href="/territorio">Explore os municípios <span>↗</span></Link><span className="home-map-source">Limites: IBGE · Regiões provisórias</span></div>;
}
