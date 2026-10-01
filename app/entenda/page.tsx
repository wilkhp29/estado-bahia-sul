import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import InnerLayout from '../../components/InnerLayout';
import { publicMetadata, publicPages } from '../../lib/site';
import { candidate } from '../../data/candidate';

const page = publicPages[1];
export const metadata = publicMetadata(page.path, page.title, page.description);

export default function UnderstandPage() {
  return <InnerLayout><article className="quick-guide reading">
    <h1>Bahia do Sul,<br/>em poucas palavras.</h1>
    <p className="page-lead">Um guia de leitura de cerca de 2 minutos para entender a proposta e escolher por onde continuar.</p>
    <section><h2>O que está sendo proposto?</h2><p>A criação de um novo Estado a partir de parte do território baiano. O projeto coloca em debate desenvolvimento regional, representação e acesso a serviços; qualquer alteração oficial seguirá os processos constitucionais aplicáveis.</p><Link href="/projeto">Ler a proposta completa <ArrowRight size={18}/></Link></section>
    <section><h2>Qual é o território?</h2><p>O mapa reúne as 173 entradas apresentadas pelo projeto e seis agrupamentos regionais. O cadastro consultado do IBGE corresponde a 169 entradas; quatro nomes seguem registrados para conferência cadastral. A lista expressa a composição proposta pelo projeto.</p><Link href="/territorio">Encontrar um município no mapa <ArrowRight size={18}/></Link></section>
    <section><h2>O que pode mudar — e o que precisa ser estudado?</h2><p>O documento propõe discutir produção local, serviços e infraestrutura. Para avaliar os possíveis efeitos de uma nova organização territorial, também é preciso estudar custos, receitas e transição administrativa. Benefícios futuros não são garantidos.</p><Link href="/projeto#mudancas">Conhecer os argumentos do projeto <ArrowRight size={18}/></Link></section>
    <section><h2>Qual é a relação de Guilherme com a proposta?</h2><p>Este portal apresenta o Bahia do Sul e promove a participação política de Professor Guilherme. Sua página reúne a relação com o projeto descrita no documento, a identificação pública da candidatura e o Instagram informado pela equipe.</p><Link href={candidate.path}>Conhecer Professor Guilherme <ArrowRight size={18}/></Link></section>
    <section><h2>Como decidir e participar?</h2><p>Você pode conferir as fontes, acompanhar o debate e ler o abaixo-assinado antes de escolher participar. Assinar não equivale a votar em um candidato ou em um plebiscito. A criação de um Estado depende do processo institucional, não da ação isolada de uma pessoa.</p><div className="guide-actions"><Link href="/fontes">Conferir as fontes <ArrowRight size={18}/></Link><Link href="/participar/abaixo-assinado">Entender o abaixo-assinado <ArrowRight size={18}/></Link></div></section>
  </article></InnerLayout>;
}
