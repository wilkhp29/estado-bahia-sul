import Link from 'next/link';

export default function Brand(){
  return <Link href="/" className="brand-v1 brand-horizontal" aria-label="Bahia do Sul Movimento Pró-Criação — início">
    <svg className="brand-symbol" viewBox="0 0 56 56" role="img" aria-label="Fruto do cacau, grão de café e ondas">
      <path className="brand-cacao-pod" d="M18 10c-7 4-11 13-9 22 1 7 6 13 13 16 7-5 11-12 10-20-1-8-6-15-14-18Z" fill="#ffcc00" stroke="#075b35" strokeWidth="1.5"/>
      <path className="brand-cacao-ribs" d="M17 13c-3 8-3 18 4 31m-9-26c4 6 9 12 18 17m-19-8c5 2 10 4 19 5" fill="none" stroke="#9c641e" strokeLinecap="round" strokeWidth="1.7"/>
      <path className="brand-leaf" d="M9 20c4-8 11-12 19-12-2 8-8 14-17 17" fill="#008844"/>
      <path className="brand-vein" d="m12 23 12-12m-7 7-1-5m5 1 4 1" fill="none" stroke="#f4f5e9" strokeLinecap="round" strokeWidth="1.3"/>
      <path className="brand-coffee-bean" d="M37 23c6-2 11 2 11 8 0 7-6 13-12 13-5-1-7-6-5-11 1-5 2-8 6-10Z" fill="#70452e" stroke="#075b35" strokeWidth="1.4"/>
      <path className="brand-coffee-seam" d="M42 25c-5 5-7 11-5 17" fill="none" stroke="#f4d4a1" strokeLinecap="round" strokeWidth="1.8"/>
      <path className="brand-cacao-leaf" d="M34 24c1-6 5-10 11-12 1 6-2 11-8 14" fill="#276b3a"/>
      <path className="brand-wave" d="M7 47c9-3 20-3 31 0m-27 5c9-2 18-2 27 0" fill="none" stroke="#006688" strokeLinecap="round" strokeWidth="2.4"/>
    </svg>
    <span className="brand-wordmark"><strong>BAHIA DO SUL</strong><small>MOVIMENTO PRÓ-CRIAÇÃO</small></span>
  </Link>;
}
