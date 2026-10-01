---
name: Bahia do Sul
description: Identidade jovem, luminosa e territorial para um portal de história, dados e participação.
colors:
  forest: "#1d8a55"
  forest-deep: "#07545c"
  forest-page: "#073d42"
  cacao-sun: "#bde23b"
  ocean: "#087eaa"
  paper: "#fffefa"
  sand: "#f6f8ee"
  soft-green: "#edf5e7"
  ink: "#102b43"
  muted: "#4a6267"
  line: "#d6e0d8"
  forest-heading: "#102b43"
  blue-link: "#00677b"
  legacy-navy: "#052957"
  legacy-ocean: "#0074ad"
  legacy-deep: "#005c8c"
  legacy-forest: "#14752b"
  legacy-green-hover: "#0b5820"
  legacy-gold: "#ffb511"
  legacy-journey-navy: "#082c56"
  legacy-journey-blue: "#67b9e8"
  legacy-journey-green: "#88c76a"
  legacy-surface-blue: "#eef7fc"
  legacy-surface-green: "#eef7ed"
  legacy-ink: "#14344f"
  legacy-ink-muted: "#4b6274"
  legacy-line: "#d6e3eb"
  legacy-map-ground: "#112f37"
  region-extremo-sul: "#38974c"
  region-sul: "#91be37"
  region-sudoeste: "#188cc0"
  region-medio-sao-francisco: "#eab044"
  region-baixo-sul: "#32b6a0"
  region-centro-sul: "#6b8bd0"
typography:
  display:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(38px, 5.1vw, 70px)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-.035em"
  heading:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "clamp(28px, 3.4vw, 42px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-.028em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  navigation:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "12px"
    fontWeight: 700
  label:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    letterSpacing: ".11em"
rounded:
  control: "7px"
  image: "7px"
  panel: "9px"
  frame: "18px"
spacing:
  compact: "8px"
  inline: "16px"
  group: "24px"
  section: "48px"
components:
  button-primary:
    backgroundColor: "{colors.cacao-sun}"
    textColor: "{colors.ink}"
    typography: "{typography.navigation}"
    rounded: "{rounded.control}"
    padding: "12px 19px"
    height: "47px"
---

# Design System: Bahia do Sul

## Overview

**Creative North Star: “O futuro começa daqui.”** A nova identidade aprovada combina verde vivo, lima, teal oceânico, amarelo e branco. A homepage abre com navegação branca e fotografia panorâmica de jovens na Bahia, texto em alto contraste à esquerda e CTA direto; não há moldura de computador nem texto desenhado dentro das imagens. A participação recebe uma página própria com fundo cromático territorial e formulário claro em primeiro plano. O mapa, dados, fontes, rotas e fluxos continuam funcionais e verificáveis. Imagens geradas são tratadas como elementos visuais; a procedência permanece nos metadados internos, sem legenda promocional.

## Colors

- Verde vivo e lima identificam a ação e a energia comunitária.
- Teal oceânico dá profundidade a hero, participação e navegação.
- Amarelo quente destaca estados de ação; azul vivo permanece em mapas e detalhes.
- Branco, papel claro e verde suave organizam leitura e respiro.
- Azul-noturno e teal preservam contraste sobre superfícies claras e escuras.
- Os tokens `legacy-*` preservam superfícies das rotas internas ainda não migradas; novas telas usam os tokens sem prefixo.

## Typography

- Montserrat ExtraBold dá energia aos títulos e à marca; Montserrat Bold estrutura navegação e rótulos.
- Inter é a fonte de leitura e interface. Ambas são auto-hospedadas.
- O wordmark é tipográfico, acompanhado por um símbolo vetorial de cacau, café e ondas.

## Layout

- A homepage se abre com header branco e hero fotográfico panorâmico em tela cheia, texto separado da fotografia e uma faixa editorial compacta em seguida.
- O conteúdo não é representado dentro de mockup de computador. Cidade, mapa, economia, mascotes, processo, participantes e notícias seguem como seções verdadeiras do portal.
- A página de participação combina campos acessíveis em painel claro com fundos cromáticos em áreas amplas; no celular, introdução e formulário empilham sem reduzir alvos de toque.
- Header sticky, foco visível, alvos de pelo menos 44px e respeito a `prefers-reduced-motion`.

## Elevation & Depth

- Hero e superfícies da participação usam profundidade tonal; o painel do formulário recebe sombra ampla e difusa.
- Evitar sombras duras, halos coloridos e bordas de destaque espessas.

## Shapes

- Controles e fotografias usam cantos compactos; o painel do formulário tem raio moderado.
- Evitar coleções de cartões aninhados e cápsulas grandes.

## Components

- CTA principal lima ou amarelo, com texto escuro e rótulo de ação explícito.
- CTA verde com texto branco para ações secundárias.
- Navegação temática com separadores sutis, nunca como caixas de botão repetidas.
- Módulos editoriais distinguem história, dados, pautas e participação; nenhuma métrica de apoio é fictícia.
- A assinatura pede somente os dados habilitados pelo fluxo real e nunca simula sucesso ou verificação.
- Crédito e licença permanecem disponíveis para fotografias documentais; imagens geradas não recebem chamadas de crédito na interface.

## Do's and Don'ts

### Do:

- Usar o verde/lima/teal da referência e uma fotografia panorâmica como assinatura da homepage.
- Manter o formulário em uma página de participação própria, sem computador/mockup de navegação.
- Fazer do território o protagonista; apresentar participantes contemporâneos depois de mapa, história e dados.
- Identificar listas municipais como iniciais/em validação quando necessário.
- Manter o mapa, status de validação, fontes e fluxos reais mesmo quando a composição for simplificada.
- Preservar procedência de ativos em metadados internos e licenças de fotografias na interface.

### Don't:

- Não afirmar dados, benefícios, promessas ou apoios sem comprovação.
- Não apresentar a lista do projeto como divisão oficial validada.
- Não remover autoria/licença de fotografias de terceiros nem insinuar que paisagens ilustradas são registro fotográfico documental.
- Não inserir contadores de apoio, formulário ativo ou certificados automáticos sem a infraestrutura correspondente.
- Não reutilizar o antigo visual editorial da home em novas superfícies.
