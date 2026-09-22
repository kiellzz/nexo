import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PendingStartup, ApprovalStatus } from '../types'

type Props = {
  pendingStartups: PendingStartup[]
  onUpdateStatus: (id: string, status: ApprovalStatus, reason?: string) => void
}

const statusLabel: Record<ApprovalStatus, string> = {
  pending: 'Pendente',
  analyzing: 'Em Análise Estatística',
  approved: 'Aprovada',
  rejected: 'Reprovada',
}

function formatCurrency(val: string | number) {
  return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function AdminPage({ pendingStartups, onUpdateStatus }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(pendingStartups[0]?.id ?? null)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const selected = pendingStartups.find((s) => s.id === selectedId) || null

  function handleApprove(id: string) {
    onUpdateStatus(id, 'approved')
  }

  function handleReject(id: string) {
    if (!rejectReason.trim()) {
      alert('Por favor, informe a justificativa da recusa.')
      return
    }
    onUpdateStatus(id, 'rejected', rejectReason)
    setRejectReason('')
    setShowRejectForm(false)
  }

  const pendingCount = pendingStartups.filter((s) => s.status === 'pending' || s.status === 'analyzing').length

  return (
    <section className="screen-shell" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <p className="label">Governança e Moderação</p>
          <h2>Painel Administrativo — Aprovação de Startups</h2>
        </div>
        <div className="stat-card" style={{ padding: '0.75rem 1.5rem' }}>
          <span>Fila de Análise</span>
          <strong style={{ fontSize: '1.5rem', color: 'var(--accent, #6366f1)' }}>{pendingCount}</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Lista Lateral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {pendingStartups.length === 0 && (
            <div className="panel" style={{ textAlign: 'center', padding: '2rem' }}>
              <p className="muted-text">Nenhuma startup na fila de moderação.</p>
            </div>
          )}
          {pendingStartups.map((s) => {
            const isSelected = selected?.id === s.id
            return (
              <div
                key={s.id}
                className="panel"
                onClick={() => {
                  setSelectedId(s.id)
                  setShowRejectForm(false)
                }}
                style={{
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--accent, #6366f1)' : '1px solid var(--border)',
                  transition: 'all 0.2s ease',
                  padding: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '1.05rem' }}>{s.formData.name}</strong>
                    <p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {s.formData.sector} • {s.formData.stage}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontWeight: 600,
                      background:
                        s.status === 'approved'
                          ? 'rgba(34,197,94,0.15)'
                          : s.status === 'rejected'
                          ? 'rgba(239,68,68,0.15)'
                          : 'rgba(99,102,241,0.15)',
                      color:
                        s.status === 'approved'
                          ? '#22c55e'
                          : s.status === 'rejected'
                          ? '#ef4444'
                          : '#6366f1',
                    }}
                  >
                    {statusLabel[s.status]}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Captação: {formatCurrency(s.formData.targetAmount)}</span>
                  <span>Score: <strong style={{ color: 'var(--accent, #6366f1)' }}>{s.analysis?.score ?? '—'}%</strong></span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detalhes da Startup Selecionada */}
        {selected ? (
          <div className="panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.6rem' }}>{selected.formData.name}</h3>
                <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)' }}>
                  {selected.formData.sector} • {selected.formData.city} • Submetido em {new Date(selected.submittedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {selected.analysis && (
                  <Link to={`/analise/${selected.id}`} className="btn btn-secondary small">
                    Ver Estatísticas Completas
                  </Link>
                )}
              </div>
            </div>

            <div className="meta-grid" style={{ marginBottom: '1.5rem' }}>
              <div><span>Faturamento Anual</span><strong>{formatCurrency(selected.formData.annualRevenue)}</strong></div>
              <div><span>Crescimento MoM</span><strong>{selected.formData.momGrowth}% ao mês</strong></div>
              <div><span>Base de Clientes</span><strong>{selected.formData.customerCount} ativos</strong></div>
              <div><span>Custos Mensais</span><strong>{formatCurrency(selected.formData.monthlyCosts)}</strong></div>
              <div><span>Captação Buscada</span><strong>{formatCurrency(selected.formData.targetAmount)}</strong></div>
              <div><span>Equity Ofertado</span><strong>{selected.formData.equityOffered}%</strong></div>
              <div><span>Modelo de Negócio</span><strong>{selected.formData.businessModel}</strong></div>
              <div><span>Estágio</span><strong>{selected.formData.stage}</strong></div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Descrição do Negócio</h4>
              <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{selected.formData.description}</p>
            </div>

            {selected.analysis && (
              <div style={{ padding: '1.25rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--accent, #6366f1)' }}>📊 Parecer Estatístico & Probabilístico</h4>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Score: {selected.analysis.score}/100</span>
                </div>
                <p style={{ lineHeight: 1.5, margin: '0 0 1rem 0' }}>{selected.analysis.summary}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div className="mini-badge">Saúde: {selected.analysis.healthScore}/100</div>
                  <div className="mini-badge">Potencial: {selected.analysis.growthScore}/100</div>
                  <div className="mini-badge">Risco: {selected.analysis.riskScore}/100</div>
                  <div className="mini-badge" style={{ textTransform: 'uppercase', background: 'rgba(255,255,255,0.1)' }}>
                    Recomendação: {selected.analysis.recommendation}
                  </div>
                </div>
              </div>
            )}

            {/* Ações de Moderação */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleApprove(selected.id)}
                disabled={selected.status === 'approved'}
                style={{ background: '#16a34a' }}
              >
                {selected.status === 'approved' ? '✓ Startup Já Aprovada' : 'Aprovar Startup'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowRejectForm(!showRejectForm)}
                style={{ color: '#ef4444', borderColor: '#ef4444' }}
              >
                Recusar / Rejeitar
              </button>
            </div>

            {showRejectForm && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Motivo da Recusa (será enviado à startup):</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: Faturamento insuficiente para o estágio atual, tese não alinhada, etc..."
                  style={{ width: '100%', marginBottom: '0.75rem' }}
                />
                <button type="button" className="btn btn-primary" style={{ background: '#ef4444' }} onClick={() => handleReject(selected.id)}>
                  Confirmar Reprovação
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <p>Selecione uma startup ao lado para analisar.</p>
          </div>
        )}
      </div>
    </section>
  )
}
