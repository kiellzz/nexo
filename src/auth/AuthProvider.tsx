import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContext, type AuthContextValue, type AuthStatus, type Usuario } from './AuthContext'

interface PerfilState {
  userId: string
  usuario: Usuario | null
  perfilCompleto: boolean
}

async function carregarPerfil(userId: string): Promise<PerfilState> {
  const { data: usuario, error } = await supabase
    .from('usuario')
    .select('id, nome, tipo, ativo')
    .eq('id', userId)
    .maybeSingle()
  if (error) throw error
  if (!usuario) return { userId, usuario: null, perfilCompleto: false }

  const tabela = usuario.tipo === 'startup' ? 'startup' : 'investidor'
  const { data: perfil, error: perfilError } = await supabase
    .from(tabela)
    .select('id')
    .eq('usuario_id', userId)
    .maybeSingle()
  if (perfilError) throw perfilError

  return { userId, usuario: usuario as Usuario, perfilCompleto: perfil !== null }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)
  const [perfil, setPerfil] = useState<PerfilState | null>(null)

  // Sessão. Não faça chamadas ao Supabase dentro do callback do onAuthStateChange
  // (pode travar); por isso ele só atualiza o estado e o perfil é carregado em outro efeito.
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setSessionLoaded(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setSessionLoaded(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user.id ?? null

  const refresh = useCallback(async () => {
    if (!userId) return
    try {
      setPerfil(await carregarPerfil(userId))
    } catch (error) {
      console.error('Falha ao carregar perfil', error)
      setPerfil({ userId, usuario: null, perfilCompleto: false })
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<AuthContextValue>(() => {
    let status: AuthStatus
    if (!sessionLoaded) status = 'loading'
    else if (!userId) status = 'signedOut'
    else if (!perfil || perfil.userId !== userId) status = 'loading'
    // Sem linha em "usuario" = usuário criado antes do trigger: apague-o no painel e cadastre de novo.
    else if (!perfil.usuario || !perfil.perfilCompleto) status = 'needsProfile'
    else status = 'ready'

    return {
      status,
      session,
      user: session?.user ?? null,
      usuario: perfil && perfil.userId === userId ? perfil.usuario : null,
      refresh,
    }
  }, [sessionLoaded, userId, perfil, session, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
