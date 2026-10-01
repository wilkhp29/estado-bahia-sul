'use client';
import {useState,useRef} from 'react';
import {X,ArrowRight} from 'lucide-react';
export default function ReferenceInteraction({label,title,children,className=''}:{label:string;title:string;children:React.ReactNode;className?:string}){
 const ref=useRef<HTMLDialogElement>(null);const[open,setOpen]=useState(false);
 return <><button className={className} onClick={()=>{setOpen(true);ref.current?.showModal();}}>{label}<ArrowRight size={16}/></button><dialog className="reference-dialog" ref={ref} onClose={()=>setOpen(false)} onClick={e=>{if(e.target===e.currentTarget)ref.current?.close();}} aria-label={title}><button autoFocus className="dialog-close" aria-label="Fechar" onClick={()=>ref.current?.close()}><X/></button>{open&&<><h2>{title}</h2><div>{children}</div></>}</dialog></>;
}
