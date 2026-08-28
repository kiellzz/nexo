import { Link } from 'react-router-dom'
import type { Investor, Startup, UserRole } from '../../types'
import { investors, opportunities, startups } from '../../data/mockData'
import { Sidebar } from './Sidebar'
import { RecommendationsList } from './RecommendationsList'

export function DashboardPage({ activeRole }: { activeRole: UserRole }) {
  const dashboardStats =
    activeRole === 'startup'
      ? [
          ['Perfil Completo', '87%', '+12% este mês'],
          ['Visualizações do Perfil', '1.3k', '+28% na semana'],
          ['Investidores Interessados', '24', '3 novos hoje'],
          ['Matches Compatíveis', '8', '94% fit médio'],
          ['Rodadas Relacionadas', '16', 'Ativas'],
        ]
      : [
          ['Startups Visualizadas', '42', 'Nesta semana'],
          ['Matches de Alta Tese', '11', 'Score > 90%'],
          ['Interesses Enviados', '9', '2 respostas'],
          ['Novas Oportunidades', '7', 'Últimos 7 dias'],
          ['Compatibilidade Média', '91%', 'Filtros ativos'],
        ]

  const recommendations: (Investor | Startup)[] = activeRole === 'startup' ? investors : startups

  return (
    <section className="dashboard-shell">
      <Sidebar activeRole={activeRole} />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="eyebrow-badge small">
              <span className="pulse-dot" />
              <span>{activeRole === 'startup' ? 'Painel da Startup' : 'Painel do Investidor'}</span>
            </div>
            <h2>{activeRole === 'startup' ? 'Resumo Executivo & Conexões' : 'Pipeline de Startups & Oportunidades'}</h2>
          </div>
          <Link to="/buscar" className="btn btn-primary">
            {activeRole === 'startup' ? 'Explorar Investidores →' : 'Explorar Startups →'}
          </Link>
        </header>

        <div className="stats-grid">
          {dashboardStats.map(([label, value, sub]) => (
            <div key={label} className="stat-card">
              <span className="stat-label">{label}</span>
              <strong className="stat-value">{value}</strong>
              <span className="stat-subtext">{sub}</span>
            </div>
          ))}
        </div>

        <div className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>{activeRole === 'startup' ? 'Investidores Recomendados' : 'Startups Recomendadas'}</h3>
                <p className="panel-subtitle">Baseado no seu perfil de tração e tese de mercado</p>
              </div>
              <Link to="/buscar" className="text-link">Ver todos ({recommendations.length})</Link>
            </div>

            <RecommendationsList activeRole={activeRole} recommendations={recommendations} />
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>{activeRole === 'startup' ? 'Rodadas Relacionadas' : 'Teses em Alta'}</h3>
                <p className="panel-subtitle">Oportunidades em seu radar</p>
              </div>
            </div>
            <div className="mini-list">
              {activeRole === 'startup'
                ? opportunities.map((opp) => (
                    <div key={opp.id} className="mini-item">
                      <div>
                        <strong>{opp.name}</strong>
                        <span>{opp.sector} • {opp.value}</span>
                      </div>
                      <span className="mini-badge">{opp.match}%</span>
                    </div>
                  ))
                : ['Inteligência Artificial', 'Saúde & BioTech', 'Logística Autônoma', 'Clean Energy', 'Fintech B2B'].map((area) => (
                    <div key={area} className="mini-item">
                      <div>
                        <strong>{area}</strong>
                        <span>Prioridade de alocação de fundos</span>
                      </div>
                      <span className="mini-badge">94%</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
