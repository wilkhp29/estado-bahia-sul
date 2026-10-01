'use client';
import Image from 'next/image';
import {useState} from 'react';
export default function ProfessorPortrait({cutout = false, instagram = false}: {cutout?: boolean; instagram?: boolean}){
 const [failed,setFailed]=useState(false);
 const src = instagram ? '/images/professor-guilherme-instagram-cutout.webp' : (cutout ? '/images/professor-guilherme-cutout.webp' : '/images/professor-guilherme-source.webp');
 const alt = instagram ? 'Retrato de Guilherme Santos, foto publicada no Instagram oficial' : (cutout ? 'Retrato de Professor Guilherme tratado com IA a partir da foto publicada pelo Opera Mundi' : 'Professor Guilherme — José Carlos Guilherme Santos, foto publicada no perfil de candidatura do Opera Mundi');
 return <div className={`professor-portrait${cutout || instagram ? ' professor-portrait-cutout' : ''}`}>{failed?<span>Retrato indisponível.<br/>Consulte a fonte.</span>:<Image unoptimized width={720} height={720} src={src} alt={alt} onError={()=>setFailed(true)}/>}</div>;
}
