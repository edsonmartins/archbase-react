import React, { useState } from 'react';
import {ArchbaseEmailIconFont, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { TextAreaField } from '@emaileditor/extensions/components/Form';
import { AttributesPanelWrapper } from '../../attributes';
import { Button, Tooltip } from '@arco-design/web-react';
import { HtmlEditor } from '../../UI/HtmlEditor';
import { t } from 'i18next';

export function Raw() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  const [visible, setVisible] = useState(false);
  return (
    <AttributesPanelWrapper
      style={{ padding: 20 }}
      extra={(
        <Tooltip content={t('archbase:Html mode')}>
          <Button
            onClick={() => setVisible(true)}
            icon={<ArchbaseEmailIconFont iconName='icon-html' />}
          />
        </Tooltip>
      )}
    >
      <TextAreaField
        label=''
        name={`${focusIdx}.data.value.content`}
        rows={5}
      />
      <HtmlEditor
        visible={visible}
        setVisible={setVisible}
      />
    </AttributesPanelWrapper>
  );
}
