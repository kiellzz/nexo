import { Link, NavLink } from 'react-router-dom'
import type { UserRole } from '../types'

interface SocialNavbarProps {
  activeRole: UserRole
  onToggleRole: (role: UserRole) => void
  unreadNotifsCount?: number
  activeNegotiationsCount?: number
}

export function SocialNavbar({
  activeRole,
  onToggleRole,
  unreadNotifsCount = 2,
  activeNegotiationsCount = 2,
}: SocialNavbarProps) {
  const currentProfile =
    activeRole === 'startup'
      ? {
          name: 'NovaFlow',
          roleLabel: 'Startup Validada',
          avatar: '🚚',
          profileUrl: '/perfil/startup/1',
        }
      : {
          name: 'Helena Costa',
          roleLabel: 'Investidora Anjo',
          avatar: '👩‍💼',
          profileUrl: '/perfil/investor/1',
        }

  return (
    <header className="social-topbar">
      <div className="social-topbar-inner">
        {/* Brand */}
        <div className="social-brand-group">
          <Link to="/feed" className="brand" aria-label="Ir para o Feed da Nexo">
            <img src="/logo.png" alt="Nexo logo" className="brand-logo" />
            <span className="brand-name">Nexo</span>
          </Link>
          <span className="social-network-badge">Rede Profissional</span>
        </div>

        {/* Main Navigation */}
        <nav className="social-nav" aria-label="Navegação da Rede Social">
          <NavLink
            to="/feed"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Feed</span>
          </NavLink>

          <NavLink
            to="/explorar"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🔎</span>
            <span className="nav-text">Explorar</span>
          </NavLink>

          <NavLink
            to="/catalogo"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Catálogo</span>
          </NavLink>

          <NavLink
            to="/startups"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🏢</span>
            <span className="nav-text">Startups</span>
          </NavLink>

          <NavLink
            to="/negociacoes"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🤝</span>
            <span className="nav-text">Negociações</span>
            {activeNegotiationsCount > 0 && (
              <span className="nav-counter">{activeNegotiationsCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/mensagens"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Mensagens</span>
          </NavLink>

          <NavLink
            to="/notificacoes"
            className={({ isActive }) => `social-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🔔</span>
            <span className="nav-text">Notificações</span>
            {unreadNotifsCount > 0 && (
              <span className="nav-counter glow">{unreadNotifsCount}</span>
            )}
          </NavLink>
        </nav>

        {/* Controls & Persona Switcher */}
        <div className="social-actions">
          {/* Alternador de Persona (Startup x Investidor) */}
          <div className="persona-switcher" title="Alterne entre visão de Startup ou Investidor">
            <button
              type="button"
              className={`persona-btn ${activeRole === 'startup' ? 'active' : ''}`}
              onClick={() => onToggleRole('startup')}
            >
              🚀 Startup
            </button>
            <button
              type="button"
              className={`persona-btn ${activeRole === 'investor' ? 'active' : ''}`}
              onClick={() => onToggleRole('investor')}
            >
              💼 Investidor
            </button>
          </div>

          {/* Link para Landing Page */}
          <Link to="/" className="btn-lp-return" title="Ver a Landing Page pública">
            🌐 Landing Page
          </Link>

          {/* Perfil Ativo */}
          <Link to={currentProfile.profileUrl} className="social-user-pill">
            <span className="user-avatar">{currentProfile.avatar}</span>
            <div className="user-info">
              <strong className="user-name">{currentProfile.name}</strong>
              <span className="user-role">{currentProfile.roleLabel}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

