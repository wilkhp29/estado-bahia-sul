# Validação do reposicionamento — 19/09/2026

Implementado localmente; este relatório não registra publicação na Vercel.

## Entregue

- Homepage: explicação do projeto e apresentação de Professor Guilherme antes do território.
- Página /historia/professor-guilherme com apresentação, fonte do perfil, pauta do documento, perguntas, canais e compartilhamento.
- Instagram informado pelo usuário: @prof.guilhermesantos.
- Navegação e rodapé explicitam vínculo político, mantendo identidade V2.
- Compartilhamento de URL pública sem identificadores; consentimento do abaixo-assinado não alterado.

## Verificações executadas

- ESLint: passou.
- TypeScript: passou.
- Testes unitários: 19 passaram.
- Testes SQL/API: 13 passaram.
- Build Next.js de produção: passou.
- QA V1: passou com banco de teste isolado, incluindo administração, confirmação, certificado, exportação e exclusão.
- QA do reposicionamento: passou em 320, 375, 390, 430, 768, 1024, 1292, 1440 e 1920 px; menu mobile, âncoras, perguntas, Instagram, fallback de compartilhamento e acesso ao abaixo-assinado.
- Nenhum erro de execução observado no QA do reposicionamento.
- Detector Impeccable sem achados nos arquivos consultados; não equivale a auditoria completa WCAG ou Lighthouse.

A revisão visual encontrou colisão com uma classe legada. As novas superfícies foram isoladas com project-journey e recapturadas. O teste passou a conferir também os limites do conteúdo, além do overflow do documento.

Revisor independente Impeccable: veredicto final ship, sem novos problemas materiais nas quatro capturas desktop/mobile. Aprovação limitada ao acabamento visual examinado.

## Limitações preservadas

YouTube, vídeo, agenda e identificação da equipe mantenedora dependem de confirmação. Não foram inventados. Não houve alteração de banco, configuração de coleta, envio de comunicação eleitoral ou publicação. A prévia mantém a política de indexação existente. Não foram medidas conversões eleitorais nem prometidos votos.

Capturas: .impeccable/review/repositioning/. Script: scripts/repositioning-qa.ts, com servidor local na porta 3102.
