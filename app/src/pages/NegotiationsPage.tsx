import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole, Negotiation, NegotiationStatus } from '../types'
import { mockNegotiations } from '../data/mockData'

interface NegotiationsPageProps {
  activeRole: UserRole
}

const statusLabels: Record<NegotiationStatus, { label: string; color: string; bg: string }> = {
  interesse_enviado: { label: 'Interesse Enviado', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)' },
  interesse_mutuo: { label: 'Interesse Mútuo', color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  negociacao_iniciada: { label: 'Negociação Iniciada', color: '#818cf8', bg: 'rgba(129,140,248,0.15)' },
  proposta_enviada: { label: 'Proposta Enviada', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
  contraproposta: { label: 'Contraproposta Ativa', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  em_analise: { label: 'Em Análise', color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
  acordo: { label: 'Acordo Fechado 🤝', color: '#22c55e', bg: 'rgba(34,197,94,0.18)' },
  encerrada: { label: 'Encerrada', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

export function NegotiationsPage({ activeRole }: NegotiationsPageProps) {
  const [negotiations, setNegotiations] = useState<Negotiation[]>(mockNegotiations)
  const [selectedId, setSelectedId] = useState<string>(mockNegotiations[0]?.id || '')
  const [newMessageText, setNewMessageText] = useState('')
  const [showCounterModal, setShowCounterModal] = useState(false)
  const [counterAmount, setCounterAmount] = useState('1200000')
  const [counterEquity, setCounterEquity] = useState('9')
  const [counterNotes, setCounterNotes] = useState('')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 4000)
  }

  const selected = negotiations.find((n) => n.id === selectedId) || negotiations[0]

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessageText.trim() || !selected) return

    const senderName =
      activeRole === 'startup'
        ? `${selected.startupName} (Fundador)`
        : `${selected.investorName} (Investidor)`

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole: activeRole,
      senderName,
      content: newMessageText.trim(),
      timestamp: 'Agora mesmo',
    }

    setNegotiations((prev) =>
      prev.map((neg) => {
        if (neg.id !== selected.id) return neg
        return {
          ...neg,
          messages: [...neg.messages, newMsg],
          lastUpdated: 'Agora mesmo',
        }
      })
    )

    setNewMessageText('')
  }

  function handleAcceptProposal() {
    if (!selected) return

    const systemMsg = {
      id: `msg-accept-${Date.now()}`,
      senderRole: activeRole,
      senderName: 'Sistema NEXO',
      content: `🎉 ACORDO CONFIRMADO! Ambas as partes aceitaram os termos de R$ ${(
        selected.currentProposal.investmentAmount / 1000
      ).toLocaleString()}k por ${selected.currentProposal.equityPercent}% de equity. Parabéns pelo fechamento da rodada!`,
      timestamp: 'Agora mesmo',
      isSystemEvent: true,
    }

    setNegotiations((prev) =>
      prev.map((neg) => {
        if (neg.id !== selected.id) return neg
        return {
          ...neg,
          status: 'acordo' as const,
          lastUpdated: 'Agora mesmo',
          currentProposal: {
            ...neg.currentProposal,
            status: 'aceita' as const,
          },
          messages: [...neg.messages, systemMsg],
        }
      })
    )

    showToast('🎉 Termos aceitos! Acordo formalizado com sucesso no NEXO!')
  }

  function handleSendCounterProposal(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return

    const amountNum = Number(counterAmount) || selected.currentProposal.investmentAmount
    const equityNum = Number(counterEquity) || selected.currentProposal.equityPercent
    const valuationCalc = Math.round((amountNum / (equityNum / 100)))

    const newProposal = {
      id: `prop-${Date.now()}`,
      proposedBy: activeRole,
      investmentAmount: amountNum,
      equityPercent: equityNum,
      valuation: valuationCalc,
      governanceTerms: selected.currentProposal.governanceTerms,
      notes: counterNotes || 'Ajuste nos termos de equity e valuation.',
      createdAt: 'Agora mesmo',
      status: 'pendente' as const,
    }

    const proposalMsg = {
      id: `msg-prop-${Date.now()}`,
      senderRole: activeRole,
      senderName: activeRole === 'startup' ? selected.startupName : selected.investorName,
      content: `📝 Nova contraproposta enviada: Aporte de R$ ${(amountNum / 1000).toLocaleString()}k por ${equityNum}% de equity (Valuation de R$ ${(
        valuationCalc / 1000000
      ).toFixed(1)}M).`,
      timestamp: 'Agora mesmo',
    }

    setNegotiations((prev) =>
      prev.map((neg) => {
        if (neg.id !== selected.id) return neg
        return {
          ...neg,
          status: 'contraproposta' as const,
          lastUpdated: 'Agora mesmo',
          proposalsHistory: [neg.currentProposal, ...neg.proposalsHistory],
          currentProposal: newProposal,
          messages: [...neg.messages, proposalMsg],
        }
      })
    )

    setShowCounterModal(false)
    setCounterNotes('')
    showToast('Contraproposta submetida com sucesso!')
  }

  if (!selected) {
    return (
      <div className="negotiations-shell">
        <div className="panel empty-state-box">
          <h2>Nenhuma negociação em andamento</h2>
          <p>Explore o catálogo e demonstre interesse para iniciar seu primeiro match e rodada!</p>
          <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Ir ao Catálogo
          </Link>
        </div>
      </div>
    )
  }

  const currentStatus = statusLabels[selected.status] || statusLabels.negociacao_iniciada

  return (
    <div className="negotiations-shell">
      {toastMsg && <div className="social-toast">{toastMsg}</div>}

      <div className="negotiations-layout">
        {/* LISTA LATERAL DE NEGOCIAÇÕES */}
        <aside className="negotiations-sidebar">
          <div className="sidebar-header-neg">
            <h3>Hub de Negociações</h3>
            <span className="neg-count-pill">{negotiations.length} Ativas</span>
          </div>

          <div className="neg-items-list">
            {negotiations.map((neg) => {
              const isSelected = neg.id === selected.id
              const otherPartyName = activeRole === 'startup' ? neg.investorName : neg.startupName
              const otherPartyAvatar = activeRole === 'startup' ? neg.investorAvatar : neg.startupAvatar
              const otherPartySub = activeRole === 'startup' ? neg.investorType : neg.startupSector
              const statusCfg = statusLabels[neg.status]

              return (
                <div
                  key={neg.id}
                  className={`neg-item-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedId(neg.id)}
                >
                  <div className="neg-item-top">
                    <span className="neg-avatar">{otherPartyAvatar}</span>
                    <div className="neg-item-meta">
                      <strong>{otherPartyName}</strong>
                      <span className="neg-item-sub">{otherPartySub}</span>
                    </div>
                  </div>

                  <div className="neg-item-bottom">
                    <span
                      className="neg-status-badge"
                      style={{ color: statusCfg.color, background: statusCfg.bg }}
                    >
                      {statusCfg.label}
                    </span>
                    <span className="neg-time">{neg.lastUpdated}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* DETALHES DA NEGOCIAÇÃO SELECIONADA */}
        <main className="negotiation-detail-view">
          {/* Header da Rodada */}
          <div className="neg-detail-header panel">
            <div className="parties-matchup">
              <div className="party-block">
                <span className="party-avatar">{selected.startupAvatar}</span>
                <div>
                  <h4>{selected.startupName}</h4>
                  <span>Startup • {selected.startupSector}</span>
                </div>
              </div>

              <div className="matchup-connector">
                <span className="connector-badge">Interesse Mútuo</span>
                <span className="connector-arrow">⇄</span>
              </div>

              <div className="party-block">
                <span className="party-avatar">{selected.investorAvatar}</span>
                <div>
                  <h4>{selected.investorName}</h4>
                  <span>{selected.investorType}</span>
                </div>
              </div>
            </div>

            <div className="neg-status-overview">
              <span
                className="status-pill-large"
                style={{ color: currentStatus.color, background: currentStatus.bg }}
              >
                ● {currentStatus.label}
              </span>
              <span className="last-up-text">Atualizado: {selected.lastUpdated}</span>
            </div>
          </div>

          {/* Stepper Visual de Evolução */}
          <div className="deal-progress-stepper">
            {[
              { id: '1', title: 'Interesse Mútuo', active: true },
              { id: '2', title: 'Match Confirmado', active: true },
              {
                id: '3',
                title: 'Proposta Enviada',
                active: ['proposta_enviada', 'contraproposta', 'em_analise', 'acordo'].includes(
                  selected.status
                ),
              },
              {
                id: '4',
                title: 'Contraproposta / Termos',
                active: ['contraproposta', 'em_analise', 'acordo'].includes(selected.status),
              },
              { id: '5', title: 'Acordo Fechado 🤝', active: selected.status === 'acordo' },
            ].map((st, idx) => (
              <div key={st.id} className={`step-item ${st.active ? 'active' : ''}`}>
                <span className="step-bullet">{idx + 1}</span>
                <span className="step-title">{st.title}</span>
              </div>
            ))}
          </div>

          {/* Banner de Celebração se fechado */}
          {selected.status === 'acordo' && (
            <div className="deal-celebration-banner">
              <span className="celeb-icon">🏆</span>
              <div>
                <h3>RODADA CONCLUÍDA COM SUCESSO!</h3>
                <p>
                  As partes fecharam o termo de investimento de R${' '}
                  {(selected.currentProposal.investmentAmount / 1000).toLocaleString()}k por{' '}
                  {selected.currentProposal.equityPercent}% de equity. A documentação final foi gerada e os
                  fundadores já podem seguir com a formalização jurídica.
                </p>
              </div>
            </div>
          )}

          {/* Card da Proposta Atual em Negociação */}
          <div className="panel current-proposal-card">
            <div className="proposal-header">
              <div>
                <span className="proposal-eyebrow">
                  Proposta Ativa (Enviada por:{' '}
                  <strong>
                    {selected.currentProposal.proposedBy === 'startup'
                      ? selected.startupName
                      : selected.investorName}
                  </strong>
                  )
                </span>
                <h3>Termos Econômicos da Rodada</h3>
              </div>
              <span className="proposal-date">{selected.currentProposal.createdAt}</span>
            </div>

            <div className="deal-terms-grid">
              <div className="term-box highlight">
                <span className="term-label">Valor do Aporte</span>
                <strong className="term-val">
                  R$ {(selected.currentProposal.investmentAmount / 1000).toLocaleString()}k
                </strong>
                <span className="term-sub">Capital Primário</span>
              </div>

              <div className="term-box">
                <span className="term-label">Equity Ofertado</span>
                <strong className="term-val">{selected.currentProposal.equityPercent}%</strong>
                <span className="term-sub">Participação Societária</span>
              </div>

              <div className="term-box">
                <span className="term-label">Valuation Post-Money</span>
                <strong className="term-val">
                  R$ {(selected.currentProposal.valuation / 1000000).toFixed(1)}M
                </strong>
                <span className="term-sub">Avaliação da Empresa</span>
              </div>
            </div>

            {/* Condições de Governança */}
            <div className="governance-box">
              <strong>Cláusulas e Governança Propostas:</strong>
              <ul>
                {selected.currentProposal.governanceTerms.map((term, i) => (
                  <li key={i}>✓ {term}</li>
                ))}
              </ul>
            </div>

            {selected.currentProposal.notes && (
              <p className="proposal-notes">
                <strong>Justificativa:</strong> {selected.currentProposal.notes}
              </p>
            )}

            {/* Ações da Proposta */}
            {selected.status !== 'acordo' && selected.status !== 'encerrada' && (
              <div className="proposal-action-buttons">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAcceptProposal}
                >
                  🤝 Aceitar Termos & Selar Acordo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCounterModal(true)}
                >
                  📝 Enviar Contraproposta
                </button>
                <Link
                  to={`/perfil/startup/${selected.startupId}`}
                  className="btn btn-ghost"
                >
                  Ver Estatísticas & Projeções
                </Link>
              </div>
            )}
          </div>

          {/* Histórico de Contrapropostas anteriores se houver */}
          {selected.proposalsHistory.length > 0 && (
            <div className="panel history-accordion">
              <h4>Histórico de Propostas Anteriores ({selected.proposalsHistory.length})</h4>
              <div className="history-list">
                {selected.proposalsHistory.map((hist) => (
                  <div key={hist.id} className="history-item">
                    <span>
                      Proposta de R$ {(hist.investmentAmount / 1000).toLocaleString()}k por{' '}
                      {hist.equityPercent}% equity (Valuation R${' '}
                      {(hist.valuation / 1000000).toFixed(1)}M)
                    </span>
                    <small>{hist.createdAt} • Superada</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feed de Conversa Direta da Negociação */}
          <div className="panel messages-panel">
            <h4>Canal Direto da Rodada</h4>
            <div className="neg-messages-stream">
              {selected.messages.map((m) => (
                <div
                  key={m.id}
                  className={`neg-chat-bubble ${
                    m.isSystemEvent ? 'system' : m.senderRole === activeRole ? 'mine' : 'theirs'
                  }`}
                >
                  <div className="chat-bubble-header">
                    <strong>{m.senderName}</strong>
                    <time>{m.timestamp}</time>
                  </div>
                  <p>{m.content}</p>
                </div>
              ))}
            </div>

            {/* Input de Mensagem */}
            <form onSubmit={handleSendMessage} className="neg-chat-input-row">
              <input
                type="text"
                placeholder="Discuta termos, tire dúvidas sobre as métricas ou combine os próximos passos..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary small" disabled={!newMessageText.trim()}>
                Enviar
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Modal de Contraproposta */}
      {showCounterModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Enviar Contraproposta de Rodada</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Ajuste o valor pretendido, o percentual de equity ofertado e adicione justificativas
              fundamentadas nas projeções da empresa.
            </p>

            <form onSubmit={handleSendCounterProposal}>
              <div className="field-group">
                <label>Valor do Aporte (R$)</label>
                <input
                  type="number"
                  value={counterAmount}
                  onChange={(e) => setCounterAmount(e.target.value)}
                  step="50000"
                  required
                />
              </div>

              <div className="field-group">
                <label>Percentual de Equity (%)</label>
                <input
                  type="number"
                  value={counterEquity}
                  onChange={(e) => setCounterEquity(e.target.value)}
                  step="0.5"
                  min="1"
                  max="49"
                  required
                />
              </div>

              <div className="field-group">
                <label>Valuation Post-Money Calculado</label>
                <input
                  type="text"
                  disabled
                  value={`R$ ${(
                    (Number(counterAmount) || 0) /
                    ((Number(counterEquity) || 10) / 100) /
                    1000000
                  ).toFixed(2)}M`}
                />
              </div>

              <div className="field-group">
                <label>Justificativa e Condições Propostas</label>
                <textarea
                  rows={3}
                  placeholder="Explique os fundamentos e ajustes solicitados nas condições..."
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCounterModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary glow-btn">
                  Enviar Contraproposta ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

