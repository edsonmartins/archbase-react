import React, { useMemo } from 'react';
import { ColorPickerField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { t } from 'i18next';

export function ContainerBackgroundColor({
  title = t('archbase:Container background color'),
}: {
  title?: string;
}) {
  const { focusIdx } = useArchbaseEmailFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={title}
        name={`${focusIdx}.attributes.container-background-color`}
      />
    );
  }, [focusIdx, title]);
}
