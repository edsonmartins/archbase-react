import React, { useCallback } from 'react';
import { t } from 'i18next'
import { Menu, Popover } from '@arco-design/web-react';
import { ToolItem } from '../ToolItem';
import {ArchbaseEmailIconFont } from '@emaileditor/editor/index';
import { useFontFamily } from '@emaileditor/extensions/hooks/useFontFamily';
import '../../styles/ToolsPopover.css';

export interface FontFamilyProps {
  execCommand: (cmd: string, value: any) => void;
  getPopupContainer: () => HTMLElement;
}

export function FontFamily(props: FontFamilyProps) {
  const { fontList } = useFontFamily();
  const { execCommand } = props;
  const [visible, setVisible] = React.useState(false);

  const onChange = useCallback(
    (val: string) => {
      execCommand('fontName', val);
      setVisible(false);
    },
    [execCommand],
  );

  const onVisibleChange = useCallback((v: boolean) => {
    setVisible(v);
  }, []);

  return (
    <Popover
      trigger='click'
      color='#fff'
      position='left'
      className='archbase-email-extensions-tools-popover'
      popupVisible={visible}
      onVisibleChange={onVisibleChange}
      content={(
        <>
          {/* <style>{styleText}</style> */}
          <div
            style={{
              maxWidth: 150,
              maxHeight: 350,
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <Menu
              onClickMenuItem={onChange}
              selectedKeys={[]}
              style={{ border: 'none', padding: 0 }}
            >
              {fontList.map(item => (
                <Menu.Item
                  style={{ lineHeight: '30px', height: 30 }}
                  key={item.value}
                >
                  {item.label}
                </Menu.Item>
              ))}
            </Menu>
          </div>
        </>
      )}
      getPopupContainer={props.getPopupContainer}
    >
      <ToolItem
        title={t('archbase:Font family')}
        icon={<ArchbaseEmailIconFont iconName='icon-font-family' />}
      />
    </Popover>
  );
}
