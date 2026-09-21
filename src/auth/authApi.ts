import type { AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { TipoUsuario } from './AuthContext'

export type AuthResult =
  | { ok: true; needsEmailConfirmation: boolean }
  | { ok: false; message: string }

export function traduzirErroAuth(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'E-mail ou senha incorretos.'
    case 'email_not_confirmed':
      return 'Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.'
    case 'user_already_exists':
    case 'email_exists':
      return 'Este e-mail já está cadastrado. Tente entrar.'
    case 'weak_password':
      return 'Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.'
    case 'over_email_send_rate_limit':
    case 'over_request_rate_limit':
      return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
    default:
      return 'Não foi possível concluir. Tente novamente em instantes.'
  }
}

export interface SignUpInput {
  email: string
  password: string
  tipo: TipoUsuario
  /** Opcional: se vazio, o trigger usa a parte local do e-mail. Ajuste depois no onboarding. */
  nome?: string
}

export async function signUp({ email, password, tipo, nome }: SignUpInput): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Lido pelo trigger public.handle_new_user
      data: { tipo, nome: nome ?? '' },
      // Precisa estar em Authentication > URL Configuration > Redirect URLs
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })
  if (error) return { ok: false, message: traduzirErroAuth(error) }

  // Com "Confirm email" ligado, e-mail já cadastrado volta sem erro e com identities vazio.
  if (data.user && data.user.identities?.length === 0) {
    return { ok: false, message: 'Este e-mail já está cadastrado. Tente entrar.' }
  }
  return { ok: true, needsEmailConfirmation: data.session === null }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { ok: false, message: traduzirErroAuth(error) }
  return { ok: true, needsEmailConfirmation: false }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Falha ao sair', error)
}