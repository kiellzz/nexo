import { useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import './App.css'
import { LandingPage } from './pages/LandingPage'
import { SocialNavbar } from './components/SocialNavbar'
import { FeedPage } from './pages/FeedPage'
import { ExplorePage } from './pages/ExplorePage'
import { NegotiationsPage } from './pages/NegotiationsPage'
import { MessagesPage } from './pages/MessagesPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { StartupRegisterPage } from './pages/StartupRegisterPage'
import { StartupStatusPage } from './pages/StartupStatusPage'
import { AdminPage } from './pages/AdminPage'
import { StartupAnalysisPage } from './pages/StartupAnalysisPage'
import { StartupsListPage } from './pages/StartupsListPage'
import { StartupFormPage } from './pages/StartupFormPage'
import { StartupDetailPage } from './pages/StartupDetailPage'
import { SwaggerUiPage } from './pages/SwaggerUiPage'
import {
  startups as initialStartups,
  investors,
  opportunities,
  matchCards,
  mockPendingStartups,
} from './data/mockData'
import type { PendingStartup, ApprovalStatus, UserRole, Startup, Investor } from './types'

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
  const location = useLocation()

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
    ...initialStartups,
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
        avatar: '🚀',
        arr: `R$ ${(Number(s.formData.annualRevenue || 0) / 1000).toFixed(0)}k`,
        mrr: `R$ ${((Number(s.formData.annualRevenue || 0) / 12) / 1000).toFixed(0)}k`,
        equityOffered: `${s.formData.equityOffered}%`,
      })),
  ]

  const isLanding = location.pathname === '/'

  if (isLanding) {
    return (
      <div className="app-shell landing-shell">
        <LandingPage />
        <footer className="footer">
          <Link to="/" className="footer-brand">
            <img src="/logo.png" alt="Nexo logo" className="brand-logo small" />
            <span className="brand-name">Nexo</span>
          </Link>
          <div className="footer-links">
            <Link to="/privacidade">Termos de uso</Link>
            <Link to="/privacidade">Política de privacidade</Link>
            <Link to="/privacidade">LGPD</Link>
            <Link to="/admin" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
              Acesso Administrativo
            </Link>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="app-shell">
      {/* Navbar Profissional da Rede NEXO */}
      <SocialNavbar
        activeRole={activeRole}
        onToggleRole={setActiveRole}
        unreadNotifsCount={2}
        activeNegotiationsCount={2}
      />

      <main className="page-content">
        <Routes>
          {/* Rotas Principais da Rede Social */}
          <Route path="/feed" element={<FeedPage activeRole={activeRole} />} />
          <Route path="/explorar" element={<ExplorePage activeRole={activeRole} />} />
          <Route
            path="/catalogo"
            element={<SearchPage activeRole={activeRole} approvedStartups={approvedStartups} />}
          />
          <Route
            path="/buscar"
            element={<SearchPage activeRole={activeRole} approvedStartups={approvedStartups} />}
          />
          <Route path="/negociacoes" element={<NegotiationsPage activeRole={activeRole} />} />
          <Route path="/mensagens" element={<MessagesPage activeRole={activeRole} />} />
          <Route path="/notificacoes" element={<NotificationsPage />} />
          <Route
            path="/perfil/:type/:id"
            element={
              <ProfilePage
                activeRole={activeRole}
                approvedStartups={approvedStartups}
                pendingStartups={pendingStartups}
              />
            }
          />

          {/* Autenticação & Cadastro */}
          <Route
            path="/login"
            element={
              <LoginPage
                setActiveRole={(role) => {
                  setActiveRole(role)
                  navigate('/feed')
                }}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignupPage
                setActiveRole={(role) => {
                  setActiveRole(role)
                  if (role === 'investor') {
                    navigate('/feed')
                  } else {
                    navigate('/cadastro-startup')
                  }
                }}
              />
            }
          />

          {/* Fluxo de Validação & Homologação de Startups */}
          <Route
            path="/cadastro-startup"
            element={<StartupRegisterPage onSubmit={handleRegisterStartup} />}
          />
          <Route path="/status-analise" element={<StartupStatusPage startup={currentStartup} />} />
          <Route
            path="/admin"
            element={
              <AdminPage pendingStartups={pendingStartups} onUpdateStatus={handleUpdateStatus} />
            }
          />
          <Route
            path="/analise"
            element={
              <StartupAnalysisPage
                startup={currentStartup}
                pendingStartups={pendingStartups}
              />
            }
          />
          <Route
            path="/analise/:id"
            element={<StartupAnalysisPage pendingStartups={pendingStartups} />}
          />

          {/* CRUD Startups (OpenAPI & Spring Boot) */}
          <Route path="/startups" element={<StartupsListPage />} />
          <Route path="/startups/nova" element={<StartupFormPage />} />
          <Route path="/startups/:id" element={<StartupDetailPage />} />
          <Route path="/startups/:id/editar" element={<StartupFormPage />} />
          <Route path="/swagger" element={<SwaggerUiPage />} />
          <Route path="/api-docs" element={<SwaggerUiPage />} />

          {/* Páginas Institucionais & Auxiliares */}
          <Route path="/oportunidades" element={<OpportunitiesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/interesses" element={<InterestsPage />} />
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
          <Link to="/feed">Feed da Rede</Link>
          <Link to="/explorar">Explorar</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/startups">Startups (CRUD)</Link>
          <Link to="/negociacoes">Negociações</Link>
          <Link to="/privacidade">Termos de uso</Link>
          <Link to="/privacidade">Política de privacidade</Link>
          <Link to="/privacidade">LGPD</Link>
          <Link to="/admin" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
            Acesso Administrativo
          </Link>
        </div>
      </footer>
    </div>
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

        <h2>Entrar na Rede NEXO</h2>

        <div className="field-group">
          <label htmlFor="email">E-mail corporativo</label>
          <input id="email" type="email" placeholder="seu@email.com" defaultValue="contato@nexo.app" />
        </div>

        <div className="field-group">
          <label htmlFor="password">Senha</label>
          <input id="password" type="password" placeholder="••••••••" defaultValue="********" />
        </div>

        <div className="inline-row">
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Lembrar de mim
          </label>
          <button type="button" className="text-link">
            Esqueci minha senha
          </button>
        </div>

        <div className="choice-row">
          <button
            type="button"
            className={loginRole === 'startup' ? 'choice-option active' : 'choice-option'}
            onClick={() => setLoginRole('startup')}
          >
            🚀 Startup
          </button>
          <button
            type="button"
            className={loginRole === 'investor' ? 'choice-option active' : 'choice-option'}
            onClick={() => setLoginRole('investor')}
          >
            💼 Investidor
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary full glow-btn"
          onClick={() => setActiveRole(loginRole)}
        >
          Entrar como {loginRole === 'startup' ? 'Startup' : 'Investidor'} ➔
        </button>

        <p className="muted-text">
          Ainda não tem conta?{' '}
          <Link to="/signup" className="text-link">
            Cadastre-se na rede
          </Link>
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

        <h2>Crie seu perfil profissional no NEXO</h2>

        <div className="choice-row">
          <button
            type="button"
            className={signupMode === 'startup' ? 'choice-option active' : 'choice-option'}
            onClick={() => setSignupMode('startup')}
          >
            🚀 Sou uma Startup
          </button>
          <button
            type="button"
            className={signupMode === 'investor' ? 'choice-option active' : 'choice-option'}
            onClick={() => setSignupMode('investor')}
          >
            💼 Sou Investidor
          </button>
        </div>

        {signupMode === 'startup' ? (
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(99,102,241,0.08)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: '10px',
                marginBottom: '1.5rem',
              }}
            >
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  color: 'var(--accent, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>🔐</span> Entrada Qualificada & Homologação de Startups
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                }}
              >
                No NEXO, cada startup passa por uma triagem estatística para que investidores
                tenham acesso a métricas auditadas e dados confiáveis de tração.
              </p>
              <ul
                style={{
                  margin: '0.75rem 0 0 0',
                  paddingLeft: '1.2rem',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                <li>Preencha métricas de faturamento, crescimento e captação</li>
                <li>O sistema gerará um diagnóstico com Estatísticas & Probabilidades e projeções</li>
                <li>O comitê administrativo aprovará sua exposição no Catálogo</li>
              </ul>
            </div>

            <button
              type="button"
              className="btn btn-primary full glow-btn"
              style={{ padding: '0.85rem' }}
              onClick={() => setActiveRole('startup')}
            >
              Preencher Cadastro da Startup ➔
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                borderRadius: '10px',
                marginBottom: '1.5rem',
              }}
            >
              <h4
                style={{
                  margin: '0 0 0.5rem 0',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>💼</span> Acesso para Investidores & Fundos
              </h4>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                }}
              >
                Acesso direto ao Feed do ecossistema, busca com filtros avançados de tese no
                Catálogo e envio de propostas estruturadas de investimento.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary full glow-btn"
              style={{ padding: '0.85rem', background: '#10b981' }}
              onClick={() => setActiveRole('investor')}
            >
              Acessar Rede como Investidor ➔
            </button>
          </div>
        )}

        <p className="muted-text">
          Já possui conta?{' '}
          <Link to="/login" className="text-link">
            Entrar
          </Link>
        </p>
      </div>
    </section>
  )
}

