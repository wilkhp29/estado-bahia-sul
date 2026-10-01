# Formato solicitado pelo cliente — 29/09/2026

- Página inicial reorganizada: mapa e convite ao livro; nove seções editoriais na ordem do documento; mascotes preservados.
- Conteúdo original arquivado em `cliente-original-2026-09-29.txt`; dados de apresentação em `data/client-presentation.json`.
- Os 13 itens do menu estão no cabeçalho, índice e rodapé. A anotação editorial “← título atualizado” permanece no original, mas não no rótulo do menu.
- Tabela comparativa sem alteração de valores, com cabeçalhos semânticos e rolagem contida no celular.
- `/livro` reutiliza o formulário protegido; `/contato` encaminha aos canais existentes, sem inventar endereço.
- ECC orientou a reutilização de componentes e Impeccable orientou hierarquia editorial, largura de leitura, menu responsivo e correção da legenda do mapa.

## Verificação

- Lint e typecheck aprovados; 29 testes aprovados, incluindo preservação literal de todas as linhas, tabela e menu.
- Build de produção aprovado. Prévia local na porta 3047; esta rodada não publicou alterações em produção.
- Inspeção em navegador desktop e 390 px: menu com os 13 itens, nove seções editoriais e ausência de overflow horizontal da página. Legenda do mapa corrigida para não sobrepor controles.
- Formulário conferido sem enviar dados pessoais: coleta continua fechada.
- Jev: catálogo acessível (200); inferência recusada (403, restrição de créditos). Nenhum resultado de julgamento foi inventado.

## Limitações

- A reprodução do documento não valida seus dados, afirmações históricas, projeções ou interpretação jurídica. Foram acrescentados avisos separados de atribuição.
- Assinaturas dependem da configuração de e-mail, segurança e revisão de privacidade. Não foram ativadas artificialmente.
- Nenhum contato público adicional foi fornecido pelo cliente.
- Nenhuma alteração de banco de dados ou dependência foi necessária.
