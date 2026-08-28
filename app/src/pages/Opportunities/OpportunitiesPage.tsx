import { opportunities } from '../../data/mockData'

export function OpportunitiesPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Rodadas Abertas</span>
          <h2>Oportunidades de Investimento e Aceleração</h2>
          <p className="section-desc">Participe de rodadas verificadas com due diligence simplificada.</p>
        </div>
      </div>

      <div className="opportunities-panel">
        {opportunities.map((item) => (
          <article key={item.id} className="opportunity-full-card">
            <div className="card-topline">
              <span className="pill">{item.type}</span>
              <span className="match-badge">
                <span className="badge-dot" />
                {item.match}% Match
              </span>
            </div>
            <h3>{item.name}</h3>
            <p className="full-card-desc">{item.description}</p>
            <div className="meta-grid">
              <div><span>Setor</span><strong>{item.sector}</strong></div>
              <div><span>Localização</span><strong>{item.location}</strong></div>
              <div><span>Valor Alvo</span><strong>{item.value}</strong></div>
              <div><span>Status</span><strong className="status-highlight">{item.status}</strong></div>
            </div>
            <div className="full-card-actions">
              <button type="button" className="btn btn-primary">Demonstrar Interesse</button>
              <button type="button" className="btn btn-secondary">Baixar Teaser Executivo</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
