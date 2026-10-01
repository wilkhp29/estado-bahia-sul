'use client';

import { postJson, requestMessage } from '../lib/client-request';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

type Turnstile = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global {
  interface Window { turnstile?: Turnstile }
}

type MunicipalityOption = { id: string; name: string };

export default function ParticipationForm({
  enabled,
  siteKey,
  municipalities,
}: {
  enabled: boolean;
  siteKey: string;
  municipalities: MunicipalityOption[];
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [ready, setReady] = useState(false);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!ready || !widget.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(widget.current, {
      sitekey: siteKey,
      action: 'petition',
      callback: (token: string) => {
        setCaptcha(token);
        setError('');
      },
      'expired-callback': () => {
        setCaptcha('');
        setError('A verificação expirou. Faça a verificação novamente antes de enviar.');
      },
      'error-callback': () => {
        setCaptcha('');
        setError('Não foi possível carregar a verificação de segurança. Confira sua conexão e tente recarregar a página.');
      },
    });
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    };
  }, [ready, siteKey]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!captcha) {
      setError('Conclua a verificação de segurança para continuar.');
      return;
    }

    setBusy(true);
    setError('');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const result = await postJson<{ message: string }>('/api/participacao', {
        name: data.get('name'),
        email: data.get('email'),
        municipality: data.get('municipality'),
        consent: data.get('consent') === 'on',
        newsletter: data.get('newsletter') === 'on',
        website: data.get('website') || '',
        captcha,
      });
      setMessage(result.message);
    } catch (cause) {
      setError(requestMessage(cause));
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
      setCaptcha('');
    } finally {
      setBusy(false);
    }
  }

  if (message) {
    return <div className="success-panel" role="status" aria-live="polite">
      <h2>Confira seu e-mail</h2>
      <p>{message}</p>
      <p>O apoio só entra no contador depois que você abrir o link e confirmar sua escolha.</p>
      <Link href="/">Voltar ao início</Link>
    </div>;
  }

  return <form aria-busy={busy} className="portal-form signature-form" onSubmit={submit}>
    {!enabled && <div className="notice" role="status">
      <h2>Assinaturas temporariamente indisponíveis</h2>
      <p>O recebimento só será aberto depois da configuração do canal de privacidade, da verificação de segurança e do envio de e-mail. Nenhum dado deste formulário é enviado ou armazenado enquanto a coleta estiver fechada.</p>
      <p>Os campos aparecem apenas para você conhecer as informações necessárias. Não é preciso preenchê-los agora.</p>
    </div>}

    <fieldset disabled={!enabled || busy}>
      <legend>Seus dados</legend>
      <label htmlFor="petition-name">Nome completo
        <input id="petition-name" name="name" autoComplete="name" required minLength={3} maxLength={120} />
      </label>
      <label htmlFor="petition-email">E-mail
        <input id="petition-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      </label>
      <label htmlFor="petition-municipality">Município
        <select id="petition-municipality" name="municipality" required defaultValue="">
          <option value="" disabled>Selecione seu município na Bahia</option>
          {municipalities.map(municipality => <option key={municipality.id} value={municipality.id}>{municipality.name}</option>)}
        </select>
      </label>
      <p className="field-help">Esta etapa contempla os municípios validados da lista territorial. Não solicitamos CPF, RG ou data de nascimento.</p>
      <div className="honey" aria-hidden="true"><label htmlFor="petition-website">Site<input id="petition-website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="check-field" htmlFor="petition-consent">
        <input id="petition-consent" name="consent" type="checkbox" required />
        <span>Manifesto voluntariamente meu apoio ao projeto Bahia do Sul e autorizo o tratamento dos dados acima para registrar e confirmar essa participação, conforme o <Link href="/privacidade" target="_blank" rel="noreferrer">aviso de privacidade</Link>. Entendo que isso não é voto ou plebiscito oficial.</span>
      </label>
      <label className="check-field" htmlFor="petition-newsletter">
        <input id="petition-newsletter" name="newsletter" type="checkbox" />
        <span>Também quero receber atualizações institucionais por e-mail. Esta escolha é opcional e independente do apoio.</span>
      </label>
      {enabled && <>
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setReady(true)} onError={() => setError('A verificação de segurança não carregou. Recarregue a página para tentar novamente.')} />
        <div ref={widget} aria-label="Verificação de segurança" />
      </>}
      <button className="button-primary" disabled={!enabled || busy || !captcha}>
        {busy ? 'Enviando…' : 'Enviar link de confirmação'}
      </button>
    </fieldset>

    <p id="petition-form-error" role="alert" aria-live="assertive" className="form-error">{error}</p>
    <p className="field-help">Não publicamos uma lista de apoiadores. Nome e e-mail não aparecem no mapa nem no contador.</p>
  </form>;
}
