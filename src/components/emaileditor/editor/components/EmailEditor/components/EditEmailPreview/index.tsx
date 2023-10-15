import React, { useEffect, useMemo, useState } from 'react';
import { MjmlDomRender } from '../EditEmailPreview/components/MjmlDomRender';
import { useDropBlock } from '@emaileditor/editor/hooks/useDropBlock';
import { useHotKeys } from '@emaileditor/editor/hooks/useHotKeys';
import { SyncScrollShadowDom } from '@emaileditor/editor/components/UI/SyncScrollShadowDom';
import { ShadowStyle } from './components/ShadowStyle';
import { useEditorContext } from '@emaileditor/editor/hooks/useEditorContext';
import { DATA_ATTRIBUTE_DROP_CONTAINER, SYNC_SCROLL_ELEMENT_CLASS_NAME } from '@emaileditor/editor/constants';
import { classnames } from '@emaileditor/editor/utils/classnames';
import { ActiveTabKeys } from '@emaileditor/editor/components/Provider/BlocksProvider';
import { useActiveTab } from '@emaileditor/editor/hooks/useActiveTab';

export function EditEmailPreview() {
  useHotKeys();
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);
  const { setRef } = useDropBlock();
  const { activeTab } = useActiveTab();

  const { setInitialized } = useEditorContext();

  useEffect(() => {
    setRef(containerRef);
  }, [containerRef, setRef]);

  useEffect(() => {
    if (containerRef) {
      setInitialized(true);
    }
  }, [containerRef, setInitialized]);

  return useMemo(
    () => (
      <SyncScrollShadowDom
        isActive={activeTab === ActiveTabKeys.EDIT}
        id='VisualEditorEditMode'
        {...{
          [DATA_ATTRIBUTE_DROP_CONTAINER]: 'true',
        }}
        style={{
          height: '100%',
          zIndex: 10,
          position: 'relative',
          outline: 'none',
        }}
      >
        <div
          id='archbase-email-plugins'
          style={{
            position: 'relative',
          }}
        />
        <div
          className={classnames('shadow-container', SYNC_SCROLL_ELEMENT_CLASS_NAME)}
          style={{
            height: '100%',
            overflowY: 'auto',
            zIndex: 10,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 40,
            paddingBottom: 40,
            boxSizing: 'border-box',
          }}
          ref={setContainerRef}

        >
          <MjmlDomRender />
        </div>
        <ShadowStyle />
      </SyncScrollShadowDom>
    ),
    [activeTab]
  );
}
