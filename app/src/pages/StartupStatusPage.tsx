import { Link } from 'react-router-dom'
import type { PendingStartup } from '../types'

type Props = {
  startup: PendingStartup | null
}

const statusConfig = {
  pending: {
    icon: '⏳',
    label: 'Aguardando Avaliação',
    description: 'Seu cadastro foi submetido com sucesso e está na fila para moderação do comitê administrativo.',
    color: 'status-pending',
    tagBg: 'rgba(234, 179, 8, 0.15)',
    tagColor: '#eab308',
  },
  analyzing: {
    icon: '📊',
    label: 'Análise Estatística Concluída',
    description: 'As estatísticas e probabilidades de crescimento foram geradas. Aguardando aprovação final do comitê.',
    color: 'status-analyzing',
    tagBg: 'rgba(99, 102, 241, 0.15)',
    tagColor: '#6366f1',
  },
  approved: {
    icon: '✅',
    label: 'Aprovada para Captação',
    description: 'Parabéns! Sua startup foi homologada e suas estatísticas já estão disponíveis para investidores qualificados.',
    color: 'status-approved',
    tagBg: 'rgba(34, 197, 94, 0.15)',
    tagColor: '#22c55e',
  },
  rejected: {
    icon: '❌',
    label: 'Reprovada na Triagem',
    description: 'Infelizmente sua startup não atendeu aos critérios mínimos de maturidade ou compliance.',
    color: 'status-rejected',
    tagBg: 'rgba(239, 68, 68, 0.15)',
    tagColor: '#ef4444',
  },
}

export function StartupStatusPage({ startup }: Props) {
  if (!startup) {
    return (
      <section className="screen-shell">
        <div className="status-card panel" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h2>Nenhum cadastro ativo</h2>
          <p style={{ color: 'var(--text-muted)' }}>Você ainda não submeteu os dados da sua startup para o processo de validação.</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/cadastro-startup" className="btn btn-primary">Cadastrar Startup</Link>
          </div>
        </div>
      </section>
    )
  }

  const config = statusConfig[startup.status]
  const submittedDate = new Date(startup.submittedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <section className="screen-shell">
      <div className="status-card panel" style={{ maxWidth: '650px', margin: '2rem auto', textAlign: 'center', padding: '2.5rem' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{config.icon}</div>
        <h2 style={{ marginBottom: '0.25rem' }}>{startup.formData.name}</h2>
        <div style={{ display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '999px', background: config.tagBg, color: config.tagColor, fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {config.label}
        </div>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary, #cbd5e1)' }}>{config.description}</p>

        {startup.status === 'rejected' && startup.rejectionReason && (
          <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', textAlign: 'left' }}>
            <strong style={{ color: '#ef4444' }}>Parecer do comitê:</strong>
            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>{startup.rejectionReason}</p>
          </div>
        )}

        <div style={{ margin: '2rem 0', padding: '1rem', background: 'var(--surface-2, rgba(255,255,255,0.03))', borderRadius: '8px', display: 'flex', justifyContent: 'space-around', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Data de Envio</span>
            <strong>{submittedDate}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Protocolo</span>
            <strong>{startup.id}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Índice Estatístico</span>
            <strong style={{ color: 'var(--accent, #6366f1)' }}>{startup.analysis?.score ?? '—'}/100</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {startup.analysis && (
            <Link to={`/analise/${startup.id}`} className="btn btn-primary">
              📊 Visualizar Estatísticas e Previsões
            </Link>
          )}
          {startup.status === 'rejected' && (
            <Link to="/cadastro-startup" className="btn btn-secondary">
              Corrigir e Reenviar
            </Link>
          )}
          <Link to="/admin" className="btn btn-secondary" style={{ opacity: 0.7 }}>
            Acessar Painel Admin (Moderação)
          </Link>
        </div>
      </div>
    </section>
  )
}
