export type DocumentStatus = 'CONTEXTO HISTÓRICO' | 'ESTIMATIVA DO DOCUMENTO' | 'POSIÇÃO DO PROJETO' | 'PROCESSO CONSTITUCIONAL';

export type ProjectSection = {
  id: string;
  eyebrow: string;
  title: string;
  status: DocumentStatus;
  paragraphs: string[];
  bullets?: string[];
};

export const projectDocumentNotice = 'Leitura editorial do documento do projeto. O conteúdo distingue contexto histórico, estimativas, cenários, posições do projeto e processo constitucional.';

export const projectSections: ProjectSection[] = [
  {
    id: 'origem', eyebrow: 'I · ORIGEM HISTÓRICA', title: 'Autonomia perdida', status: 'CONTEXTO HISTÓRICO',
    paragraphs: [
      'O documento relaciona a formação territorial do Sul da Bahia às capitanias de Porto Seguro e Ilhéus, instituídas no período colonial e posteriormente incorporadas à administração da Bahia.',
      'O documento sustenta que a distância histórica e administrativa em relação a Salvador fortaleceu a reivindicação por autonomia e representação regional.'
    ]
  },
  {
    id: 'cacau', eyebrow: 'II · CICLO DO CACAU', title: 'Riqueza que sustentou uma região', status: 'POSIÇÃO DO PROJETO',
    paragraphs: [
      'O ciclo do cacau é apresentado como um período em que o Sul da Bahia se tornou uma das regiões mais prósperas do país. O documento defende que a riqueza gerada pela cadeia do cacau não retornou de forma proporcional em infraestrutura e serviços locais.',
      'Essa leitura integra a posição do projeto sobre a distribuição de riqueza e investimentos. O Observatório apresentará os indicadores econômicos, fiscais e históricos associados a esse debate.'
    ],
    bullets: ['Beneficiamento e agregação de valor na origem', 'Infraestrutura compatível com a produção regional', 'Políticas públicas próximas das comunidades']
  },
  {
    id: 'desigualdade', eyebrow: 'III · DIMENSÃO TERRITORIAL', title: 'Um estado grande, desigual e difícil de administrar', status: 'ESTIMATIVA DO DOCUMENTO',
    paragraphs: [
      'O documento compara a dimensão territorial da Bahia com a França e argumenta que a distância entre Salvador e parte dos municípios em estudo dificulta a entrega proporcional de serviços e investimentos.',
      'Os valores de área, população, arrecadação e expectativa de vida citados no documento são estimativas do projeto. O Observatório publicará os indicadores comparáveis com fonte, ano, metodologia e recorte territorial.'
    ],
    bullets: ['Distância entre centros de decisão e comunidades', 'Concentração de recursos e serviços', 'Necessidade de comparar território, população e capacidade administrativa']
  },
  {
    id: 'realidade', eyebrow: 'IV · A REALIDADE DESCRITA', title: 'O que o documento afirma que precisa mudar', status: 'POSIÇÃO DO PROJETO',
    paragraphs: ['O documento apresenta a posição do projeto sobre a distância dos serviços públicos e as oportunidades disponíveis no território proposto. Os indicadores associados serão organizados pelo Observatório com fonte, ano e recorte territorial.'],
    bullets: ['Saúde: deslocamentos longos para consultas, exames e tratamentos complexos', 'Educação: estrutura escolar, formação e valorização docente', 'Trabalho: criação de oportunidades para reduzir a migração involuntária', 'Economia: transformação local de cacau, café, frutas, leite e minérios', 'Infraestrutura: continuidade de obras e políticas estruturantes']
  },
  {
    id: 'luta', eyebrow: 'V · HISTÓRICO DE LUTA', title: 'Um debate que atravessa gerações', status: 'CONTEXTO HISTÓRICO',
    paragraphs: [
      'A linha histórica recebida menciona debates de emancipação no século XX, propostas de criação do Estado de Santa Cruz, retomadas parlamentares e movimentos contemporâneos pela reorganização territorial.',
      'O documento atribui ao Professor Guilherme Santos a fundação do MOVISUL em 2018. O portal registra essa informação como atribuição do documento do projeto.'
    ],
    bullets: ['1930 · Debate local sobre emancipação', '1933 · Proposta de reorganização federativa atribuída ao período', '1978 e 1985 · Projetos parlamentares citados no documento', '2012 · Retomada contemporânea do debate', '2018 · MOVISUL e articulação atribuída ao projeto']
  },
  {
    id: 'viabilidade', eyebrow: 'VI · DADOS E VIABILIDADE', title: 'Uma proposta para ser conferida', status: 'ESTIMATIVA DO DOCUMENTO',
    paragraphs: [
      'O documento apresenta um território de 173 entradas distribuídas pelas regiões Extremo Sul, Sul, Sudoeste, Baixo Sul, Centro-Sul e Médio São Francisco. No portal, essa composição continua sendo uma lista de estudo e não uma divisão administrativa oficial.',
      'O Observatório apresentará população, eleitorado, PIB, área, representação e resultado fiscal em séries documentadas, com fonte, ano, fórmula e lista de municípios incluídos.'
    ]
  },
  {
    id: 'desenvolvimento', eyebrow: 'VII · CAMINHOS DE DESENVOLVIMENTO', title: 'Transformar vocação em valor local', status: 'POSIÇÃO DO PROJETO',
    paragraphs: ['A proposta estabelece como objetivo transformar a produção regional em trabalho, renda e conhecimento no próprio território, por meio de agroindustrialização, logística e qualificação profissional.'],
    bullets: ['Agroindústrias de cacau, café, frutas, laticínios e bioinsumos', 'Cooperativas e integração de pequenos produtores', 'FIOL, Porto Sul, aeroportos e rodovias como infraestrutura a estudar', 'Linhas de crédito e incentivos sujeitos à análise fiscal', 'Formação profissional conectada às cadeias produtivas']
  },
  {
    id: 'mudancas', eyebrow: 'VIII · O QUE MUDARIA', title: 'Mais proximidade, mais responsabilidade', status: 'POSIÇÃO DO PROJETO',
    paragraphs: ['O documento sustenta que um novo Estado aproximaria decisões, serviços e representação das comunidades. O portal apresenta essa visão como argumento do projeto, acompanhada da necessidade de estudar custos administrativos, transição, responsabilidades constitucionais e impactos sobre a Bahia.'],
    bullets: ['Governo e serviços mais próximos', 'Planejamento regional integrado', 'Agregação de valor e empregos no território', 'Representação política própria', 'Avaliação transparente de custos e riscos']
  },
  {
    id: 'processo', eyebrow: 'IX · PROCESSO INSTITUCIONAL', title: 'A proposta seguirá a Constituição', status: 'PROCESSO CONSTITUCIONAL',
    paragraphs: ['O projeto orienta sua tramitação pela Constituição Federal e pelo processo institucional aplicável. A equipe conduzirá esse percurso com análise jurídica especializada e articulação junto às instituições competentes.'],
    bullets: ['História e estudos', 'Participação e debate público', 'Articulação institucional', 'Análise constitucional e legislativa', 'Plebiscito, quando juridicamente aplicável', 'Congresso Nacional e lei complementar, conforme o processo aplicável']
  },
  {
    id: 'convocacao', eyebrow: 'X · PARTICIPAÇÃO', title: 'Conheça, confira e participe', status: 'POSIÇÃO DO PROJETO',
    paragraphs: ['O documento convida pessoas a conhecerem a proposta, formarem grupos, compartilharem o debate e registrarem uma manifestação voluntária. No portal, essa participação é simbólica e não equivale a voto, plebiscito, referendo ou criação jurídica de Estado.']
  }
];

export const comparisonRows = [
  ['Municípios', '173', '78', '417'],
  ['População', '~5.074.306', '4.150.692', '14.889.472'],
  ['Eleitores', '~4.190.000', '2.990.490', '11.321.005'],
  ['PIB', '~R$ 98,5–103,2 bi', 'R$ 209,8 bi', 'R$ 270,0 bi'],
  ['PIB per capita', '~R$ 19.411', 'R$ 50.540', '~R$ 18.100'],
  ['Área', '~152.000 km²', '46.074 km²', '564.733 km²'],
  ['Resultado fiscal', 'Equilibrado → cenário de superávit', 'Superávit consolidado', 'Equilibrado']
] as const;

export const nationalComparisons = [
  'São Paulo → Paraná',
  'Mato Grosso → Mato Grosso do Sul',
  'Goiás → Tocantins'
];
