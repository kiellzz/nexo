import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
import type { Investor, Startup, UserRole } from './types'
import {
  investors,
  matchCards,
  matches,
  opportunities,
  startups,
} from './data/mockData'
import { AppShell } from './layout/AppShell'
import { useAppShell } from './layout/useAppShell'
import './App.css'

function LoginRoute() {
  const { setActiveRole } = useAppShell()
  const navigate = useNavigate()
  return <LoginPage setActiveRole={(role) => { setActiveRole(role); navigate('/dashboard') }} />
}

function SignupRoute() {
  const { setActiveRole } = useAppShell()
  const navigate = useNavigate()
  return <SignupPage setActiveRole={(role) => { setActiveRole(role); navigate('/dashboard') }} />
}

function DashboardRoute() {
  const { activeRole } = useAppShell()
  return <DashboardPage activeRole={activeRole} />
}

function SearchRoute() {
  const { activeRole } = useAppShell()
  return <SearchPage activeRole={activeRole} />
}

function ProfileRoute() {
  const { activeRole } = useAppShell()
  return <ProfilePage activeRole={activeRole} />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/signup" element={<SignupRoute />} />
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/buscar" element={<SearchRoute />} />
          <Route path="/oportunidades" element={<OpportunitiesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/interesses" element={<InterestsPage />} />
          <Route path="/perfil/:type/:id" element={<ProfileRoute />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function LandingPage() {
  return (
    <div className="landing-wrapper">
      {/* FULL-WIDTH HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="hero-section-full">
        <div className="hero-video-container">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="hero-video-bg"
            poster="/handshake.png"
          >
            <source src="/handshake.mp4" type="video/mp4" />
            Seu navegador não suporta vídeos em HTML5.
          </video>
          <div className="hero-overlay" />
          <div className="hero-glow-orb orb-1" />
          <div className="hero-glow-orb orb-2" />
        </div>

        <div className="hero-content-container">
          <div className="hero-copy">
            <div className="eyebrow-badge">
              <span className="pulse-dot" />
              <span>Conecte Capital & Inovação</span>
            </div>

            <h1 className="hero-title">
              Conectamos <span className="highlight-text">startups</span> às oportunidades certas de <span className="highlight-gradient">investimento</span>.
            </h1>

            <p className="hero-description">
              Descubra investidores com visão alinhada, encontre negócios de alto crescimento validados por dados e acelere a próxima etapa da sua jornada com precisão.
            </p>

            <div className="cta-row">
              <Link to="/signup" className="btn btn-primary btn-glow btn-lg">
                <span>Começar agora</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              <Link to="/buscar" className="btn btn-glass btn-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Explorar oportunidades</span>
              </Link>
            </div>

            <div className="hero-stats-bar">
              <div className="stat-item">
                <div className="stat-number">1.2k<span className="stat-plus">+</span></div>
                <div className="stat-label">Startups Ativas</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <div className="stat-number">320<span className="stat-plus">+</span></div>
                <div className="stat-label">Investidores Qualificados</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <div className="stat-number">94<span className="stat-pct">%</span></div>
                <div className="stat-label">Taxa de Match Assertivo</div>
              </div>
            </div>
          </div>

          {/* RIGHT FLOATING GLASS CARD */}
          <div className="hero-interactive-card">
            <div className="match-showcase-card">
              <div className="match-card-header">
                <div className="badge-live">
                  <span className="live-indicator" />
                  <span>Match em Tempo Real</span>
                </div>
                <span className="match-score-pill">96% Compatibilidade</span>
              </div>

              <div className="match-parties">
                <div className="party-box startup-box">
                  <div className="party-icon">🚀</div>
                  <div>
                    <h4>NovaFlow</h4>
                    <p>SaaS B2B • Logística IA</p>
                  </div>
                </div>

                <div className="match-connector">
                  <div className="connector-line" />
                  <div className="connector-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                </div>

                <div className="party-box investor-box">
                  <div className="party-icon">💎</div>
                  <div>
                    <h4>Helena Costa</h4>
                    <p>Investidora Anjo • Ticket até R$ 1M</p>
                  </div>
                </div>
              </div>

              <div className="match-reasons-preview">
                <div className="reason-item">
                  <div className="reason-header">
                    <span>Tese & Mercado</span>
                    <strong>98%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '98%' }} />
                  </div>
                </div>
                <div className="reason-item">
                  <div className="reason-header">
                    <span>Ticket & Estágio</span>
                    <strong>94%</strong>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>

              <div className="match-card-footer">
                <span className="status-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Conexão imediata recomendada pelo algoritmo
                </span>
              </div>
            </div>

            {/* FLOATING BADGE */}
            <div className="floating-metric-badge float-1">
              <span className="badge-icon">💼</span>
              <div>
                <strong>R$ 48M+</strong>
                <p>Volume em Negociação</p>
              </div>
            </div>

            <div className="floating-metric-badge float-2">
              <span className="badge-icon">⚡</span>
              <div>
                <strong>3x mais rápido</strong>
                <p>Tempo médio até o Term Sheet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="info-panel" id="como-funciona">
        <div className="section-header-center">
          <span className="label-badge">Metodologia Nexo</span>
          <h2>Seu fluxo em 4 passos inteligentes</h2>
          <p className="section-subtitle">Processo estruturado para maximizar conexões de valor e minimizar tempo desperdiçado em reuniões desalinhadas.</p>
        </div>

        <div className="steps-grid">
          {[
            {
              num: '01',
              title: 'Crie seu perfil detalhado',
              desc: 'Cadastre sua startup ou tese de investimento com dados de tração, mercado, métricas-chave e estágio.',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              ),
            },
            {
              num: '02',
              title: 'Algoritmo de Compatibilidade',
              desc: 'Nossa engine cruza segmentos, ticket médio, governança e momento de captação para gerar scores de alinhamento.',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"></path>
                  <line x1="2" y1="20" x2="2.01" y2="20"></line>
                </svg>
              ),
            },
            {
              num: '03',
              title: 'Analise Oportunidades & Matches',
              desc: 'Receba recomendações curadas com percentual de compatibilidade e detalhamento transparente dos fatores de afinidade.',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ),
            },
            {
              num: '04',
              title: 'Conexão Direta & Negociação',
              desc: 'Inicie conversas com decisores qualificados e acelere o fechamento da rodada com segurança e privacidade.',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              ),
            },
          ].map((step) => (
            <article key={step.num} className="step-card">
              <div className="step-card-header">
                <div className="step-icon-wrap">{step.icon}</div>
                <span className="step-number">{step.num}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* BENEFIT BENTO SECTION */}
      <section className="benefit-section">
        <div className="benefit-grid">
          <article className="benefit-card blue-gradient">
            <div className="benefit-badge">Para Startups em Captação</div>
            <h3>Encontre investidores com alinhamento estratégico real</h3>
            <p className="benefit-lead">
              Apresente sua empresa para investidores que realmente compreendem o seu setor e têm capital alocado para o seu estágio.
            </p>
            <ul className="benefit-list">
              <li>
                <div className="check-circle">✓</div>
                <span>Acesso direto a fundos de VC, investidores anjo e family offices</span>
              </li>
              <li>
                <div className="check-circle">✓</div>
                <span>Métricas de compatibilidade para priorizar as melhores abordagens</span>
              </li>
              <li>
                <div className="check-circle">✓</div>
                <span>Mais visibilidade qualificada sem spam ou perda de tempo</span>
              </li>
              <li>
                <div className="check-circle">✓</div>
                <span>Deck e dados de tração apresentados de forma estruturada e segura</span>
              </li>
            </ul>
            <div className="benefit-action">
              <Link to="/signup" className="btn btn-primary">
                Cadastrar minha startup →
              </Link>
            </div>
          </article>

          <article className="benefit-card teal-gradient">
            <div className="benefit-badge teal">Para Investidores & Fundos</div>
            <h3>Descubra negócios promissores com inteligência e clareza</h3>
            <p className="benefit-lead">
              Filtre o dealflow com critérios rigorosos de tese, ticket, geografia e estágio para encontrar apenas oportunidades compatíveis.
            </p>
            <ul className="benefit-list">
              <li>
                <div className="check-circle teal">✓</div>
                <span>Dealflow pré-filtrado de acordo com a sua tese de investimentos</span>
              </li>
              <li>
                <div className="check-circle teal">✓</div>
                <span>Análise rápida de tração, modelo de negócio e equipe fundadora</span>
              </li>
              <li>
                <div className="check-circle teal">✓</div>
                <span>Notificações em tempo real sobre novas startups compatíveis</span>
              </li>
              <li>
                <div className="check-circle teal">✓</div>
                <span>Contato direto com os fundadores em um ambiente confidencial</span>
              </li>
            </ul>
            <div className="benefit-action">
              <Link to="/buscar" className="btn btn-teal">
                Explorar oportunidades →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES PREVIEW */}
      <section className="opportunity-preview">
        <div className="section-header">
          <div>
            <span className="label-badge">Portfólio & Rodadas</span>
            <h2>Oportunidades em Destaque</h2>
            <p className="section-desc">Startups selecionadas com rodadas de investimento ativas na plataforma.</p>
          </div>
          <Link to="/buscar" className="btn btn-secondary">
            Ver todas as oportunidades
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>

        <div className="opportunities-grid">
          {opportunities.map((op) => (
            <article key={op.id} className="opportunity-card">
              <div className="card-topline">
                <span className="pill">{op.type}</span>
                <span className="match-badge">
                  <span className="badge-dot" />
                  {op.match}% Match
                </span>
              </div>
              <h3>{op.name}</h3>
              <p className="opportunity-sector">
                <span className="sector-tag">{op.sector}</span> • <span>{op.location}</span>
              </p>
              <p className="opportunity-desc">{op.description}</p>
              
              <div className="card-metrics-row">
                <div className="metric-box">
                  <span>Estágio</span>
                  <strong>{op.stage}</strong>
                </div>
                <div className="metric-box">
                  <span>Valor Rodada</span>
                  <strong>{op.value}</strong>
                </div>
                <div className="metric-box">
                  <span>Data Limite</span>
                  <strong>{op.date}</strong>
                </div>
              </div>

              <div className="card-footer-action">
                <Link to="/buscar" className="btn btn-card-action">
                  Ver detalhes da rodada →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-banner-glow" />
          <div className="cta-banner-content">
            <h2>Pronto para acelerar sua próxima conexão de sucesso?</h2>
            <p>Junte-se a mais de 1.200 startups e 320 investidores que já utilizam a Nexo para estruturar rodadas com transparência e eficiência.</p>
            <div className="cta-banner-buttons">
              <Link to="/signup" className="btn btn-primary btn-glow btn-lg">
                Criar conta gratuita
              </Link>
              <Link to="/buscar" className="btn btn-glass btn-lg">
                Explorar ecossistema
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function DashboardPage({ activeRole }: { activeRole: UserRole }) {
  const dashboardStats =
    activeRole === 'startup'
      ? [
          ['Perfil Completo', '87%', '+12% este mês'],
          ['Visualizações do Perfil', '1.3k', '+28% na semana'],
          ['Investidores Interessados', '24', '3 novos hoje'],
          ['Matches Compatíveis', '8', '94% fit médio'],
          ['Rodadas Relacionadas', '16', 'Ativas'],
        ]
      : [
          ['Startups Visualizadas', '42', 'Nesta semana'],
          ['Matches de Alta Tese', '11', 'Score > 90%'],
          ['Interesses Enviados', '9', '2 respostas'],
          ['Novas Oportunidades', '7', 'Últimos 7 dias'],
          ['Compatibilidade Média', '91%', 'Filtros ativos'],
        ]

  const recommendations = activeRole === 'startup' ? investors : startups

  return (
    <section className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo-wrap small">
            <img src="/logo.png" alt="Nexo logo" className="brand-logo small" />
          </div>
          <span className="brand-name">Nexo</span>
        </div>

        <div className="sidebar-user-pill">
          <div className="user-avatar-dot" />
          <div>
            <strong>{activeRole === 'startup' ? 'Startup Modo' : 'Investidor Modo'}</strong>
            <span>Conta Verificada</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Menu do dashboard">
          {[
            {
              label: 'Dashboard',
              to: '/dashboard',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              ),
            },
            {
              label: 'Buscar Ecossistema',
              to: '/buscar',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              ),
            },
            {
              label: 'Oportunidades',
              to: '/oportunidades',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              ),
            },
            {
              label: 'Matches',
              to: '/matches',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ),
            },
            {
              label: 'Interesses',
              to: '/interesses',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              ),
            },
            {
              label: 'Configurações',
              to: '/configuracoes',
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              ),
            },
          ].map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => (isActive ? 'side-link active' : 'side-link')}
            >
              <span className="side-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="btn btn-sidebar-logout">
            <span>Voltar ao Início</span>
          </Link>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="eyebrow-badge small">
              <span className="pulse-dot" />
              <span>{activeRole === 'startup' ? 'Painel da Startup' : 'Painel do Investidor'}</span>
            </div>
            <h2>{activeRole === 'startup' ? 'Resumo Executivo & Conexões' : 'Pipeline de Startups & Oportunidades'}</h2>
          </div>
          <Link to="/buscar" className="btn btn-primary">
            {activeRole === 'startup' ? 'Explorar Investidores →' : 'Explorar Startups →'}
          </Link>
        </header>

        <div className="stats-grid">
          {dashboardStats.map(([label, value, sub]) => (
            <div key={label} className="stat-card">
              <span className="stat-label">{label}</span>
              <strong className="stat-value">{value}</strong>
              <span className="stat-subtext">{sub}</span>
            </div>
          ))}
        </div>

        <div className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>{activeRole === 'startup' ? 'Investidores Recomendados' : 'Startups Recomendadas'}</h3>
                <p className="panel-subtitle">Baseado no seu perfil de tração e tese de mercado</p>
              </div>
              <Link to="/buscar" className="text-link">Ver todos ({recommendations.length})</Link>
            </div>

            <div className="recommendations-list">
              {recommendations.map((item) => {
                if (activeRole === 'startup') {
                  const investor = item as Investor

                  return (
                    <div key={investor.id} className="recommendation-card">
                      <div className="avatar investor-avatar">
                        {investor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                      </div>
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
                        <span className="match-badge">
                          <span className="badge-dot" />
                          {investor.match}% Fit
                        </span>
                        <span className="ticket-label">{investor.ticket}</span>
                        <Link to={`/perfil/investor/${investor.id}`} className="btn btn-secondary small">
                          Ver perfil
                        </Link>
                      </div>
                    </div>
                  )
                }

                const startup = item as Startup

                return (
                  <div key={startup.id} className="recommendation-card">
                    <div className="avatar startup-avatar">
                      {startup.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="recommendation-copy">
                      <h4>{startup.name}</h4>
                      <p>{startup.sector} • {startup.city}</p>
                      <div className="tag-row">
                        <span className="pill lite">{startup.stage}</span>
                        <span className="pill">{startup.model}</span>
                      </div>
                    </div>
                    <div className="recommendation-meta">
                      <span className="match-badge">
                        <span className="badge-dot" />
                        {startup.match}% Fit
                      </span>
                      <span className="ticket-label">{startup.investment}</span>
                      <Link to={`/perfil/startup/${startup.id}`} className="btn btn-secondary small">
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>{activeRole === 'startup' ? 'Rodadas Relacionadas' : 'Teses em Alta'}</h3>
                <p className="panel-subtitle">Oportunidades em seu radar</p>
              </div>
            </div>
            <div className="mini-list">
              {activeRole === 'startup'
                ? opportunities.map((opp) => (
                    <div key={opp.id} className="mini-item">
                      <div>
                        <strong>{opp.name}</strong>
                        <span>{opp.sector} • {opp.value}</span>
                      </div>
                      <span className="mini-badge">{opp.match}%</span>
                    </div>
                  ))
                : ['Inteligência Artificial', 'Saúde & BioTech', 'Logística Autônoma', 'Clean Energy', 'Fintech B2B'].map((area) => (
                    <div key={area} className="mini-item">
                      <div>
                        <strong>{area}</strong>
                        <span>Prioridade de alocação de fundos</span>
                      </div>
                      <span className="mini-badge">94%</span>
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
          <span className="label-badge">Radar do Ecossistema</span>
          <h2>{activeRole === 'startup' ? 'Encontre Investidores Compatíveis' : 'Descubra Startups Promissoras'}</h2>
          <p className="section-desc">Filtre por estágio, segmento de atuação, localização e faixa de capital.</p>
        </div>
        <div className="search-controls">
          <div className="search-input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder={activeRole === 'startup' ? 'Pesquisar por nome de investidor, fundo ou tese...' : 'Pesquisar por startup, modelo de negócio ou setor...'} />
          </div>
          <button type="button" className="btn btn-primary">Buscar</button>
        </div>
      </div>

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

      <div className="listing-grid">
        {list.map((item) => {
          if (activeRole === 'startup') {
            const investor = item as Investor

            return (
              <article key={investor.id} className="listing-card">
                <div className="card-topline">
                  <span className="pill">{investor.type}</span>
                  <span className="match-badge">
                    <span className="badge-dot" />
                    {investor.match}% Match
                  </span>
                </div>
                <h3>{investor.name}</h3>
                <p className="listing-desc">{investor.thesis}</p>
                <div className="listing-meta-tags">
                  <span className="meta-tag">📍 {investor.city}</span>
                  <span className="meta-tag">💰 {investor.ticket}</span>
                  <span className="meta-tag">🎯 {investor.focus[0]}</span>
                </div>
                <Link to={`/perfil/investor/${investor.id}`} className="btn btn-secondary full">
                  Ver perfil completo →
                </Link>
              </article>
            )
          }

          const startup = item as Startup

          return (
            <article key={startup.id} className="listing-card">
              <div className="card-topline">
                <span className="pill">{startup.sector}</span>
                <span className="match-badge">
                  <span className="badge-dot" />
                  {startup.match}% Match
                </span>
              </div>
              <h3>{startup.name}</h3>
              <p className="listing-desc">{startup.description}</p>
              <div className="listing-meta-tags">
                <span className="meta-tag">📍 {startup.city}</span>
                <span className="meta-tag">🚀 {startup.stage}</span>
                <span className="meta-tag">💼 {startup.investment}</span>
              </div>
              <Link to={`/perfil/startup/${startup.id}`} className="btn btn-secondary full">
                Ver startup completa →
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
          <span className="label-badge">Rodadas Abertas</span>
          <h2>Oportunidades de Investimento e Aceleração</h2>
          <p className="section-desc">Participe de rodadas verificadas com due diligence simplificada.</p>
        </div>
      </div>

      <div className="opportunities-panel">
        {opportunities.map((item) => (
          <article key={item.id} className="opportunity-full-card">
            <div className="card-topline">
              <span className="pill">{item.type}</span>
              <span className="match-badge">
                <span className="badge-dot" />
                {item.match}% Match
              </span>
            </div>
            <h3>{item.name}</h3>
            <p className="full-card-desc">{item.description}</p>
            <div className="meta-grid">
              <div><span>Setor</span><strong>{item.sector}</strong></div>
              <div><span>Localização</span><strong>{item.location}</strong></div>
              <div><span>Valor Alvo</span><strong>{item.value}</strong></div>
              <div><span>Status</span><strong className="status-highlight">{item.status}</strong></div>
            </div>
            <div className="full-card-actions">
              <button type="button" className="btn btn-primary">Demonstrar Interesse</button>
              <button type="button" className="btn btn-secondary">Baixar Teaser Executivo</button>
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
          <span className="label-badge">Algoritmo de Afinidade</span>
          <h2>Suas Melhores Combinações</h2>
          <p className="section-desc">Entenda detalhadamente os critérios que geraram as notas de compatibilidade.</p>
        </div>
      </div>

      <div className="match-grid">
        {matchCards.map((match) => (
          <article key={match.id} className="match-card">
            <div className="card-topline">
              <span className="pill">{match.type === 'startup' ? 'Startup' : 'Investidor'}</span>
              <span className="match-badge">
                <span className="badge-dot" />
                {match.match}% Match
              </span>
            </div>
            <h3>{match.name}</h3>
            <div className="match-breakdown">
              {match.reasons.map((reason) => (
                <div key={reason.label} className="match-row">
                  <span className="match-label">{reason.label}</span>
                  <div className="progress-bar">
                    <span style={{ width: `${reason.value}%` }} />
                  </div>
                  <strong className="match-val">{reason.value}%</strong>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-primary full btn-match-connect">
              Iniciar Conexão
            </button>
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
          <span className="label-badge">Central de Relacionamento</span>
          <h2>Interesses e Conexões</h2>
          <p className="section-desc">Acompanhe o status de solicitações de contato enviadas e recebidas.</p>
        </div>
      </div>

      <div className="interest-layout">
        <div className="panel">
          <div className="panel-header">
            <h3>Interesses Enviados</h3>
            <span className="badge-counter">2 ativos</span>
          </div>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>NovaFlow</strong>
                <span>Logística IA • Rodada Série A</span>
              </div>
              <span className="status-pill pending">Pendente</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>GreenGrid</strong>
                <span>Energia Limpa • Seed</span>
              </div>
              <span className="status-pill accepted">Aceito</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h3>Interesses Recebidos</h3>
            <span className="badge-counter">2 novos</span>
          </div>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>Atlas Ventures</strong>
                <span>Fundo de VC • São Paulo</span>
              </div>
              <span className="status-pill new">Novo</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>Helena Costa</strong>
                <span>Investidora Anjo • Belo Horizonte</span>
              </div>
              <span className="status-pill replied">Respondido</span>
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
    return (
      <section className="screen-shell">
        <div className="not-found-card">
          <h2>Perfil não encontrado</h2>
          <p>O perfil que você tentou acessar não existe ou foi removido.</p>
          <Link to="/buscar" className="btn btn-primary">Voltar para busca</Link>
        </div>
      </section>
    )
  }

  if (type === 'startup') {
    const startup = profile as Startup

    return (
      <section className="profile-shell">
        <div className="profile-hero">
          <div className="profile-avatar startup-avatar">
            {startup.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="profile-hero-info">
            <span className="label-badge">Perfil da Startup</span>
            <h2>{startup.name}</h2>
            <p className="profile-sub">{startup.sector} • {startup.city}</p>
          </div>
          <div className="match-score">
            <span>Score de Afinidade</span>
            <strong>{startup.match}%</strong>
          </div>
        </div>

        <div className="profile-layout">
          <div className="panel profile-main">
            <h3>Sobre a Empresa</h3>
            <p className="profile-description-text">{startup.description}</p>

            <div className="meta-grid">
              <div><span>Estágio</span><strong>{startup.stage}</strong></div>
              <div><span>Modelo</span><strong>{startup.model}</strong></div>
              <div><span>Equipe</span><strong>{startup.team}</strong></div>
              <div><span>Investimento Alvo</span><strong>{startup.investment}</strong></div>
            </div>

            <div className="match-breakdown">
              <h4>Detalhamento de Compatibilidade</h4>
              {matches.map((item) => (
                <div key={item.label} className="match-row">
                  <span className="match-label">{item.label}</span>
                  <div className="progress-bar">
                    <span style={{ width: `${item.value}%` }} />
                  </div>
                  <strong className="match-val">{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="panel profile-side">
            <h3>{activeRole === 'startup' ? 'Oportunidade de Conexão' : 'Parecer de Alinhamento'}</h3>
            <p>
              {activeRole === 'startup'
                ? 'Alinhamento forte com investidores focados em escala operacional acelerada e automação B2B.'
                : 'A startup apresenta métricas de tração consistentes e modelo escalável para rodadas de crescimento regional.'}
            </p>
            <div className="profile-side-actions">
              <button type="button" className="btn btn-primary full">
                {activeRole === 'startup' ? 'Demonstrar Interesse' : 'Quero Investir'}
              </button>
              <Link to="/buscar" className="btn btn-secondary full">
                Voltar à busca
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  const investor = profile as Investor

  return (
    <section className="profile-shell">
      <div className="profile-hero">
        <div className="profile-avatar investor-avatar">
          {investor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
        </div>
        <div className="profile-hero-info">
          <span className="label-badge">Perfil do Investidor</span>
          <h2>{investor.name}</h2>
          <p className="profile-sub">{investor.type} • {investor.city}</p>
        </div>
        <div className="match-score">
          <span>Score de Afinidade</span>
          <strong>{investor.match}%</strong>
        </div>
      </div>

      <div className="profile-layout">
        <div className="panel profile-main">
          <h3>Sobre o Investidor</h3>
          <p className="profile-description-text">{investor.description}</p>

          <div className="meta-grid">
            <div><span>Tipo</span><strong>{investor.type}</strong></div>
            <div><span>Faixa de Ticket</span><strong>{investor.ticket}</strong></div>
            <div><span>Áreas de Interesse</span><strong>{investor.focus.join(', ')}</strong></div>
            <div><span>Localização</span><strong>{investor.city}</strong></div>
          </div>

          <div className="match-breakdown">
            <h4>Detalhamento de Compatibilidade</h4>
            {matches.map((item) => (
              <div key={item.label} className="match-row">
                <span className="match-label">{item.label}</span>
                <div className="progress-bar">
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <strong className="match-val">{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="panel profile-side">
          <h3>Resumo da Tese</h3>
          <p>{investor.thesis}</p>
          <div className="profile-side-actions">
            <button type="button" className="btn btn-primary full">
              {activeRole === 'startup' ? 'Enviar Pitch Deck' : 'Conectar com Investidor'}
            </button>
            <Link to="/buscar" className="btn btn-secondary full">
              Voltar à busca
            </Link>
          </div>
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
          <span className="label-badge">Painel de Controle</span>
          <h2>Configurações e Preferências</h2>
          <p className="section-desc">Gerencie seus dados de acesso, privacidade e notificações.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <h3>Dados Cadastrais</h3>
          <div className="field-group">
            <label htmlFor="settings-email">E-mail Principal</label>
            <input id="settings-email" defaultValue="contato@nexo.app" />
          </div>
          <div className="field-group">
            <label htmlFor="settings-loc">Localização / Hub Principal</label>
            <input id="settings-loc" defaultValue="São Paulo - SP" />
          </div>
          <button type="button" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>Salvar Alterações</button>
        </div>

        <div className="panel">
          <h3>Privacidade & Segurança</h3>
          <div className="checkbox-stack">
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Permitir contato direto por e-mail de perfis compatíveis</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Exibir perfil nos resultados de busca pública</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Receber alertas inteligentes de novos matches semanalmente</span>
            </label>
          </div>
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
          <span className="label-badge">Termos Legais</span>
          <h2>Privacidade, Termos & LGPD</h2>
          <p className="section-desc">Transparência total no tratamento de dados e segurança de informações.</p>
        </div>
      </div>

      <div className="privacy-card">
        <h3>1. Consentimento e Tratamento de Dados</h3>
        <p>
          Ao utilizar a plataforma Nexo, você concorda com o processamento dos dados empresariais e de contato informados para fins exclusivos de matchmaking, geração de scores de compatibilidade e recomendações no ecossistema.
        </p>
        
        <h3>2. Política de Privacidade & Confidencialidade</h3>
        <p>
          As informações de tração financeira e métricas confidenciais são protegidas por criptografia de ponta a ponta e apenas compartilhadas mediante autorização explícita do fundador ou investidor. Não comercializamos dados de usuários com terceiros.
        </p>
        
        <h3>3. Direitos do Titular (LGPD)</h3>
        <p>
          Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode solicitar a qualquer momento a visualização, correção, anonimização ou exclusão definitiva dos seus dados através do nosso canal de privacidade ou nas configurações da conta.
        </p>
      </div>
    </section>
  )
}

export default App
