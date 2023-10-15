import React, { useCallback } from 'react';
import { InputWithUnitField } from '../../../components/Form';
import { useArchbaseEmailFocusIdx, useArchbaseEmailBlock } from '@emaileditor/editor/index';
import { BasicType, getParentByIdx } from '@emaileditor/core/index';
import { InputWithUnitProps } from '@emaileditor/extensions/components/Form/InputWithUnit';
import { UseFieldConfig } from 'react-final-form';
import { t } from 'i18next';

export function Width({
  inline = false,
  unitOptions,
  config,
}: {
  inline?: boolean;
  unitOptions?: InputWithUnitProps['unitOptions'];
  config?: UseFieldConfig<any>;
}) {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const { focusBlock, values } = useArchbaseEmailBlock();
  const parentType = getParentByIdx(values, focusIdx)?.type;

  const validate = useCallback(
    (val: string): string | undefined => {
      if (focusBlock?.type === BasicType.COLUMN && parentType === BasicType.GROUP) {
        return /(\d)*%/.test(val)
          ? undefined
          : t('archbase:Column inside a group must have a width in percentage, not in pixel');
      }
      return undefined;
    },
    [focusBlock?.type, parentType],
  );

  return (
    <InputWithUnitField
      validate={validate}
      label={t('archbase:Width')}
      inline={inline}
      name={`${focusIdx}.attributes.width`}
      unitOptions={unitOptions}
      config={config}
    />
  );
}
