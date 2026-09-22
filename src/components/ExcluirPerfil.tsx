import { Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../auth/useAuth'
import { excluirPerfilInvestidor, excluirPerfilStartup } from '../lib/perfilApi'
import { traduzirErroSupabase } from '../lib/supabaseErrors'
import { limparRascunho } from '../utils/perfilDraft'

interface ExcluirPerfilButtonProps {
  /** Chamado após a exclusão do perfil com sucesso (leva o usuário ao /onboarding). */
  onExcluido: () => void
}

/**
 * Entrada da exclusão de PERFIL (não da conta) no nav do dashboard:
 * abre um diálogo de confirmação em duas etapas (explicação + checkbox),
 * exclui a linha em "startup"/"investidor" e recarrega o perfil do useAuth.
 */
export function ExcluirPerfilButton({ onExcluido }: ExcluirPerfilButtonProps) {
  const { usuario, user, refresh } = useAuth()
  const [aberto, setAberto] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [erro, setErro] = useState('')

  const fechar = () => {
    if (excluindo) return
    setAberto(false)
    setConfirmado(false)
    setErro('')
  }

  useEffect(() => {
    if (!aberto || excluindo) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') fechar()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const abrir = () => {
    setConfirmado(false)
    setErro('')
    setAberto(true)
  }

  const confirmar = async () => {
    if (!confirmado || excluindo || !usuario || !user) return

    setExcluindo(true)
    setErro('')
    try {
      if (usuario.tipo === 'startup') {
        await excluirPerfilStartup()
      } else {
        await excluirPerfilInvestidor()
      }
      limparRascunho(user.id, 'startup-edit')
      limparRascunho(user.id, 'investidor-edit')
      await refresh()
      onExcluido()
    } catch (error) {
      setErro(traduzirErroSupabase(error))
    } finally {
      setExcluindo(false)
    }
  }

  if (!usuario) return null

  const isStartup = usuario.tipo === 'startup'
  const oQueSeraPerdido = isStartup
    ? 'O perfil da startup deixará de existir, junto com suas rodadas de captação e os matches recebidos.'
    : 'O perfil de investidor deixará de existir, junto com seus segmentos de interesse e as propostas enviadas.'

  return (
    <>
      <button className="button button-ghost button-danger-ghost button-compact" type="button" onClick={abrir}>
        <Trash2 size={17} aria-hidden="true" />
        <span>Excluir perfil</span>
      </button>

      {aberto &&
        createPortal(
          <div
            className="details-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) fechar()
            }}
          >
            <section
              className="confirm-modal"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirmar-exclusao-title"
              aria-describedby="confirmar-exclusao-descricao"
            >
              <button className="details-modal-close" type="button" onClick={fechar} disabled={excluindo} aria-label="Fechar diálogo">
                <X size={20} aria-hidden="true" />
              </button>
              <p className="kicker">Zona de risco</p>
              <h2 id="confirmar-exclusao-title">Excluir perfil {isStartup ? 'da startup' : 'de investidor'}?</h2>
              <p id="confirmar-exclusao-descricao">{oQueSeraPerdido}</p>
              <p className="confirm-modal-loss">
                Esta ação não pode ser desfeita. Sua conta de acesso é mantida e você poderá criar um novo perfil.
              </p>
              <label className="confirm-modal-check">
                <input
                  type="checkbox"
                  checked={confirmado}
                  disabled={excluindo}
                  onChange={(event) => setConfirmado(event.target.checked)}
                />
                <span>Entendo que essa ação não pode ser desfeita.</span>
              </label>
              {erro && <p className="form-alert" role="alert">{erro}</p>}
              <div className="confirm-modal-actions">
                <button className="button button-outline button-compact" type="button" onClick={fechar} disabled={excluindo}>
                  Cancelar
                </button>
                <button
                  className="button button-danger button-compact"
                  type="button"
                  onClick={() => void confirmar()}
                  disabled={!confirmado || excluindo}
                >
                  <Trash2 size={17} aria-hidden="true" />
                  {excluindo ? 'Excluindo...' : 'Excluir perfil'}
                </button>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  )
}
