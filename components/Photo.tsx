import Image from 'next/image';
import {photos,photoUrl} from '../data/photos';
export default function Photo({name,priority=false}:{name:keyof typeof photos;priority?:boolean}){
 const p=photos[name];return <div className="photo"><Image src={photoUrl(p.id,priority?2000:1000)} alt={p.alt} fill unoptimized priority={priority} sizes={priority?'100vw':'(max-width:700px) 100vw, 40vw'}/><a className="photo-credit" href={p.source} target="_blank" rel="noreferrer">{p.caption} · {p.author} ↗</a></div>;
}
