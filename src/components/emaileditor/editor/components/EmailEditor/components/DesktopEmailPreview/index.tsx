import React, { useMemo } from 'react';
import { useArchbaseEmailActiveTab } from '@emaileditor/editor/hooks/useArchbaseEmailActiveTab';
import { ActiveTabKeys } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { useArchbaseEmailPreviewEmail } from '@emaileditor/editor/hooks/useArchbaseEmailPreviewEmail';
import { useArchbaseEmailEditorContext } from '@emaileditor/editor/hooks/useArchbaseEmailEditorContext';
import { SyncScrollShadowDom } from '@emaileditor/editor/components/UI/SyncScrollShadowDom';
import { classnames } from '@emaileditor/editor/utils/classnames';
import { SYNC_SCROLL_ELEMENT_CLASS_NAME } from '@emaileditor/editor/constants';
import { createPortal } from 'react-dom';

export function DesktopEmailPreview() {
  const { activeTab } = useArchbaseEmailActiveTab();
  const { errMsg, reactNode } = useArchbaseEmailPreviewEmail();

  const { pageData } = useArchbaseEmailEditorContext();

  const fonts = useMemo(() => {
    return pageData.data.value.fonts || [];
  }, [pageData.data.value.fonts]);

  const isActive = activeTab === ActiveTabKeys.PC;

  if (errMsg) {
    return (
      <div style={{ textAlign: 'center', fontSize: 24, color: 'red' }}>
        <>{errMsg}</>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <SyncScrollShadowDom
        isActive={isActive}
        style={{
          border: 'none',
          height: '100%',
          width: '100%',
        }}
      >
        <>
          <style>
            {`
                .preview-container {
                  overflow: overlay !important;
                }
                *::-webkit-scrollbar {
                  -webkit-appearance: none;
                  width: 0px;
                }
                *::-webkit-scrollbar-thumb {
                  background-color: rgba(0, 0, 0, 0.5);
                  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
                  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
                }
              `}
          </style>
          <div
            className={classnames('preview-container', SYNC_SCROLL_ELEMENT_CLASS_NAME)}
            style={{
              height: '100%',
              overflow: 'auto',
              margin: 'auto',

              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 40,
              paddingBottom: 140,
              boxSizing: 'border-box',
            }}
          >
            <>{reactNode}</>
          </div>
          {createPortal(
            <>
              {fonts.map((item, index) => (
                <link
                  key={index}
                  href={item.href}
                  rel='stylesheet'
                  type='text/css'
                />
              ))}
            </>,
            document.body,
          )}
        </>
      </SyncScrollShadowDom>
    </div>
  );
}
