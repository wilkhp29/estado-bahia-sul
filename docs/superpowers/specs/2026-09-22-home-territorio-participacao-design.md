# Home, território e participação — desenho aprovado

**Data:** 22/09/2026  
**Produto:** Bahia do Sul  
**Escopo:** hierarquia editorial da homepage, fotografias municipais, carrossel territorial e fluxo do abaixo-assinado.

## Objetivo

Fazer a homepage apresentar o Bahia do Sul como protagonista, deixar a defesa do projeto clara e afirmativa, permitir explorar municípios por mapa e fotografia, e explicar corretamente quando o abaixo-assinado pode receber uma participação.

## Decisões

### 1. Homepage e presença de Professor Guilherme

- Remover o bloco de destaque eleitoral e retrato de Professor Guilherme da abertura e da navegação de capítulos da homepage.
- Manter uma menção factual à sua atuação dentro da seção sobre a história contemporânea do projeto, com link para `/historia/professor-guilherme`.
- A página individual continua disponível para quem quiser aprofundar a relação dele com o projeto.
- Não acrescentar biografia, evento, fala ou compromisso sem fonte existente e atribuição adequada.

### 2. Tom editorial e afirmações sobre dados

- Escrever a posição do projeto com voz direta e afirmativa: o projeto defende a criação do Estado Bahia do Sul.
- Distinguir essa convicção de projeto de um resultado institucional já alcançado. Não afirmar que o Estado já existe nem que sua criação está juridicamente garantida.
- Retirar frases vagas como “ainda em pesquisa” quando servirem apenas como texto promocional ou enchimento.
- Manter fonte, ano e situação de validação junto a estatísticas, limites municipais, processos legais e demais afirmações verificáveis. Dados sem confirmação não serão convertidos em fatos; serão omitidos ou identificados pelo estado real de validação.
- Revisar os textos da homepage, da página de território e do abaixo-assinado que atualmente misturam a posição do manifesto com a situação das fontes.

### 3. Território e imagens

- Adotar a composição B: o mapa permanece como foco e o carrossel municipal fica abaixo dele na homepage.
- O carrossel percorre a lista fornecida pelo projeto, mostrando nome e fotografia associada individualmente a cada registro.
- Ao selecionar uma feição ou município na página `/territorio`, o painel lateral mostra uma fotografia do município escolhido, seguida de crédito, licença e link para a fonte original.
- A seleção por mapa e por lista continua sincronizada. Navegação por teclado, controles explícitos, pausa, movimento reduzido e adaptação mobile fazem parte do componente.
- Fotografias só serão associadas após conferência de que retratam o município indicado e de que a licença permite o uso pretendido. A origem pode ser um repositório público com licença clara ou uma fonte municipal.
- Se não houver fotografia verificável, o componente mostra um estado neutro “Imagem em seleção”; não usa a foto de outra cidade nem uma ilustração como se fosse registro local.
- O catálogo territorial atual contém 169 registros confirmados e 4 registros em revisão: Água Quente, Jaguaquara (correção ainda pendente), Livramento do Brumado e Malhada de Pedras (correção ainda pendente). Os quatro podem aparecer como registros da lista em revisão, nunca como municípios confirmados.

### 4. Abaixo-assinado

- A coleta permanece condicionada à configuração de privacidade, envio de e-mail, proteção antiautomação e armazenamento seguro já exigida pelo projeto.
- Quando a coleta estiver pronta, o formulário deve aceitar os dados mínimos, validar município e consentimento, obter Turnstile, enviar o pedido e orientar a pessoa a confirmar pelo e-mail.
- Estados de indisponibilidade, envio, erro e confirmação terão mensagens claras e acessíveis; erros não apagam os campos preenchidos.
- O ambiente atual não está pronto para receber assinaturas: `COLLECTION_ENABLED=false`, `PRIVACY_REVIEWED=false`, além de não haver `PRIVACY_EMAIL`, configuração SMTP e chaves Turnstile. A interface não deve simular sucesso nem contornar esses bloqueios. A ativação real depende dessas configurações e da revisão de privacidade responsável.
- Não testar envio usando dados pessoais reais nem tentar completar CAPTCHA automaticamente.

## Estrutura e fluxo de dados

- Homepage: `JourneyOpening` deixa de renderizar a faixa de candidatura; a seção editorial do projeto apresenta a sua posição e cita a atuação contemporânea de Guilherme em contexto histórico.
- Carrossel: componente client-side recebe os registros municipais e metadados de imagens conferidas; imagens usam carregamento sob demanda.
- Mapa: `Territory` resolve a seleção por código IBGE; o painel usa o mesmo registro e metadados de imagem do carrossel. Itens sem código confirmado mantêm o estado de revisão.
- Imagens: manifesto por município registra identificador, arquivo ou URL, texto alternativo, autoria, licença, origem e estado editorial. O manifesto não publica candidatos ainda não conferidos.
- Participação: a configuração central continua sendo a fonte de verdade para disponibilidade. A rota, formulário e API apresentam o mesmo estado e mensagens consistentes.

## Acessibilidade e comportamento responsivo

- Controles do carrossel são botões nomeados, operáveis por teclado e com foco visível; a reprodução pode ser pausada e não roda quando `prefers-reduced-motion` está ativo.
- Fotos têm texto alternativo apropriado e crédito visível ou acessível.
- Seleção do mapa é anunciada sem exigir interação com SVG; a lista textual continua sendo o caminho equivalente.
- O painel selecionado se reorganiza abaixo do mapa no mobile; o carrossel não força rolagem automática em telas pequenas.
- Campos e erros do abaixo-assinado têm rótulos, associação por `aria-describedby` e anúncio de estado.

## Erros e limites

- Falha de imagem: manter nome e seleção do município e exibir estado neutro com origem de imagem pendente.
- Falha de rede ou Turnstile: preservar campos, explicar como tentar novamente e não contar a participação.
- Falha de SMTP/API: não indicar que o e-mail foi enviado; apresentar recuperação sem expor detalhes internos.
- Falta de configuração operacional: explicar que a coleta não está aberta, sem permitir envio parcial.
- Falta de fonte ou divergência cadastral: preservar o registro de origem e seu estado de revisão.

## Verificação prevista

- Revisão de cópia para garantir tom afirmativo sem alterar a categoria de verdade dos fatos.
- Interação do carrossel com mouse, teclado, toque, redução de movimento e larguras móveis.
- Seleção de município no mapa e na lista, verificando fotografia, crédito, fallback e sincronização.
- Revisão das mensagens de configuração indisponível e dos estados acessíveis do formulário.
- Validação estática do projeto e revisão visual desktop/mobile depois da implementação. Nenhuma participação será enviada a produção durante a verificação.

## Critérios de aceite

1. A homepage apresenta o Bahia do Sul antes de introduzir seus participantes contemporâneos.
2. Professor Guilherme aparece citado dentro da narrativa do projeto e mantém página própria.
3. A posição de defesa é assertiva; estatísticas e requisitos legais continuam factuais, datados e atribuídos.
4. A homepage oferece o mapa e o carrossel municipal conforme a composição B.
5. Selecionar um município abre sua fotografia conferida e seus créditos; sem foto, a interface declara a ausência.
6. O abaixo-assinado indica corretamente quando está habilitado, preserva privacidade e nunca anuncia sucesso antes da confirmação por e-mail.
7. Os quatro registros pendentes não são publicados como municípios confirmados.
