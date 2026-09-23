import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { startupApiService } from '../services/startupApiService'
import type { EstagioStartup, StartupApiResponse } from '../types/startupApi'

const STAGE_LABELS: Record<EstagioStartup, { label: string; class: string }> = {
  IDEIA: { label: 'Ideação', class: 'stage-ideia' },
  MVP: { label: 'MVP', class: 'stage-mvp' },
  SEED: { label: 'Seed', class: 'stage-seed' },
  SERIES_A: { label: 'Série A', class: 'stage-series-a' },
}

export function StartupDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [startup, setStartup] = useState<StartupApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!id) return
    let isCurrent = true
    startupApiService
      .getStartupById(id)
      .then((res) => {
        if (isCurrent) setStartup(res.data)
      })
      .catch((err: unknown) => {
        if (isCurrent) setError(err instanceof Error ? err.message : 'Falha ao buscar detalhes da startup.')
      })
      .finally(() => {
        if (isCurrent) setLoading(false)
      })
    return () => {
      isCurrent = false
    }
  }, [id])

  async function handleDelete() {
    if (!id) return
    setIsDeleting(true)
    try {
      await startupApiService.deleteStartup(id)
      navigate('/startups')
    } catch (err: unknown) {
      alert('Erro ao excluir: ' + (err instanceof Error ? err.message : 'Erro desconhecido'))
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="crud-page-container">
        <div className="crud-loading-state">
          <div className="crud-spinner" />
          <p>Buscando detalhes da startup no servidor...</p>
        </div>
      </div>
    )
  }

  if (error || !startup) {
    return (
      <div className="crud-page-container">
        <div className="crud-top-nav">
          <Link to="/startups" className="crud-back-link">
            &larr; Voltar para a lista
          </Link>
        </div>
        <div className="crud-error-box">
          <p className="error-title">⚠️ Startup não encontrada</p>
          <p className="error-message">{error || 'Não foi possível localizar o registro com o ID fornecido.'}</p>
          <Link to="/startups" className="btn-crud-primary">
            Retornar ao catálogo
          </Link>
        </div>
      </div>
    )
  }

  const stageMeta = STAGE_LABELS[startup.estagio] || { label: startup.estagio, class: '' }
  const formattedGoal = startup.captacaoObjetivo
    ? Number(startup.captacaoObjetivo).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      })
    : 'Não informado'

  const formattedEquity = startup.equityOferecida ? `${startup.equityOferecida}%` : 'Não informado'

  const implicitValuation =
    startup.captacaoObjetivo && startup.equityOferecida && startup.equityOferecida > 0
      ? (startup.captacaoObjetivo / (startup.equityOferecida / 100)).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 0,
        })
      : null

  const formattedDate = new Date(startup.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="crud-page-container">
      {/* Top Breadcrumb */}
      <div className="crud-top-nav">
        <Link to="/startups" className="crud-back-link">
          &larr; Voltar para a lista de startups
        </Link>
        <div className="crud-header-actions">
          <button
            type="button"
            className="btn-crud-secondary"
            onClick={() => navigate(`/startups/${startup.id}/editar`)}
          >
            ✏️ Editar
          </button>
          <button
            type="button"
            className="btn-crud-danger-outline"
            onClick={() => setShowDeleteModal(true)}
          >
            🗑️ Excluir
          </button>
        </div>
      </div>

      {/* Hero Detail Card */}
      <div className="crud-detail-hero">
        <div className="detail-hero-left">
          {startup.logoUrl ? (
            <img
              src={startup.logoUrl}
              alt={startup.nome}
              className="detail-avatar-img"
              onError={(e) => {
                ;(e.target as HTMLElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="detail-avatar-placeholder">
              {startup.nome.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="detail-badges-row">
              <span className="crud-sector-tag">{startup.setor}</span>
              <span className={`crud-stage-pill ${stageMeta.class}`}>
                {stageMeta.label}
              </span>
              {startup.cidade && (
                <span className="detail-location-pill">
                  📍 {startup.cidade} {startup.estado ? `- ${startup.estado}` : ''}
                </span>
              )}
            </div>

            <h1 className="detail-title">{startup.nome}</h1>

            {startup.website && (
              <a
                href={startup.website.startsWith('http') ? startup.website : `https://${startup.website}`}
                target="_blank"
                rel="noreferrer"
                className="detail-website-link"
              >
                🌐 {startup.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="crud-metrics-grid">
        <div className="crud-metric-card">
          <span className="metric-label">Captação Pretendida</span>
          <strong className="metric-value">{formattedGoal}</strong>
          <span className="metric-helper">Meta de investimento da rodada</span>
        </div>

        <div className="crud-metric-card">
          <span className="metric-label">Equity Ofertada</span>
          <strong className="metric-value">{formattedEquity}</strong>
          <span className="metric-helper">Participação acionária na empresa</span>
        </div>

        <div className="crud-metric-card">
          <span className="metric-label">Valuation Post-Money Estimado</span>
          <strong className="metric-value highlight">{implicitValuation || '—'}</strong>
          <span className="metric-helper">Cálculo proporcional captação / equity</span>
        </div>
      </div>

      {/* Description Section */}
      <div className="crud-section-card">
        <h2 className="section-card-title">Proposta de Valor e Modelo de Negócio</h2>
        <p className="detail-description-text">
          {startup.descricao || 'Nenhuma descrição detalhada informada para esta startup.'}
        </p>
      </div>

      {/* Metadata & Technical Info */}
      <div className="crud-section-card">
        <h2 className="section-card-title">Metadados Técnicos do Registro</h2>
        <div className="tech-meta-grid">
          <div className="tech-meta-item">
            <span>Identificador UUID</span>
            <code>{startup.id}</code>
          </div>
          <div className="tech-meta-item">
            <span>Data de Cadastro</span>
            <strong>{formattedDate}</strong>
          </div>
          <div className="tech-meta-item">
            <span>Endpoint REST</span>
            <code>GET /api/startups/{startup.id}</code>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="crud-modal-backdrop" onClick={() => setShowDeleteModal(false)}>
          <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crud-modal-icon">⚠️</div>
            <h3 className="crud-modal-title">Confirmar Exclusão</h3>
            <p className="crud-modal-text">
              Deseja realmente remover <strong>{startup.nome}</strong>? Esta ação excluirá os dados permanentemente no PostgreSQL.
            </p>
            <div className="crud-modal-actions">
              <button
                type="button"
                className="btn-crud-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-crud-danger"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Excluindo...' : 'Sim, Excluir Definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

