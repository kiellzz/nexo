import { useEffect, useState } from 'react'
import type { UserProfile, UserRole } from '../../types'
import { fetchUserProfile, saveUserProfile } from '../../utils/userProfileStorage'
import { UserProfileForm } from './UserProfileForm'

interface ProfileCompletionPageProps {
  activeRole: UserRole
  onComplete: () => void
}

export function ProfileCompletionPage({ activeRole, onComplete }: ProfileCompletionPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let active = true

    fetchUserProfile(activeRole)
      .then((loadedProfile) => {
        if (active) setProfile(loadedProfile)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar seus dados de perfil.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [activeRole])

  async function handleSubmit(nextProfile: UserProfile) {
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const savedProfile = await saveUserProfile(nextProfile)
      setProfile(savedProfile)
      setSuccess(true)
      window.setTimeout(onComplete, 850)
    } catch {
      setError('Não foi possível salvar o perfil agora. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="screen-shell user-profile-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Pós-cadastro</span>
          <h2>Complete seu perfil</h2>
          <p className="section-desc">
            Quanto mais contexto você adiciona, melhor o Nexo entende compatibilidade, ticket e momento da conexão.
          </p>
        </div>
      </div>

      {loading && (
        <div className="profile-form-state panel">
          <div className="profile-loading-dot" />
          <p>Carregando dados do perfil...</p>
        </div>
      )}

      {error && <div className="form-feedback error">{error}</div>}
      {success && <div className="form-feedback success">Perfil salvo. Redirecionando para o dashboard...</div>}

      {profile && !loading && (
        <UserProfileForm
          mode="completion"
          profile={profile}
          loading={saving}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
