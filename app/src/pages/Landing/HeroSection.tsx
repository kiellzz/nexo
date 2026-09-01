import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="hero-section-full">
      <div className="hero-video-container">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video-bg"
          poster="/handshake.png"
        >
          <source src="/handshake.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos em HTML5.
        </video>
        <div className="hero-overlay" />
        <div className="hero-glow-orb orb-1" />
        <div className="hero-glow-orb orb-2" />
      </div>

      <div className="hero-content-container">
        <div className="hero-copy">
          <div className="eyebrow-badge">
            <span className="pulse-dot" />
            <span>Conecte Capital & Inovação</span>
          </div>

          <h1 className="hero-title">
            Conectamos <span className="highlight-text">startups</span> às oportunidades certas de <span className="highlight-gradient">investimento</span>.
          </h1>

          <p className="hero-description">
            Descubra investidores com visão alinhada, encontre negócios de alto crescimento validados por dados e acelere a próxima etapa da sua jornada com precisão.
          </p>

          <div className="cta-row">
            <Link to="/signup" className="btn btn-primary btn-glow btn-lg">
              <span>Começar agora</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/buscar" className="btn btn-glass btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Explorar oportunidades</span>
            </Link>
          </div>

          <div className="hero-stats-bar">
            <div className="stat-item">
              <div className="stat-number">1.2k<span className="stat-plus">+</span></div>
              <div className="stat-label">Startups Ativas</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">320<span className="stat-plus">+</span></div>
              <div className="stat-label">Investidores Qualificados</div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <div className="stat-number">94<span className="stat-pct">%</span></div>
              <div className="stat-label">Taxa de Match Assertivo</div>
            </div>
          </div>
        </div>

        {/* RIGHT FLOATING GLASS CARD */}
        <div className="hero-interactive-card">
          <div className="match-showcase-card">
            <div className="match-card-header">
              <div className="badge-live">
                <span className="live-indicator" />
                <span>Match em Tempo Real</span>
              </div>
              <span className="match-score-pill">96% Compatibilidade</span>
            </div>

            <div className="match-parties">
              <div className="party-box startup-box">
                <div className="party-icon">🚀</div>
                <div>
                  <h4>NovaFlow</h4>
                  <p>SaaS B2B • Logística IA</p>
                </div>
              </div>

              <div className="match-connector">
                <div className="connector-line" />
                <div className="connector-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
              </div>

              <div className="party-box investor-box">
                <div className="party-icon">💎</div>
                <div>
                  <h4>Helena Costa</h4>
                  <p>Investidora Anjo • Ticket até R$ 1M</p>
                </div>
              </div>
            </div>

            <div className="match-reasons-preview">
              <div className="reason-item">
                <div className="reason-header">
                  <span>Tese & Mercado</span>
                  <strong>98%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '98%' }} />
                </div>
              </div>
              <div className="reason-item">
                <div className="reason-header">
                  <span>Ticket & Estágio</span>
                  <strong>94%</strong>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '94%' }} />
                </div>
              </div>
            </div>

            <div className="match-card-footer">
              <span className="status-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Conexão imediata recomendada pelo algoritmo
              </span>
            </div>
          </div>

          {/* FLOATING BADGE */}
          <div className="floating-metric-badge float-1">
            <span className="badge-icon">💼</span>
            <div>
              <strong>R$ 48M+</strong>
              <p>Volume em Negociação</p>
            </div>
          </div>

          <div className="floating-metric-badge float-2">
            <span className="badge-icon">⚡</span>
            <div>
              <strong>3x mais rápido</strong>
              <p>Tempo médio até o Term Sheet</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
