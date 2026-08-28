import { Link } from 'react-router-dom'

export function CtaBanner() {
  return (
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
  )
}
