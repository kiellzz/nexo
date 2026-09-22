import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { NotificationItem } from '../types'
import { mockNotifications } from '../data/mockData'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'proposta' | 'match' | 'interacoes'>('all')

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'proposta') return n.type === 'proposta' || n.type === 'contraproposta' || n.type === 'acordo'
    if (filter === 'match') return n.type === 'match' || n.type === 'interesse'
    if (filter === 'interacoes') return n.type === 'like' || n.type === 'comentario' || n.type === 'conexao'
    return true
  })

  return (
    <div className="notifications-shell">
      <div className="notifications-header-panel">
        <div className="notifs-header-top">
          <div>
            <span className="label">Central da Rede</span>
            <h2>Notificações & Atividades</h2>
          </div>
          <button type="button" className="btn btn-secondary small" onClick={markAllAsRead}>
            ✓ Marcar todas como lidas
          </button>
        </div>

        {/* Filtros de Notificação */}
        <div className="notifs-filter-chips">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({notifications.length})
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'match' ? 'active' : ''}`}
            onClick={() => setFilter('match')}
          >
            🔥 Matches & Interesses
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'proposta' ? 'active' : ''}`}
            onClick={() => setFilter('proposta')}
          >
            🤝 Propostas & Negociações
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'interacoes' ? 'active' : ''}`}
            onClick={() => setFilter('interacoes')}
          >
            💬 Interações & Conexões
          </button>
        </div>
      </div>

      <div className="notifications-list-container">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((item) => (
            <div
              key={item.id}
              className={`notification-card panel ${item.read ? 'read' : 'unread'}`}
              onClick={() => markAsRead(item.id)}
            >
              <div className="notif-avatar">{item.actorAvatar}</div>
              <div className="notif-content">
                <div className="notif-topline">
                  <h4>{item.title}</h4>
                  <time>{item.timestamp}</time>
                </div>
                <p>{item.description}</p>
                <div className="notif-actions">
                  <Link to={item.link} className="btn btn-primary small tiny-btn">
                    Ver detalhes ➔
                  </Link>
                </div>
              </div>
              {!item.read && <span className="unread-dot" title="Não lida"></span>}
            </div>
          ))
        ) : (
          <div className="panel empty-state-box">
            <p>Nenhuma notificação encontrada nesta categoria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
