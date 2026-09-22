import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { UserRole, DirectMessage } from '../types'
import { mockDirectMessages, investors, startups } from '../data/mockData'

interface MessagesPageProps {
  activeRole: UserRole
}

export function MessagesPage({ activeRole }: MessagesPageProps) {
  const [messages, setMessages] = useState<DirectMessage[]>(mockDirectMessages)
  const [activeContactId, setActiveContactId] = useState<number>(1)
  const [inputText, setInputText] = useState('')

  const activeContact =
    activeRole === 'startup'
      ? investors.find((i) => i.id === activeContactId) || investors[0]
      : startups.find((s) => s.id === activeContactId) || startups[0]

  const contactName = activeContact.name
  const contactAvatar = (activeContact as any).avatar || (activeRole === 'startup' ? '👩‍💼' : '🚚')
  const contactSub =
    activeRole === 'startup'
      ? (activeContact as any).type
      : `${(activeContact as any).sector} • ${(activeContact as any).stage}`

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!inputText.trim()) return

    const newMsg: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderId: 1,
      senderName: activeRole === 'startup' ? 'NovaFlow' : 'Helena Costa',
      senderRole: activeRole,
      senderAvatar: activeRole === 'startup' ? '🚚' : '👩‍💼',
      recipientId: activeContact.id,
      recipientName: activeContact.name,
      content: inputText.trim(),
      timestamp: 'Agora mesmo',
    }

    setMessages([...messages, newMsg])
    setInputText('')
  }

  return (
    <div className="messages-shell">
      <div className="messages-layout panel">
        {/* LISTA DE CONVERSAS */}
        <aside className="conversations-sidebar">
          <div className="conv-sidebar-header">
            <h3>Mensagens Diretas</h3>
            <span className="conv-badge">Seguro & Criptografado</span>
          </div>

          <div className="conversations-list">
            {(activeRole === 'startup' ? investors : startups).map((item) => {
              const isSelected = item.id === activeContactId
              const itemAvatar = (item as any).avatar || (activeRole === 'startup' ? '👩‍💼' : '🚀')

              return (
                <div
                  key={item.id}
                  className={`conv-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveContactId(item.id)}
                >
                  <span className="conv-avatar">{itemAvatar}</span>
                  <div className="conv-meta">
                    <strong>{item.name}</strong>
                    <span className="conv-preview">
                      {activeRole === 'startup' ? (item as any).type : (item as any).sector}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* ÁREA DO CHAT ATIVO */}
        <main className="chat-thread-container">
          <div className="chat-thread-header">
            <div className="chat-contact-info">
              <span className="chat-header-avatar">{contactAvatar}</span>
              <div>
                <h4>{contactName}</h4>
                <span>{contactSub}</span>
              </div>
            </div>

            <div className="chat-header-actions">
              <Link
                to={
                  activeRole === 'startup'
                    ? `/perfil/investor/${activeContact.id}`
                    : `/perfil/startup/${activeContact.id}`
                }
                className="btn btn-secondary small"
              >
                Ver Perfil
              </Link>
              <Link to="/negociacoes" className="btn btn-primary small">
                Hub de Negociações ➔
              </Link>
            </div>
          </div>

          <div className="chat-messages-scroll">
            <div className="chat-security-callout">
              🔒 Canal de comunicação protegido. Todas as mensagens trocadas estão vinculadas às
              diretrizes de confidencialidade e governança do NEXO.
            </div>

            {messages.map((m) => {
              const isMine = m.senderRole === activeRole

              return (
                <div key={m.id} className={`direct-msg-row ${isMine ? 'mine' : 'theirs'}`}>
                  <span className="msg-avatar">{m.senderAvatar}</span>
                  <div className="direct-msg-bubble">
                    <div className="msg-header">
                      <strong>{m.senderName}</strong>
                      <time>{m.timestamp}</time>
                    </div>
                    <p>{m.content}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <form onSubmit={handleSend} className="chat-input-bar">
            <input
              type="text"
              placeholder={`Enviar mensagem direta para ${contactName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="btn btn-primary small" disabled={!inputText.trim()}>
              Enviar ➔
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
