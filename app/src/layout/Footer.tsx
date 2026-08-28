import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand-column">
          <Link to="/" className="brand">
            <div className="brand-logo-wrap small">
              <img src="/logo.png" alt="Nexo logo" className="brand-logo small" />
            </div>
            <span className="brand-name">Nexo</span>
          </Link>
          <p className="footer-tagline">
            A plataforma inteligente que conecta startups escaláveis aos investidores certos com inteligência e precisão.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Plataforma</h4>
            <Link to="/buscar">Buscar Startups</Link>
            <Link to="/buscar">Buscar Investidores</Link>
            <Link to="/oportunidades">Rodadas Abertas</Link>
            <Link to="/signup">Cadastrar Empresa</Link>
          </div>
          <div className="footer-col">
            <h4>Navegação</h4>
            <Link to="/">Início</Link>
            <Link to="/#como-funciona">Como Funciona</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/matches">Matches</Link>
          </div>
          <div className="footer-col">
            <h4>Institucional & Legal</h4>
            <Link to="/privacidade">Termos de Uso</Link>
            <Link to="/privacidade">Política de Privacidade</Link>
            <Link to="/privacidade">LGPD & Segurança</Link>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn Oficial</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Nexo Tecnologia S.A. Todos os direitos reservados.</p>
        <div className="footer-badges">
          <span className="secure-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Conexões Criptografadas & LGPD Compliant
          </span>
        </div>
      </div>
    </footer>
  )
}
