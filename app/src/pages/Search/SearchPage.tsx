import type { Investor, Startup, UserRole } from '../../types'
import { investors, startups } from '../../data/mockData'
import { FiltersPanel } from './FiltersPanel'
import { ListingCard } from './ListingCard'

export function SearchPage({ activeRole }: { activeRole: UserRole }) {
  const list: (Investor | Startup)[] = activeRole === 'startup' ? investors : startups

  return (
    <section className="search-shell">
      <div className="search-topbar">
        <div>
          <span className="label-badge">Radar do Ecossistema</span>
          <h2>{activeRole === 'startup' ? 'Encontre Investidores Compatíveis' : 'Descubra Startups Promissoras'}</h2>
          <p className="section-desc">Filtre por estágio, segmento de atuação, localização e faixa de capital.</p>
        </div>
        <div className="search-controls">
          <div className="search-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder={activeRole === 'startup' ? 'Pesquisar por nome de investidor, fundo ou tese...' : 'Pesquisar por startup, modelo de negócio ou setor...'} />
          </div>
          <button type="button" className="btn btn-primary">Buscar</button>
        </div>
      </div>

      <FiltersPanel activeRole={activeRole} />

      <div className="listing-grid">
        {list.map((item) => (
          <ListingCard key={item.id} activeRole={activeRole} item={item} />
        ))}
      </div>
    </section>
  )
}
