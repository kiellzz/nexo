import { useState } from 'react'
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import './App.css'
import { StartupRegisterPage } from './pages/StartupRegisterPage'
import { StartupStatusPage } from './pages/StartupStatusPage'
import { AdminPage } from './pages/AdminPage'
import {
  StartupAnalysisPage,
  ScoreCircle,
  IndicatorBar,
  SwotCard,
  ScenarioCard,
  ProjectionChart,
} from './pages/StartupAnalysisPage'
import { mockPendingStartups, mockAnalysis } from './data/mockData'
import type { PendingStartup, ApprovalStatus } from './types'

type UserRole = 'startup' | 'investor' | 'admin'

type Startup = {
  id: number
  name: string
  sector: string
  stage: string
  city: string
  match: number
  investment: string
  description: string
  team: string
  model: string
}

type Investor = {
  id: number
  name: string
  type: string
  focus: string[]
  city: string
  match: number
  ticket: string
  thesis: string
  description: string
}

type Opportunity = {
  id: number
  name: string
  type: string
  sector: string
  description: string
  location: string
  value: string
  stage: string
  match: number
  date: string
  status: string
}

type MatchItem = {
  id: number
  name: string
  type: string
  match: number
  reasons: { label: string; value: number }[]
}

const startups: Startup[] = [
  {
    id: 1,
    name: 'NovaFlow',
    sector: 'Logística IA',
    stage: 'Série A',
    city: 'São Paulo - SP',
    match: 92,
    investment: 'R$ 1,2M',
    description: 'Plataforma de otimização de rotas com inteligência artificial para transporte urbano.',
    team: '18 pessoas',
    model: 'SaaS B2B',
  },
  {
    id: 2,
    name: 'VitaSol',
    sector: 'Saúde digital',
    stage: 'Pré-semente',
    city: 'Rio de Janeiro - RJ',
    match: 88,
    investment: 'R$ 450k',
    description: 'Monitoramento remoto de pacientes e triagem inteligente para clínicas e redes.',
    team: '11 pessoas',
    model: 'B2B2C',
  },
  {
    id: 3,
    name: 'GreenGrid',
    sector: 'Energia limpa',
    stage: 'Seed',
    city: 'Belo Horizonte - MG',
    match: 86,
    investment: 'R$ 780k',
    description: 'Infraestrutura de gestão energética para condomínios e pequenas redes industriais.',
    team: '22 pessoas',
    model: 'Marketplace energético',
  },
]

const investors: Investor[] = [
  {
    id: 1,
    name: 'Helena Costa',
    type: 'Anjo',
    focus: ['IA', 'Saúde', 'B2B'],
    city: 'Belo Horizonte - MG',
    match: 91,
    ticket: 'R$ 300k - R$ 1M',
    thesis: 'Investimento em negócios com escalabilidade e defensabilidade operacional.',
    description: 'Investidora especialista em negócios de operação leve e forte potencial de automação.',
  },
  {
    id: 2,
    name: 'Atlas Ventures',
    type: 'Fundo',
    focus: ['Sustentabilidade', 'Energia', 'Clima'],
    city: 'São Paulo - SP',
    match: 89,
    ticket: 'R$ 2M - R$ 8M',
    thesis: 'Foco em energia, infraestrutura e plataformas que reduzem desperdício e melhoram eficiência.',
    description: 'Fundo de capital com foco em energia, infraestrutura e impactos ambientais.',
  },
  {
    id: 3,
    name: 'North Capital',
    type: 'Fundo',
    focus: ['Fintech', 'Logística', 'Enterprise'],
    city: 'Curitiba - PR',
    match: 84,
    ticket: 'R$ 1M - R$ 5M',
    thesis: 'Apoia empresas em fase de expansão com base em dados e eficiência operacional.',
    description: 'Fundo com foco em expansão e empresas de software e operação inteligente.',
  },
]

const opportunities: Opportunity[] = [
  {
    id: 1,
    name: 'Rodovias do Futuro',
    type: 'Round',
    sector: 'Logística',
    description: 'Abertura de rodada para escala do produto em logística urbana e entregas inteligentes.',
    location: 'São Paulo - SP',
    value: 'R$ 1,8M',
    stage: 'Série A',
    match: 94,
    date: '12 mar',
    status: 'Ativa',
  },
  {
    id: 2,
    name: 'Acesso Saúde',
    type: 'Aceleração',
    sector: 'Saúde',
    description: 'Programa de aceleração para clínicas e plataformas de triagem digital.',
    location: 'Rio de Janeiro - RJ',
    value: 'R$ 600k',
    stage: 'Seed',
    match: 90,
    date: '18 mar',
    status: 'Nova',
  },
  {
    id: 3,
    name: 'Energia Inteligente',
    type: 'Investimento',
    sector: 'Energia',
    description: 'Oportunidade para crescimento de operação em gestão energética de prediais e fábricas.',
    location: 'Belo Horizonte - MG',
    value: 'R$ 2,2M',
    stage: 'Série A',
    match: 87,
    date: '22 mar',
    status: 'Ativa',
  },
]

