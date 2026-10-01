export const consentVersion='2026-09-17-v1';
const publicPrivacyEmail='profguilherme_254@hotmail.com';
export function publicConfig(){return {controller:process.env.DATA_CONTROLLER||'',privacyEmail:process.env.PRIVACY_EMAIL||publicPrivacyEmail,turnstileSiteKey:process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY||'',retentionDays:Number(process.env.RETENTION_DAYS||365)};}
export function collectionReady(){return process.env.COLLECTION_ENABLED==='true'&&process.env.PRIVACY_REVIEWED==='true'&&process.env.TRUST_PROXY==='true'&&['DATA_CONTROLLER','PRIVACY_EMAIL','DATA_ENCRYPTION_KEY','SMTP_HOST','SMTP_USER','SMTP_PASSWORD','SMTP_FROM','SITE_URL','TURNSTILE_SECRET','NEXT_PUBLIC_TURNSTILE_SITE_KEY'].every(k=>!!process.env[k]);}
