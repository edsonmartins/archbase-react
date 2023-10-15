import React from 'react';

import iphoneFrame from '@emaileditor/editor/assets/images/iphone.png';
import { ActiveTabKeys } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { SYNC_SCROLL_ELEMENT_CLASS_NAME } from '@emaileditor/editor/constants';
import { usePreviewEmail } from '@emaileditor/editor/hooks/usePreviewEmail';
import { SyncScrollIframeComponent } from '@emaileditor/editor/components/UI/SyncScrollIframeComponent';
import { classnames } from '@emaileditor/editor/utils/classnames';
import { useActiveTab } from '@emaileditor/editor/hooks/useActiveTab';

const MOBILE_WIDTH = 320;
const MOBILE_Height = 640;

export function MobileEmailPreview() {
  const { mobileWidth } = usePreviewEmail();
  const { activeTab } = useActiveTab();

  const { errMsg, reactNode } = usePreviewEmail();

  const isActive = activeTab === ActiveTabKeys.MOBILE;

  if (errMsg) {
    return (
      <div style={{ textAlign: 'center', fontSize: 24, color: 'red' }}>
        <>{errMsg}</>
      </div>
    );
  }

  return (
    <div
      className='archbase-email-overlay'
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        padding: '10px 0px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'relative',
          margin: 'auto',
          padding: '6px 6.8px 2px 6.8px',
        }}
      >
        <div
          style={{
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            position: 'absolute',
            padding: '6px 6.8px 2px 6.8px',
            backgroundImage: `url(${iphoneFrame})`,
            backgroundSize: '100% 100%',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            width: MOBILE_WIDTH,
            height: MOBILE_Height,
          }}
        >
          <div
            style={{
              height: MOBILE_Height / (MOBILE_WIDTH / mobileWidth),
              width: mobileWidth,
              boxSizing: 'content-box',
              borderRadius: 30,
              border: 'none',
              transform: `scale(${MOBILE_WIDTH / mobileWidth})`,
              transformOrigin: 'left top',
              overflow: 'hidden',
            }}
          >
            <SyncScrollIframeComponent
              isActive={isActive}
              style={{
                border: 'none',
                height: '100%',
                width: '100%',
              }}
            >
              <style>
                {`
            *::-webkit-scrollbar {
              -webkit-appearance: none;
              width: 0px;
            }
          `}
              </style>
              <div
                className={classnames(
                  'preview-container',
                  SYNC_SCROLL_ELEMENT_CLASS_NAME,
                )}
                style={{
                  height: '100%',
                  overflow: 'auto',
                  margin: 'auto',
                }}
              >
                <>{reactNode}</>
              </div>
            </SyncScrollIframeComponent>
          </div>
        </div>
      </div>
    </div>
  );
}