const matchCards: MatchItem[] = [
  {
    id: 1,
    name: 'NovaFlow',
    type: 'startup',
    match: 92,
    reasons: [
      { label: 'Segmento', value: 96 },
      { label: 'Localização', value: 88 },
      { label: 'Estágio', value: 91 },
    ],
  },
  {
    id: 2,
    name: 'VitaSol',
    type: 'startup',
    match: 90,
    reasons: [
      { label: 'Segmento', value: 94 },
      { label: 'Localização', value: 82 },
      { label: 'Estágio', value: 90 },
    ],
  },
  {
    id: 3,
    name: 'Helena Costa',
    type: 'investor',
    match: 91,
    reasons: [
      { label: 'Área', value: 96 },
      { label: 'Ticket', value: 86 },
      { label: 'Faixa', value: 89 },
    ],
  },
]

const matches = [
  { label: 'Segmento', value: 96 },
  { label: 'Localização', value: 88 },
  { label: 'Estágio', value: 91 },
  { label: 'Ticket', value: 81 },
  { label: 'Mercado', value: 93 },
]

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  const [activeRole, setActiveRole] = useState<UserRole>('startup')
  const [pendingStartups, setPendingStartups] = useState<PendingStartup[]>(mockPendingStartups)
  const [currentStartup, setCurrentStartup] = useState<PendingStartup | null>(mockPendingStartups[0])
  const navigate = useNavigate()

  function handleRegisterStartup(newStartup: PendingStartup) {
    setPendingStartups((prev) => [newStartup, ...prev])
    setCurrentStartup(newStartup)
  }

  function handleUpdateStatus(id: string, status: ApprovalStatus, reason?: string) {
    setPendingStartups((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, rejectionReason: reason } : s))
    )
    if (currentStartup?.id === id) {
      setCurrentStartup((prev) => (prev ? { ...prev, status, rejectionReason: reason } : null))
    }
  }

  // Startups exibidas no catálogo para investidores (as mockadas + aprovadas pelo admin)
  const approvedStartups: Startup[] = [
    ...startups,
    ...pendingStartups
      .filter((s) => s.status === 'approved')
      .map((s, index) => ({
        id: 1000 + index,
        name: s.formData.name,
        sector: s.formData.sector,
        stage: s.formData.stage,
        city: s.formData.city,
        match: s.analysis?.score ?? 89,
        investment: `R$ ${(Number(s.formData.targetAmount || 0) / 1000).toFixed(0)}k`,
        description: s.formData.description,
        team: `${s.formData.customerCount || 10} clientes`,
        model: s.formData.businessModel || 'SaaS B2B',
      }))
  ]

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Ir para a página inicial">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo" />
          <span className="brand-name">Nexo</span>
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#sobre" className="nav-link">O que é a Nexo</a>
          <a href="#como-funciona" className="nav-link">Como funciona</a>
          <a href="#beneficios" className="nav-link">Benefícios</a>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-secondary">Entrar</Link>
          <Link to="/signup" className="btn btn-primary">Criar conta</Link>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setActiveRole={(role) => {
            setActiveRole(role)
            if (role === 'investor') {
              navigate('/buscar')
            } else {
              navigate('/status-analise')
            }
          }} />} />
          <Route path="/signup" element={<SignupPage setActiveRole={(role) => {
            setActiveRole(role)
            if (role === 'investor') {
              navigate('/buscar')
            } else {
              navigate('/cadastro-startup')
            }
          }} />} />
          <Route path="/dashboard" element={<DashboardPage activeRole={activeRole} />} />
          <Route path="/buscar" element={<SearchPage activeRole={activeRole} approvedStartups={approvedStartups} />} />
          <Route path="/oportunidades" element={<OpportunitiesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/interesses" element={<InterestsPage />} />
          <Route path="/perfil/:type/:id" element={<ProfilePage activeRole={activeRole} approvedStartups={approvedStartups} pendingStartups={pendingStartups} />} />
          <Route path="/cadastro-startup" element={<StartupRegisterPage onSubmit={handleRegisterStartup} />} />
          <Route path="/status-analise" element={<StartupStatusPage startup={currentStartup} />} />
          <Route path="/admin" element={<AdminPage pendingStartups={pendingStartups} onUpdateStatus={handleUpdateStatus} />} />
          <Route path="/analise" element={<StartupAnalysisPage startup={currentStartup} pendingStartups={pendingStartups} />} />
          <Route path="/analise/:id" element={<StartupAnalysisPage pendingStartups={pendingStartups} />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <Link to="/" className="footer-brand">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo small" />
          <span className="brand-name">Nexo</span>
        </Link>
        <div className="footer-links">
          <Link to="/privacidade">Termos de uso</Link>
          <Link to="/privacidade">Política de privacidade</Link>
          <Link to="/privacidade">LGPD</Link>
          <Link to="/admin" style={{ opacity: 0.6, fontSize: '0.85rem' }}>Acesso Administrativo</Link>
        </div>
      </footer>
    </div>
  )
}

