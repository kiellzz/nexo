import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

export type TipoUsuario = 'startup' | 'investidor'

export interface Usuario {
  id: string
  nome: string
  tipo: TipoUsuario
  ativo: boolean
}

/**
 * loading      -> ainda descobrindo sessão/perfil (mostre um spinner)
 * signedOut    -> sem sessão (redirecione para /login)
 * needsProfile -> logado, mas falta completar startup/investidor (redirecione para o onboarding)
 * ready        -> logado e com perfil completo
 */
export type AuthStatus = 'loading' | 'signedOut' | 'needsProfile' | 'ready'

export interface AuthContextValue {
  status: AuthStatus
  session: Session | null
  user: User | null
  usuario: Usuario | null
  /** Recarrega o perfil (chame ao terminar o onboarding). */
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)