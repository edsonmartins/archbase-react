import { useEffect, useState, useRef, useMemo } from 'react'
import { ArchbaseSecurityManager } from '../ArchbaseSecurityManager'
import { ArchbaseStore, useArchbaseStore } from '@archbase/data'
import { useArchbaseGetLoggedUser } from './useArchbaseGetLoggedUser'

export const ARCHBASE_SECURITY_MANAGER_STORE = 'archbaseSecurityManagerStore'

export type UseArchbaseSecurityManagerProps = {
  resourceName: string
  resourceDescription: string
  enableSecurity?: boolean
}

export type UseArchbaseSecurityManagerReturnType = {
  securityManager: ArchbaseSecurityManager
}

type UseArchbaseSecurityManagerState = {
  securityManager: ArchbaseSecurityManager | null
}

export const useArchbaseSecurityManager = (
  { resourceName, resourceDescription, enableSecurity = true }: UseArchbaseSecurityManagerProps
): UseArchbaseSecurityManagerReturnType => {
  const store = useArchbaseStore(ARCHBASE_SECURITY_MANAGER_STORE)
  const user = useArchbaseGetLoggedUser()

  // Extrair isAdmin de forma segura (null-safe)
  const isAdmin = user?.isAdmin ?? false
  const userId = user?.id

  // Ref para rastrear o userId anterior
  const prevUserIdRef = useRef<string | undefined>(userId)

  // Criar ou recuperar o securityManager usando useMemo para evitar recriações desnecessárias
  const securityManager = useMemo(() => {
    if (!enableSecurity) {
      return null
    }

    // Chave de cache inclui o userId para invalidar quando o usuário muda
    const cacheKey = userId ? `${resourceName}_${userId}` : resourceName

    // Verificar se existe no cache e se o isAdmin não mudou
    if (store && store.existsValue(cacheKey)) {
      const cached = store.getValue(cacheKey) as ArchbaseSecurityManager
      // Verificar se o isAdmin é o mesmo
      if (cached && (cached as any).isAdmin === isAdmin) {
        return cached
      }
    }

    // Criar novo manager
    const manager = new ArchbaseSecurityManager(resourceName, resourceDescription, isAdmin)

    // Salvar no cache
    if (store && userId) {
      store.setValue(cacheKey, manager)
    }

    return manager
  }, [enableSecurity, resourceName, resourceDescription, isAdmin, userId])

  // Atualizar ref quando userId muda
  useEffect(() => {
    prevUserIdRef.current = userId
  }, [userId])

  return { securityManager }
}
