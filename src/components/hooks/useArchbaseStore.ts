import { create } from 'zustand';
import { ArchbaseStateValues } from '@components/template/ArchbaseStateValues';

export const useArchbaseStore = create<ArchbaseStateValues>((set, get) => ({
  values: new Map(),
  setValue: (key, value) =>
    set((state) => {
      const newMap = new Map(state.values);
      newMap.set(key, value);

      return { values: newMap };
    }),
  existsValue: (key) => {
    return get().values.has(key);
  },
  clearValue: (name) =>
    set((state) => {
      const newMap = new Map(state.values);
      newMap.delete(name);

      return { values: newMap };
    }),
  clearAllValues: () =>
    set((_state) => {
      return { values: new Map() };
    }),
}));
