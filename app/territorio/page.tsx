import Territory from '../../components/Territory';
import InnerLayout from '../../components/InnerLayout';
import Link from 'next/link';
import { publicMetadata } from '../../lib/site';
export const metadata = publicMetadata('/territorio', 'Mapa do território em estudo', 'Explore os municípios e regiões editoriais provisórias do projeto Bahia do Sul.');
export const dynamic='force-dynamic';
export default function TerritoryPage(){return <InnerLayout><div className="map-page"><h1>Mapa do território em estudo</h1><p className="map-help">Busque pelo nome ou filtre uma região. Você também pode selecionar os municípios pela lista, sem usar o mapa. O endereço guarda a busca e a seleção para consulta posterior.</p><Link href="/ajuda#mapa">Como usar o mapa e interpretar os dados</Link><Territory/></div></InnerLayout>}
