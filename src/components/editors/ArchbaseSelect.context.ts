import React from 'react'

export interface ArchbaseSelectContextValue {
    /** Function para notificar o select que o dropdown chegou ao final da lista*/
    handleDropdownScrollEnded?: () => void;
}
const ArchbaseSelectContext = React.createContext<ArchbaseSelectContextValue>({})
export const ArchbaseSelectProvider = ArchbaseSelectContext.Provider
export default ArchbaseSelectContext