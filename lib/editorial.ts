import {z} from 'zod';
import {db,transaction,audit} from './store';

export const contentSchema=z.object({id:z.string().uuid().optional(),kind:z.enum(['noticias','estudos','documentos']),title:z.string().trim().min(5).max(160),body:z.string().trim().min(20).max(10000),source:z.url().refine(s=>s.startsWith('https://')),published:z.boolean()});
export type ContentItem={id:string;kind:string;title:string;body:string;source:string;published:number;updated_at:number};
export async function saveContent(input:unknown){
 const item=contentSchema.parse(input),id=item.id||crypto.randomUUID();
 await transaction(async()=>{
  const before=await db().prepare('SELECT published FROM content WHERE id=?').get(id);
  if(item.id&&!before) throw new Error('Conteúdo não encontrado');
  await db().prepare('INSERT INTO content(id,kind,title,body,source,published,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET kind=excluded.kind,title=excluded.title,body=excluded.body,source=excluded.source,published=excluded.published,updated_at=excluded.updated_at').run(id,item.kind,item.title,item.body,item.source,Number(item.published),Date.now());
  await audit('content.saved',JSON.stringify({id,previousPublished:before?.published??null,published:item.published}));
 });
 return id;
}
export async function publishedNews(id?:string){
 if(id&&!z.string().uuid().safeParse(id).success)return [];
 return await db().prepare("SELECT * FROM content WHERE kind='noticias' AND published=1"+(id?' AND id=?':'')+' ORDER BY updated_at DESC').all(...(id?[id]:[])) as ContentItem[];
}
export async function participationSummary(){
 const counts=await db().prepare("SELECT COUNT(*) AS total,COALESCE(SUM(CASE WHEN status='verified' THEN 1 ELSE 0 END),0) AS verified,COALESCE(SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END),0) AS pending,COUNT(DISTINCT CASE WHEN status='verified' THEN municipality END) AS municipalities FROM participants").get() as {total:number;verified:number;pending:number;municipalities:number};
 const regions=await db().prepare("SELECT municipality,COUNT(*) AS total FROM participants WHERE status='verified' GROUP BY municipality ORDER BY total DESC,municipality").all() as {municipality:string;total:number}[];
 const recent=await db().prepare("SELECT COUNT(*) AS total FROM participants WHERE status='verified' AND verified_at>=?").get(Date.now()-7*86400000) as {total:number};
 return {...counts,recent:recent.total,regions};
}
