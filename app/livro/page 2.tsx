import InnerLayout from '../../components/InnerLayout';
import ParticipationForm from '../../components/ParticipationForm';
import {collectionReady,publicConfig} from '../../lib/config';
import dataset from '../../data/territory.json';
export const dynamic='force-dynamic';
export const metadata={title:'Assine o Livro | Bahia do Sul',robots:{index:false,follow:true}};
export default function Livro(){
 const config=publicConfig();const enabled=collectionReady();
 const municipalities=dataset.municipalities.filter(m=>m.id&&!m.review).map(m=>({id:m.id!,name:m.name}));
 return <InnerLayout><article className="reading movisul-book"><h1>✍️ ASSINE O LIVRO DE CRIAÇÃO DO ESTADO BAHIA DO SUL</h1><p className="page-lead">✍️ Assine como Coautor(a) e Fundador(a) Simbólico(a)</p><p className="notice">Participação simbólica e voluntária no projeto. Este livro não é plebiscito, voto oficial ou ato de criação jurídica de um Estado. O certificado é comemorativo, sem valor jurídico, eleitoral, governamental ou patrimonial.</p><h2>Como participar</h2><p>Leia o aviso de privacidade, preencha os dados mínimos e confirme seu e-mail. Somente participações verificadas entram na contagem pública.</p>{!enabled&&<p className="notice" role="status">Coleta ainda não aberta. O envio permanece desativado até a conclusão da configuração de e-mail e da revisão de privacidade.</p>}<ParticipationForm enabled={enabled} siteKey={config.turnstileSiteKey} municipalities={municipalities}/></article></InnerLayout>;
}
