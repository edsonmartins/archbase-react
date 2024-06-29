import { useEffect, useState } from 'react'
import { ArchbaseSecurityManager } from '@components/security/ArchbaseSecurityManager'
import { ArchbaseStore, useArchbaseStore } from './useArchbaseStore'

export type UseArchbaseSecurityManagerProps = {
  resourceName: string
  resourceDescription: string
}

export type UseArchbaseSecurityManagerReturnType = {
  securityManager: ArchbaseSecurityManager
}

const buildSecurityManager = (store: ArchbaseStore, resourceName: string, resourceDescription: string) => {
  if (store && store.existsValue(resourceName)) {
    return store.getValue(resourceName);
  }
  return new ArchbaseSecurityManager(resourceName, resourceDescription)
}

type UseArchbaseSecurityManagerState = {
  securityManager: ArchbaseSecurityManager | null
}

export const useArchbaseSecurityManager = (
  props: UseArchbaseSecurityManagerProps
): UseArchbaseSecurityManagerReturnType => {
  const { resourceName, resourceDescription } = props
  const store = useArchbaseStore('archbaseSecurityManagerStore')
  const [internalState, setInternalState] = useState<UseArchbaseSecurityManagerState>({
    securityManager: buildSecurityManager(store, resourceName, resourceDescription)
  })

  useEffect(() => {
    store.setValue(resourceName, internalState.securityManager);
  }, [resourceName])

  return { securityManager: internalState.securityManager }
}
