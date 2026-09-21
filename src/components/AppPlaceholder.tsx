import { LogOut } from 'lucide-react'
import { signOut } from '../auth/authApi'
import { useAuth } from '../auth/useAuth'
import { Brand } from './Brand'

export function AppPlaceholder() {
  const { usuario } = useAuth()

  return (
    <main id="conteudo" className="app-shell">
      <section className="app-panel" aria-labelledby="app-title">
        <Brand />
        <p className="kicker">Nexo</p>
        <h1 id="app-title">Olá, {usuario?.nome || 'bem-vindo(a)'}</h1>
        <p>Perfil: {usuario?.tipo === 'startup' ? 'Startup' : 'Investidor'}</p>
        <button className="button button-outline" type="button" onClick={() => void signOut()}>
          <LogOut size={18} aria-hidden="true" />
          Sair
        </button>
      </section>
    </main>
  )
}
