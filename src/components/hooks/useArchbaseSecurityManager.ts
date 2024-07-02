import { useEffect, useState } from 'react'
import { ArchbaseSecurityManager } from '@components/security/ArchbaseSecurityManager'
import { ArchbaseStore, useArchbaseStore } from './useArchbaseStore'
import { useArchbaseGetLoggedUser } from './useArchbaseGetLoggedUser'

export type UseArchbaseSecurityManagerProps = {
  resourceName: string
  resourceDescription: string
  enableSecurity?: boolean
}

export type UseArchbaseSecurityManagerReturnType = {
  securityManager: ArchbaseSecurityManager
}

const buildSecurityManager = (store: ArchbaseStore, resourceName: string, resourceDescription: string, isAdmin: boolean) => {
  if (store && store.existsValue(resourceName)) {
    return store.getValue(resourceName);
  }
  return new ArchbaseSecurityManager(resourceName, resourceDescription, isAdmin)
}

type UseArchbaseSecurityManagerState = {
  securityManager: ArchbaseSecurityManager | null
}

export const useArchbaseSecurityManager = (
  { resourceName, resourceDescription, enableSecurity = true }: UseArchbaseSecurityManagerProps
): UseArchbaseSecurityManagerReturnType => {
  const store = useArchbaseStore('archbaseSecurityManagerStore')
  const user = useArchbaseGetLoggedUser()
  const [internalState, setInternalState] = useState<UseArchbaseSecurityManagerState>({
    securityManager: enableSecurity && buildSecurityManager(store, resourceName, resourceDescription, user.isAdmin)
  })

  useEffect(() => {
    if (enableSecurity) {
      store.setValue(resourceName, internalState.securityManager);
    }
  }, [resourceName])

  return { securityManager: internalState.securityManager }
}
