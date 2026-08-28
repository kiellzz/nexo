import { Link } from 'react-router-dom'
import type { Investor, Startup, UserRole } from '../../types'

export function RecommendationsList({
  activeRole,
  recommendations,
}: {
  activeRole: UserRole
  recommendations: (Investor | Startup)[]
}) {
  return (
    <div className="recommendations-list">
      {recommendations.map((item) => {
        if (activeRole === 'startup') {
          const investor = item as Investor

          return (
            <div key={investor.id} className="recommendation-card">
              <div className="avatar investor-avatar">
                {investor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
              </div>
              <div className="recommendation-copy">
                <h4>{investor.name}</h4>
                <p>{investor.type} • {investor.city}</p>
                <div className="tag-row">
                  {investor.focus.map((focus) => (
                    <span key={focus} className="pill lite">{focus}</span>
                  ))}
                </div>
              </div>
              <div className="recommendation-meta">
                <span className="match-badge">
                  <span className="badge-dot" />
                  {investor.match}% Fit
                </span>
                <span className="ticket-label">{investor.ticket}</span>
                <Link to={`/perfil/investor/${investor.id}`} className="btn btn-secondary small">
                  Ver perfil
                </Link>
              </div>
            </div>
          )
        }

        const startup = item as Startup

        return (
          <div key={startup.id} className="recommendation-card">
            <div className="avatar startup-avatar">
              {startup.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="recommendation-copy">
              <h4>{startup.name}</h4>
              <p>{startup.sector} • {startup.city}</p>
              <div className="tag-row">
                <span className="pill lite">{startup.stage}</span>
                <span className="pill">{startup.model}</span>
              </div>
            </div>
            <div className="recommendation-meta">
              <span className="match-badge">
                <span className="badge-dot" />
                {startup.match}% Fit
              </span>
              <span className="ticket-label">{startup.investment}</span>
              <Link to={`/perfil/startup/${startup.id}`} className="btn btn-secondary small">
                Ver perfil
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
