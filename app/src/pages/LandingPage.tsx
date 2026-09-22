import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <div className="landing-container">
      {/* 10. HEADER DA LANDING PAGE (Sticky) */}
      <header className="lp-header">
        <div className="lp-header-inner">
          <Link to="/" className="brand" aria-label="Nexo Página Inicial">
            <img src="/logo.png" alt="Nexo logo" className="brand-logo" />
            <span className="brand-name">Nexo</span>
          </Link>

          <nav className="lp-nav" aria-label="Navegação da Landing Page">
            <a href="#sobre" className="lp-nav-link">O que é</a>
            <a href="#como-funciona" className="lp-nav-link">Como funciona</a>
            <a href="#feed-ecossistema" className="lp-nav-link">O Feed</a>
            <a href="#para-startups" className="lp-nav-link">Para Startups</a>
            <a href="#para-investidores" className="lp-nav-link">Para Investidores</a>
            <a href="#estatisticas" className="lp-nav-link">Estatísticas</a>
            <a href="#match-negociacao" className="lp-nav-link">Negociação</a>
          </nav>

          <div className="lp-actions">
            <Link to="/login" className="btn btn-secondary small">
              Entrar
            </Link>
            <Link to="/signup" className="btn btn-primary small">
              Criar perfil
            </Link>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <div className="lp-eyebrow">
            <span className="pulse-dot"></span>
            A Rede Social Profissional de Inovação & Capital
          </div>

          <h1 className="lp-hero-title">
            Onde startups encontram investidores. <br />
            <span className="gradient-text">E conexões se transformam em negócios.</span>
          </h1>

          <p className="lp-hero-subtitle">
            O NEXO conecta startups e investidores em uma rede profissional criada para descoberta,
            relacionamento e negociação. Conheça empresas, acompanhe conquistas no Feed, analise
            estatísticas auditadas e feche acordos dentro da plataforma.
          </p>

          <div className="lp-hero-buttons">
            <Link to="/feed" className="btn btn-primary large glow-btn">
              🚀 Explorar o NEXO
            </Link>
            <Link to="/signup?role=startup" className="btn btn-secondary large">
              Sou uma Startup
            </Link>
            <Link to="/signup?role=investor" className="btn btn-secondary large">
              Sou um Investidor
            </Link>
          </div>

          <div className="lp-hero-stats">
            <div className="stat-box">
              <strong>+1.400</strong>
              <span>Startups cadastradas</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <strong>+380</strong>
              <span>Investidores ativos</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <strong>R$ 48M+</strong>
              <span>Em rodadas negociadas</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-box">
              <strong>94%</strong>
              <span>Assertividade de match</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Mockup Showcase */}
        <div className="lp-hero-visual">
          <div className="showcase-glass-card main-showcase">
            <div className="showcase-header">
              <div className="author-row">
                <span className="avatar-chip">🚚</span>
                <div>
                  <div className="name-badge">
                    <strong>NovaFlow</strong>
                    <span className="verified-pill">✓ Startup Homologada</span>
                  </div>
                  <span className="subtext">Logística & SaaS B2B • São Paulo - SP</span>
                </div>
              </div>
              <span className="match-pill">92% Match</span>
            </div>

            <div className="showcase-post-body">
              <p>
                🚀 Abrimos nossa rodada Seed de R$ 1,2M por 10% de equity no NEXO! Acelerando rotas
                inteligentes com MRR de R$ 150k (+18% MoM).
              </p>
              <div className="showcase-metric-tag">
                <span>Captação: R$ 1,2M</span>
                <span>•</span>
                <span>Equity: 10%</span>
                <span>•</span>
                <span>Índice Estatístico: 78/100</span>
              </div>
            </div>

            <div className="showcase-negotiation-preview">
              <div className="neg-chip">
                <span className="chip-icon">🤝</span>
                <span>Helena Costa (Investidora Anjo) propôs: <strong>R$ 1,2M por 10%</strong></span>
              </div>
              <span className="neg-status-tag">Proposta em Análise</span>
            </div>
          </div>

          {/* Floating Accents */}
          <div className="floating-badge badge-top-right">
            <span>🔥 Deu Match!</span>
            <small>Interesse mútuo confirmado</small>
          </div>
          <div className="floating-badge badge-bottom-left">
            <span>📊 Métricas Auditadas</span>
            <small>Unit Economics & Projeções</small>
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO "O QUE É O NEXO?" */}
      <section id="sobre" className="lp-section">
        <div className="lp-section-header">
          <span className="section-tag">O Conceito</span>
          <h2>O que é o NEXO?</h2>
          <p>
            O NEXO não é apenas um catálogo de empresas nem uma rede social genérica. É a primeira
            <strong> rede profissional de negócios</strong> onde fundadores e investidores constroem
            relacionamento contínuo, validam tração e realizam rodadas de ponta a ponta.
          </p>
        </div>

        <div className="pilares-grid">
          <div className="pilar-card">
            <div className="pilar-icon">🌐</div>
            <h3>Networking</h3>
            <p>
              Startups e investidores criam seus próprios perfis profissionais, compartilham
              atualizações de mercado, teses e podem se conectar diretamente com outros participantes
              do ecossistema de inovação.
            </p>
            <div className="pilar-feature-list">
              <span>✓ Feed dinâmico de publicações</span>
              <span>✓ Perfis de startups e investidores</span>
              <span>✓ Conexões profissionais diretas</span>
            </div>
          </div>

          <div className="pilar-card highlight">
            <div className="pilar-icon">📊</div>
            <h3>Descoberta</h3>
            <p>
              Usuários encontram oportunidades qualificadas através do Feed, da aba Explorar e do
              Catálogo de Startups com dados abertos, histórico de crescimento e análise de risco
              estruturada.
            </p>
            <div className="pilar-feature-list">
              <span>✓ Catálogo com filtros de tese e ticket</span>
              <span>✓ Estatísticas & Probabilidades</span>
              <span>✓ Curadoria administrativa e dados auditados</span>
            </div>
          </div>

          <div className="pilar-card">
            <div className="pilar-icon">🤝</div>
            <h3>Negociação</h3>
            <p>
              Quando existe interesse mútuo entre as partes, a plataforma abre um ambiente seguro de
              negociação para estruturação de propostas, contrapropostas, termos de governança e
              acordos formais.
            </p>
            <div className="pilar-feature-list">
              <span>✓ Registro de interesse mútuo e match</span>
              <span>✓ Histórico de propostas e valuation</span>
              <span>✓ Chat direto integrado à rodada</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO "COMO FUNCIONA?" */}
      <section id="como-funciona" className="lp-section alt-bg">
        <div className="lp-section-header">
          <span className="section-tag">Jornada Completa</span>
          <h2>Como funciona o ciclo na plataforma</h2>
          <p>
            Da primeira conexão até a assinatura do acordo de investimento: um fluxo fluido, seguro
            e transparente.
          </p>
        </div>

        <div className="steps-flow">
          {[
            {
              step: '1',
              title: 'Crie seu perfil',
              desc: 'Startup ou investidor cria seu perfil profissional detalhando modelo de negócio ou tese de aporte.',
              icon: '👤',
            },
            {
              step: '2',
              title: 'Conecte-se',
              desc: 'Usuários acompanham empresas, fundadores, fundos e conteúdos relevantes no feed da rede.',
              icon: '🌐',
            },
            {
              step: '3',
              title: 'Descubra oportunidades',
              desc: 'O Feed, a busca no Explorar e o Catálogo permitem encontrar negócios alinhados aos seus objetivos.',
              icon: '🔎',
            },
            {
              step: '4',
              title: 'Demonstre interesse',
              desc: 'Um investidor pode demonstrar interesse em uma startup, e a startup também pode demonstrar interesse no investidor.',
              icon: '💚',
            },
            {
              step: '5',
              title: 'Match',
              desc: 'Quando existe interesse mútuo, as duas partes recebem notificação e o canal direto é aberto.',
              icon: '🔥',
            },
            {
              step: '6',
              title: 'Negocie',
              desc: 'A negociação acontece dentro do NEXO, com mensagens, propostas, contrapropostas de equity e acordo final.',
              icon: '🤝',
            },
          ].map((item) => (
            <div key={item.step} className="step-node">
              <div className="step-circle">
                <span className="step-num">{item.step}</span>
                <span className="step-emoji">{item.icon}</span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SEÇÃO EXPLICANDO O FEED */}
      <section id="feed-ecossistema" className="lp-section">
        <div className="lp-section-header">
          <span className="section-tag">Rede em Tempo Real</span>
          <h2>Um espaço para acompanhar o ecossistema</h2>
          <p>
            O Feed do NEXO é o centro de gravidade da plataforma. Nele, o mercado compartilha
            tração com transparência e investidores expõem suas teses com clareza.
          </p>
        </div>

        <div className="feed-showcase-layout">
          <div className="feed-columns-explanation">
            <div className="feed-expl-box startup-box">
              <div className="expl-header">
                <span className="expl-icon">🚀</span>
                <h4>Startups publicam:</h4>
              </div>
              <ul>
                <li>Resultados operacionais e métricas de crescimento (MRR, ARR)</li>
                <li>Novidades sobre produtos e lançamentos de features</li>
                <li>Expansões para novos mercados e cidades</li>
                <li>Conquistas, premiações e marcos de clientes atendidos</li>
                <li>Abertura oficial de rodadas de captação no NEXO</li>
              </ul>
            </div>

            <div className="feed-expl-box investor-box">
              <div className="expl-header">
                <span className="expl-icon">💼</span>
                <h4>Investidores publicam:</h4>
              </div>
              <ul>
                <li>Teses de investimento ativas e tickets praticados</li>
                <li>Setores prioritários de interesse e busca de soluções</li>
                <li>Oportunidades de aceleração, mentorias e eventos</li>
                <li>Artigos, insights de mercado e orientações para fundadores</li>
                <li>Atualizações sobre o portfólio de empresas investidas</li>
              </ul>
            </div>

            <div className="feed-interactions-row">
              <span className="interaction-badge">❤️ Curtir & Reagir</span>
              <span className="interaction-badge">💬 Comentar & Debater</span>
              <span className="interaction-badge">🔁 Compartilhar</span>
              <span className="interaction-badge">🔖 Salvar Oportunidades</span>
            </div>
          </div>

          {/* Feed Mockup Preview */}
          <div className="feed-preview-mockup">
            <div className="mockup-top-bar">
              <span className="mockup-dot red"></span>
              <span className="mockup-dot yellow"></span>
              <span className="mockup-dot green"></span>
              <span className="mockup-title">Feed da Rede NEXO</span>
            </div>

            <div className="mockup-post">
              <div className="post-header-mockup">
                <span className="author-avatar-mockup">⚡</span>
                <div>
                  <strong>GreenGrid</strong>
                  <span className="badge-mockup">Startup Homologada</span>
                  <small className="time-mockup">Há 4h • Energia Limpa</small>
                </div>
              </div>
              <p className="post-text-mockup">
                Ultrapassamos a marca de 50 plantas industriais monitoradas com redução de 18% no
                desperdício de energia! Agradecemos aos investidores da rede pelo apoio contínuo.
              </p>
              <div className="post-metric-pill">
                50+ Plantas Ativas • 18% Economia Média Gerada
              </div>
              <div className="post-actions-mockup">
                <span>❤️ 52 curtidas</span>
                <span>💬 7 comentários</span>
                <span>🔁 Compartilhar</span>
              </div>
            </div>

            <div className="mockup-post">
              <div className="post-header-mockup">
                <span className="author-avatar-mockup">👩‍💼</span>
                <div>
                  <strong>Helena Costa</strong>
                  <span className="badge-mockup investor">Investidora Anjo</span>
                  <small className="time-mockup">Há 6h • Tese de Investimento</small>
                </div>
              </div>
              <p className="post-text-mockup">
                Buscando startups B2B SaaS no Catálogo com margem bruta {'>'} 70% e payback sob 8 meses.
                Ticket de R$ 300k a R$ 1M. Conecte-se comigo!
              </p>
              <div className="post-actions-mockup">
                <span>❤️ 68 curtidas</span>
                <span>💬 14 comentários</span>
                <span>🔁 Compartilhar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO "PARA STARTUPS" */}
      <section id="para-startups" className="lp-section alt-bg">
        <div className="lp-section-header">
          <span className="section-tag">Para Fundadores</span>
          <h2>Apresente sua empresa para quem está procurando oportunidades</h2>
          <p>
            Ganhe visibilidade qualificada diante de investidores ativos e elimine o envio frio de
            materiais que ninguém lê.
          </p>
        </div>

        <div className="persona-split-grid">
          <div className="persona-benefits">
            <ul className="benefit-checklist">
              <li>
                <strong>Crie um perfil profissional completo:</strong> Posicione sua marca no centro
                do ecossistema.
              </li>
              <li>
                <strong>Apresente seus fundadores e equipe:</strong> Destaque o histórico técnico e de
                negócios do time.
              </li>
              <li>
                <strong>Mostre seus produtos e tração:</strong> Publique novidades, expansões e
                marcos no Feed.
              </li>
              <li>
                <strong>Apresente métricas auditadas:</strong> Dados de faturamento, margens e custos
                validados pelo comitê.
              </li>
              <li>
                <strong>Receba interesse de investidores:</strong> Seja descoberto por quem possui
                tese alinhada ao seu setor.
              </li>
              <li>
                <strong>Inicie negociações estruturadas:</strong> Receba termos, discuta contrapropostas
                e feche sua rodada com segurança.
              </li>
            </ul>

            <Link to="/signup?role=startup" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Cadastrar minha Startup no NEXO ➔
            </Link>
          </div>

          <div className="persona-preview-card">
            <div className="preview-card-header">
              <div className="preview-avatar">🚚</div>
              <div>
                <h3>NovaFlow Tecnologia</h3>
                <span className="sector-tag">Logística • Série A • São Paulo</span>
              </div>
            </div>
            <p className="preview-desc">
              Otimização de rotas e frotas urbanas com software proprietário de alta densidade.
            </p>
            <div className="preview-kpis">
              <div><span>MRR</span><strong>R$ 150k</strong></div>
              <div><span>Crescimento MoM</span><strong>+18%</strong></div>
              <div><span>Captação</span><strong>R$ 1,2M</strong></div>
              <div><span>Equity</span><strong>10%</strong></div>
            </div>
            <div className="preview-action-row">
              <span className="status-badge-live">Disponível para Negociação</span>
              <button className="btn btn-secondary small" type="button">Ver Perfil Completo</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEÇÃO "PARA INVESTIDORES" */}
      <section id="para-investidores" className="lp-section">
        <div className="lp-section-header">
          <span className="section-tag">Para Investidores & Fundos</span>
          <h2>Descubra empresas e encontre novas oportunidades</h2>
          <p>
            Tenha acesso a um catálogo curado de negócios com números auditados, modelagem de cenários
            e canal direto com os fundadores.
          </p>
        </div>

        <div className="persona-split-grid reverse">
          <div className="persona-benefits">
            <ul className="benefit-checklist">
              <li>
                <strong>Crie seu perfil de investidor:</strong> Defina sua tese, histórico de exits e
                empresas apoiadas.
              </li>
              <li>
                <strong>Defina setores e estágios de interesse:</strong> Filtre de Pré-semente a
                Expansão com total precisão.
              </li>
              <li>
                <strong>Acompanhe empresas no Feed:</strong> Observe a consistência dos fundadores
                ao longo dos meses.
              </li>
              <li>
                <strong>Consulte Estatísticas & Probabilidades:</strong> Acesse saúde financeira,
                matriz SWOT e projeções em 3 cenários.
              </li>
              <li>
                <strong>Demonstre interesse mútuo:</strong> Inicie conversas sem intermediários quando
                houver fit mútuo.
              </li>
              <li>
                <strong>Envie propostas e contrapropostas:</strong> Estruture o valuation e termos de
                governança na plataforma.
              </li>
            </ul>

            <Link to="/signup?role=investor" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Criar Perfil de Investidor no NEXO ➔
            </Link>
          </div>

          <div className="persona-preview-card">
            <div className="preview-card-header">
              <div className="preview-avatar">👩‍💼</div>
              <div>
                <h3>Helena Costa</h3>
                <span className="sector-tag">Investidora Anjo • Belo Horizonte</span>
              </div>
            </div>
            <p className="preview-desc">
              Tese voltada para soluções SaaS B2B e Saúde Digital com modelo escalável e margens
              defensáveis.
            </p>
            <div className="preview-kpis">
              <div><span>Ticket</span><strong>R$ 300k - 1M</strong></div>
              <div><span>Estágios</span><strong>Pré-seed & Seed</strong></div>
              <div><span>Portfólio</span><strong>7 Startups</strong></div>
              <div><span>Status</span><strong>Aportes Ativos</strong></div>
            </div>
            <div className="preview-action-row">
              <span className="status-badge-live">Tese Aberta no Catálogo</span>
              <button className="btn btn-secondary small" type="button">Conectar com Investidora</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SEÇÃO DE ESTATÍSTICAS & PROBABILIDADES */}
      <section id="estatisticas" className="lp-section alt-bg">
        <div className="lp-section-header">
          <span className="section-tag">Fundamentos & Decisão</span>
          <h2>Estatísticas & Probabilidades de Crescimento</h2>
          <p>
            O NEXO utiliza os dados reais fornecidos pelas startups para gerar indicadores técnicos
            que ajudam investidores e fundadores a avaliar oportunidades com clareza matemática.
          </p>
        </div>

        <div className="stats-cards-grid">
          <div className="stat-card-feature">
            <span className="stat-feat-icon">🎯</span>
            <h4>Índice Estatístico</h4>
            <p>Score consolidado de 0 a 100 que pondera tração, consistência de margens e governança.</p>
          </div>

          <div className="stat-card-feature">
            <span className="stat-feat-icon">💚</span>
            <h4>Saúde Financeira</h4>
            <p>Auditoria de fluxo de caixa, burn rate, runway e unit economics operacionais.</p>
          </div>

          <div className="stat-card-feature">
            <span className="stat-feat-icon">🚀</span>
            <h4>Potencial de Escala</h4>
            <p>Dimensionamento de TAM/SAM/SOM e capacidade de expansão sem aumento linear de custo.</p>
          </div>

          <div className="stat-card-feature">
            <span className="stat-feat-icon">🛡️</span>
            <h4>Análise de Risco</h4>
            <p>Mapeamento de concentração de clientes, riscos regulatórios e dependência de canais.</p>
          </div>

          <div className="stat-card-feature">
            <span className="stat-feat-icon">📋</span>
            <h4>Matriz SWOT</h4>
            <p>Quadro com forças, fraquezas, oportunidades e ameaças validado por comitê de analistas.</p>
          </div>

          <div className="stat-card-feature">
            <span className="stat-feat-icon">📈</span>
            <h4>Projeções em 3 Cenários</h4>
            <p>Modelos de faturamento e valuation em 12 e 24 meses: Pessimista, Realista e Otimista.</p>
          </div>
        </div>
      </section>

      {/* 8. SEÇÃO "DO MATCH À NEGOCIAÇÃO" */}
      <section id="match-negociacao" className="lp-section">
        <div className="lp-section-header">
          <span className="section-tag">O Diferencial do NEXO</span>
          <h2>Do Match à Negociação</h2>
          <p>
            O objetivo não termina quando duas pessoas demonstram interesse mútuo. O NEXO fornece a
            infraestrutura completa para transformar conexões em rodadas de investimento fechadas.
          </p>
        </div>

        <div className="deal-pipeline-container">
          <div className="pipeline-track">
            <div className="pipeline-step active">
              <div className="pip-badge">01</div>
              <h4>Startup & Investidor</h4>
              <p>Descoberta pelo Feed, Explorar ou Catálogo de oportunidades homologadas.</p>
            </div>
            <div className="pip-arrow">➔</div>

            <div className="pipeline-step active">
              <div className="pip-badge">02</div>
              <h4>Interesse Mútuo</h4>
              <p>Ambas as partes confirmam interesse com base em teses e estatísticas.</p>
            </div>
            <div className="pip-arrow">➔</div>

            <div className="pipeline-step highlight">
              <div className="pip-badge">03</div>
              <h4>Match 🔥</h4>
              <p>Notificação instantânea e abertura da sala de negociações direta.</p>
            </div>
            <div className="pip-arrow">➔</div>

            <div className="pipeline-step">
              <div className="pip-badge">04</div>
              <h4>Conversa & Termos</h4>
              <p>Alinhamento de expectativas e envio da primeira proposta de investimento.</p>
            </div>
            <div className="pip-arrow">➔</div>

            <div className="pipeline-step">
              <div className="pip-badge">05</div>
              <h4>Contraproposta</h4>
              <p>Ajustes dinâmicos de valuation, percentual de equity e condições de governança.</p>
            </div>
            <div className="pip-arrow">➔</div>

            <div className="pipeline-step success">
              <div className="pip-badge">06</div>
              <h4>Acordo 🤝</h4>
              <p>Aceite formal dos termos entre os fundadores e o investidor ou fundo.</p>
            </div>
          </div>

          <div className="deal-callout-box">
            <div className="callout-content">
              <h3>Negociação transparente, sem intermediários e com dados validados</h3>
              <p>
                Acompanhe o valuation implícito, defina cláusulas de vesting, conselho e
                prestação de contas diretamente no Hub de Negociações da plataforma.
              </p>
            </div>
            <Link to="/negociacoes" className="btn btn-primary large">
              Ver Hub de Negociações ➔
            </Link>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION FINAL */}
      <section className="lp-final-cta">
        <div className="final-cta-card">
          <span className="cta-icon">🌟</span>
          <h2>Sua próxima conexão pode transformar seu próximo negócio.</h2>
          <p>
            Crie seu perfil no NEXO e faça parte de uma rede construída para aproximar startups e
            investidores de forma séria, ágil e focada em resultados.
          </p>
          <div className="final-cta-buttons">
            <Link to="/signup" className="btn btn-primary large glow-btn">
              Criar perfil gratuito
            </Link>
            <Link to="/feed" className="btn btn-secondary large">
              Conhecer o NEXO
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

