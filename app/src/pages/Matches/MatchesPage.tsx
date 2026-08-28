import { matchCards } from '../../data/mockData'

export function MatchesPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Algoritmo de Afinidade</span>
          <h2>Suas Melhores Combinações</h2>
          <p className="section-desc">Entenda detalhadamente os critérios que geraram as notas de compatibilidade.</p>
        </div>
      </div>

      <div className="match-grid">
        {matchCards.map((match) => (
          <article key={match.id} className="match-card">
            <div className="card-topline">
              <span className="pill">{match.type === 'startup' ? 'Startup' : 'Investidor'}</span>
              <span className="match-badge">
                <span className="badge-dot" />
                {match.match}% Match
              </span>
            </div>
            <h3>{match.name}</h3>
            <div className="match-breakdown">
              {match.reasons.map((reason) => (
                <div key={reason.label} className="match-row">
                  <span className="match-label">{reason.label}</span>
                  <div className="progress-bar">
                    <span style={{ width: `${reason.value}%` }} />
                  </div>
                  <strong className="match-val">{reason.value}%</strong>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-primary full btn-match-connect">
              Iniciar Conexão
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
