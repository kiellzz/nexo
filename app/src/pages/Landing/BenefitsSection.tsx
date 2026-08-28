import { Link } from 'react-router-dom'

export function BenefitsSection() {
  return (
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
  )
}
