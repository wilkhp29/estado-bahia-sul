import type { Metadata } from 'next';

export const siteUrl = 'https://estadobahiadosul.com.br';
export const siteMaintainer = 'Professor Guilherme';
export const publicPages = [
  { path: '/', title: 'Bahia do Sul', description: 'Conheça o projeto Bahia do Sul: explore o mapa e os municípios do território em estudo, consulte informações com fontes e entenda a proposta e seu processo institucional.' },
  { path: '/entenda', title: 'Bahia do Sul em 2 minutos', description: 'Entenda a proposta Bahia do Sul em uma leitura rápida: conheça o território, os municípios, a história, a economia e os caminhos institucionais para aprofundar o tema.' },
  { path: '/projeto', title: 'O projeto Bahia do Sul', description: 'Conheça a proposta Bahia do Sul, seus argumentos e os documentos disponíveis; explore informações sobre território, história, economia e processo institucional.' },
  { path: '/historia/professor-guilherme', title: 'Professor Guilherme e Bahia do Sul', description: 'Conheça a participação contemporânea de Professor Guilherme no projeto Bahia do Sul, sua trajetória pública e declarações atribuídas com referências para consulta.' },
  { path: '/territorio', title: 'Mapa e municípios do território', description: 'Explore o mapa interativo do território em estudo, conheça os municípios e as regiões editoriais provisórias e consulte dados e referências cadastrais disponíveis.' },
  { path: '/economia', title: 'Economia do território em estudo', description: 'Explore cacau, café, turismo e outras atividades econômicas do território em estudo, com contexto, informações disponíveis e fontes para aprofundar a consulta.' },
  { path: '/mineracao', title: 'Mineração no território em estudo', description: 'Consulte referências sobre mineração e processos minerários; entenda as diferenças entre ocorrência, recurso, reserva e produção e acesse fontes oficiais.' },
  { path: '/historia', title: 'História e processo institucional', description: 'Conheça antecedentes, documentos e participantes do debate Bahia do Sul; diferencie registros históricos, fatos documentados e posições contemporâneas.' },
  { path: '/fontes', title: 'Fontes e metodologia | Bahia do Sul', description: 'Confira as fontes das informações territoriais, os critérios de consulta e as pendências de validação da lista municipal inicial apresentada pelo projeto.' },
  { path: '/ajuda', title: 'Ajuda sobre Bahia do Sul', description: 'Encontre respostas sobre o mapa, o projeto, a participação voluntária, o abaixo-assinado e a privacidade; veja como navegar e consultar informações no portal.' },
  { path: '/participar', title: 'Participar do Bahia do Sul', description: 'Conheça formas de acompanhar o projeto Bahia do Sul, participar de atividades públicas e consultar informações sobre a manifestação voluntária de apoio.' },
  { path: '/participar/abaixo-assinado', title: 'Abaixo-assinado Bahia do Sul | Participação', description: 'Leia o manifesto, entenda o significado da participação voluntária e consulte o aviso de privacidade do projeto Bahia do Sul.' },
  { path: '/processo-legal', title: 'Processo institucional | Bahia do Sul', description: 'Entenda as etapas constitucionais relacionadas a alterações territoriais e diferencie regras jurídicas, estudos disponíveis e estratégias do projeto Bahia do Sul.' },
  { path: '/privacidade', title: 'Privacidade e participação', description: 'Saiba como os dados relacionados à participação no Bahia do Sul são tratados, quais consentimentos são solicitados e como conhecer e exercer seus direitos.' },
  { path: '/contato', title: 'Contato', description: 'Fale com o projeto Bahia do Sul sobre participação e privacidade. Consulte o canal público de contato, conheça a política de privacidade e encontre informações institucionais.' },
] as const;

export function indexingEnabled() {
  return process.env.PUBLIC_INDEXING_ENABLED !== 'false' && (process.env.VERCEL_ENV === 'production' || process.env.PUBLIC_INDEXING_ENABLED === 'true');
}

export function publicMetadata(path: string, title: string, description: string, options: { type?: 'website' | 'article'; modifiedAt?: number } = {}): Metadata {
  const socialImage = { url: siteUrl + '/images/hero-youth-bahia.webp', width: 1920, height: 1080, alt: 'Jovens reunidos em uma rua da Bahia, imagem de destaque do portal Bahia do Sul.' };
  return {
    title, description,
    alternates: { canonical: siteUrl + path },
    robots: { index: indexingEnabled(), follow: true },
    openGraph: { title, description, url: siteUrl + path, siteName: 'Bahia do Sul', locale: 'pt_BR', type: options.type ?? 'website', images: [socialImage], ...(options.modifiedAt ? { modifiedTime: new Date(options.modifiedAt).toISOString() } : {}) },
    twitter: { card: 'summary_large_image', title, description, images: [socialImage.url] },
  };
}
