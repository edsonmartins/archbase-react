import React, { useMemo } from 'react';
import { ColorPickerField } from '../../../components/Form';
import { useFocusIdx } from '@emaileditor/editor/index';

export function ContainerBackgroundColor({
  title = t('Container background color'),
}: {
  title?: string;
}) {
  const { focusIdx } = useFocusIdx();

  return useMemo(() => {
    return (
      <ColorPickerField
        label={title}
        name={`${focusIdx}.attributes.container-background-color`}
      />
    );
  }, [focusIdx, title]);
}
