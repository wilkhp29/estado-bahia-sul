import type { MetadataRoute } from 'next';
import { indexingEnabled, publicPages, siteUrl } from '../lib/site';
import { db } from '../lib/store';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexingEnabled()) return [];
  const entries: MetadataRoute.Sitemap = publicPages.map(page => ({ url: siteUrl + page.path }));
  try {
    const rows = await db().prepare("SELECT id,kind,updated_at FROM content WHERE published=1 AND kind IN ('noticias','estudos','documentos') ORDER BY updated_at DESC").all() as {id:string;kind:string;updated_at:number}[];
    const kinds = new Set(rows.map(row => row.kind));
    for (const kind of ['estudos','documentos']) if (kinds.has(kind)) entries.push({url:`${siteUrl}/${kind}`});
    for (const row of rows) {
      if (row.kind === 'noticias') entries.push({url:`${siteUrl}/noticias/${row.id}`,lastModified:new Date(row.updated_at)});
    }
  } catch (error) {
    console.error('Unable to load published content for sitemap', error);
  }
  return entries;
}
