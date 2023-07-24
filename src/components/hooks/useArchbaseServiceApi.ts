import type { interfaces } from 'inversify'
import { useContainer } from 'inversify-react'

export function useArchbaseServiceApi<T>(apiId: interfaces.ServiceIdentifier<T>): T {
  return useContainer((container) => container.get<T>(apiId))
}
