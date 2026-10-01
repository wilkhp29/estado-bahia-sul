import { authenticated } from '../../../lib/auth';
import { db, totals, audit, cleanup } from '../../../lib/store';
import { decrypt } from '../../../lib/security';
import { collectionReady, publicConfig } from '../../../lib/config';
import InnerLayout from '../../../components/InnerLayout';
import AdminLogin from '../../../components/AdminLogin';
import { ExportForm, Logout, DeleteParticipation, ContentForm } from '../../../components/AdminActions';
import type { Participant } from '../../../lib/participation';
import dataset from '../../../data/territory.json';
export const dynamic = 'force-dynamic';
export default async function Page({ searchParams }: {
    searchParams: Promise<{
        page?: string;
        status?: string;
    }>;
}) {
    if (!await authenticated())
            return <InnerLayout><AdminLogin configured={!!process.env.ADMIN_EMAIL&&!!process.env.ADMIN_PASSWORD_HASH}/></InnerLayout>;
    await cleanup();
    const params = await searchParams;
    const page = Math.max(1, Math.min(10000, Number.parseInt(params.page || '1') || 1));
    const status = ['pending', 'verified'].includes(params.status || '') ? params.status! : '';
    const rows = await db().prepare('SELECT * FROM participants WHERE (?=\'\' OR status=?) ORDER BY created_at DESC LIMIT 25 OFFSET ?').all(status, status, (page - 1) * 25) as unknown as Participant[];
    const count = (await db().prepare('SELECT COUNT(*) AS n FROM participants WHERE (?=\'\' OR status=?)').get(status, status) as {
        n: number;
    }).n;
    const total = await totals();
    const pending = (await db().prepare("SELECT COUNT(*) AS n FROM participants WHERE status='pending'").get() as {
        n: number;
    }).n;
    await audit('admin.view', JSON.stringify({ page, status, count: rows.length }));
    const events = await db().prepare('SELECT * FROM audit ORDER BY id DESC LIMIT 20').all() as {
        id: number;
        action: string;
        detail: string;
        created_at: number;
    }[];
    const content = await db().prepare('SELECT * FROM content ORDER BY updated_at DESC LIMIT 100').all() as {
        id: string;
        kind: string;
        title: string;
        body: string;
        source: string;
        published: number;
    }[];
    const config = publicConfig();
    return <InnerLayout><div className="admin-heading"><div><h1>Gestão do Bahia do Sul</h1><p>Banco SQL · Dados reais · Exportações auditadas</p></div><Logout /></div><nav className="admin-nav"><a href="#registros">Participações</a><a href="#exportar">Exportações</a><a href="#editorial">Conteúdo</a><a href="#auditoria">Auditoria</a></nav><div className="admin-stats"><div><strong>{total.verified}</strong><span>Confirmadas</span></div><div><strong>{pending}</strong><span>Pendentes</span></div><div><strong>{total.municipalities}</strong><span>Municípios com confirmações</span></div></div><section className="notice"><h2>{collectionReady() ? 'Coleta habilitada' : 'Coleta ainda desativada'}</h2><p>Responsável: {config.controller || 'não configurado'} · Contato de privacidade: {config.privacyEmail || 'pendente de confirmação'}.</p><p>Antes de abrir: configurar SMTP e Turnstile, confirmar o contato e revisar privacidade e retenção. A senha e as chaves não aparecem neste painel.</p></section><section id="registros"><h2>Participações</h2><form className="admin-filter"><label>Situação<select name="status" defaultValue={status}><option value="">Todas</option><option value="pending">Pendentes</option><option value="verified">Confirmadas</option></select></label><button className="button-secondary">Filtrar</button></form><div className="table-scroll"><table><caption>{count} registro(s) · Página {page}</caption><thead><tr><th>Participante / ID</th><th>E-mail</th><th>Município</th><th>Situação</th><th>Cadastro</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td>{decrypt(r.name)}<small>{r.id}</small></td><td>{decrypt(r.email)}</td><td>{dataset.municipalities.find(m => m.id === r.municipality)?.name}</td><td>{r.status === 'verified' ? 'Confirmada' : 'Pendente'}</td><td>{new Date(r.created_at).toLocaleDateString('pt-BR')}</td></tr>)}{!rows.length && <tr><td colSpan={5}>Nenhuma participação nesta seleção. Os dados aparecerão após o uso real do formulário.</td></tr>}</tbody></table></div><div className="pagination">{page > 1 && <a href={`?page=${page - 1}&status=${status}`}>← Anterior</a>}{page * 25 < count && <a href={`?page=${page + 1}&status=${status}`}>Próxima →</a>}</div></section><div className="admin-columns" id="exportar"><ExportForm /><DeleteParticipation /></div><section id="editorial"><ContentForm items={content.map(item=>({...item}))}/></section><section id="auditoria"><h2>Últimas operações</h2><p>O histórico não armazena nomes, e-mails nem senhas. Justificativas de exportação devem evitar dados pessoais.</p><div className="table-scroll"><table><thead><tr><th>Data</th><th>Operação</th><th>Detalhes</th></tr></thead><tbody>{events.map(e => <tr key={e.id}><td>{new Date(e.created_at).toLocaleString('pt-BR')}</td><td>{e.action}</td><td>{e.detail}</td></tr>)}</tbody></table></div></section></InnerLayout>;
}
