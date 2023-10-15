import React, { useMemo } from 'react';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { AutoCompleteField } from '../../../components/Form';
import { useFontFamily } from '@emaileditor/extensions/hooks/useFontFamily';
import { t } from 'i18next';

export function FontFamily({ name }: { name?: string }) {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { fontList } = useFontFamily();

  return useMemo(() => {
    return (
      <AutoCompleteField
        style={{ minWidth: 100, flex: 1 }}
        showSearch
        label={t('archbase:Font family')}
        name={name || `${focusIdx}.attributes.font-family`}
        options={fontList}
      />
    );
  }, [focusIdx, fontList, name]);
}
