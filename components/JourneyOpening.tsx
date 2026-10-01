import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function JourneyOpening() {
  return <>
    <section className="journey-hero" aria-labelledby="journey-title">
      <picture className="journey-landscape-frame"><source media="(max-width: 760px)" srcSet="/images/jornada-coast-mobile.webp"/><Image unoptimized className="journey-landscape" src="/images/jornada-coast.webp" alt="Paisagem do litoral, Mata Atlântica e cacau" fill sizes="100vw" fetchPriority="high" loading="eager"/></picture>
      <div className="journey-hero-copy">
        <h1 id="journey-title">Bahia<br/><span>do <em>Sul</em></span></h1>
        <p className="journey-motto">Nossa terra. Mais futuro.</p>
        <div className="journey-actions">
          <Link className="journey-button" href="/projeto">Conheça o projeto <ArrowRight aria-hidden="true" size={20}/></Link>
          <Link className="journey-button journey-button-outline" href="/territorio">Explore o território <ArrowRight aria-hidden="true" size={20}/></Link>
        </div>
      </div>
    </section>
    <nav className="journey-chapters" aria-label="Explore a página por capítulos">
      <a href="#entenda"><span aria-hidden="true">01</span> O projeto <ArrowRight size={18} aria-hidden="true"/></a>
      <a href="#territorio"><span aria-hidden="true">02</span> Território <ArrowRight size={18} aria-hidden="true"/></a>
      <a href="#economia"><span aria-hidden="true">03</span> Economia <ArrowRight size={18} aria-hidden="true"/></a>
    </nav>
  </>;
}
