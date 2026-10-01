import fs from 'node:fs';
import {geoArea} from 'd3-geo';
const original=JSON.parse(fs.readFileSync('municipios.json','utf8'));
const official=JSON.parse(fs.readFileSync('/tmp/bahia-municipios-ibge.json','utf8'));
const geometry=JSON.parse(fs.readFileSync('/tmp/bahia-malha-ibge.json','utf8'));
// D3 spherical polygons use the opposite exterior winding to RFC 7946.
for(const feature of geometry.features){
 const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
 for(const rings of polygons)if(geoArea({type:'Polygon',coordinates:rings})>2*Math.PI)for(const ring of rings)ring.reverse();
}
const norm=s=>s.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
const regions={'Porto Seguro':'Extremo Sul','Ilhéus-Itabuna':'Sul','Valença':'Baixo Sul','Vitória da Conquista':'Sudoeste','Itapetinga':'Sudoeste','Jequié':'Sudoeste','Bom Jesus da Lapa':'Médio São Francisco','Santa Maria da Vitória':'Médio São Francisco','Guanambi':'Centro Sul','Brumado':'Centro Sul','Boquira':'Centro Sul','Seabra':'Centro Sul','Livramento do Brumado':'Centro Sul','Jaguaquara':'Sudoeste','Santo Antônio de Jesus':'Baixo Sul'};
const municipalities=original.municipalities.map(entry=>{
 const match=official.find(x=>norm(x.nome)===norm(entry.name));
 const micro=match?.microrregiao.nome;
 return {...entry,id:match?String(match.id):null,micro:micro??null,region:regions[micro]??null,review:!match||entry.status.includes('requires')||entry.status==='requires_review',matched:!!match};
});
const byId=new Map(municipalities.filter(x=>x.id).map(x=>[x.id,x]));
const features=geometry.features.filter(f=>byId.has(f.properties.codarea)).map(f=>({...f,properties:byId.get(f.properties.codarea)}));
const result={source:'https://servicodados.ibge.gov.br/api/v1/localidades/estados/29/municipios',geometrySource:'https://servicodados.ibge.gov.br/api/v3/malhas/estados/29?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio',checkedAt:new Date().toISOString(),regionStatus:'Proposta editorial para revisão; não é uma divisão regional oficial do IBGE.',municipalities,territory:{type:'FeatureCollection',features},context:geometry};
fs.mkdirSync('data',{recursive:true});fs.writeFileSync('data/territory.json',JSON.stringify(result));
fs.writeFileSync('data/validation-report.json',JSON.stringify({source:result.source,checkedAt:result.checkedAt,regionStatus:result.regionStatus,municipalities},null,2));
console.log(JSON.stringify({entries:municipalities.length,matched:features.length,pending:municipalities.filter(x=>x.review).map(x=>x.name),unassigned:municipalities.filter(x=>x.id&&!x.region).map(x=>[x.name,x.micro])},null,2));
