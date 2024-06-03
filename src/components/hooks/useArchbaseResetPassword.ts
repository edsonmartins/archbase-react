import { useState } from 'react'
import { useContainer } from 'inversify-react'
import { ArchbaseAuthenticator } from '../auth/ArchbaseAuthenticator'
import { ARCHBASE_IOC_API_TYPE } from '../core/ioc'
import { processErrorMessage } from '../core/exceptions'

export interface ResetPasswordReturnType {
  sendResetPasswordEmail: (email: string) => Promise<void>
  resetPassword: (email: string, passwordResetToken: string, newPassword: string) => Promise<void>
  isError: boolean
  error: any
  clearError: () => void
}

export const useArchbaseResetPassword = (): ResetPasswordReturnType => {
  const authenticator = useContainer((container) =>
    container.get<ArchbaseAuthenticator>(ARCHBASE_IOC_API_TYPE.Authenticator)
  )
  const [isError, setIsError] = useState<boolean>(false)
  const [errorString, setErrorString] = useState<string>('')

  const clearError = () => {
    setIsError(false)
    setErrorString('')
  }

  const sendResetPasswordEmail = async (email: string) => {
    try {
      return await authenticator.sendResetPasswordEmail(email)
    } catch (error: any) {
      setErrorString(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  const resetPassword = async (email: string, passwordResetToken: string, newPassword: string) => {
    try {
      return await authenticator.resetPassword(email, passwordResetToken, newPassword)
    } catch (error: any) {
      setErrorString(processErrorMessage(error))
      setIsError(true)
      throw error
    }
  }

  return {
    sendResetPasswordEmail,
    resetPassword,
    isError,
    error: errorString,
    clearError,
  }
}
