import React, { useState } from 'react';
import { IconFont, useFocusIdx } from '@emaileditor/editor/index';
import { TextAreaField } from '@emaileditor/extensions/components/Form';
import { AttributesPanelWrapper } from '../../attributes';
import { Button, Tooltip } from '@arco-design/web-react';
import { HtmlEditor } from '../../UI/HtmlEditor';

export function Raw() {
  const { focusIdx } = useFocusIdx();
  const [visible, setVisible] = useState(false);
  return (
    <AttributesPanelWrapper
      style={{ padding: 20 }}
      extra={(
        <Tooltip content={t('Html mode')}>
          <Button
            onClick={() => setVisible(true)}
            icon={<IconFont iconName='icon-html' />}
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
