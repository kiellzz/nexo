import { Brand } from './Brand'

export function LoadingScreen() {
  return (
    <main id="conteudo" className="status-shell" aria-busy="true">
      <Brand />
      <div className="spinner" aria-hidden="true" />
      <p>Carregando...</p>
    </main>
  )
}
