import { create } from 'zustand'
import { ArchbaseStateValues } from '@/components/template/ArchbaseStateValues'
import { createTrackedSelector } from 'react-tracked';


const useArchbaseStoreInternal = create<ArchbaseStateValues>((set, get) => ({
  values: new Map(),
  setValue: (key, value) =>
    set((state) => {
      const newMap = new Map(state.values)
      newMap.set(key, value)
      return { values: newMap }
    }),
  getValue: (key) => {
    return get().values.get(key)
  }, 
  existsValue: (key) => {
    return get().values.has(key)
  },
  clearValue: (name) =>
    set((state) => {
      const newMap = new Map(state.values)
      newMap.delete(name)
      return { values: newMap }
    }),
  clearAllValues: () =>
    set((state) => {
      return { values: new Map() }
    }),
  reset: () =>
    set((state) => {
      return { values: new Map() }
    }),  
}))

const useArchbaseTrackedStoreInternal = createTrackedSelector(useArchbaseStoreInternal);

export type ArchbaseStore = {
  setValue: (key : string, value: any) => void
  getValue: (key : string) => any
  existsValue: (key: string) => boolean
  clearValue: (key: string) => void
  clearAllValues: () => void
  reset: () => void
  values: Map<string,any>
}

function filterMapByKey(mapOriginal, key) {
  const result = new Map();

  for (const [chave, valor] of mapOriginal) {
    if (chave.startsWith(key)) {
      result.set(chave, valor);
    }
  }

  return result;
}

export const useArchbaseStore = (nameSpace: string = 'default') : ArchbaseStore => {
  const store = useArchbaseTrackedStoreInternal()

  const setValue = (key: string, value: any) => {
    store.setValue(`${nameSpace}.${key}`,value)
  }

  const getValue = (key: string) => {
    return store.getValue(`${nameSpace}.${key}`)
  }

  const existsValue = (key: string) => {
    return store.existsValue(`${nameSpace}.${key}`)
  }

  const clearValue = (key: string) => {
    store.clearValue(`${nameSpace}.${key}`)
  }

  const clearAllValues = () => {
    for (const [key, value] of store.values.entries()) {
      if (key.startsWith(`${nameSpace}.`)) {
        store.clearValue(key)
      }
    }
  }

  const reset = () => {
    store.clearAllValues()
  }

  const result : ArchbaseStore = {setValue, getValue, clearValue, existsValue, clearAllValues, reset, values: store.values}

  return result;
};