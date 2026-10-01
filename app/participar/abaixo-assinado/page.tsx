import Link from 'next/link';
import InnerLayout from '../../../components/InnerLayout';
import ParticipationForm from '../../../components/ParticipationForm';
import {collectionReady,publicConfig} from '../../../lib/config';
import dataset from '../../../data/territory.json';
import { publicMetadata } from '../../../lib/site';
export const metadata = publicMetadata('/participar/abaixo-assinado', 'Abaixo-assinado Bahia do Sul | Participação', 'Leia o manifesto, entenda o significado da participação voluntária e consulte o aviso de privacidade do projeto Bahia do Sul.');

export const dynamic='force-dynamic';

export default function AbaixoAssinadoPage(){
  const config=publicConfig();
  const collecting=collectionReady();
  const municipalities=dataset.municipalities.filter(m=>m.id&&!m.review).map(m=>({id:m.id!,name:m.name}));
  return <InnerLayout><article className="petition-page reading">
    <h1>Apoio à criação do Estado Bahia do Sul</h1>
    <p className="page-lead">Um abaixo-assinado para registrar uma manifestação voluntária e simbólica de apoio à proposta Bahia do Sul.</p>
    <p className="petition-status"><strong>O que esta página representa</strong><br/>Este manifesto é uma posição do projeto. Não é plebiscito, referendo, voto oficial, consulta da Justiça Eleitoral ou criação jurídica de um Estado.</p>
    <h2>Texto do abaixo-assinado</h2>
    <div className="manifesto"><p>Nós, cidadãos e cidadãs brasileiros e brasileiras, manifestamos nosso apoio à criação do Estado Bahia do Sul, conforme a proposta apresentada neste portal e sujeita aos processos constitucionais aplicáveis.</p><p>O projeto defende um debate público sobre território, emprego, indústria, agropecuária, educação, saúde, segurança, esporte, cultura, juventude e desenvolvimento regional.</p><p>Ao assinar, cada pessoa registra uma manifestação voluntária e identificada de apoio. A assinatura expressa participação pública e se soma ao debate, aos estudos, à análise jurídica e às etapas previstas na Constituição e na legislação.</p><p>A lista territorial do projeto reúne 173 entradas; 169 correspondem a municípios no cadastro consultado do IBGE e quatro nomes estão identificados para conferência cadastral. As seis regiões do mapa são agrupamentos editoriais do projeto.</p></div>
    <h2>Compromisso com dados e fontes</h2>
    <p>O projeto Bahia do Sul defende a criação de um novo estado e a abertura de um debate público sobre desenvolvimento regional. O portal organiza essa proposta, seu território, sua história e seus argumentos.</p>
    <p>Indicadores apresentados como dados oficiais são publicados com fonte, ano e metodologia. Estimativas e posições do projeto são identificadas como tais, para que a proposta possa ser conhecida com clareza e seus fundamentos possam ser consultados.</p>
    <h2>Como participar</h2>
    <ol className="petition-steps"><li>Preencha os dados mínimos e leia o aviso de privacidade.</li><li>Receba um link de confirmação por e-mail.</li><li>Abra o link para confirmar a manifestação.</li><li>Só a participação confirmada poderá entrar nos números agregados.</li></ol>
    <p className="petition-note"><strong>Importante:</strong> {collecting ? 'A participação só será registrada no total público após sua confirmação por e-mail. Confira o aviso de privacidade antes de enviar.' : 'O formulário está preparado, mas a coleta continua fechada enquanto o canal de privacidade, o envio de e-mail e a revisão necessária não estiverem concluídos. Nenhum dado será recebido nesta etapa.'}</p>
    <section className="petition-form-section" aria-labelledby="assinar-heading"><h2 id="assinar-heading">Assine o abaixo-assinado</h2><p>O formulário atual solicita nome, e-mail e município. Não solicitamos CPF, RG, data de nascimento ou WhatsApp.</p><ParticipationForm enabled={collectionReady()} siteKey={config.turnstileSiteKey} municipalities={municipalities}/></section>
    <p><Link href="/privacidade">Leia a política de privacidade</Link> · <Link href="/territorio">Consulte os municípios em estudo</Link> · <Link href="/ajuda#participacao">Como funciona a participação</Link></p>
  </article></InnerLayout>;
}
