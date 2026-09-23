import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { startupApiService } from '../services/startupApiService'
import type { EstagioStartup, StartupApiResponse } from '../types/startupApi'

const STAGE_LABELS: Record<EstagioStartup, { label: string; class: string }> = {
  IDEIA: { label: 'Ideação', class: 'stage-ideia' },
  MVP: { label: 'MVP', class: 'stage-mvp' },
  SEED: { label: 'Seed', class: 'stage-seed' },
  SERIES_A: { label: 'Série A', class: 'stage-series-a' },
}

export function StartupsListPage() {
  const [startups, setStartups] = useState<StartupApiResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState<string>('ALL')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const loadStartups = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await startupApiService.listStartups({
        busca: search.trim() ? search.trim() : undefined,
        estagio: stageFilter !== 'ALL' ? (stageFilter as EstagioStartup) : undefined,
      })
      setStartups(res.data)
      setIsFallback(res.isMockFallback)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar startups da API.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [search, stageFilter])

  useEffect(() => {
    let isCurrent = true
    startupApiService
      .listStartups({
        busca: search.trim() ? search.trim() : undefined,
        estagio: stageFilter !== 'ALL' ? (stageFilter as EstagioStartup) : undefined,
      })
      .then((res) => {
        if (isCurrent) {
          setStartups(res.data)
          setIsFallback(res.isMockFallback)
        }
      })
      .catch((err: unknown) => {
        if (isCurrent) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar startups da API.')
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })

    return () => {
      isCurrent = false
    }
  }, [search, stageFilter])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    loadStartups()
  }

  async function confirmDelete() {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      await startupApiService.deleteStartup(deletingId)
      setStartups((prev) => prev.filter((s) => s.id !== deletingId))
      setDeletingId(null)
    } catch (err: unknown) {
      alert('Erro ao excluir startup: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredStartups = useMemo(() => {
    return startups.filter((s) => {
      const matchSearch =
        search === '' ||
        s.nome.toLowerCase().includes(search.toLowerCase()) ||
        (s.descricao && s.descricao.toLowerCase().includes(search.toLowerCase())) ||
        s.setor.toLowerCase().includes(search.toLowerCase())
      const matchStage = stageFilter === 'ALL' || s.estagio === stageFilter
      return matchSearch && matchStage
    })
  }, [startups, search, stageFilter])

  return (
    <div className="crud-page-container">
      {/* Top Header */}
      <div className="crud-header">
        <div>
          <div className="crud-badge">Gestão de Empresas &bull; OpenAPI REST</div>
          <h1 className="crud-title">Startups Cadastradas</h1>
          <p className="crud-subtitle">
            Gerenciamento completo das startups cadastradas no backend Spring Boot via especificação OpenAPI.
          </p>
        </div>
        <div className="crud-header-actions">
          <Link
            to="/swagger"
            className="btn-crud-secondary"
            title="Acessar documentação OpenAPI interativa (Swagger UI)"
          >
            <span style={{ fontSize: '1.1rem' }}>⚡</span> Swagger UI
          </Link>
          <Link to="/startups/nova" className="btn-crud-primary">
            <span>+</span> Nova Startup
          </Link>
        </div>
      </div>

      {/* Backend connection status bar */}
      <div className={`crud-status-banner ${isFallback ? 'banner-offline' : 'banner-online'}`}>
        <div className="status-indicator-dot" />
        {isFallback ? (
          <span>
            <strong>Backend Offline ou em inicialização:</strong> Exibindo dados locais com persistência em memória. Para conectar ao PostgreSQL + Spring Boot, execute <code>mvn spring-boot:run</code> na pasta <code>backend</code>.
          </span>
        ) : (
          <span>
            <strong>Conectado ao Backend Spring Boot:</strong> Consumindo endpoints REST em <code>http://localhost:8080/api/startups</code>.
          </span>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="crud-controls-bar">
        <form onSubmit={handleSearchSubmit} className="crud-search-form">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome, setor ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="crud-search-input"
          />
          {search && (
            <button
              type="button"
              className="crud-search-clear"
              onClick={() => {
                setSearch('')
                loadStartups()
              }}
            >
              &times;
            </button>
          )}
        </form>

        <div className="crud-filter-group">
          <label htmlFor="stage-select">Estágio:</label>
          <select
            id="stage-select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="crud-select"
          >
            <option value="ALL">Todos os Estágios</option>
            <option value="IDEIA">Ideação (IDEIA)</option>
            <option value="MVP">MVP</option>
            <option value="SEED">Seed</option>
            <option value="SERIES_A">Série A</option>
          </select>

          <button
            type="button"
            onClick={loadStartups}
            className="btn-crud-refresh"
            title="Recarregar lista da API"
          >
            🔄 Atualizar
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="crud-loading-state">
          <div className="crud-spinner" />
          <p>Carregando dados da API REST...</p>
        </div>
      ) : error ? (
        <div className="crud-error-box">
          <p className="error-title">⚠️ Erro ao consultar a API</p>
          <p className="error-message">{error}</p>
          <button type="button" onClick={loadStartups} className="btn-crud-primary">
            Tentar novamente
          </button>
        </div>
      ) : filteredStartups.length === 0 ? (
        <div className="crud-empty-box">
          <div className="empty-icon">🏢</div>
          <h3>Nenhuma startup encontrada</h3>
          <p>Nenhum registro corresponde aos filtros selecionados ou nenhuma startup foi cadastrada ainda.</p>
          <Link to="/startups/nova" className="btn-crud-primary">
            Cadastrar primeira startup
          </Link>
        </div>
      ) : (
        <div className="crud-table-wrapper">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Setor</th>
                <th>Estágio</th>
                <th>Localização</th>
                <th>Captação</th>
                <th>Equity</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStartups.map((s) => {
                const stageMeta = STAGE_LABELS[s.estagio] || { label: s.estagio, class: '' }
                const formattedGoal = s.captacaoObjetivo
                  ? Number(s.captacaoObjetivo).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    })
                  : '—'
                const formattedEquity = s.equityOferecida ? `${s.equityOferecida}%` : '—'

                return (
                  <tr key={s.id}>
                    <td>
                      <div className="startup-cell-name">
                        {s.logoUrl ? (
                          <img
                            src={s.logoUrl}
                            alt={s.nome}
                            className="startup-mini-avatar"
                            onError={(e) => {
                              ;(e.target as HTMLElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div className="startup-mini-placeholder">
                            {s.nome.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <Link to={`/startups/${s.id}`} className="startup-name-link">
                            {s.nome}
                          </Link>
                          {s.website && (
                            <a
                              href={s.website.startsWith('http') ? s.website : `https://${s.website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="startup-web-link"
                            >
                              {s.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="crud-sector-tag">{s.setor}</span>
                    </td>
                    <td>
                      <span className={`crud-stage-pill ${stageMeta.class}`}>
                        {stageMeta.label}
                      </span>
                    </td>
                    <td>
                      <span className="crud-location-text">
                        {s.cidade ? `${s.cidade}` : '—'}
                        {s.estado ? ` / ${s.estado}` : ''}
                      </span>
                    </td>
                    <td>
                      <strong className="crud-metric-text">{formattedGoal}</strong>
                    </td>
                    <td>
                      <span className="crud-metric-text">{formattedEquity}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="crud-actions-group">
                        <button
                          type="button"
                          className="btn-action-view"
                          title="Visualizar Detalhes"
                          onClick={() => navigate(`/startups/${s.id}`)}
                        >
                          👁️
                        </button>
                        <button
                          type="button"
                          className="btn-action-edit"
                          title="Editar Startup"
                          onClick={() => navigate(`/startups/${s.id}/editar`)}
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className="btn-action-delete"
                          title="Excluir Startup"
                          onClick={() => setDeletingId(s.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="crud-modal-backdrop" onClick={() => setDeletingId(null)}>
          <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crud-modal-icon">⚠️</div>
            <h3 className="crud-modal-title">Confirmar Exclusão</h3>
            <p className="crud-modal-text">
              Tem certeza que deseja excluir esta startup? Essa ação removerá o registro permanentemente do banco de dados PostgreSQL via endpoint <code>DELETE /api/startups/{deletingId}</code>.
            </p>
            <div className="crud-modal-actions">
              <button
                type="button"
                className="btn-crud-secondary"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-crud-danger"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

