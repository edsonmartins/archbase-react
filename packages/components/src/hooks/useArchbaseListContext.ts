import { useContext } from "react"
import { ArchbaseListContext, ArchbaseListContextValue } from "../list"

export function useArchbaseListContext<T,ID>() {
    const context = useContext<ArchbaseListContextValue<T,ID>>(ArchbaseListContext)
    if (!context) {
      throw new Error('useArchbaseListContext deve ser usado dentro de um ArchbaseListProvider')
    }
    return context
}