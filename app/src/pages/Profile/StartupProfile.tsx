import { Link } from 'react-router-dom'
import type { Startup, UserRole } from '../../types'
import { matches } from '../../data/mockData'
import { ProgressBar } from '../../components/ui/ProgressBar'

export function StartupProfile({
  startup,
  activeRole,
}: {
  startup: Startup
  activeRole: UserRole
}) {
  return (
    <section className="profile-shell">
      <div className="profile-hero">
        <div className="profile-avatar startup-avatar">
          {startup.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="profile-hero-info">
          <span className="label-badge">Perfil da Startup</span>
          <h2>{startup.name}</h2>
          <p className="profile-sub">{startup.sector} • {startup.city}</p>
        </div>
        <div className="match-score">
          <span>Score de Afinidade</span>
          <strong>{startup.match}%</strong>
        </div>
      </div>

      <div className="profile-layout">
        <div className="panel profile-main">
          <h3>Sobre a Empresa</h3>
          <p className="profile-description-text">{startup.description}</p>

          <div className="meta-grid">
            <div><span>Estágio</span><strong>{startup.stage}</strong></div>
            <div><span>Modelo</span><strong>{startup.model}</strong></div>
            <div><span>Equipe</span><strong>{startup.team}</strong></div>
            <div><span>Investimento Alvo</span><strong>{startup.investment}</strong></div>
          </div>

          <div className="match-breakdown">
            <h4>Detalhamento de Compatibilidade</h4>
            {matches.map((item) => (
              <ProgressBar key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div className="panel profile-side">
          <h3>{activeRole === 'startup' ? 'Oportunidade de Conexão' : 'Parecer de Alinhamento'}</h3>
          <p>
            {activeRole === 'startup'
              ? 'Alinhamento forte com investidores focados em escala operacional acelerada e automação B2B.'
              : 'A startup apresenta métricas de tração consistentes e modelo escalável para rodadas de crescimento regional.'}
          </p>
          <div className="profile-side-actions">
            <button type="button" className="btn btn-primary full">
              {activeRole === 'startup' ? 'Demonstrar Interesse' : 'Quero Investir'}
            </button>
            <Link to="/buscar" className="btn btn-secondary full">
              Voltar à busca
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
