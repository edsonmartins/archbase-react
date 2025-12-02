import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface ValidationErrorsContextType {
  errors: Record<string, string>
  setError: (field: string, error: string) => void
  clearError: (field: string) => void
  clearAll: () => void
  getError: (field: string) => string | undefined
}

const ValidationErrorsContext = createContext<ValidationErrorsContextType | undefined>(undefined)

/**
 * Provider para gerenciar erros de validação de formulários
 * Armazena erros em um estado global que sobrevive a unmounts de componentes
 */
export function ValidationErrorsProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAll = useCallback(() => {
    setErrors({})
  }, [])

  const getError = useCallback((field: string) => {
    return errors[field]
  }, [errors])

  return (
    <ValidationErrorsContext.Provider value={{ errors, setError, clearError, clearAll, getError }}>
      {children}
    </ValidationErrorsContext.Provider>
  )
}

/**
 * Hook para acessar o contexto de erros de validação
 * Retorna undefined se o contexto não estiver disponível (para compatibilidade)
 */
export function useValidationErrors(): ValidationErrorsContextType | undefined {
  return useContext(ValidationErrorsContext)
}

/**
 * Hook que sempre retorna um contexto de erros (cria um vazio se não existir)
 * Use quando você PRECISA do contexto
 */
export function useRequiredValidationErrors(): ValidationErrorsContextType {
  const context = useContext(ValidationErrorsContext)
  if (!context) {
    throw new Error('useRequiredValidationErrors must be used within ValidationErrorsProvider')
  }
  return context
}
