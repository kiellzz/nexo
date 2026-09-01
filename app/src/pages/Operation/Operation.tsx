import { useMemo, useState } from 'react'
import type { InvestorType, StartupStage } from '../../types'
import { affinityTable, calculateMatchScore } from '../../utils/matchScore'

const criteria = [
  {
    value: '35%',
    title: 'Segmentos em comum',
    description: 'Cruzamos áreas como IA, Fintech, B2B e Saúde para medir sobreposição real de tese.',
  },
  {
    value: '25%',
    title: 'Faixa de investimento',
    description: 'Comparamos ticket disponível e valor buscado para entender se a conversa cabe no orçamento.',
  },
  {
    value: '25%',
    title: 'Tipo x estágio',
    description: 'Relacionamos Anjo, Fundo ou Family Office com Pré-semente, Seed, Série A e Expansion.',
  },
  {
    value: '10%',
    title: 'Localização',
    description: 'A proximidade geográfica ajuda quando rede local, reuniões e mercado regional fazem diferença.',
  },
  {
    value: '5%',
    title: 'Completude do perfil',
    description: 'Perfis completos ganham confiança porque reduzem ruído antes da primeira conversa.',
  },
]

const flowSteps = [
  {
    title: 'Descoberta curada',
    description: 'Cada lado vê perfis priorizados pelo score, não uma lista aleatória de contatos.',
  },
  {
    title: 'Interesse privado',
    description: 'Startup e investidor podem curtir ou passar sem expor e-mail, telefone ou dados sensíveis.',
  },
  {
    title: 'Match mútuo',
    description: 'A conexão só abre quando os dois demonstram interesse no perfil um do outro.',
  },
  {
    title: 'Contato liberado',
    description: 'Depois do match, a conversa começa com contexto de compatibilidade e critérios visíveis.',
  },
]

const investorTypes: InvestorType[] = ['Anjo', 'Fundo', 'Family Office']
const startupStages: StartupStage[] = ['Pré-semente', 'Seed', 'Série A', 'Expansion']

function OperationExample() {
  const [investorType, setInvestorType] = useState<InvestorType>('Fundo')
  const [startupStage, setStartupStage] = useState<StartupStage>('Série A')

  const sampleMatch = useMemo(() => {
    const investor = {
      investorType,
      focus: ['IA', 'Fintech', 'B2B'],
      ticketMin: 500_000,
      ticketMax: 1_800_000,
      city: 'São Paulo - SP',
      profileCompleteness: 0.92,
    }
    const startup = {
      stage: startupStage,
      sectors: ['IA', 'B2B', 'Logística'],
      investmentMin: 700_000,
      investmentMax: 1_400_000,
      city: 'São Paulo - SP',
      profileCompleteness: 0.88,
    }

    return {
      score: calculateMatchScore(investor, startup),
      stageAffinity: Math.round(affinityTable[investorType][startupStage] * 100),
    }
  }, [investorType, startupStage])

  return (
    <section className="operation-section operation-example-section">
      <div>
        <span className="label-badge">Exemplo ao vivo</span>
        <h2>Teste uma combinação simples</h2>
        <p>
          O exemplo mantém segmentos, ticket, localização e completude constantes para mostrar como a afinidade
          entre tipo de investidor e estágio altera o resultado final.
        </p>
      </div>

      <div className="operation-example-card">
        <div className="operation-example-controls">
          <label>
            Tipo de investidor
            <select value={investorType} onChange={(event) => setInvestorType(event.target.value as InvestorType)}>
              {investorTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Estágio da startup
            <select value={startupStage} onChange={(event) => setStartupStage(event.target.value as StartupStage)}>
              {startupStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="operation-score-preview">
          <div className="operation-score-ring" style={{ ['--score' as string]: `${sampleMatch.score}%` }}>
            <strong>{sampleMatch.score}%</strong>
            <span>match</span>
          </div>
          <div>
            <h3>Compatibilidade estimada</h3>
            <p>
              A afinidade estágio x investidor nesta configuração é de{' '}
              <strong>{sampleMatch.stageAffinity}%</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function OperationPage() {
  return (
    <main className="screen-shell operation-page">
      <section className="operation-hero">
        <div>
          <span className="label-badge">Matchmaking Nexo</span>
          <h1>Compatibilidade antes da conexão.</h1>
          <p>
            O Nexo aproxima startups e investidores por sinais objetivos de fit: tese, ticket, estágio, localização
            e qualidade do perfil. Nada de lista aleatória disfarçada de recomendação.
          </p>
        </div>
        <div className="operation-hero-panel" aria-label="Resumo da fórmula de compatibilidade">
          <span>Score final</span>
          <strong>0-100%</strong>
          <p>Quanto maior o score, maior a chance de a conversa começar com contexto certo para os dois lados.</p>
        </div>
      </section>

      <section className="operation-section">
        <div className="section-header compact">
          <div>
            <span className="label-badge">Como calculamos o match</span>
            <h2>Cinco sinais, um score priorizado</h2>
            <p className="section-desc">
              Cada critério entra com um peso claro para equilibrar tese, capacidade de investimento e momento da
              startup.
            </p>
          </div>
        </div>

        <div className="operation-criteria-grid">
          {criteria.map((item) => (
            <article key={item.title} className="operation-criterion-card">
              <span>{item.value}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="operation-section">
        <div className="section-header compact">
          <div>
            <span className="label-badge">Fluxo de match</span>
            <h2>O contato só aparece quando o interesse é mútuo</h2>
            <p className="section-desc">
              O swipe preserva privacidade: curtir um perfil não revela dados de contato até que o outro lado também
              demonstre interesse.
            </p>
          </div>
        </div>

        <div className="operation-flow">
          {flowSteps.map((step, index) => (
            <article key={step.title} className="operation-flow-step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <OperationExample />
    </main>
  )
}
