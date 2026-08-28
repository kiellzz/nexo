import { Link } from 'react-router-dom'
import { opportunities } from '../../data/mockData'

export function FeaturedOpportunities() {
  return (
    <section className="opportunity-preview">
      <div className="section-header">
        <div>
          <span className="label-badge">Portfólio & Rodadas</span>
          <h2>Oportunidades em Destaque</h2>
          <p className="section-desc">Startups selecionadas com rodadas de investimento ativas na plataforma.</p>
        </div>
        <Link to="/buscar" className="btn btn-secondary">
          Ver todas as oportunidades
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>

      <div className="opportunities-grid">
        {opportunities.map((op) => (
          <article key={op.id} className="opportunity-card">
            <div className="card-topline">
              <span className="pill">{op.type}</span>
              <span className="match-badge">
                <span className="badge-dot" />
                {op.match}% Match
              </span>
            </div>
            <h3>{op.name}</h3>
            <p className="opportunity-sector">
              <span className="sector-tag">{op.sector}</span> • <span>{op.location}</span>
            </p>
            <p className="opportunity-desc">{op.description}</p>
            
            <div className="card-metrics-row">
              <div className="metric-box">
                <span>Estágio</span>
                <strong>{op.stage}</strong>
              </div>
              <div className="metric-box">
                <span>Valor Rodada</span>
                <strong>{op.value}</strong>
              </div>
              <div className="metric-box">
                <span>Data Limite</span>
                <strong>{op.date}</strong>
              </div>
            </div>

            <div className="card-footer-action">
              <Link to="/buscar" className="btn btn-card-action">
                Ver detalhes da rodada →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
