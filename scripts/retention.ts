import {db,cleanup,audit,transaction} from '../lib/store';
async function main(){
 await cleanup();const days=Number(process.env.RETENTION_DAYS||365);if(!Number.isInteger(days)||days<1)throw new Error('RETENTION_DAYS inválido');
 await transaction(async()=>{const result=await db().prepare("DELETE FROM participants WHERE status='verified' AND verified_at<?").run(Date.now()-days*86400000);await audit('system.retention',JSON.stringify({removed:result.changes,days}));console.log(`Retenção executada: ${result.changes} registro(s) confirmado(s) removido(s).`);});
}
main().finally(()=>db().close());
