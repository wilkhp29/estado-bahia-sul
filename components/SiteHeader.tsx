'use client';

import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useRef, useState} from 'react';
import {Menu, X, Search} from 'lucide-react';
import Brand from './Brand';

const links = [
  ['/projeto', 'O projeto'],
  ['/territorio', 'Território'],
  ['/economia', 'Economia'],
  ['/historia', 'História'],
  ['/fontes', 'Fontes'],
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setOpen(false); router.push('/buscar');
      }
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [router]);
  return <>
    <a className="site-skip" href="#conteudo">Pular para o conteúdo</a>
    <header className="site-header movisul-header" onKeyDown={event => {
      if (event.key === 'Escape' && open) { setOpen(false); trigger.current?.focus(); }
    }}>
      <Brand/>
      <button ref={trigger} className="site-menu-toggle" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
        {open ? <X size={22}/> : <Menu size={22}/>} <span className="site-menu-label">{open ? 'Fechar menu' : 'Abrir menu'}</span>
      </button>
      <nav id="site-navigation" className={open ? 'site-nav is-open' : 'site-nav'} aria-label="Navegação principal">
        {links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
        <Link className="site-header-cta" href="/participar" onClick={() => setOpen(false)}>Participar</Link>
      </nav>
      <Link className="site-search" href="/buscar" aria-label="Buscar no portal" title="Buscar no portal (Ctrl ou ⌘ + K)"><Search size={20}/></Link>
    </header>
  </>;
}
