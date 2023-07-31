import React from 'react'

export interface ArchbaseAsyncSelectContextValue {
    /** Function para notificar o select que o dropdown chegou ao final da lista*/
    handleDropdownScrollEnded?: () => void;
}
const ArchbaseAsyncSelectContext = React.createContext<ArchbaseAsyncSelectContextValue>({})
export const ArchbaseAsyncSelectProvider = ArchbaseAsyncSelectContext.Provider
export default ArchbaseAsyncSelectContext