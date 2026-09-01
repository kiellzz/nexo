import { Route, Routes, useNavigate } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { useAppShell } from './layout/useAppShell'
import { LoginPage } from './pages/Login'
import { SignupPage } from './pages/Signup'
import { LandingPage } from './pages/Landing/LandingPage'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { SearchPage } from './pages/Search/SearchPage'
import { OpportunitiesPage } from './pages/Opportunities/OpportunitiesPage'
import { MatchesPage } from './pages/Matches/MatchesPage'
import { InterestsPage } from './pages/Interests/InterestsPage'
import { ProfilePage } from './pages/Profile/ProfilePage'
import { SettingsPage } from './pages/Settings/SettingsPage'
import { PrivacyPage } from './pages/Privacy/PrivacyPage'
import { OperationPage } from './pages/Operation/Operation'
import { ProfileCompletionPage } from './pages/UserProfile/ProfileCompletionPage'
import { ProfileEditPage } from './pages/UserProfile/ProfileEditPage'

function LoginRoute() {
  const { setActiveRole } = useAppShell()
  const navigate = useNavigate()
  return <LoginPage setActiveRole={(role) => { setActiveRole(role); navigate('/dashboard') }} />
}

function SignupRoute() {
  const { setActiveRole } = useAppShell()
  const navigate = useNavigate()
  return <SignupPage setActiveRole={(role) => { setActiveRole(role); navigate('/perfil/completar') }} />
}

function DashboardRoute() {
  const { activeRole } = useAppShell()
  return <DashboardPage activeRole={activeRole} />
}

function SearchRoute() {
  const { activeRole } = useAppShell()
  return <SearchPage activeRole={activeRole} />
}

function ProfileRoute() {
  const { activeRole } = useAppShell()
  return <ProfilePage activeRole={activeRole} />
}

function ProfileCompletionRoute() {
  const { activeRole } = useAppShell()
  const navigate = useNavigate()
  return <ProfileCompletionPage activeRole={activeRole} onComplete={() => navigate('/dashboard')} />
}

function ProfileEditRoute() {
  const { activeRole } = useAppShell()
  return <ProfileEditPage activeRole={activeRole} />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/signup" element={<SignupRoute />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/buscar" element={<SearchRoute />} />
        <Route path="/oportunidades" element={<OpportunitiesPage />} />
        <Route path="/operacao" element={<OperationPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/interesses" element={<InterestsPage />} />
        <Route path="/perfil/:type/:id" element={<ProfileRoute />} />
        <Route path="/perfil/completar" element={<ProfileCompletionRoute />} />
        <Route path="/perfil/editar" element={<ProfileEditRoute />} />
        <Route path="/configuracoes" element={<SettingsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />
      </Route>
    </Routes>
  )
}
