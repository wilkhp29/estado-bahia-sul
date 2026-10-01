'use client';

import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {Menu, Search, X} from 'lucide-react';
import Brand from './Brand';

const links = [
  {href:'/projeto',label:'O projeto'}, {href:'/territorio',label:'Território'},
  {href:'/economia',label:'Economia'}, {href:'/historia',label:'História'},
  {href:'/observatorio',label:'Observatório'},
];

export default function HomeHeader(){
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const trigger=useRef<HTMLButtonElement>(null);
  useEffect(()=>{const close=(event:KeyboardEvent)=>{if(event.key==='Escape'&&open){setOpen(false);trigger.current?.focus();}};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[open]);
  useEffect(()=>{const update=()=>setScrolled(window.scrollY>120);update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update)},[]);
  return <><a className="bs-skip" href="#conteudo">Pular para o conteúdo</a><header className={`bs-header${scrolled?' is-scrolled':''}`}><Brand/><nav className="bs-desktop-nav" aria-label="Navegação principal">{links.map(link=><Link key={link.href} href={link.href}>{link.label}</Link>)}</nav><Link className="bs-header-cta" href="/participar">Assine agora</Link><Link className="bs-search" href="/buscar" aria-label="Buscar no portal"><Search size={21}/></Link><button ref={trigger} className="bs-menu-trigger" type="button" aria-expanded={open} aria-controls="bs-mobile-navigation" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}<span className="bs-sr-only">{open?'Fechar menu':'Abrir menu'}</span></button>{open&&<nav className="bs-mobile-nav" id="bs-mobile-navigation" aria-label="Navegação móvel">{links.map(link=><Link key={link.href} href={link.href} onClick={()=>setOpen(false)}>{link.label}</Link>)}<Link href="/buscar" onClick={()=>setOpen(false)}>Buscar no portal</Link><Link className="bs-mobile-nav-cta" href="/participar" onClick={()=>setOpen(false)}>Assine agora</Link></nav>}</header></>;
}
