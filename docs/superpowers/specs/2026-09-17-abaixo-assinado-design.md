# Abaixo assinado Bahia do Sul

## Objetivo

Publicar o manifesto fornecido em DOCX e conectá-lo ao fluxo de participação já existente, com linguagem clara sobre seu caráter simbólico, fontes verificáveis e coleta protegida.

## Decisões

- A página pública será `/participar/abaixo-assinado` e terá o texto do manifesto como posição do projeto, não como dado oficial.
- Números e afirmações do DOCX sem fonte confirmada serão apresentados como informações do documento em verificação, sem entrar nos indicadores do portal.
- O formulário reutilizará a confirmação por e-mail, Turnstile, consentimento, deduplicação, certificado e gerenciamento já implementados.
- A versão inicial manterá os campos mínimos já existentes: nome, e-mail e município. WhatsApp não será coletado até haver finalidade, retenção, responsável e revisão de privacidade específicos.
- A coleta pública continuará desativada enquanto `COLLECTION_ENABLED=false`, sem inserir assinaturas fictícias.

## Critérios de aceite

- O manifesto é acessível, tem autoria e status editorial visíveis, e não apresenta suas métricas como indicadores oficiais.
- O formulário explica o que acontece após o envio, preserva dados em erro e redireciona para a confirmação existente.
- A página inicial, a página de participação e a política de privacidade apontam para o manifesto.
- Testes, typecheck, lint, build e inspeção no navegador passam sem abrir a coleta.
