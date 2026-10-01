import type {NextConfig} from 'next';

const config:NextConfig={
  // Keep the preview's dev artifacts separate from production builds.
  distDir:process.env.NODE_ENV==='development'?'.next-dev':'.next',
  outputFileTracingRoot:process.cwd(),
  async headers(){
    return [{source:'/(.*)',headers:[
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'Referrer-Policy',value:'no-referrer'},
      {key:'X-Frame-Options',value:'DENY'},
      {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
      {key:'Content-Security-Policy',value:"default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com"+(process.env.NODE_ENV==='development'?" 'unsafe-eval'":'')+"; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://operamundi.uol.com.br https://thumb.wikimedia.org https://upload.wikimedia.org; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"}
    ]}];
  }
};
export default config;
