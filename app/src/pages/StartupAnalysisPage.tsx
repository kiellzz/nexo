import { useParams, Link } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { PendingStartup, StartupAnalysis } from '../types'
import { mockAnalysis } from '../data/mockData'

type Props = {
  startup?: PendingStartup | null
  pendingStartups?: PendingStartup[]
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}k`
  return `R$ ${value.toLocaleString('pt-BR')}`
}

export function ScoreCircle({ value, label, color }: { value: number; label: string; color: string }) {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="score-circle-wrap" style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 120 120" style={{ width: '100px', height: '100px' }}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--text-primary, #fff)">
          {value}
        </text>
      </svg>
      <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

export function IndicatorBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="match-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
      <span style={{ width: '200px', fontSize: '0.9rem' }}>{label}</span>
      <div className="progress-bar" style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
      <strong style={{ width: '60px', textAlign: 'right', fontSize: '0.9rem' }}>{value}/100</strong>
    </div>
  )
}

export function SwotCard({
  title,
  items,
  icon,
  borderCol,
}: {
  title: string
  items: string[]
  icon: string
  borderCol: string
}) {
  return (
    <div style={{ padding: '1.25rem', background: 'var(--surface-2, rgba(255,255,255,0.03))', borderRadius: '10px', borderLeft: `4px solid ${borderCol}` }}>
      <h4 style={{ margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{icon}</span> {title}
      </h4>
      <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-secondary, #cbd5e1)' }}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export function ScenarioCard({
  title,
  icon,
  growth12,
  growth24,
  revenue12,
  revenue24,
  accentColor,
}: {
  title: string
  icon: string
  growth12: number
  growth24: number
  revenue12: number
  revenue24: number
  accentColor: string
}) {
  return (
    <div style={{ padding: '1.25rem', background: 'var(--surface-2, rgba(255,255,255,0.03))', borderRadius: '10px', borderTop: `4px solid ${accentColor}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <strong style={{ fontSize: '1.1rem' }}>Cenário {title}</strong>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projeção 12m</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: accentColor, margin: '0.2rem 0' }}>+{growth12}%</strong>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{formatCurrency(revenue12)}</small>
        </div>
        <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projeção 24m</span>
          <strong style={{ display: 'block', fontSize: '1.4rem', color: accentColor, margin: '0.2rem 0' }}>+{growth24}%</strong>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{formatCurrency(revenue24)}</small>
        </div>
      </div>
    </div>
  )
}

