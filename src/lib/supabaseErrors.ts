interface SupabaseLikeError {
  code?: string
  message?: string
  details?: string
}

export function traduzirErroSupabase(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Não foi possível salvar. Tente novamente em instantes.'

  const supabaseError = error as SupabaseLikeError
  const text = `${supabaseError.message ?? ''} ${supabaseError.details ?? ''}`.toLowerCase()

  if (supabaseError.code === '23505') {
    if (text.includes('cnpj')) return 'Este CNPJ já está cadastrado.'
    if (text.includes('cpf')) return 'Este CPF já está cadastrado.'
    return 'Já existe um cadastro com esses dados.'
  }
  if (supabaseError.code === '23503') return 'Perfil base não encontrado. Saia e faça um novo cadastro.'
  if (supabaseError.code === '42501') return 'Sem permissão. Entre novamente.'

  return 'Não foi possível salvar. Verifique os dados e tente novamente.'
}
