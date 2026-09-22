# Home, território e participação — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganizar a homepage em torno do projeto, apresentar municípios por mapa e carrossel com imagens atribuídas e tornar o estado do abaixo-assinado claro e funcional quando sua infraestrutura estiver configurada.

**Architecture:** Manter Next.js App Router, separar catálogo de fotos e atribuição dos componentes visuais, reaproveitar `data/territory.json` como origem de municípios e manter `collectionReady()` como a proteção central que evita coleta sem revisão de privacidade e serviços configurados. O mapa e o carrossel consomem a mesma seleção e o mesmo catálogo editorial de imagens.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS existente, dados JSON/TypeScript, Cloudflare Turnstile e API atual de participação.

---

## Arquivos e responsabilidades

- `components/JourneyOpening.tsx`: abertura e navegação dos capítulos da homepage; remover a faixa eleitoral destacada.
- `app/page.tsx`: hierarquia da home, linguagem sobre o projeto e inclusão do carrossel sob o mapa.
- `data/municipality-photos.ts`: catálogo curado por código IBGE, com alt, autoria, licença, fonte e estado de revisão.
- `scripts/find-municipality-photos.mjs`: consulta candidatos de imagem à API oficial do Wikimedia Commons e grava metadados candidatos sem publicá-los automaticamente.
- `components/MunicipalityCarousel.tsx`: navegação acessível pelos registros municipais da lista.
- `components/Territory.tsx`: imagem e crédito no painel do município selecionado no mapa ou na lista.
- `app/municipality-carousel.css` e `app/layout.tsx`: apresentação e inclusão responsiva do novo carrossel.
- `app/jornada.css`, `app/territory-highlights.css`, `app/usability.css`: ajustes pontuais das composições existentes.
- `app/participar/abaixo-assinado/page.tsx`, `app/participar/page.tsx`, `components/ParticipationForm.tsx`: cópia e estados do formulário.
- `lib/config.ts`, `app/api/participacao/route.ts`: readiness e respostas coerentes com as condições atuais, sem remover controles de segurança.
- `tests/`: ampliar apenas os testes de lógica/fluxo que já existem para configuração, lista de municípios e submissão do formulário.
- `docs/superpowers/specs/2026-09-22-home-territorio-participacao-design.md`: referência aprovada para decisões e aceite.

### Task 1: Confirmar a situação do abaixo-assinado e os dados territoriais

**Files:**
- Read: `lib/config.ts`
- Read: `app/api/participacao/route.ts`
- Read: `.env.example`
- Read: `data/territory.json`
- Read: `public/data/validation.json`
- Read: `tests/participation-api.test.ts`

- [ ] Conferir `collectionReady()` e registrar a lista de nomes de variáveis ausentes sem imprimir valores secretos.
- [ ] Conferir os quatro registros em revisão (Água Quente, Jaguaquara, Livramento do Brumado e Malhada de Pedras) e confirmar que os componentes recebem `review` e `id` corretamente.
- [ ] Corrigir os totais da home para derivar 169 registros confirmados e 4 em revisão do catálogo atual, sem valores duplicados no JSX.
- [ ] Mapear cenários existentes de API para origem inválida, coleta desativada, validação, Turnstile e e-mail.
- [ ] Manter `COLLECTION_ENABLED=false` e `PRIVACY_REVIEWED=false` no ambiente local enquanto faltarem as condições operacionais.

### Task 2: Reposicionar a narrativa da homepage

**Files:**
- Modify: `components/JourneyOpening.tsx`
- Modify: `app/page.tsx`
- Modify: `app/jornada.css`
- Modify: `app/project-story.css`
- Read: `data/candidate.ts`

- [ ] Retirar a faixa de Professor Guilherme e o capítulo dedicado a ele da abertura da home.
- [ ] Introduzir a posição do projeto em frase editorial direta, sem afirmar que a criação do Estado já ocorreu ou está juridicamente garantida.
- [ ] Acrescentar menção factual à participação contemporânea dentro da narrativa do projeto e manter link para `/historia/professor-guilherme`.
- [ ] Remover textos promocionais vagos sobre levantamentos; manter badges e status onde descrevem dados realmente ainda não validados.
- [ ] Remover seletores CSS exclusivos da faixa retirada, preservando estilos usados pela página individual do participante.

