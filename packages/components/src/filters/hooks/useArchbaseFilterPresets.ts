import { useCallback, useMemo } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import React from 'react';
import type {
  ArchbaseActiveFilter,
  SavedFilterPreset,
  UseArchbaseFilterPresetsOptions,
  UseArchbaseFilterPresetsReturn,
} from '../ArchbaseCompositeFilters.types';

/**
 * Hook para gerenciar presets de filtros salvos no localStorage
 *
 * @param options - Opções de configuração
 * @returns Objeto com presets e ações para gerenciá-los
 *
 * @example
 * ```ts
 * const {
 *   presets,
 *   sortedPresets,
 *   savePreset,
 *   loadPreset,
 *   deletePreset,
 *   toggleFavorite
 * } = useArchbaseFilterPresets({
 *   storageKey: 'my-app-filters',
 *   onLoad: (filters) => console.log('Loaded', filters)
 * });
 * ```
 */
export function useArchbaseFilterPresets(
  options: UseArchbaseFilterPresetsOptions = {}
): UseArchbaseFilterPresetsReturn {
  const { storageKey = 'archbase-filter-presets', onLoad } = options;

  const [savedPresets, setSavedPresets] = useLocalStorage<SavedFilterPreset[]>({
    key: storageKey,
    defaultValue: [],
  });

  // Presets ordenados (favoritos primeiro)
  const sortedPresets = useMemo(() => {
    return [...savedPresets].sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [savedPresets]);

  // Salva um preset
  const savePreset = useCallback(
    (filters: ArchbaseActiveFilter[], name?: string): SavedFilterPreset | null => {
      if (filters.length === 0) {
        notifications.show({
          title: String('No filters to save'),
          message: String('Add some filters before saving a preset'),
          color: 'yellow',
        });
        return null;
      }

      const presetName = name || prompt(String('Enter a name for this filter preset:'));
      if (!presetName) return null;

      const newPreset: SavedFilterPreset = {
        id: `preset-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: presetName,
        filters,
        createdAt: Date.now(),
        isFavorite: false,
      };

      setSavedPresets(prev => [...prev, newPreset]);

      notifications.show({
        title: String('Preset saved'),
        message: `"${presetName}" has been saved`,
        color: 'green',
        icon: React.createElement(
          'svg',
          { xmlns: 'http://www.w3.org/2000/svg', width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
          React.createElement('path', { d: 'M20 6L9 17l-5-5' })
        ),
      });

      return newPreset;
    },
    [setSavedPresets]
  );

  // Carrega um preset
  const loadPreset = useCallback(
    (preset: SavedFilterPreset) => {
      onLoad?.(preset.filters);
      notifications.show({
        title: String('Preset loaded'),
        message: `"${preset.name}" has been applied`,
        color: 'blue',
      });
    },
    [onLoad]
  );

  // Remove um preset
  const deletePreset = useCallback(
    (presetId: string) => {
      setSavedPresets(prev => {
        const preset = prev.find(p => p.id === presetId);
        const updated = prev.filter(p => p.id !== presetId);
        if (preset) {
          notifications.show({
            title: String('Preset deleted'),
            message: `"${preset.name}" has been removed`,
            color: 'red',
          });
        }
        return updated;
      });
    },
    [setSavedPresets]
  );

  // Alterna favorito
  const toggleFavorite = useCallback(
    (presetId: string) => {
      setSavedPresets(prev =>
        prev.map(p =>
          p.id === presetId ? { ...p, isFavorite: !p.isFavorite } : p
        )
      );
    },
    [setSavedPresets]
  );

  // Atualiza um preset
  const updatePreset = useCallback(
    (presetId: string, updates: Partial<Omit<SavedFilterPreset, 'id'>>) => {
      setSavedPresets(prev =>
        prev.map(p => (p.id === presetId ? { ...p, ...updates } : p))
      );
    },
    [setSavedPresets]
  );

  return {
    presets: savedPresets,
    sortedPresets,
    savePreset,
    loadPreset,
    deletePreset,
    updatePreset,
    toggleFavorite,
    hasPresets: savedPresets.length > 0,
  };
}
