import InnerLayout from '../../../components/InnerLayout';
import ManageParticipation from '../../../components/ManageParticipation';
import {publicConfig} from '../../../lib/config';
export const dynamic='force-dynamic';
export default function Page(){const {privacyEmail}=publicConfig();return <InnerLayout><div className="reading"><h1>Gerencie sua participação.</h1><p>Use a chave privada fornecida após a confirmação para excluir seu registro. Não é possível consultar apoiadores pelo nome.</p><ManageParticipation/><p>{privacyEmail?<>Perdeu sua chave? Escreva para <a href={`mailto:${privacyEmail}`}>{privacyEmail}</a> para solicitar acesso, correção ou exclusão.</>:'O canal de privacidade será divulgado antes da abertura das inscrições.'}</p></div></InnerLayout>;}
