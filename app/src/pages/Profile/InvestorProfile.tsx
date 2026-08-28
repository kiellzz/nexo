import { Link } from 'react-router-dom'
import type { Investor, UserRole } from '../../types'
import { matches } from '../../data/mockData'

export function InvestorProfile({
  investor,
  activeRole,
}: {
  investor: Investor
  activeRole: UserRole
}) {
  return (
    <section className="profile-shell">
      <div className="profile-hero">
        <div className="profile-avatar investor-avatar">
          {investor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
        </div>
        <div className="profile-hero-info">
          <span className="label-badge">Perfil do Investidor</span>
          <h2>{investor.name}</h2>
          <p className="profile-sub">{investor.type} • {investor.city}</p>
        </div>
        <div className="match-score">
          <span>Score de Afinidade</span>
          <strong>{investor.match}%</strong>
        </div>
      </div>

      <div className="profile-layout">
        <div className="panel profile-main">
          <h3>Sobre o Investidor</h3>
          <p className="profile-description-text">{investor.description}</p>

          <div className="meta-grid">
            <div><span>Tipo</span><strong>{investor.type}</strong></div>
            <div><span>Faixa de Ticket</span><strong>{investor.ticket}</strong></div>
            <div><span>Áreas de Interesse</span><strong>{investor.focus.join(', ')}</strong></div>
            <div><span>Localização</span><strong>{investor.city}</strong></div>
          </div>

          <div className="match-breakdown">
            <h4>Detalhamento de Compatibilidade</h4>
            {matches.map((item) => (
              <div key={item.label} className="match-row">
                <span className="match-label">{item.label}</span>
                <div className="progress-bar">
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <strong className="match-val">{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel profile-side">
          <h3>Resumo da Tese</h3>
          <p>{investor.thesis}</p>
          <div className="profile-side-actions">
            <button type="button" className="btn btn-primary full">
              {activeRole === 'startup' ? 'Enviar Pitch Deck' : 'Conectar com Investidor'}
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
