# Home e Professor Guilherme

Modo: Persuade na home, Read e participação na página do candidato. Implementação do brief aprovado, dentro da identidade existente; não há nova seleção de identidade ou comp.

## Direction contract

THESIS: o território desperta interesse; a explicação conecta a proposta à participação pública e ao candidato.

OWN-WORLD: logo V2, navy, verde, azul e branco existentes; Libre Baskerville e DM Sans; retrato real, paisagens aprovadas, controles de 44px.

STORY: entender Bahia do Sul, conhecer Guilherme, avaliar a proposta, compartilhar por iniciativa própria.

FIRST VIEWPORT: preservar hero costeiro; breve explicação seguida por faixa editorial navy com retrato e ação para a página do candidato. Na página própria, retrato à direita, nome e apresentação à esquerda; pauta e perguntas abaixo.

FORM: extensão code-led do brief aprovado, sem sorteio de nova identidade. Interação: leitura progressiva com perguntas expansíveis e compartilhamento explícito.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Plano técnico e arquitetura de informação

- Reutilizar SiteHeader, SiteFooter, ProfessorPortrait, ReferenceArt e mapa.
- Centralizar informações do candidato em data/candidate.ts, com fonte e campos vazios para mídia e canais não fornecidos.
- Home: hero → explicação → Guilherme → território → vocações → participação → processo.
- /historia/professor-guilherme: apresentação, relação com o projeto, pauta do documento, perguntas, participação e fontes.
- Sem alterações no SQL ou consentimento. Compartilhar usa link público sem identificadores pessoais.
- Validar lint, tipos, testes existentes, build e navegação responsiva; revisão visual desktop/mobile em lote.
