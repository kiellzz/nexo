import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StartupFormData, StartupStage, PendingStartup } from '../types'
import { analyzeStartup } from '../services/geminiService'

const STEPS = ['Identidade', 'Financeiro', 'Captação', 'Revisão']

const emptyForm: StartupFormData = {
  name: '',
  sector: '',
  city: '',
  website: '',
  description: '',
  annualRevenue: '',
  momGrowth: '',
  customerCount: '',
  monthlyCosts: '',
  targetAmount: '',
  equityOffered: '',
  stage: 'Seed',
  businessModel: '',
}

type Props = {
  onSubmit: (startup: PendingStartup) => void
}

export function StartupRegisterPage({ onSubmit }: Props) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<StartupFormData>(emptyForm)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update(field: keyof StartupFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const analysis = await analyzeStartup(form)
      const pending: PendingStartup = {
        id: `ps-${Date.now()}`,
        submittedAt: new Date().toISOString(),
        status: 'analyzing',
        analysis,
        formData: form,
      }
      onSubmit(pending)
      navigate('/status-analise')
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <div className="register-card panel" style={{ maxWidth: '780px', margin: '0 auto', width: '100%' }}>
        <div className="stepper" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '0.5rem' }}>
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`step-dot ${i === step ? 'active' : i < step ? 'done' : ''}`}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.75rem 0.5rem',
                borderRadius: '8px',
                background: i === step ? 'var(--accent-muted, rgba(99,102,241,0.15))' : 'var(--surface-2, rgba(255,255,255,0.05))',
                border: i === step ? '1px solid var(--accent, #6366f1)' : '1px solid transparent',
              }}
            >
              <span style={{ fontWeight: 700, display: 'block', fontSize: '1.1rem' }}>0{i + 1}</span>
              <p style={{ margin: 0, fontSize: '0.85rem', color: i === step ? 'var(--accent, #6366f1)' : 'var(--text-muted, #94a3b8)' }}>{s}</p>
            </div>
          ))}
        </div>

        <h2 style={{ marginBottom: '1.5rem' }}>Passo {step + 1}: {STEPS[step]}</h2>

        {step === 0 && (
          <div className="form-step">
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Nome da startup</label>
                <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Ex: NovaFlow" />
              </div>
              <div className="field-group">
                <label>Segmento de atuação</label>
                <input value={form.sector} onChange={(e) => update('sector', e.target.value)} placeholder="Ex: Logística IA, FinTech, HealthTech" />
              </div>
            </div>
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Cidade / Estado</label>
                <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="São Paulo - SP" />
              </div>
              <div className="field-group">
                <label>Site ou Landing Page</label>
                <input value={form.website} onChange={(e) => update('website', e.target.value)} placeholder="https://minhaempresa.com.br" />
              </div>
            </div>
            <div className="field-group">
              <label>Descrição detalhada da startup e proposta de valor</label>
              <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Explique o que sua startup faz, o problema que resolve e como monetiza." />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="form-step">
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Faturamento Anual Bruto (R$)</label>
                <input type="number" value={form.annualRevenue} onChange={(e) => update('annualRevenue', e.target.value)} placeholder="480000" />
              </div>
              <div className="field-group">
                <label>Crescimento Médio Mensal (MoM %)</label>
                <input type="number" value={form.momGrowth} onChange={(e) => update('momGrowth', e.target.value)} placeholder="15" />
              </div>
            </div>
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Número de Clientes Ativos</label>
                <input type="number" value={form.customerCount} onChange={(e) => update('customerCount', e.target.value)} placeholder="45" />
              </div>
              <div className="field-group">
                <label>Custos Operacionais Mensais (R$)</label>
                <input type="number" value={form.monthlyCosts} onChange={(e) => update('monthlyCosts', e.target.value)} placeholder="32000" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Valor Pretendido de Captação (R$)</label>
                <input type="number" value={form.targetAmount} onChange={(e) => update('targetAmount', e.target.value)} placeholder="1200000" />
              </div>
              <div className="field-group">
                <label>Participação Societária Ofertada (Equity %)</label>
                <input type="number" value={form.equityOffered} onChange={(e) => update('equityOffered', e.target.value)} placeholder="15" />
              </div>
            </div>
            <div className="field-grid two-col">
              <div className="field-group">
                <label>Estágio Atual de Maturidade</label>
                <select value={form.stage} onChange={(e) => update('stage', e.target.value as StartupStage)}>
                  <option value="Pré-semente">Pré-semente</option>
                  <option value="Seed">Seed</option>
                  <option value="Série A">Série A</option>
                  <option value="Expansion">Expansion</option>
                </select>
              </div>
              <div className="field-group">
                <label>Modelo de Negócio</label>
                <input value={form.businessModel} onChange={(e) => update('businessModel', e.target.value)} placeholder="Ex: SaaS B2B, Marketplace, Assinatura" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step review-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="review-block" style={{ padding: '1rem', background: 'var(--surface-2, rgba(255,255,255,0.03))', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent, #6366f1)' }}>1. Identidade</h4>
              <p><strong>Nome:</strong> {form.name || 'Não preenchido'}</p>
              <p><strong>Segmento:</strong> {form.sector || 'Não preenchido'} • <strong>Cidade:</strong> {form.city || 'Não preenchido'}</p>
              <p><strong>Descrição:</strong> {form.description || 'Não preenchido'}</p>
            </div>
            <div className="review-block" style={{ padding: '1rem', background: 'var(--surface-2, rgba(255,255,255,0.03))', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent, #6366f1)' }}>2. Métricas Financeiras</h4>
              <p><strong>Faturamento Anual:</strong> R$ {Number(form.annualRevenue || 0).toLocaleString('pt-BR')}</p>
              <p><strong>Crescimento MoM:</strong> {form.momGrowth}% ao mês</p>
              <p><strong>Clientes Ativos:</strong> {form.customerCount} • <strong>Custos Mensais:</strong> R$ {Number(form.monthlyCosts || 0).toLocaleString('pt-BR')}</p>
            </div>
            <div className="review-block" style={{ padding: '1rem', background: 'var(--surface-2, rgba(255,255,255,0.03))', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent, #6366f1)' }}>3. Proposta de Captação</h4>
              <p><strong>Valor Desejado:</strong> R$ {Number(form.targetAmount || 0).toLocaleString('pt-BR')}</p>
              <p><strong>Equity Ofertado:</strong> {form.equityOffered}%</p>
              <p><strong>Estágio:</strong> {form.stage} • <strong>Modelo:</strong> {form.businessModel || 'Não preenchido'}</p>
            </div>
          </div>
        )}

        <div className="step-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          {step > 0 ? (
            <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
              Voltar
            </button>
          ) : <div />}
          {step < 3 ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (step === 0 && !form.name) {
                  alert('Por favor informe o nome da startup')
                  return
                }
                setStep((s) => s + 1)
              }}
            >
              Próximo
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? '🤖 Analisando com IA...' : 'Submeter para Análise e Validação'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
