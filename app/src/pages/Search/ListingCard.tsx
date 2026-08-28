import { Link } from 'react-router-dom'
import type { Investor, Startup, UserRole } from '../../types'

export function ListingCard({
  activeRole,
  item,
}: {
  activeRole: UserRole
  item: Investor | Startup
}) {
  if (activeRole === 'startup') {
    const investor = item as Investor

    return (
      <article className="listing-card">
        <div className="card-topline">
          <span className="pill">{investor.type}</span>
          <span className="match-badge">
            <span className="badge-dot" />
            {investor.match}% Match
          </span>
        </div>
        <h3>{investor.name}</h3>
        <p className="listing-desc">{investor.thesis}</p>
        <div className="listing-meta-tags">
          <span className="meta-tag">📍 {investor.city}</span>
          <span className="meta-tag">💰 {investor.ticket}</span>
          <span className="meta-tag">🎯 {investor.focus[0]}</span>
        </div>
        <Link to={`/perfil/investor/${investor.id}`} className="btn btn-secondary full">
          Ver perfil completo →
        </Link>
      </article>
    )
  }

  const startup = item as Startup

  return (
    <article className="listing-card">
      <div className="card-topline">
        <span className="pill">{startup.sector}</span>
        <span className="match-badge">
          <span className="badge-dot" />
          {startup.match}% Match
        </span>
      </div>
      <h3>{startup.name}</h3>
      <p className="listing-desc">{startup.description}</p>
      <div className="listing-meta-tags">
        <span className="meta-tag">📍 {startup.city}</span>
        <span className="meta-tag">🚀 {startup.stage}</span>
        <span className="meta-tag">💼 {startup.investment}</span>
      </div>
      <Link to={`/perfil/startup/${startup.id}`} className="btn btn-secondary full">
        Ver startup completa →
      </Link>
    </article>
  )
}
