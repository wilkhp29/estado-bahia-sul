/** Exact regions of the user-owned, AI-generated layout; the source stays unmodified. */
export default function ReferenceArt({box,label,className='',alignment='xMidYMid slice'}:{box:[number,number,number,number];label:string;className?:string;alignment?:'xMidYMid slice'|'xMaxYMid slice'}){
 return <svg className={`reference-art ${className}`} viewBox={box.join(' ')} preserveAspectRatio={alignment} role="img" aria-label={label}><image href="/images/layout-original.png" x="0" y="0" width="1024" height="1536"/></svg>;
}