function SearchPage({
  activeRole,
  approvedStartups,
}: {
  activeRole: UserRole
  approvedStartups?: Startup[]
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState('Todos')
  const [stageFilter, setStageFilter] = useState('Qualquer')

  const currentStartups = approvedStartups ?? initialStartups
  const list = activeRole === 'startup' ? investors : currentStartups

  const filteredList = list.filter((item) => {
    const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    if (activeRole === 'startup') {
      const inv = item as Investor
      const sectorMatch =
        sectorFilter === 'Todos' || inv.focus.some((f) => f.includes(sectorFilter))
      return nameMatch && sectorMatch
    } else {
      const st = item as Startup
      const sectorMatch = sectorFilter === 'Todos' || st.sector.includes(sectorFilter)
      const stageMatch = stageFilter === 'Qualquer' || st.stage === stageFilter
      return nameMatch && sectorMatch && stageMatch
    }
  })

  return (
    <section className="search-shell">
      <div className="search-topbar">
        <div>
          <p className="label">
            {activeRole === 'startup' ? 'Busca de Investidores' : 'Catálogo de Oportunidades'}
          </p>
          <h2>
            {activeRole === 'startup'
              ? 'Encontre investidores com tese alinhada'
              : 'Startups Homologadas & Auditadas'}
          </h2>
          {activeRole === 'investor' && (
            <p
              style={{
                margin: '0.25rem 0 0 0',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
              }}
            >
              Todas as empresas abaixo passaram pelo processo de triagem e possuem estatísticas e
              projeções validadas disponíveis para investidores.
            </p>
          )}
        </div>
        <div className="search-controls">
          <input
            type="text"
            placeholder={
              activeRole === 'startup'
                ? 'Pesquisar investidor ou área'
                : 'Pesquisar por nome, segmento ou modelo'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="filters-panel">
        <div className="filter-group">
          <label>{activeRole === 'startup' ? 'Área de interesse' : 'Segmento'}</label>
          <select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Logística">Logística</option>
            <option value="Saúde">Saúde Digital</option>
            <option value="Energia">Energia Limpa</option>
            <option value="SaaS">SaaS B2B</option>
          </select>
        </div>

        <div className="filter-group">
          <label>{activeRole === 'startup' ? 'Faixa de investimento' : 'Estágio'}</label>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
            <option value="Qualquer">Qualquer</option>
            <option value="Pré-semente">Pré-semente</option>
            <option value="Seed">Seed</option>
            <option value="Série A">Série A</option>
          </select>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSearchTerm('')
            setSectorFilter('Todos')
            setStageFilter('Qualquer')
          }}
        >
          Limpar filtros
        </button>
      </div>

      <div className="listing-grid">
        {filteredList.map((item) => {
          if (activeRole === 'startup') {
            const investor = item as Investor

            return (
              <article key={investor.id} className="listing-card">
                <div className="card-topline">
                  <span className="pill">{investor.type}</span>
                  <span className="match-badge">{investor.match}%</span>
                </div>
                <h3>{investor.name}</h3>
                <p>
                  {investor.focus.join(', ')} • {investor.city}
                </p>
                <ul>
                  <li>{investor.city}</li>
                  <li>Ticket: {investor.ticket}</li>
                  <li>Foco: {investor.focus[0]}</li>
                </ul>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <Link
                    to={`/perfil/investor/${investor.id}`}
                    className="btn btn-secondary small full"
                  >
                    Ver Perfil
                  </Link>
                  <Link to="/negociacoes" className="btn btn-primary small full">
                    Apresentar Rodada
                  </Link>
                </div>
              </article>
            )
          }

          const startup = item as Startup

          return (
            <article
              key={startup.id}
              className="listing-card"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div className="card-topline">
                <span className="pill">{startup.sector}</span>
                <span
                  className="match-badge"
                  title="Compatibilidade & Índice Estatístico"
                >
                  {startup.match}% Match
                </span>
              </div>
              <h3>{startup.name}</h3>
              <p style={{ flex: 1, color: 'var(--text-secondary)' }}>{startup.description}</p>
              <div style={{ display: 'flex', gap: '0.4rem', margin: '0.5rem 0', flexWrap: 'wrap' }}>
                <span className="pill lite">{startup.stage}</span>
                <span className="pill lite">{startup.city}</span>
                <span
                  className="pill lite"
                  style={{ color: 'var(--accent, #6366f1)', fontWeight: 600 }}
                >
                  Captação: {startup.investment}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Link
                  to={`/perfil/startup/${startup.id}`}
                  className="btn btn-secondary small full"
                  style={{ textAlign: 'center' }}
                >
                  📊 Estatísticas
                </Link>
                <Link
                  to="/negociacoes"
                  className="btn btn-primary small full glow-btn"
                  style={{ textAlign: 'center' }}
                >
                  💚 Demonstrar Interesse
                </Link>
              </div>
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
              <div>
                <span>Setor</span>
                <strong>{item.sector}</strong>
              </div>
              <div>
                <span>Localização</span>
                <strong>{item.location}</strong>
              </div>
              <div>
                <span>Valor</span>
                <strong>{item.value}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{item.status}</strong>
              </div>
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
          <h2>Conexões e respostas da rede</h2>
        </div>
      </div>

      <div className="interest-layout">
        <div className="panel">
          <h3>Interesses enviados</h3>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>NovaFlow</strong>
                <span>Logística SaaS</span>
              </div>
              <span className="mini-badge">Proposta Enviada</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>GreenGrid</strong>
                <span>Energia limpa</span>
              </div>
              <span className="mini-badge" style={{ color: '#22c55e' }}>
                Acordo Fechado
              </span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>Interesses recebidos</h3>
          <div className="mini-list">
            <div className="mini-item">
              <div>
                <strong>Atlas Ventures</strong>
                <span>Fundo VC</span>
              </div>
              <span className="mini-badge">Novo Match</span>
            </div>
            <div className="mini-item">
              <div>
                <strong>Helena Costa</strong>
                <span>Investidora Anjo</span>
              </div>
              <span className="mini-badge">Proposta Ativa</span>
            </div>
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
          <p className="label">Configurações</p>
          <h2>Preferências e conta</h2>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <h3>Dados cadastrais</h3>
          <div className="field-group">
            <label>Email profissional</label>
            <input defaultValue="contato@nexo.app" />
          </div>
          <div className="field-group">
            <label>Localização</label>
            <input defaultValue="São Paulo - SP" />
          </div>
        </div>

        <div className="panel">
          <h3>Privacidade & Rede</h3>
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Permitir contato de investidores qualificados
          </label>
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Mostrar perfil e publicações no Explorar
          </label>
          <label className="checkbox-row">
            <input type="checkbox" defaultChecked />
            Receber notificações de propostas e contrapropostas
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
          <h2>Termos, LGPD e Segurança da Informação</h2>
        </div>
      </div>

      <div className="privacy-card panel" style={{ padding: '2rem' }}>
        <h3>Governança de Dados no NEXO</h3>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Ao utilizar a plataforma, fundadores e investidores concordam com o tratamento seguro de
          métricas financeiras e societárias para fins de descoberta, auditoria estatística e
          matchmaking qualificado.
        </p>
        <h3>Política de Confidencialidade</h3>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Os dados estratégicos de propostas e contrapropostas de investimento são restritos
          exclusivamente às partes envolvidas na rodada ativa e ao comitê de governança do NEXO.
        </p>
        <h3>Conformidade LGPD</h3>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>
          Você pode solicitar alteração, visualização ou exclusão dos dados da sua organização a
          qualquer momento através do suporte ou no painel de configurações.
        </p>
      </div>
    </section>
  )
}

export default App
