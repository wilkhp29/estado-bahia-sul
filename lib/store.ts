import {DatabaseSync,type SQLInputValue} from 'node:sqlite';
import {mkdirSync,chmodSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {AsyncLocalStorage} from 'node:async_hooks';
import {Pool,types,type PoolClient} from 'pg';
import {attachDatabasePool} from '@vercel/functions';
import {schema} from './schema';

type Row=Record<string,string|number|null>;
type Context={client?:PoolClient;sqlite?:boolean};
const context=new AsyncLocalStorage<Context>();
let local:DatabaseSync|undefined,pool:Pool|undefined,initializing:Promise<void>|undefined;
let localQueue:Promise<unknown>=Promise.resolve();
const isRemote=()=>!!process.env.DATABASE_URL;
types.setTypeParser(20,value=>{const number=Number(value);if(!Number.isSafeInteger(number))throw new Error('SQL integer outside safe range');return number;});
async function lockLocal<T>(operation:()=>Promise<T>|T):Promise<T>{
 if(context.getStore()?.sqlite)return operation();
 const previous=localQueue;let release!:()=>void;localQueue=new Promise<void>(resolve=>{release=resolve;});
 await previous;try{return await operation();}finally{release();}
}
function sqlite(){
 if(process.env.VERCEL)throw new Error('DATABASE_URL is required on Vercel. Local storage is prohibited.');
 if(!local){const path=resolve(process.env.DATABASE_PATH||'private/bahia.sqlite');mkdirSync(dirname(path),{recursive:true,mode:0o700});local=new DatabaseSync(path);chmodSync(path,0o600);local.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');local.exec(schema(false));}
 return local;
}
function postgres(){
 if(!pool){const url=new URL(process.env.DATABASE_URL!);url.searchParams.set('sslmode','verify-full');pool=new Pool({connectionString:url.href,max:5,idleTimeoutMillis:5000,connectionTimeoutMillis:15000,statement_timeout:20000});pool.on('error',()=>console.error('Database pool connection error'));if(process.env.VERCEL)attachDatabasePool(pool);}
 return pool;
}
async function ready(){
 if(!initializing){initializing=(async()=>{const result=await postgres().query('SELECT version FROM schema_version WHERE version=1');if(!result.rowCount)throw new Error('Database migration required');})().catch(error=>{initializing=undefined;throw error;});}
 await initializing;
}
export function postgresParameters(sql:string){let quoted=false,n=0,result='';for(let i=0;i<sql.length;i++){const c=sql[i];if(c==="'"){if(quoted&&sql[i+1]==="'"){result+="''";i++;continue;}quoted=!quoted;}result+=c==='?'&&!quoted?'$'+(++n):c;}return result;}
async function execute(sql:string,values:SQLInputValue[],mode:'all'|'get'|'run'){
 if(isRemote()){await ready();const client=context.getStore()?.client||postgres();const result=await client.query(postgresParameters(sql),values);return {rows:result.rows as Row[],changes:result.rowCount||0};}
 return lockLocal(()=>{const statement=sqlite().prepare(sql);if(mode==='run'){const result=statement.run(...values);return {rows:[] as Row[],changes:Number(result.changes)};}return {rows:statement.all(...values) as Row[],changes:0};});
}
const adapter={
 prepare(sql:string){return {
  async get(...values:SQLInputValue[]){return (await execute(sql,values,'get')).rows[0];},
  async all(...values:SQLInputValue[]){return (await execute(sql,values,'all')).rows;},
  async run(...values:SQLInputValue[]){const result=await execute(sql,values,'run');return {changes:result.changes};},
 };},
 async close(){if(pool){await pool.end();pool=undefined;initializing=undefined;}if(local){local.close();local=undefined;}}
};
export function db(){return adapter;}
export async function transaction<T>(operation:()=>Promise<T>|T):Promise<T>{
 if(context.getStore())throw new Error('Nested transaction is not supported');
 if(isRemote()){await ready();const client=await postgres().connect();try{await client.query('BEGIN');const value=await context.run({client},operation);await client.query('COMMIT');return value;}catch(error){await client.query('ROLLBACK');throw error;}finally{client.release();}}
 return lockLocal(async()=>{const connection=sqlite();connection.exec('BEGIN IMMEDIATE');try{const value=await context.run({sqlite:true},operation);connection.exec('COMMIT');return value;}catch(error){connection.exec('ROLLBACK');throw error;}});
}
export async function audit(action:string,detail:string){await db().prepare('INSERT INTO audit(action,detail,created_at) VALUES(?,?,?)').run(action,detail,Date.now());}
export async function totals(){return await db().prepare("SELECT COUNT(*) AS verified,COUNT(DISTINCT municipality) AS municipalities FROM participants WHERE status='verified'").get() as {verified:number;municipalities:number};}
export async function cleanup(){const now=Date.now();await transaction(async()=>{await db().prepare('DELETE FROM sessions WHERE expires_at<?').run(now);await db().prepare('DELETE FROM limits WHERE expires_at<?').run(now);await db().prepare('DELETE FROM tokens WHERE expires_at<?').run(now);await db().prepare("DELETE FROM participants WHERE status='pending' AND created_at<?").run(now-7*86400000);});}
