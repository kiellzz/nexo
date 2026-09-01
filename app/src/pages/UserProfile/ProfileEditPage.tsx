import { useEffect, useState } from 'react'
import type { UserProfile, UserRole } from '../../types'
import { fetchUserProfile, saveUserProfile } from '../../utils/userProfileStorage'
import { UserProfileForm } from './UserProfileForm'

export function ProfileEditPage({ activeRole }: { activeRole: UserRole }) {
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
        if (active) setError('Não foi possível buscar o perfil atual.')
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
    } catch {
      setError('Não foi possível salvar as alterações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="screen-shell user-profile-shell">
      <div className="section-header compact">
        <div>
          <span className="label-badge">Perfil</span>
          <h2>Editar dados do perfil</h2>
          <p className="section-desc">
            Atualize cadastro, foto, tese, localização e preferências usadas no score de matchmaking.
          </p>
        </div>
      </div>

      {loading && (
        <div className="profile-form-state panel">
          <div className="profile-loading-dot" />
          <p>Buscando perfil atual...</p>
        </div>
      )}

      {error && <div className="form-feedback error">{error}</div>}
      {success && <div className="form-feedback success">Alterações salvas com sucesso.</div>}

      {profile && !loading && (
        <UserProfileForm
          mode="edit"
          profile={profile}
          loading={saving}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
