export function schema(postgres:boolean){return `
CREATE TABLE IF NOT EXISTS schema_version(version INTEGER PRIMARY KEY);
INSERT INTO schema_version VALUES(1) ON CONFLICT(version) DO NOTHING;
CREATE TABLE IF NOT EXISTS participants(
 id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL,email_hash TEXT UNIQUE NOT NULL,
 municipality TEXT NOT NULL,status TEXT NOT NULL CHECK(status IN ('pending','verified')),
 newsletter INTEGER NOT NULL DEFAULT 0,consent_version TEXT NOT NULL,created_at BIGINT NOT NULL,
 verified_at BIGINT,certificate TEXT UNIQUE,manage_hash TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS tokens(hash TEXT PRIMARY KEY,participant_id TEXT NOT NULL REFERENCES participants(id) ON DELETE CASCADE,expires_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY,expires_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id ${postgres?'BIGSERIAL':'INTEGER'} PRIMARY KEY,action TEXT NOT NULL,detail TEXT NOT NULL,created_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS content(id TEXT PRIMARY KEY,kind TEXT NOT NULL CHECK(kind IN ('noticias','estudos','documentos')),title TEXT NOT NULL,body TEXT NOT NULL,source TEXT NOT NULL,published INTEGER NOT NULL DEFAULT 0,updated_at BIGINT NOT NULL);
CREATE INDEX IF NOT EXISTS participants_status ON participants(status);
CREATE INDEX IF NOT EXISTS tokens_expiry ON tokens(expires_at);`;}
