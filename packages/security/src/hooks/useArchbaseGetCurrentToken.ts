import { useEffect, useState } from 'react'
import { useContainer } from 'inversify-react'
import { ARCHBASE_IOC_API_TYPE } from '@archbase/core'
import { ArchbaseTokenManager } from '../ArchbaseTokenManager'


export interface GetCurrentTokenReturnType {
  token: string|null
}
export const useArchbaseGetCurrentToken = (): GetCurrentTokenReturnType => {
  const tokenManager = useContainer((container) =>
    container.get<ArchbaseTokenManager>(ARCHBASE_IOC_API_TYPE.TokenManager)
  )
  const [token, setCurrentToken] = useState<string | null>(null)

  useEffect(() => {
    const accessToken = tokenManager.getToken()
    if (accessToken) {
      setCurrentToken(accessToken.access_token)
    }
  }, [])

  return {
    token
  }
}
