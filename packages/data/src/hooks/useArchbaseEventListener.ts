import { useEffect, useRef } from 'react'

/*
Example usage:
    import { useState, useRef, useEffect, useCallback } from "react";
    // Usage
    function App() {
    // State for storing mouse coordinates
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    // Event handler utilizing useCallback ...
    // ... so that reference never changes.
    const handler = useCallback(
        ({ clientX, clientY }) => {
        // Update coordinates
        setCoords({ x: clientX, y: clientY });
        },
        [setCoords]
    );
    // Add event listener using our hook
    useArchbaseEventListener("mousemove", handler);
    return (
        <h1>
        The mouse position is ({coords.x}, {coords.y})
        </h1>
    );
    }
*/

export function useArchbaseEventListener(eventName, handler, element = window) {
  // Crie uma referência que armazene o manipulador
  const savedHandler = useRef<any>(handler)
  // Atualiza o valor ref.current se o manipulador mudar.
  // Isso permite que nosso efeito abaixo sempre obtenha o manipulador mais recente ...
  // ... sem que precisemos passá-lo em efeito deps array ...
  // ... e potencialmente causar efeito para executar novamente cada renderização.
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // Certifique-se de que o elemento suporta addEventListener
      // on
      const isSupported = element && element.addEventListener
      if (!isSupported) return
      if (savedHandler.current) {
        // Cria um ouvinte de eventos que chama a função do manipulador armazenada em ref
        const eventListener = (event) => savedHandler.current(event)
        // Adicionar ouvinte de evento
        element.addEventListener(eventName, eventListener)
        // Remove o ouvinte de evento na limpeza
        return () => {
          element.removeEventListener(eventName, eventListener)
        }
      }
    },
    [eventName, element] // Executa novamente se eventName ou elemento mudar
  )
}
