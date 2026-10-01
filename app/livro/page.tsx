import {redirect} from 'next/navigation';

export const metadata = {title: 'Assine o abaixo-assinado | Bahia do Sul', robots: {index: false, follow: true}};

export default function Livro(){
  redirect('/participar');
}
