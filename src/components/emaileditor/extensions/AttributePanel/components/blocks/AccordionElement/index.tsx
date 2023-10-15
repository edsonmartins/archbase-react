import React from 'react';
import { Border } from '../../attributes/Border';
import { BackgroundColor } from '../../attributes/BackgroundColor';
import { FontFamily } from '../../attributes/FontFamily';
import { AttributesPanelWrapper } from '../../attributes/AttributesPanelWrapper';
import { useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { Collapse, Space } from '@arco-design/web-react';
import { t } from 'i18next';

export function AccordionElement() {
  const { focusIdx } = useArchbaseEmailFocusIdx();
  return (
    <AttributesPanelWrapper>
      <Collapse defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item name='0' header={t('archbase:Setting')}>
          <Space direction='vertical'>
            <Border />
            <BackgroundColor />
            <FontFamily />
          </Space>
        </Collapse.Item>
      </Collapse>
    </AttributesPanelWrapper>
  );
}
