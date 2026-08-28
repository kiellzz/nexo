export function HowItWorksSection() {
  return (
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
  )
}