function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Matchmaking de Investimentos</span>
          <h1>Conectamos startups promissoras aos investidores certos.</h1>
          <p>
            O <strong>NEXO</strong> é uma plataforma bilateral que une startups em busca de captação a investidores qualificados.
            Com validação rigorosa de dados, estatísticas preditivas e métricas auditadas, eliminamos o ruído e aceleramos conexões assertivas.
          </p>
          <div className="hero-stats" style={{ marginTop: '2rem' }}>
            <div>
              <strong>1.2k+</strong>
              <span>Startups auditadas</span>
            </div>
            <div>
              <strong>320+</strong>
              <span>Investidores ativos</span>
            </div>
            <div>
              <strong>94%</strong>
              <span>Assertividade de match</span>
            </div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Prévia visual da plataforma">
          <div className="network-card">
            <div className="node a"></div>
            <div className="node b"></div>
            <div className="node c"></div>
            <div className="node d"></div>
            <div className="connector connector-1"></div>
            <div className="connector connector-2"></div>
            <div className="connector connector-3"></div>
            <div className="connector connector-4"></div>
          </div>
        </div>
      </section>

      {/* O que é o NEXO */}
      <section id="sobre" className="info-panel" style={{ padding: '3.5rem 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          <p className="label">Conheça a plataforma</p>
          <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0' }}>O que é o NEXO?</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Diferente de redes sociais abertas ou planilhas estáticas, o NEXO é um ambiente curado onde cada negócio é validado antes de ser exibido, criando uma ponte de confiança mútua entre fundadores e investidores.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="panel" style={{ padding: '1.75rem', borderTop: '4px solid var(--accent, #6366f1)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🛡️</span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Curadoria & Governança</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Nem toda empresa é listada automaticamente. As startups submetem métricas reais de faturamento, margens, clientes e custos, que passam por triagem e homologação administrativa.
            </p>
          </div>

          <div className="panel" style={{ padding: '1.75rem', borderTop: '4px solid #22c55e' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>📊</span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Estatísticas & Probabilidades</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Modelagem estatística analisa a saúde financeira, defensabilidade do modelo e riscos operacionais da startup, gerando uma matriz SWOT detalhada para cada empresa.
            </p>
          </div>

          <div className="panel" style={{ padding: '1.75rem', borderTop: '4px solid #eab308' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>📈</span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Previsões em 3 Cenários</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Projeções de crescimento de faturamento e valuation em 12 e 24 meses sob cenários 🔴 Pessimista, 🟡 Realista e 🟢 Otimista para embasar a tomada de decisão do investidor.
            </p>
          </div>

          <div className="panel" style={{ padding: '1.75rem', borderTop: '4px solid #3b82f6' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>🤝</span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Matchmaking Assertivo</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Investidores navegam pelo catálogo curado e encontram negócios alinhados à sua tese. Ao demonstrar interesse, a conexão é direta e instantânea com os fundadores.
            </p>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="info-panel" style={{ padding: '3.5rem 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 2.5rem auto' }}>
          <p className="label">Fluxo Simplificado</p>
          <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0' }}>Como o NEXO funciona</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Um processo de 4 passos estruturado para proteger investidores e acelerar a captação de startups sérias.
          </p>
        </div>
        <div className="steps-grid">
          {[
            { step: '01', title: 'Cadastro & Triagem', desc: 'Startups preenchem suas métricas reais e investidores definem suas teses de aporte e áreas de interesse.' },
            { step: '02', title: 'Análise & Homologação', desc: 'O sistema gera estatísticas e probabilidades de crescimento enquanto o comitê administrativo aprova a publicação da startup no catálogo.' },
            { step: '03', title: 'Descoberta no Catálogo', desc: 'Investidores exploram as startups aprovadas, analisam os gráficos de projeção e cenários de retorno.' },
            { step: '04', title: 'Match & Negociação', desc: 'Ao registrar interesse mútuo, o canal seguro é liberado para contato direto entre fundadores e investidores.' },
          ].map((item) => (
            <article key={item.step} className="step-card">
              <span className="step-number">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="benefit-grid" style={{ padding: '3rem 0', borderTop: '1px solid var(--border)' }}>
        <article className="benefit-card blue">
          <p className="label">Para Startups</p>
          <h3>Conecte-se com smart money e acelere sua rodada</h3>
          <ul>
            <li>Exposição direta para investidores-anjo e fundos qualificados</li>
            <li>Diagnóstico gratuito de pontos fortes, fraquezas e riscos via modelagem estatística</li>
            <li>Projeções de crescimento para valorizar seu negócio</li>
            <li>Fim do envio frio de pitch decks que ninguém lê</li>
          </ul>
        </article>

        <article className="benefit-card teal">
          <p className="label">Para Investidores</p>
          <h3>Catálogo qualificado com métricas reais e auditoria</h3>
          <ul>
            <li>Startups pré-filtradas e homologadas com números reais</li>
            <li>Estatísticas de saúde financeira e modelo de negócio auditadas</li>
            <li>Cenários preditivos de faturamento e valuation em 12 e 24 meses</li>
            <li>Filtros refinados por setor, tese, estágio e ticket de investimento</li>
          </ul>
        </article>
      </section>

      {/* CTA Final */}
      <section style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'var(--surface-1, #1e293b)', borderRadius: '16px', margin: '2rem 0' }}>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Pronto para fazer conexões de alto valor?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Crie sua conta agora mesmo. Seja você um fundador buscando investimento inteligente ou um investidor procurando as melhores startups.
        </p>
        <Link to="/signup" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
          Criar minha conta no NEXO ➔
        </Link>
      </section>
    </>
  )
}

function LoginPage({ setActiveRole }: { setActiveRole: (role: UserRole) => void }) {
  const [loginRole, setLoginRole] = useState<UserRole>('startup')

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo large" />
          <span className="brand-name">Nexo</span>
        </div>

        <h2>Entrar na plataforma</h2>

        <div className="field-group">
          <label htmlFor="email">E-mail</label>
          <input id="email" type="email" placeholder="seu@email.com" />
        </div>

        <div className="field-group">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="••••••••" />
        </div>

        <div className="inline-row">
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Lembrar de mim
          </label>
          <button type="button" className="text-link">Esqueci minha senha</button>
        </div>

        <div className="choice-row">
          <button type="button" className={loginRole === 'startup' ? 'choice-option active' : 'choice-option'} onClick={() => setLoginRole('startup')}>
            Startup
          </button>
          <button type="button" className={loginRole === 'investor' ? 'choice-option active' : 'choice-option'} onClick={() => setLoginRole('investor')}>
            Investidor
          </button>
        </div>

        <button type="button" className="btn btn-primary full" onClick={() => setActiveRole(loginRole)}>
          Entrar como {loginRole === 'startup' ? 'Startup' : 'Investidor'}
        </button>

        <p className="muted-text">
          Ainda não tem conta? <Link to="/signup" className="text-link">Cadastre-se</Link>
        </p>
      </div>
    </section>
  )
}

function SignupPage({ setActiveRole }: { setActiveRole: (role: UserRole) => void }) {
  const [signupMode, setSignupMode] = useState<UserRole>('startup')

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-brand center">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo large" />
          <span className="brand-name">Nexo</span>
        </div>

        <h2>Comece a sua jornada</h2>

        <div className="choice-row">
          <button type="button" className={signupMode === 'startup' ? 'choice-option active' : 'choice-option'} onClick={() => setSignupMode('startup')}>
            Sou uma Startup
          </button>
          <button type="button" className={signupMode === 'investor' ? 'choice-option active' : 'choice-option'} onClick={() => setSignupMode('investor')}>
            Sou Investidor
          </button>
        </div>

        {signupMode === 'startup' ? (
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1.25rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '10px', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent, #6366f1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔐</span> Entrada Qualificada & Curadoria de Startups
              </h4>
              <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                No NEXO, nem toda startup é listada automaticamente. Para proteger a tese dos investidores e garantir um catálogo de alta qualidade, sua empresa precisa passar por uma triagem estatística e aprovação do comitê administrativo.
              </p>
              <ul style={{ margin: '0.75rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li>Você preencherá métricas: faturamento, crescimento, custos e captação</li>
                <li>Nossa IA gerará um diagnóstico com Raio-X, SWOT e projeções</li>
                <li>Um administrador revisará os dados antes de expor seu perfil aos investidores</li>
              </ul>
            </div>

            <button
              type="button"
              className="btn btn-primary full"
              style={{ padding: '0.85rem' }}
              onClick={() => setActiveRole('startup')}
            >
              Iniciar Cadastro & Validação da Startup (4 Passos) ➔
            </button>
          </div>
        ) : (
          <>
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="investor-name">Nome completo ou Fundo</label>
                <input id="investor-name" placeholder="Ex: Helena Costa ou Atlas Capital" />
              </div>
              <div className="field-group">
                <label htmlFor="investor-type">Tipo de investidor</label>
                <select id="investor-type" defaultValue="Anjo">
                  <option>Anjo</option>
                  <option>Fundo VC</option>
                  <option>Family Office</option>
                  <option>Corporate Venture</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="areas">Teses / Setores de preferência</label>
              <input id="areas" placeholder="Ex: IA, FinTech, Logística, Saúde" />
            </div>

            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="focus">Ticket médio de aporte</label>
                <input id="focus" placeholder="R$ 300k - R$ 1M" />
              </div>
              <div className="field-group">
                <label htmlFor="city">Localização</label>
                <input id="city" placeholder="São Paulo - SP" />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary full"
              style={{ marginTop: '1rem', padding: '0.85rem' }}
              onClick={() => setActiveRole('investor')}
            >
              Entrar e Acessar Catálogo de Startups ➔
            </button>
          </>
        )}
      </div>
    </section>
  )
}

function DashboardPage({ activeRole }: { activeRole: UserRole }) {
  const dashboardStats =
    activeRole === 'startup'
      ? [
          ['Perfil completo', '87%'],
          ['Visualizações', '1.3k'],
          ['Investidores interessados', '24'],
          ['Matches', '8'],
          ['Oportunidades', '16'],
        ]
      : [
          ['Startups visualizadas', '42'],
          ['Matches', '11'],
          ['Interesses enviados', '9'],
          ['Novas oportunidades', '7'],
          ['Compatibilidade média', '91%'],
        ]

  const recommendations = activeRole === 'startup' ? investors : startups

  return (
    <section className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo small" />
          <span className="brand-name">Nexo</span>
        </div>

        <nav className="sidebar-nav" aria-label="Menu do dashboard">
          {[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Buscar', to: '/buscar' },
            { label: 'Oportunidades', to: '/oportunidades' },
            { label: 'Matches', to: '/matches' },
            { label: 'Interesses', to: '/interesses' },
            { label: 'Configurações', to: '/configuracoes' },
          ].map((item) => (
            <NavLink key={item.label} to={item.to} className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="label">{activeRole === 'startup' ? 'Dashboard da Startup' : 'Dashboard do Investidor'}</p>
            <h2>{activeRole === 'startup' ? 'Resumo executivo' : 'Startups e combinações'}</h2>
          </div>
          <Link to="/buscar" className="btn btn-primary">
            {activeRole === 'startup' ? 'Explorar investidores' : 'Encontrar startups'}
          </Link>
        </header>

        <div className="stats-grid">
          {dashboardStats.map(([label, value]) => (
            <div key={label} className="stat-card">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>

        <div className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h3>{activeRole === 'startup' ? 'Investidores recomendados' : 'Startups recomendadas'}</h3>
              <Link to="/buscar" className="text-link">Ver todos</Link>
            </div>

            {recommendations.map((item) => {
              if (activeRole === 'startup') {
                const investor = item as Investor

                return (
                  <div key={investor.id} className="recommendation-card">
                    <div className="avatar">{investor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                    <div className="recommendation-copy">
                      <h4>{investor.name}</h4>
                      <p>{investor.type} • {investor.city}</p>
                      <div className="tag-row">
                        {investor.focus.map((focus) => (
                          <span key={focus} className="pill lite">{focus}</span>
                        ))}
                      </div>
                    </div>
                    <div className="recommendation-meta">
                      <strong>{investor.match}%</strong>
                      <span>{investor.ticket}</span>
                      <Link to={`/perfil/investor/${investor.id}`} className="btn btn-secondary small">Ver perfil</Link>
                    </div>
                  </div>
                )
              }

              const startup = item as Startup

              return (
                <div key={startup.id} className="recommendation-card">
                  <div className="avatar">{startup.name.slice(0, 2).toUpperCase()}</div>
                  <div className="recommendation-copy">
                    <h4>{startup.name}</h4>
                    <p>{startup.sector} • {startup.city}</p>
                    <div className="tag-row">
                      <span className="pill lite">{startup.stage}</span>
                    </div>
                  </div>
                  <div className="recommendation-meta">
                    <strong>{startup.match}%</strong>
                    <span>{startup.investment}</span>
                    <Link to={`/perfil/startup/${startup.id}`} className="btn btn-secondary small">Ver perfil</Link>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>{activeRole === 'startup' ? 'Oportunidades relacionadas' : 'Áreas de interesse'}</h3>
            </div>
            <div className="mini-list">
              {activeRole === 'startup'
                ? opportunities.map((opp) => (
                    <div key={opp.id} className="mini-item">
                      <div>
                        <strong>{opp.name}</strong>
                        <span>{opp.sector}</span>
                      </div>
                      <span className="mini-badge">{opp.match}%</span>
                    </div>
                  ))
                : ['IA', 'Saúde', 'Logística', 'Energia', 'B2B'].map((area) => (
                    <div key={area} className="mini-item">
                      <div>
                        <strong>{area}</strong>
                        <span>Prioridade de investimento</span>
                      </div>
                      <span className="mini-badge">92%</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SearchPage({ activeRole, approvedStartups }: { activeRole: UserRole; approvedStartups?: Startup[] }) {
  const currentStartups = approvedStartups ?? startups
  const list = activeRole === 'startup' ? investors : currentStartups

  return (
    <section className="search-shell">
      <div className="search-topbar">
        <div>
          <p className="label">{activeRole === 'startup' ? 'Busca de Investidores' : 'Catálogo de Oportunidades'}</p>
          <h2>{activeRole === 'startup' ? 'Encontre investidores com tese alinhada' : 'Startups Homologadas & Auditadas'}</h2>
          {activeRole === 'investor' && (
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Todas as empresas abaixo passaram pelo processo de triagem e possuem estatísticas e projeções validadas disponíveis para investidores.
            </p>
          )}
        </div>
        <div className="search-controls">
          <input type="text" placeholder={activeRole === 'startup' ? 'Pesquisar investidor ou área' : 'Pesquisar por nome, segmento ou modelo'} />
          <button type="button" className="btn btn-primary">Buscar</button>
        </div>
      </div>

      <div className="filters-panel">
        <div className="filter-group">
          <label>{activeRole === 'startup' ? 'Área de interesse' : 'Segmento'}</label>
          <select defaultValue="Todos">
            <option>Todos</option>
            <option>{activeRole === 'startup' ? 'IA' : 'Logística IA'}</option>
            <option>{activeRole === 'startup' ? 'Saúde' : 'Saúde digital'}</option>
            <option>{activeRole === 'startup' ? 'Fintech' : 'Energia limpa'}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Localização</label>
          <select defaultValue="Brasil">
            <option>Brasil</option>
            <option>São Paulo</option>
            <option>Rio de Janeiro</option>
            <option>Belo Horizonte</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{activeRole === 'startup' ? 'Faixa de investimento' : 'Estágio'}</label>
          <select defaultValue="Qualquer">
            <option>Qualquer</option>
            <option>{activeRole === 'startup' ? 'R$ 300k - R$ 1M' : 'Pré-semente'}</option>
            <option>{activeRole === 'startup' ? 'R$ 1M - R$ 5M' : 'Seed'}</option>
            <option>{activeRole === 'startup' ? 'Acima de R$ 5M' : 'Série A'}</option>
          </select>
        </div>
        <button type="button" className="btn btn-secondary">Limpar filtros</button>
      </div>

      <div className="listing-grid">
        {list.map((item) => {
          if (activeRole === 'startup') {
            const investor = item as Investor

            return (
              <article key={investor.id} className="listing-card">
                <div className="card-topline">
                  <span className="pill">{investor.type}</span>
                  <span className="match-badge">{investor.match}%</span>
                </div>
                <h3>{investor.name}</h3>
                <p>{investor.focus.join(', ')} • {investor.city}</p>
                <ul>
                  <li>{investor.city}</li>
                  <li>{investor.ticket}</li>
                  <li>{investor.focus[0]}</li>
                </ul>
                <Link to={`/perfil/investor/${investor.id}`} className="btn btn-secondary small">Ver investidor</Link>
              </article>
            )
          }

          const startup = item as Startup

          return (
            <article key={startup.id} className="listing-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="card-topline">
                <span className="pill">{startup.sector}</span>
                <span className="match-badge" title="Compatibilidade & Score IA">{startup.match}% Match</span>
              </div>
              <h3>{startup.name}</h3>
              <p style={{ flex: 1, color: 'var(--text-secondary)' }}>{startup.description}</p>
              <div style={{ display: 'flex', gap: '0.4rem', margin: '0.5rem 0', flexWrap: 'wrap' }}>
                <span className="pill lite">{startup.stage}</span>
                <span className="pill lite">{startup.city}</span>
                <span className="pill lite" style={{ color: 'var(--accent, #6366f1)', fontWeight: 600 }}>Captação: {startup.investment}</span>
              </div>
              <Link
                to={`/perfil/startup/${startup.id}`}
                className="btn btn-primary small"
                style={{ marginTop: '0.75rem', textAlign: 'center' }}
              >
                📊 Analisar Métricas & Dar Match
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function OpportunitiesPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <p className="label">Oportunidades</p>
          <h2>Investimentos e programas em destaque</h2>
        </div>
      </div>

      <div className="opportunities-panel">
        {opportunities.map((item) => (
          <article key={item.id} className="opportunity-full-card">
            <div className="card-topline">
              <span className="pill">{item.type}</span>
              <span className="match-badge">{item.match}%</span>
            </div>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <div className="meta-grid">
              <div><span>Setor</span><strong>{item.sector}</strong></div>
              <div><span>Localização</span><strong>{item.location}</strong></div>
              <div><span>Valor</span><strong>{item.value}</strong></div>
              <div><span>Status</span><strong>{item.status}</strong></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function MatchesPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <p className="label">Matches</p>
          <h2>Suas melhores combinações</h2>
        </div>
      </div>

      <div className="match-grid">
        {matchCards.map((match) => (
          <article key={match.id} className="match-card">
            <div className="card-topline">
              <span className="pill">{match.type}</span>
              <span className="match-badge">{match.match}%</span>
            </div>
            <h3>{match.name}</h3>
            <div className="match-breakdown">
              {match.reasons.map((reason) => (
                <div key={reason.label} className="match-row">
                  <span>{reason.label}</span>
                  <div className="progress-bar">
                    <span style={{ width: `${reason.value}%` }} />
                  </div>
                  <strong>{reason.value}%</strong>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function InterestsPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <p className="label">Interesses</p>
          <h2>Conexões e respostas</h2>
        </div>
      </div>

      <div className="interest-layout">
        <div className="panel">
          <h3>Interesses enviados</h3>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>NovaFlow</strong>
                <span>Logística IA</span>
              </div>
              <span className="mini-badge">Pendente</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>GreenGrid</strong>
                <span>Energia limpa</span>
              </div>
              <span className="mini-badge">Aceito</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Interesses recebidos</h3>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>Atlas Ventures</strong>
                <span>Fundo</span>
              </div>
              <span className="mini-badge">Novo</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>Helena Costa</strong>
                <span>Anjo</span>
              </div>
              <span className="mini-badge">Respondido</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProfilePage({
  activeRole,
  approvedStartups,
  pendingStartups = [],
}: {
  activeRole: UserRole
  approvedStartups?: Startup[]
  pendingStartups?: PendingStartup[]
}) {
  const { type, id } = useParams()
  const profileId = Number(id)
  const [matched, setMatched] = useState(false)
  const navigate = useNavigate()

  const currentStartups = approvedStartups ?? startups

  let startupProfile: Startup | undefined = undefined
  let customAnalysis = mockAnalysis

  if (type === 'startup') {
    startupProfile = currentStartups.find((item) => item.id === profileId)
    // Tentar achar também em pendingStartups
    const pending = pendingStartups.find((p) => p.id === id || p.formData.name === startupProfile?.name)
    if (pending?.analysis) {
      customAnalysis = pending.analysis
    }
  }

  const investorProfile = type === 'investor' ? investors.find((item) => item.id === profileId) : undefined

  if (type === 'startup' && !startupProfile) {
    return (
      <section className="screen-shell" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Startup não encontrada no catálogo de empresas homologadas.</h2>
        <Link to="/buscar" className="btn btn-primary" style={{ marginTop: '1rem' }}>Voltar ao Catálogo</Link>
      </section>
    )
  }

  if (type === 'investor' && !investorProfile) {
    return <section className="screen-shell"><h2>Perfil de investidor não encontrado</h2></section>
  }

  if (type === 'startup' && startupProfile) {
    const startup = startupProfile

    return (
      <section className="profile-shell" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Notificação de Match estilo Tinder */}
        {matched && (
          <div style={{ padding: '1.25rem 2rem', background: 'rgba(34,197,94,0.15)', border: '2px solid #22c55e', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>🔥</span>
              <div>
                <h3 style={{ margin: 0, color: '#22c55e' }}>DEU MATCH COM {startup.name.toUpperCase()}!</h3>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>
                  Seu interesse de investimento foi registrado com sucesso. Os fundadores foram notificados e o canal seguro foi aberto no seu painel de conexões.
                </p>
              </div>
            </div>
            <Link to="/interesses" className="btn btn-primary" style={{ background: '#16a34a' }}>
              Ver Conexões
            </Link>
          </div>
        )}

        {/* Hero */}
        <div className="profile-hero" style={{ background: 'var(--surface-1, #1e293b)', borderRadius: '14px', padding: '2rem' }}>
          <div className="profile-avatar" style={{ background: 'var(--accent, #6366f1)', color: '#fff', fontSize: '2rem', width: '70px', height: '70px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {startup.name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>{startup.name}</h2>
              <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontWeight: 600 }}>
                ✓ Homologada pelo Comitê
              </span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-muted)' }}>
              {startup.sector} • {startup.city} • Rodada {startup.stage}
            </p>
          </div>
          <div className="match-score" style={{ textAlign: 'center', background: 'rgba(99,102,241,0.12)', padding: '0.75rem 1.25rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.8rem', display: 'block' }}>Match com sua tese</span>
            <strong style={{ fontSize: '1.75rem', color: 'var(--accent, #6366f1)' }}>{startup.match}%</strong>
          </div>
        </div>

        <div className="profile-layout" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>
          <div className="profile-main" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Sobre a empresa */}
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Sobre a Empresa</h3>
              <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{startup.description}</p>

              <div className="meta-grid" style={{ marginTop: '1rem' }}>
                <div><span>Estágio</span><strong>{startup.stage}</strong></div>
                <div><span>Modelo de Negócio</span><strong>{startup.model}</strong></div>
                <div><span>Base Atual</span><strong>{startup.team}</strong></div>
                <div><span>Captação Pretendida</span><strong style={{ color: 'var(--accent, #6366f1)' }}>{startup.investment}</strong></div>
              </div>
            </div>

            {/* Estatísticas & Probabilidades para o Investidor */}
            <div className="panel" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📊</span> Estatísticas & Probabilidades de Crescimento
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auditoria de saúde financeira, riscos e expansão</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score Geral</span>
                  <strong style={{ display: 'block', fontSize: '1.3rem', color: 'var(--accent, #6366f1)' }}>{customAnalysis.score}/100</strong>
                </div>
              </div>

              {/* Círculos de Scores */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', margin: '1rem 0' }}>
                <ScoreCircle value={customAnalysis.score} label="Score Geral" color="#6366f1" />
                <ScoreCircle value={customAnalysis.healthScore} label="Saúde Financeira" color="#22c55e" />
                <ScoreCircle value={customAnalysis.growthScore} label="Potencial Escala" color="#3b82f6" />
                <ScoreCircle value={100 - customAnalysis.riskScore} label="Segurança" color="#eab308" />
              </div>

              {/* Indicadores Detalhados */}
              <div style={{ marginTop: '1.25rem' }}>
                <IndicatorBar label="Saúde Financeira & Unit Economics" value={customAnalysis.healthScore} color="#22c55e" />
                <IndicatorBar label="Potencial de Tração & Escala" value={customAnalysis.growthScore} color="#3b82f6" />
                <IndicatorBar label="Nível de Risco Operacional" value={customAnalysis.riskScore} color="#ef4444" />
              </div>

              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--accent, #6366f1)' }}>Síntese Estatística para Investidores:</strong>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>{customAnalysis.summary}</p>
              </div>
            </div>

            {/* Matriz SWOT */}
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>Matriz SWOT Analítica</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <SwotCard title="Forças" icon="💪" items={customAnalysis.strengths} borderCol="#22c55e" />
                <SwotCard title="Fraquezas" icon="⚠️" items={customAnalysis.weaknesses} borderCol="#ef4444" />
                <SwotCard title="Oportunidades" icon="🚀" items={customAnalysis.opportunities} borderCol="#3b82f6" />
                <SwotCard title="Ameaças" icon="🛡️" items={customAnalysis.threats} borderCol="#eab308" />
              </div>
            </div>

            {/* Gráfico de Projeções de Faturamento */}
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>📈 Projeção de Crescimento & Faturamento (24 meses)</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Estatísticas preditivas nos 3 cenários operacionais avaliados pelo comitê.
              </p>
              <ProjectionChart analysis={customAnalysis} />
            </div>

            {/* Cards de Cenário 🔴🟡🟢 */}
            <div className="panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginTop: 0 }}>🎯 Cenários de Retorno Preditivo</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                <ScenarioCard
                  title="Pessimista"
                  icon="🔴"
                  accentColor="#ef4444"
                  growth12={customAnalysis.projections.months12.pessimistic}
                  growth24={customAnalysis.projections.months24.pessimistic}
                  revenue12={customAnalysis.revenueProjection.months12.pessimistic}
                  revenue24={customAnalysis.revenueProjection.months24.pessimistic}
                />
                <ScenarioCard
                  title="Realista"
                  icon="🟡"
                  accentColor="#eab308"
                  growth12={customAnalysis.projections.months12.realistic}
                  growth24={customAnalysis.projections.months24.realistic}
                  revenue12={customAnalysis.revenueProjection.months12.realistic}
                  revenue24={customAnalysis.revenueProjection.months24.realistic}
                />
                <ScenarioCard
                  title="Otimista"
                  icon="🟢"
                  accentColor="#22c55e"
                  growth12={customAnalysis.projections.months12.optimistic}
                  growth24={customAnalysis.projections.months24.optimistic}
                  revenue12={customAnalysis.revenueProjection.months12.optimistic}
                  revenue24={customAnalysis.revenueProjection.months24.optimistic}
                />
              </div>
            </div>
          </div>

          {/* Painel Lateral estilo Tinder de Dealflow */}
          <div className="profile-side panel" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ marginTop: 0, color: 'var(--accent, #6366f1)' }}>Decisão de Investimento</h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
              A startup combina com a sua tese de aporte. Analise as estatísticas e registre seu interesse mútuo para abrir o canal direto com os fundadores.
            </p>

            <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary full"
                onClick={() => setMatched(true)}
                style={{
                  background: matched ? '#16a34a' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  padding: '1rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                }}
              >
                {matched ? '✓ Interesse Registrado (Match)' : '💚 Tenho Interesse em Investir (Dar Match)'}
              </button>

              <button
                type="button"
                className="btn btn-secondary full"
                onClick={() => {
                  const currentIndex = currentStartups.findIndex((s) => s.id === startup.id)
                  const nextStartup = currentStartups[(currentIndex + 1) % currentStartups.length]
                  setMatched(false)
                  navigate(`/perfil/startup/${nextStartup.id}`)
                }}
                style={{ padding: '0.85rem' }}
              >
                ➡️ Próxima Startup do Catálogo
              </button>

              <Link to="/buscar" className="btn btn-ghost full" style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                Voltar para a Lista de Startups
              </Link>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🔒 Todas as informações e métricas financeiras desta startup foram validadas pelo comitê administrativo do NEXO sob conformidade com a LGPD.
            </div>
          </div>
        </div>
      </section>
    )
  }

  const investor = investorProfile as Investor

  return (
    <section className="profile-shell">
      <div className="profile-hero">
        <div className="profile-avatar">{investor.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <p className="label">Perfil do investidor</p>
          <h2>{investor.name}</h2>
          <p>{investor.type} • {investor.city}</p>
        </div>
        <div className="match-score">
          <span>Compatibilidade</span>
          <strong>{investor.match}%</strong>
        </div>
      </div>

      <div className="profile-layout">
        <div className="panel profile-main">
          <h3>Sobre o investidor</h3>
          <p>{investor.description}</p>

          <div className="meta-grid">
            <div><span>Tipo</span><strong>{investor.type}</strong></div>
            <div><span>Faixa</span><strong>{investor.ticket}</strong></div>
            <div><span>Áreas</span><strong>{investor.focus.join(', ')}</strong></div>
            <div><span>Localização</span><strong>{investor.city}</strong></div>
          </div>

          <div className="match-breakdown">
            <h4>Compatibilidade</h4>
            {matches.map((item) => (
              <div key={item.label} className="match-row">
                <span>{item.label}</span>
                <div className="progress-bar">
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel profile-side">
          <h3>Resumo da tese</h3>
          <p>{investor.thesis}</p>
          <button type="button" className="btn btn-primary full">{activeRole === 'startup' ? 'Demonstrar interesse' : 'Tenho interesse'}</button>
          <Link to="/buscar" className="btn btn-secondary full">Ver mais</Link>
        </div>
      </div>
    </section>
  )
}

function SettingsPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <p className="label">Configurações</p>
          <h2>Preferências e conta</h2>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <h3>Dados pessoais</h3>
          <div className="field-group">
            <label>Email</label>
            <input defaultValue="contato@nexo.app" />
          </div>
          <div className="field-group">
            <label>Localização</label>
            <input defaultValue="São Paulo - SP" />
          </div>
        </div>

        <div className="panel">
          <h3>Privacidade</h3>
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Permitir contato por e-mail
          </label>
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Mostrar perfil em buscas
          </label>
          <label className="checkbox-row">
            <input type="checkbox" />
            Receber sugestões automáticas
          </label>
        </div>
      </div>
    </section>
  )
}

function PrivacyPage() {
  return (
    <section className="screen-shell">
      <div className="section-header compact">
        <div>
          <p className="label">Privacidade</p>
          <h2>Termos, LGPD e consentimento</h2>
        </div>
      </div>

      <div className="privacy-card">
        <h3>Consentimento</h3>
        <p>Ao utilizar a plataforma, você concorda com o tratamento de dados para fins de matchmaking, recomendações e comunicação interna.</p>
        <h3>Política de privacidade</h3>
        <p>Os dados de perfil e interesses são utilizados exclusivamente para conectar usuários com maior compatibilidade. Não compartilhamos informações com terceiros fora do escopo da plataforma.</p>
        <h3>LGPD</h3>
        <p>Você pode solicitar alteração, visualização ou exclusão dos dados a qualquer momento no painel de configurações.</p>
      </div>
    </section>
  )
}

export default App
