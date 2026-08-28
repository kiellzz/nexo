import { matchCards } from '../../data/mockData'
import { MatchBadge } from '../../components/ui/MatchBadge'
import { Pill } from '../../components/ui/Pill'
import { ProgressBar } from '../../components/ui/ProgressBar'

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
              <Pill>{match.type === 'startup' ? 'Startup' : 'Investidor'}</Pill>
              <MatchBadge value={match.match} />
            </div>
            <h3>{match.name}</h3>
            <div className="match-breakdown">
              {match.reasons.map((reason) => (
                <ProgressBar key={reason.label} label={reason.label} value={reason.value} />
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
