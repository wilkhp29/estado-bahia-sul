import InnerLayout from '../../../components/InnerLayout';
import Confirmation from '../../../components/Confirmation';
export default async function Page({searchParams}:{searchParams:Promise<{token?:string}>}){const {token}=await searchParams;return <InnerLayout><div className="reading"><Confirmation token={typeof token==='string'?token:''}/></div></InnerLayout>;}
