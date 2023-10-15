import React, { useMemo } from 'react';
import { useFocusIdx } from '@emaileditor/editor/index';
import { AutoCompleteField } from '../../../components/Form';
import { useFontFamily } from '@emaileditor/extensions/hooks/useFontFamily';

export function FontFamily({ name }: { name?: string }) {
  const { focusIdx } = useFocusIdx();
  const { fontList } = useFontFamily();

  return useMemo(() => {
    return (
      <AutoCompleteField
        style={{ minWidth: 100, flex: 1 }}
        showSearch
        label={t('Font family')}
        name={name || `${focusIdx}.attributes.font-family`}
        options={fontList}
      />
    );
  }, [focusIdx, fontList, name]);
}
