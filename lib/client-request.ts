/** Safe, actionable messages. Never display an upstream HTML body or a raw JS error. */
export class RequestFailure extends Error {}
export function requestMessage(error:unknown):string {
  return error instanceof RequestFailure ? error.message : 'Não foi possível conectar. Confira sua internet e tente novamente. Seus campos foram mantidos.';
}
export async function postJson<T>(url:string,body:unknown):Promise<T> {
  let response:Response;
  try {
    response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
  } catch {
    throw new RequestFailure('Não foi possível concluir a conexão. Confira sua internet e tente novamente. Seus campos foram mantidos.');
  }
  if(response.status>=500)throw new RequestFailure('O serviço está temporariamente indisponível. Tente novamente em alguns instantes. Seus campos foram mantidos.');
  let data:unknown;
  try {data=await response.json();}catch{throw new RequestFailure('O serviço enviou uma resposta inesperada. Tente novamente em alguns instantes.');}
  if(!response.ok){
    const message=typeof data==='object'&&data!==null&&'error' in data&&typeof data.error==='string'?data.error:null;
    throw new RequestFailure(message||'Não foi possível concluir. Confira os campos e tente novamente.');
  }
  return data as T;
}