### Task 3: Criar catálogo de fotografias municipais com atribuição

**Files:**
- Create: `data/municipality-photos.ts`
- Create: `scripts/find-municipality-photos.mjs`
- Create: `public/images/municipalities/` somente para imagens autorizadas e revisadas
- Read: `data/territory.json`
- Read: `public/data/validation.json`

- [ ] Para cada município confirmado, buscar uma fotografia real em fonte pública ou municipal.
- [ ] Verificar correspondência do local e registrar autoria, licença, URL da página de origem, URL do arquivo e texto alternativo.
- [ ] Não publicar associação ambígua ou sem licença de reutilização clara; marcar como pendente no catálogo.
- [ ] Preservar os quatro registros em revisão no conjunto de origem sem tratá-los como municípios confirmados.
- [ ] Expor uma função única que retorne a fotografia revisada por código IBGE e `null` quando não houver registro publicável.

### Task 4: Adicionar carrossel municipal abaixo do mapa

**Files:**
- Create: `components/MunicipalityCarousel.tsx`
- Create: `app/municipality-carousel.css`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`

- [ ] Construir uma faixa horizontal com nome de município, imagem atribuída, crédito e link para `/territorio?municipio=<código>`.
- [ ] Incluir botões anterior, próximo e pausa, nomes acessíveis, foco visível e funcionamento por teclado/toque.
- [ ] Respeitar `prefers-reduced-motion`; iniciar sem movimento quando redução estiver ativa e pausar ao receber foco ou hover.
- [ ] Carregar imagens sob demanda e limitar o número de imagens antecipadas para evitar baixar as 173 no carregamento inicial.
- [ ] Renderizar pendências de imagem com um estado neutro sem trocar a fotografia por uma cidade diferente.
- [ ] Adaptar a faixa para telas de 320px a 1920px sem cortar controles nem criar rolagem horizontal da página.

### Task 5: Exibir fotografia ao selecionar um município no mapa

**Files:**
- Modify: `components/Territory.tsx`
- Modify: `app/territory-highlights.css`
- Modify: `data/municipality-photos.ts`

- [ ] Resolver imagem pelo mesmo código IBGE usado no município selecionado.
- [ ] Mostrar fotografia, texto alternativo, autoria, licença e link de fonte dentro do painel selecionado.
- [ ] Para seleção sem código confirmado ou sem foto revisada, mostrar o estado pendente sem perder nome, revisão ou seleção.
- [ ] Manter seleção por mapa, lista, URL e navegação por teclado consistente.
- [ ] No mobile, posicionar fotografia e detalhes no painel/bottom sheet sem ocultar o mapa ou os controles.

### Task 6: Corrigir mensagens e estados do abaixo-assinado

**Files:**
- Modify: `components/ParticipationForm.tsx`
- Modify: `app/participar/abaixo-assinado/page.tsx`
- Modify: `app/participar/page.tsx`
- Modify: `app/api/participacao/route.ts`
- Modify: `lib/config.ts` apenas se a resposta puder ser tornada mais clara sem enfraquecer a condição existente
- Modify: `tests/participation-api.test.ts`

- [ ] Apresentar indisponibilidade antes do formulário com motivo operacional compreensível e caminho de recuperação para a equipe.
- [ ] Desabilitar campos e botão enquanto a coleta estiver fechada; não iniciar Turnstile nem enviar dados nessa condição.
- [ ] Quando habilitado, associar labels e erros aos campos com `aria-describedby`, `aria-invalid` e anúncio de estado.
- [ ] Preservar os campos em erro de rede, API ou CAPTCHA e explicar como tentar novamente.
- [ ] Manter validação, confirmação por e-mail, rate limiting, verificação de origem, armazenamento cifrado e consentimento existentes.
- [ ] Não declarar envio bem-sucedido se `sendVerification()` falhar; manter resposta pública sem detalhes internos.
- [ ] Não alterar variáveis secretas nem marcar revisão de privacidade como concluída automaticamente.

### Task 7: Revisar metadados e frases de navegação

**Files:**
- Modify: `lib/site.ts`
- Modify: `app/territorio/page.tsx`
- Modify: `app/entenda/page.tsx`
- Modify: `app/[section]/page.tsx`
- Modify: `components/ProjectDocument.tsx` quando a inspeção confirmar as mesmas frases

- [ ] Atualizar título e descrição SEO para apresentar o projeto e o território antes de qualquer participante.
- [ ] Remover frases vagas sobre “pesquisa” quando forem apenas texto editorial; manter etiquetas de validação que descrevam o estado do cadastro e dos indicadores.
- [ ] Revisar no conteúdo de `/entenda` a afirmação de que a proposta ainda não é uma divisão oficial e manter os requisitos institucionais claros.
- [ ] Não alterar declarações atribuídas a participantes sem fonte documental.

### Task 8: Revisar a linguagem das páginas de projeto e dados

**Files:**
- Modify: `app/participar/abaixo-assinado/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/territorio/page.tsx`
- Read: `agents.md`

- [ ] Atualizar frases que confundem a posição do projeto com status de fonte ou levantamento.
- [ ] Manter explícitas a natureza de proposta, os requisitos institucionais e a situação oficial dos municípios.
- [ ] Manter avisos legais e de privacidade necessários à compreensão e à participação informada.
- [ ] Procurar usos restantes de expressões de incerteza e classificar cada um como status factual necessário ou texto editorial dispensável antes de alterar.

### Task 9: Revisão funcional e visual

**Files:**
- Review: `app/page.tsx`
- Review: `components/MunicipalityCarousel.tsx`
- Review: `components/Territory.tsx`
- Review: `components/ParticipationForm.tsx`
- Review: `app/globals.css`
- Review: `app/municipality-carousel.css`

- [ ] Executar lint, typecheck, build e testes existentes de API/participação após as alterações.
- [ ] Conferir homepage, carrossel, seleção de município e formulário nos viewports 320, 375, 768 e 1440px.
- [ ] Inspecionar teclado, foco, redução de movimento, texto alternativo, créditos, console e falhas de rede no browser.
- [ ] Registrar fotos sem fonte/licença confirmada e variáveis operacionais ausentes como limitações para ativação.
- [ ] Não submeter dados pessoais nem enviar mensagens de verificação a destinatários reais durante a QA.

## Método de levantamento de fotos

- Consultar a API MediaWiki da Wikimedia Commons com busca restrita ao namespace de arquivos; solicitar URL da página do arquivo, URL de miniatura, `extmetadata` de autor/licença/crédito e aplicar uso ético do endpoint com lotes pequenos.
- Pesquisar pelo nome oficial do município junto de `Bahia`, revisar visualmente o local retratado e comparar o título/descrição do arquivo antes de aceitar o candidato.
- Gravar o candidato como não aprovado até conferir local, autor, licença e requisitos de atribuição na página do arquivo; a documentação oficial alerta que as condições e créditos variam por arquivo e devem ser conferidos individualmente.
- Baixar para `public/images/municipalities/` apenas os arquivos candidatos aprovados, mantendo uma URL original e uma URL da licença no catálogo. Arquivos sem resultado verificável ficam como `null` e recebem fallback textual.

## Lacunas conhecidas antes da execução

- A especificação exige fotos individualizadas, mas o workspace não contém essas imagens nem atribuições. O catálogo precisa ser preenchido e revisado pela fonte de cada arquivo; a interface terá fallback honesto onde a busca não produzir uma fonte utilizável.
- A assinatura real não pode ser habilitada com os valores atuais: coleta e revisão estão desativadas e faltam SMTP, contato de privacidade e Turnstile. O código pode deixar a experiência correta, mas a equipe responsável precisa configurar e revisar esses itens.
- Este plano segue o fluxo de execução inline porque o pedido atual é implementar neste workspace; a ferramenta desta sessão não expõe criação de subagentes de código.
