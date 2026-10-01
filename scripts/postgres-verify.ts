import {readFileSync} from 'node:fs';
import {parseEnv} from 'node:util';
import {randomBytes} from 'node:crypto';
import assert from 'node:assert/strict';
import {Client} from 'pg';
import {schema} from '../lib/schema';
import {db,totals,transaction,cleanup} from '../lib/store';
import {limited} from '../lib/security';
import {prepareParticipation,confirmParticipation,withdraw} from '../lib/participation';

async function main(){
 const env=parseEnv(readFileSync('private/vercel-production.env','utf8'));
 assert.ok(env.DATABASE_URL_UNPOOLED);
 const direct=new URL(env.DATABASE_URL_UNPOOLED);direct.searchParams.set('sslmode','verify-full');
 assert.ok(!direct.hostname.includes('-pooler'));
 const client=new Client({connectionString:direct.href});await client.connect();
 const temporary='qa_'+randomBytes(12).toString('hex');
 let created=false;
 try{
  await client.query(`CREATE SCHEMA ${temporary}`);created=true;
  await client.query(`SET search_path TO ${temporary}`);
  await client.query(schema(true));
  const testUrl=new URL(direct);testUrl.searchParams.set('options',`-c search_path=${temporary}`);
  process.env.DATABASE_URL=testUrl.href;delete process.env.VERCEL;
  process.env.DATA_ENCRYPTION_KEY=randomBytes(32).toString('hex');
  assert.equal((await totals()).verified,0);
  const input={name:'Teste isolado',email:'isolated@example.invalid',municipality:'2913606',consent:true as const,newsletter:false,website:'',captcha:'test'};
  const pending=await prepareParticipation(input);assert.ok(pending);
  const confirmations=await Promise.all([confirmParticipation(pending.token),confirmParticipation(pending.token)]);
  assert.equal(confirmations.filter(Boolean).length,1);
  assert.equal((await totals()).verified,1);
  assert.equal(await prepareParticipation(input),null);
  assert.equal(await withdraw(confirmations.find(Boolean)!.manage),true);
  assert.equal((await totals()).verified,0);
  assert.equal(await limited('test',1,10000),false);assert.equal(await limited('test',1,10000),true);
  await assert.rejects(transaction(async()=>{await db().prepare('INSERT INTO content(id,kind,title,body,source,published,updated_at) VALUES(?,?,?,?,?,?,?)').run('rollback','estudos','Teste','Teste','',0,Date.now());throw new Error('rollback expected');}));
  assert.equal(await db().prepare('SELECT id FROM content WHERE id=?').get('rollback'),undefined);
  await cleanup();await db().close();
  console.log('PostgreSQL: schema, confirmation concurrency, deletion, rate limits and rollback passed in isolated schema.');
  await client.query('SET search_path TO public');
  await client.query('BEGIN');
  await client.query('SELECT pg_advisory_xact_lock(69729001)');
  await client.query(schema(true));
  await client.query('COMMIT');
  const result=await client.query('SELECT (SELECT COUNT(*) FROM participants) AS participants,(SELECT COUNT(*) FROM content) AS content');
  console.log('Production schema initialized. Counts:',result.rows[0]);
 }finally{
  await db().close();
  if(created){await client.query('SET search_path TO public');await client.query(`DROP SCHEMA ${temporary} CASCADE`);}
  await client.end();
 }
}
main().catch(error=>{console.error('PostgreSQL verification failed:',error instanceof Error?error.message:'Unknown error');process.exitCode=1;});
