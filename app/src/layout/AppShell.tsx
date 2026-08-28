import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import type { UserRole } from '../types'
import { Header } from './Header'
import { Footer } from './Footer'
import type { AppOutletContext } from './useAppShell'

export function AppShell() {
  const [activeRole, setActiveRole] = useState<UserRole>('startup')

  return (
    <div className="app-shell">
      <Header />
      <main className="page-content">
        <Outlet context={{ activeRole, setActiveRole } satisfies AppOutletContext} />
      </main>
      <Footer />
    </div>
  )
}

