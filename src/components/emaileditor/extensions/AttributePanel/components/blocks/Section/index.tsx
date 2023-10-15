import React, { useCallback } from 'react';
import { Padding } from '@emaileditor/extensions/AttributePanel/components/attributes/Padding';
import { Background } from '@emaileditor/extensions/AttributePanel/components/attributes/Background';
import { Border } from '@emaileditor/extensions/AttributePanel/components/attributes/Border';
import { AttributesPanelWrapper } from '@emaileditor/extensions/AttributePanel/components/attributes/AttributesPanelWrapper';
import { Collapse, Grid, Space, Switch } from '@arco-design/web-react';
import { Stack, useArchbaseEmailBlock } from '@emaileditor/editor/index';
import { BasicType, BlockManager } from '@emaileditor/core/index';
import { ClassName } from '../../attributes/ClassName';
import { CollapseWrapper } from '../../attributes/CollapseWrapper';
import { t } from 'i18next';

export function Section() {
  const { focusBlock, setFocusBlock } = useArchbaseEmailBlock();

  const noWrap = focusBlock?.data.value.noWrap;

  const onChange = useCallback((checked) => {
    if (!focusBlock) return;
    focusBlock.data.value.noWrap = checked;
    if (checked) {
      const children = [...focusBlock.children];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child) continue;
        if (child.type === BasicType.GROUP) {
          children.splice(i, 1, ...child.children);
        }
      }
      focusBlock.children = [
        BlockManager.getBlockByType(BasicType.GROUP)!.create({
          children: children,
        }),
      ];
    } else {
      if (
        focusBlock.children.length === 1 &&
        focusBlock.children[0].type === BasicType.GROUP
      ) {
        focusBlock.children = focusBlock.children[0]?.children || [];
      }
    }
    setFocusBlock({ ...focusBlock });
  }, [focusBlock, setFocusBlock]);

  return (
    <AttributesPanelWrapper style={{ padding: 0 }}>
      <CollapseWrapper defaultActiveKey={['0', '1', '2']}>
        <Collapse.Item name='0' header={t('archbase:Dimension')}>
          <Space direction='vertical'>
            <Grid.Row>
              <Grid.Col span={12}>
                <label style={{ width: '100%', display: 'flex' }}>
                  <div style={{ flex: 1 }}>{t('archbase:Group')}</div>
                </label>
                <Switch
                  checked={noWrap}
                  checkedText={t('archbase:True')}
                  uncheckedText={t('archbase:False')}
                  onChange={onChange}
                />
              </Grid.Col>
              <Grid.Col span={12} />
            </Grid.Row>

            <Padding />
          </Space>
        </Collapse.Item>
        <Collapse.Item name='1' header={t('archbase:Background')}>
          <Stack vertical spacing='tight'>
            <Background />
          </Stack>
        </Collapse.Item>
        <Collapse.Item name='2' header={t('archbase:Border')}>
          <Border />
        </Collapse.Item>
        <Collapse.Item name='4' header={t('archbase:Extra')}>
          <Grid.Col span={24}>
            <ClassName />
          </Grid.Col>
        </Collapse.Item>
      </CollapseWrapper>
    </AttributesPanelWrapper>
  );
}
