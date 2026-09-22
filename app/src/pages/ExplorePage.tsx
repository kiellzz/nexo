import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole } from '../types'
import { startups, investors, mockSocialPosts } from '../data/mockData'

interface ExplorePageProps {
  activeRole?: UserRole
}

export function ExplorePage({ activeRole: _activeRole }: ExplorePageProps) {
  const [activeTab, setActiveTab] = useState<'startups' | 'investidores' | 'empresas' | 'publicacoes'>('startups')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState('Todos')
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})

  function toggleFollow(key: string) {
    setFollowingMap((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const filteredStartups = startups.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchSector = selectedSector === 'Todos' || s.sector.includes(selectedSector)
    return matchSearch && matchSector
  })

  const filteredInvestors = investors.filter((inv) => {
    const matchSearch =
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.focus.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchSearch
  })

  const filteredPosts = mockSocialPosts.filter((p) =>
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="explore-shell">
      <div className="explore-header-panel">
        <div>
          <span className="label">Descoberta do Ecossistema</span>
          <h2>Explorar Startups, Investidores e Negócios</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Encontre fundadores, teses de investimento e publicações relevantes na rede NEXO.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="explore-controls-row">
          <input
            type="text"
            placeholder="Pesquisar por nome, setor, modelo ou palavras-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="explore-search-input"
          />

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="explore-select"
          >
            <option value="Todos">Todos os setores</option>
            <option value="Logística">Logística</option>
            <option value="Saúde">Saúde Digital</option>
            <option value="Energia">Energia Limpa</option>
            <option value="SaaS">SaaS B2B</option>
          </select>
        </div>

        {/* Abas de Descoberta */}
        <div className="explore-tabs-bar">
          <button
            type="button"
            className={`explore-tab ${activeTab === 'startups' ? 'active' : ''}`}
            onClick={() => setActiveTab('startups')}
          >
            🚀 Startups ({filteredStartups.length})
          </button>
          <button
            type="button"
            className={`explore-tab ${activeTab === 'investidores' ? 'active' : ''}`}
            onClick={() => setActiveTab('investidores')}
          >
            💼 Investidores ({filteredInvestors.length})
          </button>
          <button
            type="button"
            className={`explore-tab ${activeTab === 'empresas' ? 'active' : ''}`}
            onClick={() => setActiveTab('empresas')}
          >
            🏢 Empresas & Scale-ups
          </button>
          <button
            type="button"
            className={`explore-tab ${activeTab === 'publicacoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('publicacoes')}
          >
            📢 Publicações ({filteredPosts.length})
          </button>
        </div>
      </div>

      {/* CONTEÚDO DAS ABAS */}
      <div className="explore-content-area">
        {/* ABA STARTUPS */}
        {activeTab === 'startups' && (
          <div className="explore-grid">
            {filteredStartups.map((st) => {
              const isFollowing = followingMap[`st-${st.id}`]

              return (
                <div key={st.id} className="explore-card">
                  <div className="explore-card-top">
                    <span className="explore-card-avatar">{st.avatar || '🚀'}</span>
                    <button
                      type="button"
                      className={`btn-follow ${isFollowing ? 'following' : ''}`}
                      onClick={() => toggleFollow(`st-${st.id}`)}
                    >
                      {isFollowing ? '✓ Seguindo' : '+ Seguir'}
                    </button>
                  </div>

                  <div className="explore-card-body">
                    <h3>{st.name}</h3>
                    <span className="explore-tag">
                      {st.sector} • {st.stage} • {st.city}
                    </span>
                    <p className="explore-desc">{st.description}</p>

                    <div className="explore-kpis-mini">
                      <div>
                        <span>Captação</span>
                        <strong>{st.investment}</strong>
                      </div>
                      <div>
                        <span>Equity</span>
                        <strong>{st.equityOffered || '10%'}</strong>
                      </div>
                      <div>
                        <span>Match</span>
                        <strong style={{ color: 'var(--accent, #6366f1)' }}>{st.match}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="explore-card-footer">
                    <Link to={`/perfil/startup/${st.id}`} className="btn btn-secondary small full">
                      Ver Perfil & Estatísticas
                    </Link>
                    <Link to="/negociacoes" className="btn btn-primary small full">
                      Demonstrar Interesse
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ABA INVESTIDORES */}
        {activeTab === 'investidores' && (
          <div className="explore-grid">
            {filteredInvestors.map((inv) => {
              const isFollowing = followingMap[`inv-${inv.id}`]

              return (
                <div key={inv.id} className="explore-card">
                  <div className="explore-card-top">
                    <span className="explore-card-avatar">{inv.avatar || '💼'}</span>
                    <button
                      type="button"
                      className={`btn-follow ${isFollowing ? 'following' : ''}`}
                      onClick={() => toggleFollow(`inv-${inv.id}`)}
                    >
                      {isFollowing ? '✓ Conectado' : '+ Conectar'}
                    </button>
                  </div>

                  <div className="explore-card-body">
                    <h3>{inv.name}</h3>
                    <span className="explore-tag">
                      {inv.type} • {inv.city}
                    </span>
                    <p className="explore-desc">{inv.thesis}</p>

                    <div className="explore-kpis-mini">
                      <div>
                        <span>Ticket</span>
                        <strong>{inv.ticket}</strong>
                      </div>
                      <div>
                        <span>Foco</span>
                        <strong>{inv.focus[0]}</strong>
                      </div>
                      <div>
                        <span>Aderência</span>
                        <strong style={{ color: '#22c55e' }}>{inv.match}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="explore-card-footer">
                    <Link to={`/perfil/investor/${inv.id}`} className="btn btn-secondary small full">
                      Ver Perfil Completo
                    </Link>
                    <Link to="/mensagens" className="btn btn-ghost small full">
                      Enviar Mensagem
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ABA EMPRESAS */}
        {activeTab === 'empresas' && (
          <div className="panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🏢</span>
            <h3>Empresas & Parceiros Corporativos do NEXO</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 1.5rem auto' }}>
              Grandes corporações e aceleradoras parceiras divulgam desafios de inovação aberta,
              contratações de fornecedores SaaS e programas de coinvestimento.
            </p>
            <div className="explore-grid" style={{ marginTop: '1.5rem' }}>
              <div className="explore-card">
                <div className="explore-card-top">
                  <span className="explore-card-avatar">🏛️</span>
                  <button className="btn-follow">+ Seguir</button>
                </div>
                <div className="explore-card-body">
                  <h3>NEXO Corporate Hub</h3>
                  <span className="explore-tag">Inovação Aberta • São Paulo</span>
                  <p className="explore-desc">
                    Programa contínuo conectando grandes empresas a startups homologadas no catálogo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA PUBLICAÇÕES */}
        {activeTab === 'publicacoes' && (
          <div className="explore-posts-list">
            {filteredPosts.map((p) => (
              <div key={p.id} className="explore-post-card panel">
                <div className="post-header-mockup">
                  <span className="author-avatar-mockup">{p.authorAvatar}</span>
                  <div>
                    <strong>{p.authorName}</strong>
                    <span className="badge-mockup">{p.authorType}</span>
                    <small className="time-mockup">{p.createdAt}</small>
                  </div>
                </div>
                <p style={{ margin: '0.75rem 0', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {p.content}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/feed" className="btn btn-secondary small">
                    Ver no Feed
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
