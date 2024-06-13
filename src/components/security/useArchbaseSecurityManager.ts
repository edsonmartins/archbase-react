import { ArchbaseStore } from "@components/hooks"
import { ArchbaseSecurityManager } from "./ArchbaseSecurityManager"

export type UseArchbaseSecurityManagerProps = {
    name: string
    store: ArchbaseStore
  }

export function useArchbaseSecurityManager(props: UseArchbaseSecurityManagerProps) {
    const {
        name,
        store
    } = props

    const buildSecurityManager = () => {
        if (store.existsValue(name)) {
          return store.getValue(name)
        }
        const securityManager = new ArchbaseSecurityManager(name)
        store.setValue(name, securityManager)
        return securityManager
    }

    return buildSecurityManager()
}