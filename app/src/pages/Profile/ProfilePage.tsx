import { Link, useParams } from 'react-router-dom'
import type { Investor, Startup, UserRole } from '../../types'
import { investors, startups } from '../../data/mockData'
import { StartupProfile } from './StartupProfile'
import { InvestorProfile } from './InvestorProfile'

export function ProfilePage({ activeRole }: { activeRole: UserRole }) {
  const { type, id } = useParams()
  const profileId = Number(id)

  const profile =
    type === 'startup'
      ? startups.find((item) => item.id === profileId)
      : investors.find((item) => item.id === profileId)

  if (!profile) {
    return (
      <section className="screen-shell">
        <div className="not-found-card">
          <h2>Perfil não encontrado</h2>
          <p>O perfil que você tentou acessar não existe ou foi removido.</p>
          <Link to="/buscar" className="btn btn-primary">Voltar para busca</Link>
        </div>
      </section>
    )
  }

  if (type === 'startup') {
    return <StartupProfile startup={profile as Startup} activeRole={activeRole} />
  }

  return <InvestorProfile investor={profile as Investor} activeRole={activeRole} />
}
