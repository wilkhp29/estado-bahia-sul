# Publicação Vercel — estado em 17/09/2026

- Projeto criado e vinculado: `williamtanayoupopcs-projects/bahia-do-sul`.
- Domínio adicionado ao projeto: `estadobahiadosul.com.br`.
- Deploy de produção concluído: `dpl_GiHChusUJx31eMVEbdaqGrKQdn2o`, estado READY. Site: https://estadobahiadosul.com.br; alias: https://bahia-do-sul.vercel.app.
- Após aceitação humana dos termos, PostgreSQL Neon gratuito provisionado: `bahia-do-sul-db`, plano `free_v3`, região `gru1` (São Paulo), autenticação Neon desabilitada, conexão apenas production. Nenhum serviço pago contratado.
- Adaptador SQL assíncrono, pool PostgreSQL e transações por conexão; SQLite preservado para desenvolvimento. Schema inicial testado em namespace isolado e aplicado por conexão direta. Banco local e produção tinham zero participantes e zero conteúdos editoriais; nenhum dado pessoal precisou ser migrado. Namespace de teste removido após validação.
- CLI utilizada na vinculação: Vercel 59.20.0 via npx; CLI global 32.3.1 é antiga.

## DNS verificado pela Vercel

Registro solicitado: tipo `A`, host raiz (`@`/vazio conforme interface), valor `76.76.21.21`.

Usuário configurou o registro A no Registro.br. Em 17/09/2026, servidor autoritativo e resolvers 1.1.1.1 e 8.8.8.8 retornaram `76.76.21.21`. HTTPS validado com certificado confiável e resposta 200 usando resolução explícita; o resolver local ainda tinha cache negativo. DNS permanece `a.sec.dns.br` e `c.sec.dns.br`; MX Zoho preservados. Não trocar nameservers. SPF e verificação Zoho não foram alterados pelo agente.

Teste adicional do domínio próprio aprovado no navegador com resolução explícita: HTTPS, login, sessão PostgreSQL, download CSV e logout, sem erros de JavaScript. O alias de produção passou em duas repetições completas. A coleta permanece fechada e nenhum registro de participante foi criado.

## Proteções

`.vercelignore` exclui .env*, private/, bancos SQLite, relatórios e artefatos de desenvolvimento do upload. `.vercel/` está no .gitignore. A vinculação adicionou o token OIDC gerenciado pela Vercel à configuração local sem remover as chaves existentes; não publicar esse arquivo. Não foram enviadas credenciais SMTP nem ativada coleta pública.

## Verificação e pendências

Build local e remoto aprovados; lint, TypeScript, sete testes territoriais, treze testes SQL/API, QA V1 isolado e teste de produção. Login, persistência da sessão PostgreSQL, CSV vazio, CSRF, logout e coleta fechada confirmados online. O primeiro teste online capturou um aviso React 418 não reproduzido na repetição; não foi suprimido. Segredos configurados na Vercel sem exibir valores. `SITE_URL` usa o domínio próprio e a origem adicional permite apenas o alias exato de produção. Senha administrativa preservada; cópia local em `private/acesso-admin.txt`.

Coleta continua desativada. Antes de abri-la: confirmar controlador/contato de privacidade, SMTP, Turnstile, revisão de privacidade, retenção e backups. Não foram enviados e-mails reais nem criadas participações de teste em produção. Configuração www não foi solicitada nem adicionada.
