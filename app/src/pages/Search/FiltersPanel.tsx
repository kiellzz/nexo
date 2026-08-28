import type { UserRole } from '../../types'

export function FiltersPanel({ activeRole }: { activeRole: UserRole }) {
  return (
    <div className="filters-panel">
      <div className="filter-group">
        <label>{activeRole === 'startup' ? 'Tese / Segmento' : 'Setor de Atuação'}</label>
        <select defaultValue="Todos">
          <option>Todos os setores</option>
          <option>{activeRole === 'startup' ? 'Inteligência Artificial' : 'Logística IA'}</option>
          <option>{activeRole === 'startup' ? 'Saúde Digital' : 'Saúde Digital'}</option>
          <option>{activeRole === 'startup' ? 'Fintech & B2B' : 'Energia Limpa'}</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Localização / Hub</label>
        <select defaultValue="Brasil">
          <option>Todo o Brasil</option>
          <option>São Paulo - SP</option>
          <option>Rio de Janeiro - RJ</option>
          <option>Belo Horizonte - MG</option>
          <option>Curitiba - PR</option>
        </select>
      </div>
      <div className="filter-group">
        <label>{activeRole === 'startup' ? 'Faixa de Aporte' : 'Estágio Atual'}</label>
        <select defaultValue="Qualquer">
          <option>Qualquer faixa / estágio</option>
          <option>{activeRole === 'startup' ? 'R$ 300k - R$ 1M' : 'Pré-semente'}</option>
          <option>{activeRole === 'startup' ? 'R$ 1M - R$ 5M' : 'Seed'}</option>
          <option>{activeRole === 'startup' ? 'Acima de R$ 5M' : 'Série A'}</option>
        </select>
      </div>
      <button type="button" className="btn btn-secondary btn-reset-filters">Limpar filtros</button>
    </div>
  )
}
