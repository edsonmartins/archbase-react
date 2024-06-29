import { useEffect, useState } from 'react'
import { ArchbaseSecurityManager } from '@components/security/ArchbaseSecurityManager'
import { ArchbaseStore, useArchbaseStore } from './useArchbaseStore'
import { processErrorMessage } from '@components/core'

export type UseArchbaseSecurityManagerProps = {
  resourceName: string
  resourceDescription: string
  onError?: (error, originError) => void
}

export type UseArchbaseSecurityManagerReturnType = {
  securityManager: ArchbaseSecurityManager
}

const buildSecurityManager = (store: ArchbaseStore, resourceName: string, resourceDescription: string) => {
  if (store && store.existsValue(resourceName)){
    return store.getValue(resourceName);
  }

  return new ArchbaseSecurityManager(resourceName, resourceDescription)
}

type UseArchbaseSecurityManagerState = {
  securityManager: ArchbaseSecurityManager | null
  isError: boolean
  error: any
}

export const useArchbaseSecurityManager = (
  props: UseArchbaseSecurityManagerProps
): UseArchbaseSecurityManagerReturnType => {
  const { resourceName, resourceDescription, onError} = props
  const store = useArchbaseStore('archbaseSecurityManagerStore')
  const [internalState, setInternalState] = useState<UseArchbaseSecurityManagerState>({
    securityManager: buildSecurityManager(store, resourceName, resourceDescription),
    isError: false,
    error: '',
  })

  useEffect(() => {
    // try {
      // const securityManager = buildSecurityManager(store, resourceName, resourceDescription)
      store.setValue(resourceName, internalState.securityManager);
    //   setInternalState((prev) => ({
    //     ...prev,
    //     securityManager,
    //   }))
    // } catch (error) {
    //   const userError = processErrorMessage(error)
    //   setInternalState((prev) => ({
    //     ...prev,
    //     isError: true,
    //     error: userError
    //   }))
    //   if (onError) {
    //     onError(userError, error)
    //   }
    // }
  }, [resourceName])

  return { securityManager: internalState.securityManager }
}
