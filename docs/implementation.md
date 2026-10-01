# Primeira entrega: território na homepage

Direção aprovada: referência editorial do usuário, Next.js, TypeScript e Tailwind; branco quente, azul profundo, verde floresta, títulos serifados e mapa destacado. O mapa usa D3 Geo (open source) para projetar as geometrias reais do IBGE em SVG acessível, sem depender de tiles externos. A página completa /territorio fica para a próxima etapa.

Fluxo: introdução → mapa → seleção municipal → fonte. Busca textual funciona como alternativa ao mapa. Controles de zoom, filtros e detalhes respondem a teclado e toque. Layout mobile empilha o mapa e os detalhes.

Dados: preservar municipios.json; gerar dataset derivado com correspondências exatas por nome normalizado no cadastro BA do IBGE. Divergências permanecem no relatório, sem coordenadas adivinhadas. Correções que exigem confirmação permanecem pendentes. Nenhum agregado socioeconômico é calculado. Agrupamentos das seis categorias aguardam lista aprovada do projeto; proposta visual preliminar baseada em microrregiões deve ser identificada explicitamente.

Etapas: preparar dados auditáveis; construir componentes da homepage e mapa; validar busca, seleção e filtros; typecheck, lint, testes de integridade, build; conferir desktop e mobile.
