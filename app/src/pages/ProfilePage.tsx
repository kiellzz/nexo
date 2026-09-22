import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { UserRole, Startup, PendingStartup } from '../types'
import {
  ScoreCircle,
  IndicatorBar,
  SwotCard,
  ScenarioCard,
  ProjectionChart,
} from './StartupAnalysisPage'
import {
  startups as initialStartups,
  investors as initialInvestors,
  mockAnalysis,
  mockSocialPosts,
} from '../data/mockData'

interface ProfilePageProps {
  activeRole?: UserRole
  approvedStartups?: Startup[]
  pendingStartups?: PendingStartup[]
}

export function ProfilePage({
  activeRole: _activeRole,
  approvedStartups,
  pendingStartups = [],
}: ProfilePageProps) {
  const { type, id } = useParams()
  const profileId = Number(id)

  const [activeTab, setActiveTab] = useState<'sobre' | 'estatisticas' | 'publicacoes'>('sobre')
  const [matched, setMatched] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const currentStartups = approvedStartups ?? initialStartups
  const currentInvestors = initialInvestors

  let startupProfile: Startup | undefined = undefined
  let customAnalysis = mockAnalysis

  if (type === 'startup') {
    startupProfile = currentStartups.find((item) => item.id === profileId)
    const pending = pendingStartups.find(
      (p) => p.id === id || p.formData.name === startupProfile?.name
    )
    if (pending?.analysis) {
      customAnalysis = pending.analysis
    }
  }

  const investorProfile =
    type === 'investor' ? currentInvestors.find((item) => item.id === profileId) : undefined

  // Publicações do perfil
  const profilePosts = mockSocialPosts.filter(
    (p) => p.authorRole === type && p.authorId === profileId
  )

  // -------------------------------------------------------------
  // PERFIL DE STARTUP
  // -------------------------------------------------------------
  if (type === 'startup' && startupProfile) {
    const startup = startupProfile

    return (
      <div className="profile-shell-extended">
        {/* Notificação de Match */}
        {matched && (
          <div className="match-alert-box">
            <div className="alert-content">
              <span className="match-fire-emoji">🔥</span>
              <div>
                <h3>INTERESSE CONFIRMADO COM {startup.name.toUpperCase()}!</h3>
                <p>
                  O canal de negociação foi aberto. Você pode enviar propostas de investimento e
                  discutir termos diretamente na aba de Negociações.
                </p>
              </div>
            </div>
            <Link to="/negociacoes" className="btn btn-primary">
              Ir para o Hub de Negociações ➔
            </Link>
          </div>
        )}

        {/* HERO DO PERFIL DE STARTUP */}
        <div className="profile-hero-card panel">
          <div className="profile-banner-bg"></div>

          <div className="profile-hero-main-row">
            <div className="profile-brand-avatar">{startup.avatar || '🚀'}</div>

            <div className="profile-brand-details">
              <div className="brand-title-line">
                <h2>{startup.name}</h2>
                <span className="verified-status-tag">✓ Homologada pelo Comitê NEXO</span>
                <span className="stage-pill-highlight">{startup.stage}</span>
              </div>

              <p className="brand-sector-loc">
                {startup.sector} • {startup.city} • Modelo: {startup.model}
              </p>

              <div className="brand-connections-count">
                <span><strong>{startup.followersCount || 1420}</strong> seguidores</span>
                <span>•</span>
                <span><strong>{startup.connectionsCount || 380}</strong> conexões</span>
                {startup.website && (
                  <>
                    <span>•</span>
                    <a href={startup.website} target="_blank" rel="noreferrer" className="site-link">
                      🌐 {startup.website.replace('https://', '')}
                    </a>
                  </>
                )}
              </div>
            </div>

            <div className="profile-hero-score-box">
              <span className="score-lbl">Aderência à Tese</span>
              <strong className="score-val">{startup.match}% Match</strong>
              <span className="score-sub">Índice: {customAnalysis.score}/100</span>
            </div>
          </div>

          {/* Barra de Ações Rápidas do Perfil */}
          <div className="profile-hero-actions-bar">
            <div className="profile-tabs-nav">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`}
                onClick={() => setActiveTab('sobre')}
              >
                🏢 Visão Geral & Métricas
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'estatisticas' ? 'active' : ''}`}
                onClick={() => setActiveTab('estatisticas')}
              >
                📊 Estatísticas & Probabilidades
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'publicacoes' ? 'active' : ''}`}
                onClick={() => setActiveTab('publicacoes')}
              >
                📢 Publicações ({profilePosts.length})
              </button>
            </div>

            <div className="profile-action-btns-group">
              <button
                type="button"
                className={`btn btn-secondary small ${isFollowing ? 'following' : ''}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? '✓ Seguindo' : '+ Seguir'}
              </button>

              <button
                type="button"
                className="btn btn-primary small glow-btn"
                onClick={() => setMatched(true)}
              >
                💚 {matched ? 'Interesse Registrado' : 'Demonstrar Interesse (Match)'}
              </button>

              <Link to="/negociacoes" className="btn btn-secondary small">
                Iniciar Negociação
              </Link>
            </div>
          </div>
        </div>

        {/* CORPO DO PERFIL DE STARTUP */}
        <div className="profile-body-grid">
          {/* COLUNA PRINCIPAL */}
          <div className="profile-body-main">
            {/* ABA 1: SOBRE & MÉTRICAS */}
            {activeTab === 'sobre' && (
              <>
                <div className="panel profile-section-box">
                  <h3>Sobre a Empresa</h3>
                  <p className="profile-text-desc">{startup.description}</p>

                  <div className="company-founders-box">
                    <h4>Fundadores & Liderança</h4>
                    <div className="founders-tags">
                      {(startup.founders || ['Lucas Andrade (CEO)', 'Camila Prado (CTO)']).map(
                        (f, i) => (
                          <span key={i} className="founder-tag">
                            👤 {f}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Métricas Financeiras & Captação */}
                <div className="panel profile-section-box">
                  <h3>Métricas Operacionais & Captação</h3>
                  <div className="profile-kpis-grid">
                    <div className="kpi-card highlight">
                      <span>Captação Pretendida</span>
                      <strong>{startup.investment}</strong>
                      <small>Rodada {startup.stage}</small>
                    </div>
                    <div className="kpi-card">
                      <span>Equity Ofertado</span>
                      <strong>{startup.equityOffered || '10%'}</strong>
                      <small>Participação societária</small>
                    </div>
                    <div className="kpi-card">
                      <span>MRR Atual</span>
                      <strong>{startup.mrr || 'R$ 150k'}</strong>
                      <small>Receita Recorrente Mensal</small>
                    </div>
                    <div className="kpi-card">
                      <span>Equipe</span>
                      <strong>{startup.team}</strong>
                      <small>Colaboradores diretos</small>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ABA 2: ESTATÍSTICAS & PROBABILIDADES */}
            {activeTab === 'estatisticas' && (
              <>
                <div className="panel profile-section-box">
                  <div className="stats-box-header">
                    <div>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📊</span> Estatísticas & Probabilidades de Crescimento
                      </h3>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Auditoria algorítmica de saúde financeira, riscos e expansão homologada
                      </span>
                    </div>
                    <div className="score-pill-big">
                      Score: <strong>{customAnalysis.score}/100</strong>
                    </div>
                  </div>

                  <div className="score-circles-row">
                    <ScoreCircle value={customAnalysis.score} label="Score Geral" color="#6366f1" />
                    <ScoreCircle value={customAnalysis.healthScore} label="Saúde Financeira" color="#22c55e" />
                    <ScoreCircle value={customAnalysis.growthScore} label="Potencial Escala" color="#3b82f6" />
                    <ScoreCircle value={100 - customAnalysis.riskScore} label="Segurança" color="#eab308" />
                  </div>

                  <div className="indicator-bars-group">
                    <IndicatorBar
                      label="Saúde Financeira & Unit Economics"
                      value={customAnalysis.healthScore}
                      color="#22c55e"
                    />
                    <IndicatorBar
                      label="Potencial de Tração & Escala"
                      value={customAnalysis.growthScore}
                      color="#3b82f6"
                    />
                    <IndicatorBar
                      label="Nível de Risco Operacional"
                      value={customAnalysis.riskScore}
                      color="#ef4444"
                    />
                  </div>

                  <div className="stats-summary-quote">
                    <strong>Síntese Estatística para Investidores:</strong>
                    <p>{customAnalysis.summary}</p>
                  </div>
                </div>

                {/* Matriz SWOT */}
                <div className="panel profile-section-box">
                  <h3>Matriz SWOT Analítica</h3>
                  <div className="swot-cards-grid">
                    <SwotCard title="Forças" icon="💪" items={customAnalysis.strengths} borderCol="#22c55e" />
                    <SwotCard title="Fraquezas" icon="⚠️" items={customAnalysis.weaknesses} borderCol="#ef4444" />
                    <SwotCard title="Oportunidades" icon="🚀" items={customAnalysis.opportunities} borderCol="#3b82f6" />
                    <SwotCard title="Ameaças" icon="🛡️" items={customAnalysis.threats} borderCol="#eab308" />
                  </div>
                </div>

                {/* Projeção Gráfica e Cenários */}
                <div className="panel profile-section-box">
                  <h3>Projeção de Faturamento & Valuation (24 meses)</h3>
                  <ProjectionChart analysis={customAnalysis} />

                  <div className="scenarios-grid" style={{ marginTop: '1.5rem' }}>
                    <ScenarioCard
                      title="Pessimista"
                      icon="🔴"
                      accentColor="#ef4444"
                      growth12={customAnalysis.projections.months12.pessimistic}
                      growth24={customAnalysis.projections.months24.pessimistic}
                      revenue12={customAnalysis.revenueProjection.months12.pessimistic}
                      revenue24={customAnalysis.revenueProjection.months24.pessimistic}
                    />
                    <ScenarioCard
                      title="Realista"
                      icon="🟡"
                      accentColor="#eab308"
                      growth12={customAnalysis.projections.months12.realistic}
                      growth24={customAnalysis.projections.months24.realistic}
                      revenue12={customAnalysis.revenueProjection.months12.realistic}
                      revenue24={customAnalysis.revenueProjection.months24.realistic}
                    />
                    <ScenarioCard
                      title="Otimista"
                      icon="🟢"
                      accentColor="#22c55e"
                      growth12={customAnalysis.projections.months12.optimistic}
                      growth24={customAnalysis.projections.months24.optimistic}
                      revenue12={customAnalysis.revenueProjection.months12.optimistic}
                      revenue24={customAnalysis.revenueProjection.months24.optimistic}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ABA 3: PUBLICAÇÕES */}
            {activeTab === 'publicacoes' && (
              <div className="profile-posts-list">
                {profilePosts.length > 0 ? (
                  profilePosts.map((p) => (
                    <div key={p.id} className="panel post-item-card">
                      <div className="post-header-mockup">
                        <span className="author-avatar-mockup">{p.authorAvatar}</span>
                        <div>
                          <strong>{p.authorName}</strong>
                          <span className="badge-mockup">{p.authorBadge}</span>
                          <small className="time-mockup">{p.createdAt}</small>
                        </div>
                      </div>
                      <p style={{ margin: '1rem 0', lineHeight: 1.6 }}>{p.content}</p>
                      {p.metricBadge && (
                        <div className="post-metric-pill">{p.metricBadge.value}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="panel empty-state-box">
                    <p>Esta startup ainda não fez publicações no feed.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BARRA LATERAL DO PERFIL */}
          <aside className="profile-body-sidebar">
            <div className="panel profile-side-box">
              <h4>Decisão & Negociação</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Esta oportunidade se encaixa na tese de investidores com foco em {startup.sector}.
              </p>

              <div className="side-action-buttons">
                <button
                  type="button"
                  className="btn btn-primary full"
                  onClick={() => setMatched(true)}
                >
                  💚 {matched ? '✓ Interesse Registrado' : 'Demonstrar Interesse'}
                </button>

                <Link to="/negociacoes" className="btn btn-secondary full">
                  Abrir Term Sheet / Negociação
                </Link>

                <Link
                  to="/mensagens"
                  className="btn btn-ghost full"
                  style={{ textAlign: 'center' }}
                >
                  Enviar Mensagem Direta
                </Link>
              </div>

              <div className="side-security-note">
                🔒 Métricas financeiras e societárias homologadas em conformidade com as diretrizes
                do NEXO.
              </div>
            </div>

            {/* Próximas Startups */}
            <div className="panel profile-side-box">
              <h4>Outras Startups do Setor</h4>
              <div className="side-suggestions-list">
                {currentStartups
                  .filter((s) => s.id !== startup.id)
                  .map((other) => (
                    <Link
                      key={other.id}
                      to={`/perfil/startup/${other.id}`}
                      className="suggestion-item"
                    >
                      <span className="sugg-avatar">{other.avatar || '🚀'}</span>
                      <div>
                        <strong>{other.name}</strong>
                        <span>{other.sector} • Captação: {other.investment}</span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // PERFIL DE INVESTIDOR
  // -------------------------------------------------------------
  if (type === 'investor' && investorProfile) {
    const investor = investorProfile

    return (
      <div className="profile-shell-extended">
        <div className="profile-hero-card panel">
          <div className="profile-banner-bg investor-banner"></div>

          <div className="profile-hero-main-row">
            <div className="profile-brand-avatar">{investor.avatar || '👩‍💼'}</div>

            <div className="profile-brand-details">
              <div className="brand-title-line">
                <h2>{investor.name}</h2>
                <span className="verified-status-tag">Investidor Verificado</span>
                <span className="stage-pill-highlight">{investor.type}</span>
              </div>

              <p className="brand-sector-loc">
                {investor.type} • {investor.city} • Ticket médio: {investor.ticket}
              </p>

              <div className="brand-connections-count">
                <span><strong>{investor.followersCount || 4850}</strong> seguidores</span>
                <span>•</span>
                <span><strong>{investor.connectionsCount || 940}</strong> conexões</span>
              </div>
            </div>

            <div className="profile-hero-score-box">
              <span className="score-lbl">Aderência Geral</span>
              <strong className="score-val">{investor.match}% Match</strong>
              <span className="score-sub">Tese Aberta</span>
            </div>
          </div>

          <div className="profile-hero-actions-bar">
            <div className="profile-tabs-nav">
              <button
                type="button"
                className={`tab-btn ${activeTab === 'sobre' ? 'active' : ''}`}
                onClick={() => setActiveTab('sobre')}
              >
                💼 Tese & Portfólio
              </button>
              <button
                type="button"
                className={`tab-btn ${activeTab === 'publicacoes' ? 'active' : ''}`}
                onClick={() => setActiveTab('publicacoes')}
              >
                📢 Publicações ({profilePosts.length})
              </button>
            </div>

            <div className="profile-action-btns-group">
              <button
                type="button"
                className={`btn btn-secondary small ${isFollowing ? 'following' : ''}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? '✓ Conectado' : '+ Conectar'}
              </button>

              <Link to="/negociacoes" className="btn btn-primary small glow-btn">
                Propor Rodada de Investimento
              </Link>

              <Link to="/mensagens" className="btn btn-ghost small">
                Enviar Mensagem
              </Link>
            </div>
          </div>
        </div>

        <div className="profile-body-grid">
          <div className="profile-body-main">
            {activeTab === 'sobre' && (
              <>
                <div className="panel profile-section-box">
                  <h3>Sobre o Investidor & Bio</h3>
                  <p className="profile-text-desc">{investor.description}</p>
                </div>

                <div className="panel profile-section-box">
                  <h3>Tese de Investimento Detalhada</h3>
                  <p className="profile-text-desc">{investor.thesis}</p>

                  <div className="profile-kpis-grid" style={{ marginTop: '1.25rem' }}>
                    <div className="kpi-card highlight">
                      <span>Faixa de Ticket</span>
                      <strong>{investor.ticket}</strong>
                      <small>Por rodada</small>
                    </div>
                    <div className="kpi-card">
                      <span>Estágios de Foco</span>
                      <strong>{(investor.stages || ['Seed', 'Série A']).join(', ')}</strong>
                      <small>Maturidade de entrada</small>
                    </div>
                    <div className="kpi-card">
                      <span>Setores Prioritários</span>
                      <strong>{investor.focus.join(', ')}</strong>
                      <small>Mercados de interesse</small>
                    </div>
                  </div>
                </div>

                {/* Portfólio de Startups Investidas */}
                <div className="panel profile-section-box">
                  <h3>Portfólio de Startups Apoiadas</h3>
                  <div className="portfolio-tags-grid">
                    {(investor.portfolio || ['LogiLog', 'HealthTrack', 'FastPay']).map(
                      (item, i) => (
                        <div key={i} className="portfolio-item-card">
                          <span className="port-icon">🚀</span>
                          <div>
                            <strong>{item}</strong>
                            <span>Investida</span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'publicacoes' && (
              <div className="profile-posts-list">
                {profilePosts.length > 0 ? (
                  profilePosts.map((p) => (
                    <div key={p.id} className="panel post-item-card">
                      <div className="post-header-mockup">
                        <span className="author-avatar-mockup">{p.authorAvatar}</span>
                        <div>
                          <strong>{p.authorName}</strong>
                          <span className="badge-mockup">{p.authorBadge}</span>
                          <small className="time-mockup">{p.createdAt}</small>
                        </div>
                      </div>
                      <p style={{ margin: '1rem 0', lineHeight: 1.6 }}>{p.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="panel empty-state-box">
                    <p>Este investidor ainda não fez publicações no feed.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="profile-body-sidebar">
            <div className="panel profile-side-box">
              <h4>Conectar com {investor.name}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Envie suas métricas validadas ou inicie uma conversa para avaliar se há fit com a
                tese de aporte.
              </p>

              <div className="side-action-buttons">
                <Link to="/negociacoes" className="btn btn-primary full">
                  Apresentar Rodada de Captação
                </Link>
                <Link to="/mensagens" className="btn btn-secondary full">
                  Mensagem Direta
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div className="panel empty-state-box" style={{ margin: '3rem auto', maxWidth: '600px' }}>
      <h2>Perfil não encontrado no catálogo do NEXO</h2>
      <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: '1rem' }}>
        Voltar ao Catálogo
      </Link>
    </div>
  )
}
