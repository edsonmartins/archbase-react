import { useArchbaseAppContext } from '../core'
import { ArchbaseUser } from '../auth'

export const useArchbaseGetLoggedUser = (): ArchbaseUser | null => {
  const values = useArchbaseAppContext()
  return values.user
}
