import React, { useState } from 'react';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import { TextDecoration } from '@emaileditor/extensions/AttributePanel/components/attributes/TextDecoration';
import { FontWeight } from '@emaileditor/extensions/AttributePanel/components/attributes/FontWeight';
import { FontStyle } from '@emaileditor/extensions/AttributePanel/components/attributes/FontStyle';
import { FontFamily } from '@emaileditor/extensions/AttributePanel/components/attributes/FontFamily';
import { Height } from '@emaileditor/extensions/AttributePanel/components/attributes/Height';
import { ContainerBackgroundColor } from '@emaileditor/extensions/AttributePanel/components/attributes/ContainerBackgroundColor';
import { FontSize } from '@emaileditor/extensions/AttributePanel/components/attributes/FontSize';
import { Color } from '@emaileditor/extensions/AttributePanel/components/attributes/Color';
import { Align } from '@emaileditor/extensions/AttributePanel/components/attributes/Align';
import { LineHeight } from '@emaileditor/extensions/AttributePanel/components/attributes/LineHeight';
import { LetterSpacing } from '@emaileditor/extensions/AttributePanel/components/attributes/LetterSpacing';

import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space, Tooltip, Button } from '@arco-design/web-react';
import {ArchbaseEmailIconFont } from '@emaileditor/editor/index';
import { HtmlEditor } from '../../UI/HtmlEditor';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

export function Text() {
  const [visible, setVisible] = useState(false);

  return (
    <AttributesPanelWrapper
      extra={(
        <Tooltip content={t('archbase:Html mode')}>
          <Button
            onClick={() => setVisible(true)}
            icon={<ArchbaseEmailIconFont iconName='icon-html' />}
          />
        </Tooltip>
      )}
    >
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item
          name='0'
          header={t('archbase:Dimension')}
        >
          <Space direction='vertical'>
            <Height />
            <Padding showResetAll />
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='1'
          header={t('archbase:Color')}
        >
          <Grid.Row>
            <Grid.Col span={11}>
              <Color />
            </Grid.Col>
            <Grid.Col
              offset={1}
              span={11}
            >
              <ContainerBackgroundColor title={t('archbase:Background color')} />
            </Grid.Col>
          </Grid.Row>
        </Collapse.Item>
        <Collapse.Item
          name='2'
          header={t('archbase:Typography')}
        >
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={11}>
                <FontFamily />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <FontSize />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <LineHeight />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <LetterSpacing />
              </Grid.Col>
            </Grid.Row>

            <Grid.Row>
              <Grid.Col span={11}>
                <TextDecoration />
              </Grid.Col>
              <Grid.Col
                offset={1}
                span={11}
              >
                <FontWeight />
              </Grid.Col>
            </Grid.Row>

            <Align />

            <FontStyle />

            <Grid.Row>
              <Grid.Col span={11} />
              <Grid.Col
                offset={1}
                span={11}
              />
            </Grid.Row>
          </Space>
        </Collapse.Item>
        <Collapse.Item
          name='4'
          header={t('archbase:Extra')}
        >
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
      <HtmlEditor
        visible={visible}
        setVisible={setVisible}
      />
    </AttributesPanelWrapper>
  );
}
