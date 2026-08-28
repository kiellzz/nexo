import { useOutletContext } from 'react-router-dom'
import type { UserRole } from '../types'

export type AppOutletContext = {
  activeRole: UserRole
  setActiveRole: (role: UserRole) => void
}

export function useAppShell() {
  return useOutletContext<AppOutletContext>()
}
