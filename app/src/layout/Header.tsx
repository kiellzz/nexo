import { Link } from 'react-router-dom'
import { navItems } from './navItems'

export function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link to="/" className="brand" aria-label="Ir para a página inicial">
          <div className="brand-logo-wrap">
            <img src="/logo.png" alt="Nexo logo" className="brand-logo" />
          </div>
          <span className="brand-name">Nexo</span>
        </Link>

        <nav className="main-nav" aria-label="Navegação principal">
          {navItems.map((item) => (
            <Link key={item.label} to={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-nav-secondary">
            Entrar
          </Link>
          <Link to="/signup" className="btn btn-primary btn-nav-cta">
            <span>Criar conta</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
