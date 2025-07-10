import { useArchbaseAppContext } from '@archbase/core'
import { ArchbaseUser } from '../ArchbaseUser'

export const useArchbaseGetLoggedUser = (): ArchbaseUser | null => {
  const values = useArchbaseAppContext()
  return values.user
}
