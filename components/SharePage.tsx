'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

export default function SharePage({ path, title }: { path: string; title: string }) {
  const [status, setStatus] = useState('');
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);
  const url = `https://estadobahiadosul.com.br${path}`;
  async function share() {
    setBusy(true);
    setStatus('');
    setManual(false);
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setStatus('Link copiado. Você escolhe com quem compartilhar.');
      } else {
        setManual(true);
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) {
        setManual(true);
        setStatus('Copie o endereço abaixo para compartilhar.');
      }
    } finally { setBusy(false); }
  }
  return <div className="story-share">
    <button className="story-button story-button-secondary" onClick={share} disabled={busy}>
      {status.startsWith('Link copiado') ? <Check size={18} aria-hidden="true"/> : <Share2 size={18} aria-hidden="true"/>}
      {busy ? 'Abrindo…' : 'Compartilhar esta página'}
    </button>
    <p role="status">{status}</p>
    {manual && <label>Endereço da página<input readOnly value={url} onFocus={event => event.currentTarget.select()}/></label>}
  </div>;
}
