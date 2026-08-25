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

type UserRole = 'startup' | 'investor'

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

const navItems = ['Início', 'Como funciona', 'Startups', 'Investidores', 'Sobre']

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

function AppContent() {
  const [activeRole, setActiveRole] = useState<UserRole>('startup')
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="Ir para a página inicial">
          <img src="/logo.png" alt="Nexo logo" className="brand-logo" />
          <span className="brand-name">Nexo</span>
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link key={item} to="/" className="nav-link">
              {item}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-secondary">Entrar</Link>
          <Link to="/signup" className="btn btn-primary">Criar conta</Link>
        </div>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage setActiveRole={(role) => { setActiveRole(role); navigate('/dashboard') }} />} />
          <Route path="/signup" element={<SignupPage setActiveRole={(role) => { setActiveRole(role); navigate('/dashboard') }} />} />
          <Route path="/dashboard" element={<DashboardPage activeRole={activeRole} />} />
          <Route path="/buscar" element={<SearchPage activeRole={activeRole} />} />
          <Route path="/oportunidades" element={<OpportunitiesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/interesses" element={<InterestsPage />} />
          <Route path="/perfil/:type/:id" element={<ProfilePage activeRole={activeRole} />} />
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
          <a href="#">LinkedIn</a>
        </div>
      </footer>
    </div>
  )
}

