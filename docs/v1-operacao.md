# Operação da V1 — Bahia do Sul

## O que está implementado

Identidade com a logo original do usuário; cores azul-marinho, oceano, verde e dourado; números sem preenchimento fictício; mapa e fontes preservados. Participação SQL, envio SMTP, confirmação explícita, certificado imprimível, gerenciamento/exclusão e contador baseado em registros confirmados. Administração com sessão de oito horas, consulta paginada, filtros, exportação CSV agregada ou nominal mediante justificativa, exclusão e auditoria. Editor de notícias/estudos/documentos com rascunho, publicação e referência externa; sem upload de arquivos.

## Acesso local

`npm run setup` solicita o e-mail e cria `.env.local` e `private/acesso-admin.txt` com permissões restritas, sem sobrescrever configuração existente. O painel usa e-mail e senha. Para trocar a credencial em uma instalação configurada, execute `npm run admin:set`; informe a senha no prompt oculto. A senha fica somente como hash scrypt em `.env.local`.

Instalação requer Node >=22.16 (`node:sqlite` ainda é experimental nessa série). Execute `npm ci`, `npm run build` e `npm start -- --hostname 127.0.0.1`. Não execute build e dev ao mesmo tempo. Dados em `private/bahia.sqlite`; arquivo SQL real, não localStorage. O servidor local não foi publicado na internet.

## Abrir a coleta

1. Confirmar o controlador. Por indicação do usuário, a configuração local contém José Carlos Guilherme Santos — Professor Guilherme. Isso não substitui sua aceitação de responsabilidade.
2. Informar `PRIVACY_EMAIL`. Pesquisa em 17/09/2026 não encontrou canal profissional verificável para esta finalidade. Não reaproveitar o e-mail de portais eleitorais ou diretórios como se fosse do professor.
3. Configurar `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` e `SMTP_FROM`. Porta 465 usa TLS direto; outras usam STARTTLS obrigatório. Validar domínio, SPF/DKIM/DMARC e recebimento real. Falha no provedor retorna erro e não contabiliza apoio; o participante pode solicitar reenvio limitado.
4. Configurar Turnstile: `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET` e hostname exato do site. A ação esperada é `petition` e a validação ocorre no servidor.
5. Definir `SITE_URL` HTTPS para publicação, revisar contratos de operadores, consentimento, contato e retenção, e só então definir `PRIVACY_REVIEWED=true` e `COLLECTION_ENABLED=true`. O formulário permanece fechado se alguma dependência faltar. Rebuild obrigatório após alteração de variáveis `NEXT_PUBLIC_*`.
6. Testar e-mail real, confirmação, exportação e exclusão com autorização, retirando o registro de teste ao terminar. O teste automatizado usa banco isolado e provedores simulados de forma explícita; não certifica entregabilidade real.

## Banco e segurança

- PostgreSQL Neon na Vercel, com pool de conexões e transações na mesma conexão. SQLite WAL somente no ambiente local. Schema versionado em `lib/schema.ts`: participants, tokens, sessions, audit, limits e content. Sem `DATABASE_URL`, a aplicação recusa armazenamento local na Vercel.
- Nome e e-mail cifrados com AES-256-GCM; chave `DATA_ENCRYPTION_KEY` separada do banco. Email normalizado com HMAC para deduplicação. Não perca nem substitua a chave sem migrar os registros: perder a chave impede recuperação.
- Senha scrypt com salt; sessão aleatória com hash no banco, cookie HttpOnly/SameSite Strict e Secure em HTTPS. Rotas administrativas verificam autenticação em cada operação. Esta V1 tem um papel administrador, não gestão multiusuário/MFA.
- Verificação de origem em operações POST; limite persistente de tentativas. `TRUST_PROXY=true` só quando o proxy sobrescreve cabeçalhos de IP. Sem proxy confiável, o limite é compartilhado conservadoramente entre visitantes.
- Exportações até 50 mil linhas, com finalidade, confirmação e auditoria. CSV UTF-8 com proteção contra fórmulas. Relatório nominal inclui dados sensíveis: armazenar e descartar com cuidado. A exportação agregada não contém nomes/e-mails. Arquivos não são salvos no servidor.
- Nenhuma busca pública por apoiadores. Certificado público mostra apenas validade/data. Nome somente na sessão do titular; código aleatório e noindex. Chave privada permite excluir apoio; perda requer verificação humana pelo canal de privacidade.
- Política CSP básica com scripts inline exigidos pelo Next atual; não é uma implementação com nonce estrito. Não afirmar auditoria independente, conformidade integral LGPD/WCAG ou disponibilidade de produção.

## Retenção e backup

Política proposta: pendentes por até sete dias; confirmados por `RETENTION_DAYS` (padrão 365), sujeita à aprovação do controlador. Execute diariamente `npm run retention` pelo agendador da hospedagem. Nenhum agendador foi instalado automaticamente. Tokens e sessões expiradas são limpos também nos fluxos do sistema. Auditoria não contém os campos pessoais dos participantes; sua retenção deve ser definida na revisão de privacidade.

Antes de alterações operacionais, faça backup SQLite consistente pela API `node:sqlite.backup` ou com servidor parado. Não copie apenas o arquivo principal com WAL ativo. Criptografe o backup e guarde a chave separadamente; teste restauração. A exclusão do registro ativo não remove automaticamente cópias antigas: os backups precisam expirar conforme a mesma política.

SQLite requer disco persistente e uma única instância; por isso a publicação usa PostgreSQL. `DATABASE_URL` é a conexão pooled da aplicação; `DATABASE_URL_UNPOOLED` é reservada às migrações e backups. O runtime apenas verifica a versão, sem executar DDL. `scripts/postgres-verify.ts` valida o schema e fluxos em namespace descartável antes de inicializar as tabelas de produção. Para evoluções com dados reais, testar em branch do banco e guardar backup antes de aplicar. Credenciais nunca podem entrar no client bundle ou Git. Configurar backup PostgreSQL e ensaiar restauração antes de abrir a coleta; o plano gratuito não deve ser tratado como garantia de backup.

## Verificação

`npm run lint`, `npm run typecheck`, `npm test`, `npm run test:sql`, `npx tsx --test tests/participation-api.test.ts`, `npm run build`, `npx tsx scripts/v1-qa.ts`. O último inicia um servidor temporário na porta 3099 e banco descartável separado, sem enviar e-mails externos nem alterar o banco real.

## Limites de lançamento

Ainda dependem de configuração/coordenação: e-mail de privacidade, SMTP real, Turnstile, aceitação do responsável, revisão de retenção/privacidade, operação de backups, autorização do retrato e hospedagem. Não há série de PIB/população enriquecida, comparador econômico completo, catálogo mineral validado, biblioteca documental preenchida ou notícias publicadas. Esses dados não foram inventados. A V1 local não equivale à plataforma integral descrita nos 110 tópicos de agents.md.
