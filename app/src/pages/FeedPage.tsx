import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole, SocialPost, PostCategory } from '../types'
import { mockSocialPosts, startups, investors } from '../data/mockData'

interface FeedPageProps {
  activeRole: UserRole
}

export function FeedPage({ activeRole }: FeedPageProps) {
  const [posts, setPosts] = useState<SocialPost[]>(mockSocialPosts)
  const [newPostText, setNewPostText] = useState('')
  const [newPostCategory, setNewPostCategory] = useState<PostCategory>('atualizacao')
  const [newPostMetricLabel, setNewPostMetricLabel] = useState('')
  const [newPostMetricValue, setNewPostMetricValue] = useState('')
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  function showToast(msg: string) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Identidade do usuário ativo
  const activeUser =
    activeRole === 'startup'
      ? {
          id: 1,
          name: 'NovaFlow',
          role: 'startup' as const,
          type: 'Logística & SaaS B2B',
          avatar: '🚚',
          badge: 'Startup Homologada',
          profileUrl: '/perfil/startup/1',
        }
      : {
          id: 1,
          name: 'Helena Costa',
          role: 'investor' as const,
          type: 'Investidora Anjo',
          avatar: '👩‍💼',
          badge: 'Investidora Anjo',
          profileUrl: '/perfil/investor/1',
        }

  function handleCreatePost(e: React.FormEvent) {
    e.preventDefault()
    if (!newPostText.trim()) return

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: activeUser.id,
      authorName: activeUser.name,
      authorRole: activeUser.role,
      authorType: activeUser.type,
      authorAvatar: activeUser.avatar,
      authorBadge: activeUser.badge,
      content: newPostText,
      category: newPostCategory,
      createdAt: 'Agora mesmo',
      likesCount: 0,
      isLiked: false,
      isSaved: false,
      sharesCount: 0,
      comments: [],
      metricBadge:
        newPostMetricLabel && newPostMetricValue
          ? {
              label: newPostMetricLabel,
              value: newPostMetricValue,
              highlight: true,
            }
          : undefined,
    }

    setPosts([newPost, ...posts])
    setNewPostText('')
    setNewPostMetricLabel('')
    setNewPostMetricValue('')
    showToast('Publicação compartilhada com a rede NEXO! 🚀')
  }

  function handleLike(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const isLiked = !p.isLiked
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1,
        }
      })
    )
  }

  function handleSave(postId: string) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const isSaved = !p.isSaved
        showToast(isSaved ? 'Publicação salva nas suas coleções!' : 'Publicação removida dos salvos.')
        return { ...p, isSaved }
      })
    )
  }

  function handleShare(post: SocialPost) {
    showToast(`Link da publicação de ${post.authorName} copiado para a área de transferência!`)
  }

  function handleAddComment(postId: string) {
    const text = commentInput[postId]
    if (!text || !text.trim()) return

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const newComment = {
          id: `comment-${Date.now()}`,
          authorId: activeUser.id,
          authorName: activeUser.name,
          authorRole: activeUser.role,
          authorAvatar: activeUser.avatar,
          content: text.trim(),
          createdAt: 'Agora mesmo',
        }
        return {
          ...p,
          comments: [...p.comments, newComment],
        }
      })
    )

    setCommentInput({ ...commentInput, [postId]: '' })
    showToast('Comentário publicado!')
  }

  return (
    <div className="feed-layout-shell">
      {toastMessage && <div className="social-toast">{toastMessage}</div>}

      {/* COLUNA ESQUERDA: Card do Perfil Conectado */}
      <aside className="feed-sidebar-left">
        <div className="user-profile-summary-card">
          <div className="summary-card-banner"></div>
          <div className="summary-card-avatar">{activeUser.avatar}</div>
          <div className="summary-card-content">
            <h3>{activeUser.name}</h3>
            <span className="summary-role-tag">{activeUser.badge}</span>
            <p className="summary-type">{activeUser.type}</p>

            <div className="summary-stats-row">
              <div>
                <strong>340</strong>
                <span>Conexões</span>
              </div>
              <div>
                <strong>1.2k</strong>
                <span>Seguidores</span>
              </div>
              <div>
                <strong>88%</strong>
                <span>Índice</span>
              </div>
            </div>

            <div className="summary-actions">
              <Link to={activeUser.profileUrl} className="btn btn-secondary small full">
                Ver meu perfil
              </Link>
              <Link to="/negociacoes" className="btn btn-ghost small full">
                Minhas Negociações ➔
              </Link>
            </div>
          </div>
        </div>

        {/* Atalhos Rápidos da Rede */}
        <div className="quick-links-panel">
          <h4>Navegação do Ecossistema</h4>
          <Link to="/catalogo" className="quick-link-item">
            <span>📊</span> Catálogo de Oportunidades
          </Link>
          <Link to="/explorar" className="quick-link-item">
            <span>🔎</span> Explorar Empresas & Teses
          </Link>
          <Link to="/negociacoes" className="quick-link-item">
            <span>🤝</span> Propostas & Rodadas
          </Link>
          <Link to="/mensagens" className="quick-link-item">
            <span>💬</span> Mensagens Diretas
          </Link>
        </div>
      </aside>

      {/* COLUNA CENTRAL: Criador de Posts + Feed */}
      <main className="feed-main-col">
        {/* Caixa de Criação de Post */}
        <div className="create-post-card">
          <div className="create-post-header">
            <span className="current-avatar">{activeUser.avatar}</span>
            <div className="composer-categories">
              <button
                type="button"
                className={`cat-pill ${newPostCategory === 'atualizacao' ? 'active' : ''}`}
                onClick={() => setNewPostCategory('atualizacao')}
              >
                📢 Atualização
              </button>
              <button
                type="button"
                className={`cat-pill ${newPostCategory === 'conquista' ? 'active' : ''}`}
                onClick={() => setNewPostCategory('conquista')}
              >
                🏆 Conquista
              </button>
              <button
                type="button"
                className={`cat-pill ${newPostCategory === 'rodada' ? 'active' : ''}`}
                onClick={() => setNewPostCategory('rodada')}
              >
                🚀 Rodada / Captação
              </button>
              <button
                type="button"
                className={`cat-pill ${newPostCategory === 'tese' ? 'active' : ''}`}
                onClick={() => setNewPostCategory('tese')}
              >
                💡 Tese / Insight
              </button>
            </div>
          </div>

          <form onSubmit={handleCreatePost}>
            <textarea
              className="create-post-input"
              rows={3}
              placeholder={
                activeRole === 'startup'
                  ? 'Compartilhe um marco, métrica de crescimento, atualização de produto ou abertura de rodada...'
                  : 'Compartilhe sua tese, o que está buscando no mercado ou insights com os fundadores...'
              }
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
            />

            {/* Inserção de métricas estruturadas */}
            <div className="create-post-metrics-row">
              <input
                type="text"
                placeholder="Rótulo (ex: MRR, Captação, Ticket)"
                value={newPostMetricLabel}
                onChange={(e) => setNewPostMetricLabel(e.target.value)}
                className="metric-input"
              />
              <input
                type="text"
                placeholder="Valor (ex: R$ 120k +15% MoM, R$ 1,5M por 10%)"
                value={newPostMetricValue}
                onChange={(e) => setNewPostMetricValue(e.target.value)}
                className="metric-input wide"
              />
            </div>

            <div className="create-post-footer">
              <span className="post-privacy-note">
                🔒 Publicação visível para todos os membros homologados da rede NEXO
              </span>
              <button type="submit" className="btn btn-primary small glow-btn" disabled={!newPostText.trim()}>
                Publicar no Feed ➔
              </button>
            </div>
          </form>
        </div>

        {/* Lista de Postagens da Rede */}
        <div className="posts-stream">
          {posts.map((post) => {
            const isCommentsOpen = activeCommentPostId === post.id
            const profileLink =
              post.authorRole === 'startup'
                ? `/perfil/startup/${post.authorId}`
                : `/perfil/investor/${post.authorId}`

            return (
              <article key={post.id} className="social-post-card">
                {/* Header do Post */}
                <div className="post-author-bar">
                  <Link to={profileLink} className="author-avatar-link">
                    <span className="post-avatar">{post.authorAvatar}</span>
                  </Link>

                  <div className="post-author-meta">
                    <div className="author-title-line">
                      <Link to={profileLink} className="author-name">
                        {post.authorName}
                      </Link>
                      {post.authorBadge && (
                        <span className={`author-badge-pill ${post.authorRole}`}>
                          {post.authorBadge}
                        </span>
                      )}
                    </div>
                    <div className="author-subtitle-line">
                      <span>{post.authorType}</span>
                      <span>•</span>
                      <time>{post.createdAt}</time>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`btn-save-bookmark ${post.isSaved ? 'saved' : ''}`}
                    title={post.isSaved ? 'Salvo' : 'Salvar publicação'}
                    onClick={() => handleSave(post.id)}
                  >
                    {post.isSaved ? '🔖' : '📑'}
                  </button>
                </div>

                {/* Conteúdo do Post */}
                <div className="post-text-content">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {/* Tag de Métrica em Destaque */}
                {post.metricBadge && (
                  <div className="post-highlight-metric">
                    <div className="metric-icon">📊</div>
                    <div>
                      <span className="metric-label">{post.metricBadge.label}</span>
                      <strong className="metric-value">{post.metricBadge.value}</strong>
                    </div>
                  </div>
                )}

                {/* Detalhes de Rodada / Ação Direta se for Oportunidade */}
                {post.category === 'rodada' && (
                  <div className="post-deal-callout">
                    <div className="deal-info-brief">
                      <span className="fire-icon">🔥</span>
                      <span>Oportunidade no Catálogo do NEXO com estatísticas e projeções auditadas.</span>
                    </div>
                    <div className="deal-actions">
                      <Link to={`/perfil/startup/${post.authorId}`} className="btn btn-secondary small">
                        Ver Estatísticas
                      </Link>
                      <Link to="/negociacoes" className="btn btn-primary small">
                        Demonstrar Interesse
                      </Link>
                    </div>
                  </div>
                )}

                {/* Barra de Reações do Post */}
                <div className="post-stats-strip">
                  <span>{post.likesCount} curtidas</span>
                  <span>•</span>
                  <span>{post.comments.length} comentários</span>
                  <span>•</span>
                  <span>{post.sharesCount} compartilhamentos</span>
                </div>

                <div className="post-actions-toolbar">
                  <button
                    type="button"
                    className={`post-action-btn ${post.isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(post.id)}
                  >
                    <span>{post.isLiked ? '❤️' : '🤍'}</span>
                    <span>{post.isLiked ? 'Curtiu' : 'Curtir'}</span>
                  </button>

                  <button
                    type="button"
                    className="post-action-btn"
                    onClick={() =>
                      setActiveCommentPostId(isCommentsOpen ? null : post.id)
                    }
                  >
                    <span>💬</span>
                    <span>Comentar</span>
                  </button>

                  <button
                    type="button"
                    className="post-action-btn"
                    onClick={() => handleShare(post)}
                  >
                    <span>🔁</span>
                    <span>Compartilhar</span>
                  </button>

                  <Link to={profileLink} className="post-action-btn profile-link-btn">
                    <span>👤</span>
                    <span>Ver Perfil</span>
                  </Link>
                </div>

                {/* Seção de Comentários */}
                {isCommentsOpen && (
                  <div className="post-comments-container">
                    {/* Lista de Comentários */}
                    {post.comments.length > 0 ? (
                      <div className="comments-list">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <span className="comment-avatar">{comment.authorAvatar}</span>
                            <div className="comment-bubble">
                              <div className="comment-header">
                                <strong>{comment.authorName}</strong>
                                <small>{comment.createdAt}</small>
                              </div>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-comments-hint">Seja o primeiro a comentar nesta publicação.</p>
                    )}

                    {/* Formulário de Novo Comentário */}
                    <div className="add-comment-row">
                      <span className="comment-current-avatar">{activeUser.avatar}</span>
                      <input
                        type="text"
                        placeholder="Escreva um comentário profissional..."
                        value={commentInput[post.id] || ''}
                        onChange={(e) =>
                          setCommentInput({ ...commentInput, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddComment(post.id)
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-primary small"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInput[post.id]?.trim()}
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </main>

      {/* COLUNA DIREITA: Startups em Alta, Investidores, Tópicos */}
      <aside className="feed-sidebar-right">
        {/* Startups em Alta */}
        <div className="side-widget">
          <div className="widget-header">
            <h4>Startups em Destaque</h4>
            <Link to="/catalogo" className="widget-link">
              Catálogo
            </Link>
          </div>
          <div className="widget-items-list">
            {startups.slice(0, 3).map((st) => (
              <div key={st.id} className="widget-item">
                <span className="widget-avatar">{st.avatar || '🚀'}</span>
                <div className="widget-item-info">
                  <Link to={`/perfil/startup/${st.id}`} className="item-title">
                    {st.name}
                  </Link>
                  <span className="item-sub">
                    {st.sector} • {st.stage}
                  </span>
                  <span className="item-kpi">Captação: {st.investment}</span>
                </div>
                <Link to={`/perfil/startup/${st.id}`} className="btn btn-secondary small tiny-btn">
                  Conectar
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Investidores Ativos */}
        <div className="side-widget">
          <div className="widget-header">
            <h4>Investidores Ativos</h4>
            <Link to="/explorar" className="widget-link">
              Ver todos
            </Link>
          </div>
          <div className="widget-items-list">
            {investors.slice(0, 3).map((inv) => (
              <div key={inv.id} className="widget-item">
                <span className="widget-avatar">{inv.avatar || '💼'}</span>
                <div className="widget-item-info">
                  <Link to={`/perfil/investor/${inv.id}`} className="item-title">
                    {inv.name}
                  </Link>
                  <span className="item-sub">{inv.type}</span>
                  <span className="item-kpi">Ticket: {inv.ticket}</span>
                </div>
                <Link to={`/perfil/investor/${inv.id}`} className="btn btn-secondary small tiny-btn">
                  Tese
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Tópicos em Alta */}
        <div className="side-widget topics-widget">
          <h4>Assuntos em Alta na Rede</h4>
          <div className="tag-cloud">
            <span className="topic-chip">#RodadasSeed</span>
            <span className="topic-chip">#SaaSB2B</span>
            <span className="topic-chip">#UnitEconomics</span>
            <span className="topic-chip">#HealthTech</span>
            <span className="topic-chip">#EnergiaLimpa</span>
            <span className="topic-chip">#VentureCapitalBrasil</span>
          </div>
        </div>
      </aside>
    </div>
  )
}
