import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { startupApiService } from '../services/startupApiService'
import type { EstagioStartup, StartupApiRequest } from '../types/startupApi'

export function StartupFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const [formData, setFormData] = useState<StartupApiRequest>({
    nome: '',
    descricao: '',
    setor: '',
    estagio: 'SEED',
    captacaoObjetivo: null,
    equityOferecida: null,
    cidade: '',
    estado: '',
    website: '',
    logoUrl: '',
  })

  const [loading, setLoading] = useState(isEditing)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isEditing && id) {
      let isCurrent = true
      startupApiService
        .getStartupById(id)
        .then((res) => {
          if (isCurrent) {
            setFormData({
              nome: res.data.nome || '',
              descricao: res.data.descricao || '',
              setor: res.data.setor || '',
              estagio: res.data.estagio || 'SEED',
              captacaoObjetivo: res.data.captacaoObjetivo,
              equityOferecida: res.data.equityOferecida,
              cidade: res.data.cidade || '',
              estado: res.data.estado || '',
              website: res.data.website || '',
              logoUrl: res.data.logoUrl || '',
            })
          }
        })
        .catch((err: unknown) => {
          if (isCurrent) {
            setError(err instanceof Error ? err.message : 'Falha ao carregar dados da startup.')
          }
        })
        .finally(() => {
          if (isCurrent) setLoading(false)
        })
      return () => {
        isCurrent = false
      }
    }
  }, [id, isEditing])

  function handleChange(field: keyof StartupApiRequest, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated[field]
        return updated
      })
    }
  }

  function validate(): boolean {
    const errors: Record<string, string> = {}
    if (!formData.nome.trim()) {
      errors.nome = 'O nome da startup é obrigatório.'
    }
    if (!formData.setor.trim()) {
      errors.setor = 'O setor de atuação é obrigatório.'
    }
    if (formData.estado && !/^[A-Za-z]{2}$/.test(formData.estado.trim())) {
      errors.estado = 'O estado deve conter exatamente 2 letras (ex: SP).'
    }
    if (
      formData.equityOferecida !== null &&
      formData.equityOferecida !== undefined &&
      (formData.equityOferecida < 0 || formData.equityOferecida > 100)
    ) {
      errors.equityOferecida = 'A equity deve estar entre 0% e 100%.'
    }
    if (
      formData.captacaoObjetivo !== null &&
      formData.captacaoObjetivo !== undefined &&
      formData.captacaoObjetivo < 0
    ) {
      errors.captacaoObjetivo = 'A captação não pode ser negativa.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError(null)

    const payload: StartupApiRequest = {
      ...formData,
      nome: formData.nome.trim(),
      descricao: formData.descricao?.trim() || undefined,
      setor: formData.setor.trim(),
      cidade: formData.cidade?.trim() || undefined,
      estado: formData.estado?.trim().toUpperCase() || undefined,
      website: formData.website?.trim() || undefined,
      logoUrl: formData.logoUrl?.trim() || undefined,
      captacaoObjetivo:
        formData.captacaoObjetivo === null || isNaN(Number(formData.captacaoObjetivo))
          ? null
          : Number(formData.captacaoObjetivo),
      equityOferecida:
        formData.equityOferecida === null || isNaN(Number(formData.equityOferecida))
          ? null
          : Number(formData.equityOferecida),
    }

    try {
      if (isEditing && id) {
        await startupApiService.updateStartup(id, payload)
      } else {
        await startupApiService.createStartup(payload)
      }
      navigate('/startups')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao salvar startup.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="crud-page-container">
        <div className="crud-loading-state">
          <div className="crud-spinner" />
          <p>Carregando dados da startup...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="crud-page-container">
      {/* Breadcrumb & Navigation */}
      <div className="crud-top-nav">
        <Link to="/startups" className="crud-back-link">
          &larr; Voltar para Startups
        </Link>
      </div>

      <div className="crud-form-card">
        <div className="crud-form-header">
          <div className="crud-badge">
            {isEditing ? 'Atualização via PUT /api/startups/{id}' : 'Novo Registro via POST /api/startups'}
          </div>
          <h1 className="crud-title">
            {isEditing ? `Editar Startup: ${formData.nome}` : 'Cadastrar Nova Startup'}
          </h1>
          <p className="crud-subtitle">
            Preencha os dados abaixo para sincronizar com o banco de dados PostgreSQL e expor no OpenAPI Swagger.
          </p>
        </div>

        {error && (
          <div className="crud-error-box" style={{ marginBottom: '1.5rem' }}>
            <p className="error-title">⚠️ Erro na operação</p>
            <p className="error-message">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="crud-form">
          {/* Section: Identidade */}
          <div className="form-section-title">
            <span>1</span> Informações Principais
          </div>

          <div className="form-row two-cols">
            <div className="form-field">
              <label htmlFor="nome">
                Nome da Startup <span className="req">*</span>
              </label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                placeholder="Ex: NovaFlow AI"
                className={`crud-input ${fieldErrors.nome ? 'input-error' : ''}`}
              />
              {fieldErrors.nome && <span className="field-error-text">{fieldErrors.nome}</span>}
            </div>

            <div className="form-field">
              <label htmlFor="setor">
                Setor de Atuação <span className="req">*</span>
              </label>
              <input
                id="setor"
                type="text"
                value={formData.setor}
                onChange={(e) => handleChange('setor', e.target.value)}
                placeholder="Ex: Logística, FinTech, Saúde Digital..."
                className={`crud-input ${fieldErrors.setor ? 'input-error' : ''}`}
              />
              {fieldErrors.setor && <span className="field-error-text">{fieldErrors.setor}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="descricao">Descrição e Proposta de Valor</label>
            <textarea
              id="descricao"
              rows={4}
              value={formData.descricao || ''}
              onChange={(e) => handleChange('descricao', e.target.value)}
              placeholder="Descreva o problema que a empresa resolve, modelo de monetização e diferenciais competitivos..."
              className="crud-textarea"
            />
          </div>

          <div className="form-row two-cols">
            <div className="form-field">
              <label htmlFor="estagio">
                Estágio de Maturação <span className="req">*</span>
              </label>
              <select
                id="estagio"
                value={formData.estagio}
                onChange={(e) => handleChange('estagio', e.target.value as EstagioStartup)}
                className="crud-select"
              >
                <option value="IDEIA">Ideação (IDEIA)</option>
                <option value="MVP">MVP (Produto Mínimo Viável)</option>
                <option value="SEED">Seed (Tração Inicial)</option>
                <option value="SERIES_A">Série A (Escala & Expansão)</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="website">Website Oficial</label>
              <input
                id="website"
                type="text"
                value={formData.website || ''}
                onChange={(e) => handleChange('website', e.target.value)}
                placeholder="https://suastartup.com.br"
                className="crud-input"
              />
            </div>
          </div>

          {/* Section: Rodada & Finanças */}
          <div className="form-section-title" style={{ marginTop: '2rem' }}>
            <span>2</span> Captação & Equity
          </div>

          <div className="form-row two-cols">
            <div className="form-field">
              <label htmlFor="captacaoObjetivo">Objetivo de Captação (R$)</label>
              <input
                id="captacaoObjetivo"
                type="number"
                step="1000"
                min="0"
                value={formData.captacaoObjetivo ?? ''}
                onChange={(e) =>
                  handleChange(
                    'captacaoObjetivo',
                    e.target.value === '' ? null : parseFloat(e.target.value)
                  )
                }
                placeholder="Ex: 1200000"
                className={`crud-input ${fieldErrors.captacaoObjetivo ? 'input-error' : ''}`}
              />
              {fieldErrors.captacaoObjetivo && (
                <span className="field-error-text">{fieldErrors.captacaoObjetivo}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="equityOferecida">Equity Ofertada (%)</label>
              <input
                id="equityOferecida"
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={formData.equityOferecida ?? ''}
                onChange={(e) =>
                  handleChange(
                    'equityOferecida',
                    e.target.value === '' ? null : parseFloat(e.target.value)
                  )
                }
                placeholder="Ex: 15.0"
                className={`crud-input ${fieldErrors.equityOferecida ? 'input-error' : ''}`}
              />
              {fieldErrors.equityOferecida && (
                <span className="field-error-text">{fieldErrors.equityOferecida}</span>
              )}
            </div>
          </div>

          {/* Section: Localização e Mídia */}
          <div className="form-section-title" style={{ marginTop: '2rem' }}>
            <span>3</span> Localização & Identidade Visual
          </div>

          <div className="form-row two-cols">
            <div className="form-field">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                type="text"
                value={formData.cidade || ''}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="Ex: São Paulo"
                className="crud-input"
              />
            </div>

            <div className="form-field">
              <label htmlFor="estado">Estado (UF)</label>
              <input
                id="estado"
                type="text"
                maxLength={2}
                value={formData.estado || ''}
                onChange={(e) => handleChange('estado', e.target.value.toUpperCase())}
                placeholder="SP"
                className={`crud-input ${fieldErrors.estado ? 'input-error' : ''}`}
              />
              {fieldErrors.estado && <span className="field-error-text">{fieldErrors.estado}</span>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="logoUrl">URL do Logotipo / Imagem</label>
            <input
              id="logoUrl"
              type="text"
              value={formData.logoUrl || ''}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="https://exemplo.com/logo.png"
              className="crud-input"
            />
          </div>

          {/* Form Actions */}
          <div className="crud-form-actions">
            <Link to="/startups" className="btn-crud-secondary">
              Cancelar
            </Link>
            <button
              type="submit"
              className="btn-crud-primary"
              disabled={submitting}
            >
              {submitting ? 'Salvando dados...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Startup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

