import { useCallback, useRef, useState } from 'react';
import { useGridFilter } from 'ag-grid-react';
import type { CustomFilterProps } from 'ag-grid-react';
import { Checkbox, Divider, Stack } from '@mantine/core';

interface EnumFilterModel {
  filterType: 'set';
  values: string[];
}

type Props = CustomFilterProps<any, any, EnumFilterModel> & {
  enumValues?: Array<{ label: string; value: string }>;
};

export function ArchbaseEnumSetFilter({ model, onModelChange, onUiChange, colDef, enumValues = [] }: Props) {
  const [pending, setPending] = useState<string[]>(model?.values ?? []);

  // modelRef keeps doesFilterPass and afterGuiAttached stable across re-renders.
  // FilterComponentWrapper.setMethods() calls filterChangedCallback() whenever
  // doesFilterPass changes reference — causing an infinite loop if defined inline.
  const modelRef = useRef(model);
  modelRef.current = model;

  const field = ((colDef as any).field ?? '') as string;

  const doesFilterPass = useCallback(({ data }: any) => {
    if (!modelRef.current?.values?.length) return true;
    return modelRef.current.values.includes(data?.[field]);
  }, [field]);

  const afterGuiAttached = useCallback(() => {
    setPending(modelRef.current?.values ?? []);
  }, []);

  useGridFilter({ doesFilterPass, afterGuiAttached });

  const toggle = (value: string) => {
    setPending((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    onUiChange();
  };

  const handleApply = () => {
    onModelChange(pending.length === 0 ? null : { filterType: 'set', values: pending });
  };

  const handleReset = () => {
    setPending([]);
    onModelChange(null);
  };

  return (
    <Stack gap={0} miw={180}>
      <Stack p="xs" gap={6}>
        {enumValues.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            size="sm"
            checked={pending.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
        ))}
      </Stack>
      <Divider />
      <div className="ag-filter-apply-panel">
        <button className="ag-standard-button ag-filter-apply-panel-button" onClick={handleReset}>
          Redefinir
        </button>
        <button className="ag-standard-button ag-filter-apply-panel-button" onClick={handleApply}>
          Aplicar
        </button>
      </div>
    </Stack>
  );
}

ArchbaseEnumSetFilter.displayName = 'ArchbaseEnumSetFilter';
