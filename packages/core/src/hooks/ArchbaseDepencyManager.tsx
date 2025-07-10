/**
 * # ArchbaseDependencyProvider Component
 *
 * O `ArchbaseDependencyProvider` é um componente React que facilita a comunicação entre componentes em uma aplicação,
 * permitindo que se registrem como ouvintes de dependências específicas e sejam notificados sobre atualizações,
 * acompanhadas de dados relevantes.
 *
 * ## Uso
 *
 * Para utilizar, envolva os componentes com `ArchbaseDependencyProvider`. Dentro dos componentes filhos,
 * utilize o hook `useArchbaseDependency` para registrar ouvintes para dependências específicas ou para notificar
 * sobre atualizações de dependências.
 *
 * ## Exemplo
 *
 * ```jsx
 * import React from 'react';
 * import { ArchbaseDependencyProvider, useArchbaseDependency } from './ArchbaseDependencyManager';
 *
 * const App = () => (
 *   <ArchbaseDependencyProvider>
 *     <ChildComponent />
 *     <SiblingComponent />
 *   </ArchbaseDependencyProvider>
 * );
 *
 * const ChildComponent = () => {
 *   const { registerListener } = useArchbaseDependency();
 *
 *   useEffect(() => {
 *     const handleDataChange = (newData, extra) => {
 *       console.log('Data updated:', newData, 'Additional info:', extra);
 *     };
 *
 *     registerListener('key', handleDataChange);
 *   }, []);
 *
 *   return <div>Child Component</div>;
 * };
 *
 * const SiblingComponent = () => {
 *   const { enqueueUpdate } = useArchbaseDependency();
 *
 *   const updateData = () => {
 *     enqueueUpdate('key', 'updatedValue', { extraData: 'extraInfo' });
 *   };
 *
 *   return <button onClick={updateData}>Update Data</button>;
 * };
 * ```
 *
 * Este exemplo mostra como `SiblingComponent` pode notificar `ChildComponent` sobre atualizações,
 * usando o `ArchbaseDependencyProvider` para gerenciar a dependência 'key' entre eles.
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

type UpdateQueueItem = {
  key: string
  value: any
  data: any
}

interface ArchbaseDependencyProviderProps {
  children: ReactNode
}

const ArchbaseDependencyContext = createContext({
  registerListener: (key: string, listener: Function): void => {
    throw new Error('registerListener chamado fora do contexto de ArchbaseDependencyProvider')
  },
  removeListener: (key: string, listener: Function): void => {
    throw new Error('removeListener chamado fora do contexto de ArchbaseDependencyProvider')
  },
  enqueueUpdate: (update: UpdateQueueItem): void => {
    throw new Error('enqueueUpdate chamado fora do contexto de ArchbaseDependencyProvider')
  }
})

// Definição dos tipos para as ações do reducer
const REGISTER_LISTENER = 'REGISTER_LISTENER'
const REMOVE_LISTENER = 'REMOVE_LISTENER'
const ENQUEUE_UPDATE = 'ENQUEUE_UPDATE'
const PROCESS_QUEUE = 'PROCESS_QUEUE'

// Ação de typescript para as ações do reducer
type Action =
  | { type: 'REGISTER_LISTENER'; key: string; listener: Function }
  | { type: 'REMOVE_LISTENER'; key: string; listener: Function }
  | { type: 'ENQUEUE_UPDATE'; update: UpdateQueueItem }
  | { type: 'PROCESS_QUEUE' }

// Estado inicial para o reducer
const initialState = {
  listeners: {},
  updateQueue: []
}

// Reducer para gerenciar o estado
function dependencyReducer(state, action) {
  switch (action.type) {
    case REGISTER_LISTENER:
      return {
        ...state,
        listeners: {
          ...state.listeners,
          [action.key]: [...(state.listeners[action.key] || []), action.listener]
        }
      }
    case REMOVE_LISTENER:
      return {
        ...state,
        listeners: {
          ...state.listeners,
          [action.key]:
            state.listeners[action.key]?.filter((listener) => listener !== action.listener) || []
        }
      }
    case ENQUEUE_UPDATE: {
      // Verifica se existem listeners registrados para a chave especificada.
      const listenersForKey = state.listeners[action.update.key]
      if (listenersForKey) {
        // Para cada listener registrado sob a chave, adiciona uma entrada separada na fila de atualização.
        const updatesForListeners = listenersForKey.map((listener) => ({
          ...action.update,
          listener
        }))
        return {
          ...state,
          updateQueue: [...state.updateQueue, ...updatesForListeners]
        }
      }
      return state
    }
    case PROCESS_QUEUE: {
      if (state.updateQueue.length > 0) {
        // Extrai o primeiro item da fila.
        const update = state.updateQueue[0]
        // Notifica apenas o listener específico para esta atualização.
        update.listener(update.value, update.data)
        // Remove a atualização atual da fila.
        return {
          ...state,
          updateQueue: state.updateQueue.slice(1)
        }
      }
      return state
    }
    default:
      return state
  }
}

export const ArchbaseDependencyProvider: React.FC<ArchbaseDependencyProviderProps> = ({
  children
}) => {
  const [state, dispatch] = useReducer(dependencyReducer, initialState)

  // Funções para interagir com o estado
  const registerListener = (key, listener) => dispatch({ type: REGISTER_LISTENER, key, listener })
  const removeListener = (key, listener) => dispatch({ type: REMOVE_LISTENER, key, listener })
  const enqueueUpdate = (update: UpdateQueueItem) => dispatch({ type: ENQUEUE_UPDATE, update })

  // Processar a fila de atualizações
  useEffect(() => {
    dispatch({ type: PROCESS_QUEUE })
  }, [state.updateQueue])

  return (
    <ArchbaseDependencyContext.Provider value={{ registerListener, removeListener, enqueueUpdate }}>
      {children}
    </ArchbaseDependencyContext.Provider>
  )
}

export const useArchbaseDependency = () => useContext(ArchbaseDependencyContext)
