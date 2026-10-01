# Painel de notícias e assinaturas

## Acesso

Abra `/admin` e entre com o e-mail e a senha do administrador. Para atualizar o acesso local de forma protegida, execute `npm run admin:set`; o terminal não exibe a senha, e `.env.local` armazena somente o hash scrypt. Novos ambientes coletam o e-mail durante `npm run setup`.

## Notícias

1. Abra **Notícias** e escolha **Nova notícia**.
2. Informe título, texto e fonte/referência HTTPS. O editor usa texto simples, sem executar HTML.
3. **Salvar rascunho** guarda o conteúdo sem exibi-lo no blog.
4. Confira a **Prévia**, marque a conferência editorial e selecione **Publicar notícia**.
5. Use **Abrir notícia no blog** para conferir o resultado público.
6. Para editar, escolha uma notícia na lista; há busca por título e filtro por situação.
7. **Retirar do ar e salvar rascunho** remove a notícia das rotas públicas sem apagar o registro.

Notícias publicadas aparecem em `/noticias` e em `/noticias/[id]`. A data exibida é de atualização, não uma data de publicação inventada. Rascunhos retornam página não encontrada na rota pública.

## Assinaturas

Visão geral e Assinaturas usam o banco real: verificadas, pendentes, municípios com confirmações e distribuição municipal. A aba Assinaturas também mostra cadastros totais e confirmações dos últimos sete dias. Atualize a contagem pelo link ou recarregue a página.

Somente e-mails confirmados entram na contagem pública. O painel principal não retorna nomes/e-mails. A área `/admin/registros` preserva as ferramentas anteriores de consulta, exportação com finalidade, exclusão e auditoria, todas autenticadas.

## Segurança e limitações

- Sessão HttpOnly, limite de tentativas, senha derivada por scrypt, verificação de origem e consultas parametrizadas preservados.
- Publicações auditadas por ID e mudança de estado; sem dados pessoais nos novos eventos.
- Sem migração de banco: reutiliza `content`, `participants`, `sessions` e `audit` em SQLite/PostgreSQL.
- Permanece um perfil administrativo único; não implementa contas separadas de editor/pesquisador.
- Sem upload de imagens, agendamento ou editor de HTML nesta etapa.
- A coleta de assinaturas continua dependendo das configurações de e-mail, segurança e revisão de privacidade. O painel não contorna esses bloqueios.
- Testes de navegador feitos em banco temporário isolado. Nenhum conteúdo de teste foi inserido no banco real.
- Jev respondeu 403 (restrição da conta); nenhuma validação semântica foi alegada.

## Verificação

Testes automatizados cobrem rascunho/publicação/edição/retirada, validação, auditoria e totais pendentes/verificados. No navegador, login, publicação e retirada foram exercitados; a API recusou chamadas sem sessão (401) e com origem diferente (403). Revisão visual direta em desktop e celular, usando o procedimento degradado do Impeccable, sem revisor independente.

Para validar: `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:sql`, `npm run build`.

Resultado da entrega do painel: lint, typecheck, build e testes anteriores aprovados. A atualização de autenticação por e-mail e senha passou por lint, typecheck e build local e remoto. A conta foi configurada localmente e nas variáveis protegidas da Vercel, implantada em produção e validada no domínio `estadobahiadosul.com.br`: o login abriu o painel autenticado. Para trocar o acesso local, execute `npm run admin:set`; atualizações futuras de produção também exigem atualizar `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` na Vercel e publicar novo deploy.
