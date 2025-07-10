import { injectable } from 'inversify'
import { ArchbaseAccessToken, ArchbaseTokenManager } from '@archbase/core'

// Re-export the interface from core to maintain backward compatibility
export type { ArchbaseTokenManager, ArchbaseAccessToken } from '@archbase/core'