export function ProjectionChart({ analysis }: { analysis: StartupAnalysis }) {
  const currentRevenue = 1_200_000
  const data = [
    { name: 'Hoje', pessimista: currentRevenue, realista: currentRevenue, otimista: currentRevenue },
    {
      name: '6m',
      pessimista: Math.round(currentRevenue * (1 + analysis.projections.months12.pessimistic / 100 / 2)),
      realista: Math.round(currentRevenue * (1 + analysis.projections.months12.realistic / 100 / 2)),
      otimista: Math.round(currentRevenue * (1 + analysis.projections.months12.optimistic / 100 / 2)),
    },
    {
      name: '12m',
      pessimista: analysis.revenueProjection.months12.pessimistic,
      realista: analysis.revenueProjection.months12.realistic,
      otimista: analysis.revenueProjection.months12.optimistic,
    },
    {
      name: '18m',
      pessimista: Math.round(
        (analysis.revenueProjection.months12.pessimistic + analysis.revenueProjection.months24.pessimistic) / 2,
      ),
      realista: Math.round(
        (analysis.revenueProjection.months12.realistic + analysis.revenueProjection.months24.realistic) / 2,
      ),
      otimista: Math.round(
        (analysis.revenueProjection.months12.optimistic + analysis.revenueProjection.months24.optimistic) / 2,
      ),
    },
    {
      name: '24m',
      pessimista: analysis.revenueProjection.months24.pessimistic,
      realista: analysis.revenueProjection.months24.realistic,
      otimista: analysis.revenueProjection.months24.optimistic,
    },
  ]

  return (
    <div style={{ width: '100%', height: 280, marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} />
          <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 11, fill: '#94a3b8' }} width={80} />
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="pessimista" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="🔴 Pessimista" />
          <Line type="monotone" dataKey="realista" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} name="🟡 Realista" />
          <Line type="monotone" dataKey="otimista" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="🟢 Otimista" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function StartupAnalysisPage({ startup: propStartup, pendingStartups = [] }: Props) {
  const { id } = useParams<{ id: string }>()

  let targetStartup: PendingStartup | null = propStartup ?? null

  if (!targetStartup && id) {
    targetStartup = pendingStartups.find((s) => s.id === id) ?? null
  }

  if (!targetStartup && id) {
    targetStartup = {
      id,
      submittedAt: new Date().toISOString(),
      status: 'approved',
      analysis: mockAnalysis,
      formData: {
        name: id === '1' ? 'NovaFlow' : id === '2' ? 'VitaSol' : id === '3' ? 'GreenGrid' : `Startup #${id}`,
        sector: id === '1' ? 'Logística IA' : id === '2' ? 'Saúde Digital' : 'Energia Limpa',
        city: 'São Paulo - SP',
        website: 'empresa.com.br',
        description: 'Plataforma líder em otimização com inteligência artificial e alto crescimento.',
        annualRevenue: '1200000',
        momGrowth: '14',
        customerCount: '85',
        monthlyCosts: '60000',
        targetAmount: '1500000',
        equityOffered: '10',
        stage: 'Série A',
        businessModel: 'SaaS B2B',
      },
    }
  }

  const activeStartup = targetStartup ?? {
    id: 'default',
    submittedAt: new Date().toISOString(),
    status: 'approved' as const,
    analysis: mockAnalysis,
    formData: {
      name: 'NovaFlow',
      sector: 'Logística IA',
      city: 'São Paulo - SP',
      website: 'novaflow.ai',
      description: 'Plataforma de otimização de rotas com IA para frotas corporativas.',
      annualRevenue: '1200000',
      momGrowth: '16',
      customerCount: '62',
      monthlyCosts: '70000',
      targetAmount: '1800000',
      equityOffered: '12',
      stage: 'Série A' as const,
      businessModel: 'SaaS B2B',
    },
  }

  const analysis = activeStartup.analysis ?? mockAnalysis
  const { formData } = activeStartup

  return (
    <section className="screen-shell" style={{ maxWidth: '1050px', margin: '0 auto' }}>
      {/* Hero */}
      <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '1.5rem 2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', background: 'var(--accent, #6366f1)', color: '#fff' }}>
            {formData.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0 }}>{formData.name}</h2>
              <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 600 }}>
                Homologada
              </span>
            </div>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>
              {formData.sector} • {formData.city} • Estágio {formData.stage}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/oportunidades" className="btn btn-secondary small">Explorar Rodadas</Link>
          <Link to="/buscar" className="btn btn-primary small">Conectar com Fundadores</Link>
        </div>
      </div>

      {/* Pontuação Geral - IA */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🤖</span> Raio-X Diagnóstico por Inteligência Artificial
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Auditoria algorítmica de métricas, saúde financeira, risco de mercado e projeção de retorno para investidores.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
          <ScoreCircle value={analysis.score} label="Score Geral" color="#6366f1" />
          <ScoreCircle value={analysis.healthScore} label="Saúde Financeira" color="#22c55e" />
          <ScoreCircle value={analysis.growthScore} label="Potencial Expansão" color="#3b82f6" />
          <ScoreCircle value={100 - analysis.riskScore} label="Índice de Segurança" color="#eab308" />
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          <IndicatorBar label="Saúde Financeira & Unit Economics" value={analysis.healthScore} color="#22c55e" />
          <IndicatorBar label="Potencial de Escala & Crescimento" value={analysis.growthScore} color="#3b82f6" />
          <IndicatorBar label="Atratividade do Segmento" value={Math.min(analysis.growthScore + 6, 98)} color="#a855f7" />
          <IndicatorBar label="Nível de Risco Operacional" value={analysis.riskScore} color="#ef4444" />
        </div>
      </div>

      {/* Síntese e Mercado */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--accent, #6366f1)' }}>📋 Síntese do Negócio para Investidores</h4>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{analysis.summary}</p>
        </div>
        <div className="panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: 'var(--accent, #6366f1)' }}>🌐 Mercado e Oportunidade de Saída</h4>
          <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{analysis.marketAssessment}</p>
        </div>
      </div>

      {/* Matriz SWOT */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <h3 style={{ marginTop: 0 }}>Matriz SWOT Analítica</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <SwotCard title="Pontos Fortes" icon="💪" items={analysis.strengths} borderCol="#22c55e" />
          <SwotCard title="Pontos Fracos" icon="⚠️" items={analysis.weaknesses} borderCol="#ef4444" />
          <SwotCard title="Oportunidades" icon="🚀" items={analysis.opportunities} borderCol="#3b82f6" />
          <SwotCard title="Ameaças" icon="🛡️" items={analysis.threats} borderCol="#eab308" />
        </div>
      </div>

      {/* Projeção de Faturamento com Gráfico */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <h3 style={{ marginTop: 0 }}>📊 Projeção de Faturamento e Previsões (24 Meses)</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Curvas preditivas baseadas na taxa histórica de crescimento ({formData.momGrowth}% MoM) ajustada por volatilidade de mercado.
        </p>
        <ProjectionChart analysis={analysis} />
      </div>

      {/* Cenários Pessimista, Realista e Otimista */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.5rem 2rem' }}>
        <h3 style={{ marginTop: 0 }}>🎯 Cenários de Retorno para o Investidor</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
          <ScenarioCard
            title="Pessimista"
            icon="🔴"
            accentColor="#ef4444"
            growth12={analysis.projections.months12.pessimistic}
            growth24={analysis.projections.months24.pessimistic}
            revenue12={analysis.revenueProjection.months12.pessimistic}
            revenue24={analysis.revenueProjection.months24.pessimistic}
          />
          <ScenarioCard
            title="Realista"
            icon="🟡"
            accentColor="#eab308"
            growth12={analysis.projections.months12.realistic}
            growth24={analysis.projections.months24.realistic}
            revenue12={analysis.revenueProjection.months12.realistic}
            revenue24={analysis.revenueProjection.months24.realistic}
          />
          <ScenarioCard
            title="Otimista"
            icon="🟢"
            accentColor="#22c55e"
            growth12={analysis.projections.months12.optimistic}
            growth24={analysis.projections.months24.optimistic}
            revenue12={analysis.revenueProjection.months12.optimistic}
            revenue24={analysis.revenueProjection.months24.optimistic}
          />
        </div>

        {/* Projeção de Valuation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valuation Est. (24m Pessimista)</span>
            <strong style={{ display: 'block', fontSize: '1.25rem', color: '#ef4444', marginTop: '0.25rem' }}>
              {formatCurrency(analysis.valuationProjection.months24.pessimistic)}
            </strong>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent, #6366f1)' }}>Valuation Est. (24m Realista)</span>
            <strong style={{ display: 'block', fontSize: '1.35rem', color: '#fff', marginTop: '0.25rem' }}>
              {formatCurrency(analysis.valuationProjection.months24.realistic)}
            </strong>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valuation Est. (24m Otimista)</span>
            <strong style={{ display: 'block', fontSize: '1.25rem', color: '#22c55e', marginTop: '0.25rem' }}>
              {formatCurrency(analysis.valuationProjection.months24.optimistic)}
            </strong>
          </div>
        </div>
      </div>
    </section>
  )
}