function LandingPage() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Conecte capital e inovação</span>
          <h1>Conectamos startups às oportunidades certas de investimento.</h1>
          <p>
            Descubra investidores com visão, encontre negócios compatíveis e acelere a próxima etapa da sua jornada.
          </p>
          <div className="cta-row">
            <Link to="/signup" className="btn btn-primary">Começar agora</Link>
            <Link to="/buscar" className="btn btn-ghost">Explorar oportunidades</Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>1.2k+</strong>
              <span>Startups ativas</span>
            </div>
            <div>
              <strong>320</strong>
              <span>Investidores</span>
            </div>
            <div>
              <strong>94%</strong>
              <span>Compatibilidade</span>
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

      <section className="info-panel">
        <div>
          <p className="label">Como funciona</p>
          <h2>Seu fluxo em 4 passos</h2>
        </div>
        <div className="steps-grid">
          {['Crie seu perfil', 'Encontre oportunidades', 'Conheça perfis compatíveis', 'Conecte-se'].map((step, index) => (
            <article key={step} className="step-card">
              <span className="step-number">0{index + 1}</span>
              <h3>{step}</h3>
              <p>Estruture seu posicionamento e receba combinações relevantes para o próximo passo.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="benefit-grid">
        <article className="benefit-card blue">
          <p className="label">Para startups</p>
          <h3>Encontre investidores com alinhamento estratégico</h3>
          <ul>
            <li>Encontrar investidores</li>
            <li>Apresentar sua empresa</li>
            <li>Encontrar investimentos compatíveis</li>
            <li>Aumentar visibilidade</li>
          </ul>
        </article>

        <article className="benefit-card teal">
          <p className="label">Para investidores</p>
          <h3>Descubra negócios com potencial e clareza</h3>
          <ul>
            <li>Descobrir startups</li>
            <li>Filtrar oportunidades</li>
            <li>Definir áreas de interesse</li>
            <li>Encontrar negócios compatíveis</li>
          </ul>
        </article>
      </section>

      <section className="opportunity-preview">
        <div className="section-header">
          <div>
            <p className="label">Oportunidades em destaque</p>
            <h2>Matches e negócios com forte alinhamento</h2>
          </div>
          <Link to="/buscar" className="btn btn-secondary">Ver mais</Link>
        </div>

        <div className="opportunities-grid">
          {opportunities.map((op) => (
            <article key={op.id} className="opportunity-card">
              <div className="card-topline">
                <span className="pill">{op.type}</span>
                <span className="match-badge">{op.match}%</span>
              </div>
              <h3>{op.name}</h3>
              <p>{op.sector}</p>
              <ul>
                <li>{op.stage}</li>
                <li>{op.value}</li>
                <li>{op.date}</li>
              </ul>
            </article>
          ))}
        </div>
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
          <>
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="startup-name">Nome da startup</label>
                <input id="startup-name" placeholder="NovaFlow" />
              </div>
              <div className="field-group">
                <label htmlFor="segment">Segmento</label>
                <input id="segment" placeholder="Logística IA" />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="startup-desc">Descrição</label>
              <textarea id="startup-desc" rows={4} placeholder="Descreva sua proposta de valor e trajetória." />
            </div>

            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="stage">Estágio</label>
                <select id="stage" defaultValue="Seed">
                  <option>Pré-semente</option>
                  <option>Seed</option>
                  <option>Série A</option>
                  <option>Expansion</option>
                </select>
              </div>
              <div className="field-group">
                <label htmlFor="ticket">Investimento pretendido</label>
                <input id="ticket" placeholder="R$ 750k" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="investor-name">Nome</label>
                <input id="investor-name" placeholder="Helena Costa" />
              </div>
              <div className="field-group">
                <label htmlFor="investor-type">Tipo</label>
                <select id="investor-type" defaultValue="Anjo">
                  <option>Anjo</option>
                  <option>Fundo</option>
                  <option>Family Office</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="areas">Áreas de interesse</label>
              <input id="areas" placeholder="IA, Saúde, B2B" />
            </div>

            <div className="field-grid two-col">
              <div className="field-group">
                <label htmlFor="focus">Faixa de investimento</label>
                <input id="focus" placeholder="R$ 300k - R$ 1M" />
              </div>
              <div className="field-group">
                <label htmlFor="city">Localização</label>
                <input id="city" placeholder="Belo Horizonte" />
              </div>
            </div>
          </>
        )}

        <button type="button" className="btn btn-primary full" onClick={() => setActiveRole(signupMode)}>
          Criar conta como {signupMode === 'startup' ? 'Startup' : 'Investidor'}
        </button>
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

function SearchPage({ activeRole }: { activeRole: UserRole }) {
  const list = activeRole === 'startup' ? investors : startups

  return (
    <section className="search-shell">
      <div className="search-topbar">
        <div>
          <p className="label">Busca</p>
          <h2>{activeRole === 'startup' ? 'Encontre investidores com potencial' : 'Descubra startups compatíveis'}</h2>
        </div>
        <div className="search-controls">
          <input type="text" placeholder={activeRole === 'startup' ? 'Pesquisar investidor ou área' : 'Pesquisar startup ou setor'} />
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
            <article key={startup.id} className="listing-card">
              <div className="card-topline">
                <span className="pill">{startup.sector}</span>
                <span className="match-badge">{startup.match}%</span>
              </div>
              <h3>{startup.name}</h3>
              <p>{startup.description}</p>
              <ul>
                <li>{startup.city}</li>
                <li>{startup.stage}</li>
                <li>{startup.investment}</li>
              </ul>
              <Link to={`/perfil/startup/${startup.id}`} className="btn btn-secondary small">Ver startup</Link>
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

function ProfilePage({ activeRole }: { activeRole: UserRole }) {
  const { type, id } = useParams()
  const profileId = Number(id)

  const profile =
    type === 'startup'
      ? startups.find((item) => item.id === profileId)
      : investors.find((item) => item.id === profileId)

  if (!profile) {
    return <section className="screen-shell"><h2>Perfil não encontrado</h2></section>
  }

  if (type === 'startup') {
    const startup = profile as Startup

    return (
      <section className="profile-shell">
        <div className="profile-hero">
          <div className="profile-avatar">{startup.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <p className="label">Perfil da startup</p>
            <h2>{startup.name}</h2>
            <p>{startup.sector} • {startup.city}</p>
          </div>
          <div className="match-score">
            <span>Compatibilidade</span>
            <strong>{startup.match}%</strong>
          </div>
        </div>

        <div className="profile-layout">
          <div className="panel profile-main">
            <h3>Sobre a empresa</h3>
            <p>{startup.description}</p>

            <div className="meta-grid">
              <div><span>Estágio</span><strong>{startup.stage}</strong></div>
              <div><span>Modelo</span><strong>{startup.model}</strong></div>
              <div><span>Equipe</span><strong>{startup.team}</strong></div>
              <div><span>Investimento</span><strong>{startup.investment}</strong></div>
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
            <h3>{activeRole === 'startup' ? 'Oportunidade' : 'Conclusão'}</h3>
            <p>
              {activeRole === 'startup'
                ? 'Alinhamento forte com investidores que buscam operações escaláveis e impacto em logística e tecnologia.'
                : 'A startup combina com investidores focados em eficiência, automação e crescimento regional.'}
            </p>
            <button type="button" className="btn btn-primary full">{activeRole === 'startup' ? 'Demonstrar interesse' : 'Tenho interesse'}</button>
            <Link to="/buscar" className="btn btn-secondary full">Ver mais</Link>
          </div>
        </div>
      </section>
    )
  }

  const investor = profile as Investor

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
