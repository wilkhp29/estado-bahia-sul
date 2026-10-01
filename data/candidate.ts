export const candidate = {
  name: 'Professor Guilherme',
  fullName: 'José Carlos Guilherme Santos',
  path: '/historia/professor-guilherme',
  presentation: 'Conheça Professor Guilherme, sua relação com o Bahia do Sul e a proposta de desenvolvimento regional apresentada neste portal.',
  source: {
    title: 'Perfil de candidatura — Opera Mundi',
    url: 'https://operamundi.uol.com.br/eleicoes-2026/candidatos/professor-guilherme-ba/',
    checkedAt: '19/09/2026',
  },
  election: { year: '2026', office: 'Deputado federal · Bahia', party: 'Republicanos', number: '1026' },
  // Populate only with channels and media confirmed by the project team.
  channels: [{ label: 'Instagram · @prof.guilhermesantos', url: 'https://www.instagram.com/prof.guilhermesantos/' }] as { label: string; url: string }[],
  video: null as { src: string; title: string; transcript: string } | null,
};

export const projectPriorities = [
  { title: 'Trabalho e produção local', text: 'Agregar valor ao cacau, ao café e à produção rural, com agroindústria, cooperativas e formação profissional.', anchor: 'desenvolvimento' },
  { title: 'Serviços mais próximos', text: 'Colocar acesso à saúde, educação e oportunidades no centro do debate sobre a organização do território.', anchor: 'realidade' },
  { title: 'Infraestrutura e planejamento', text: 'Discutir logística, integração entre municípios e investimentos, com avaliação de custos e capacidade financeira.', anchor: 'mudancas' },
];

// Selected public records, not a complete biography. Each milestone keeps its own source.
export const candidateTrajectory = [
  { year: '2016', title: 'Participação na política municipal', text: 'Disputou a Prefeitura de Arataca. A publicação da Assembleia Legislativa da Bahia registra a candidatura e o resultado de não eleito.', source: 'Assembleia Legislativa da Bahia — Eleições 2016', url: 'https://www.al.ba.gov.br/fserver/:imagensAlbanet:upload:07042017092443000000_livro_eleicao2016.pdf' },
  { year: '2017', title: 'Docência em Arataca', text: 'O registro funcional publicado pela Prefeitura de Arataca em agosto de 2017 identifica José Carlos Guilherme Santos como professor efetivo. É um registro da atuação profissional naquele período, não uma comprovação do vínculo atual.', source: 'Prefeitura de Arataca — registro funcional de agosto de 2017, p. 11', url: 'https://www.arataca.ba.gov.br/Handler.ashx?f=f&query=037e8d23-fe1c-4ef0-b5e0-53be0dc31f7a.pdf#page=11' },
  { year: '2025', title: 'Bahia do Sul em debate público', text: 'Segundo reportagem de Joselito dos Reis Santos, participou da sessão sobre o Bahia do Sul realizada em 24 de outubro na Câmara Municipal de Arataca. A matéria o apresenta como coordenador do Movisul naquele encontro.', source: 'Expressão Única — reportagem de 27 de outubro de 2025', url: 'https://expressaounica.blogspot.com/2025/10/criacao-do-estado-bahia-do-sul-o.html' },
  { year: '2026', title: 'Candidatura a deputado federal', text: 'Apresenta-se como candidato a deputado federal pela Bahia, pelo Republicanos, com o número 1026. A identificação também consta no perfil eleitoral publicado pela Tribuna.', source: 'Tribuna — perfil eleitoral de Professor Guilherme', url: 'https://www.tribunapr.com.br/eleicoes/2026/candidatos/ba/deputado-federal/professor-guilherme-republicanos-1026/' },
];
