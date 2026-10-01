import type { MetadataRoute } from 'next';
import { indexingEnabled, siteUrl } from '../lib/site';

export default function robots(): MetadataRoute.Robots {
  if (!indexingEnabled()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin', '/certificado/', '/participar/confirmar', '/participar/gerenciar', '/buscar'] },
    sitemap: siteUrl + '/sitemap.xml',
  };
}
