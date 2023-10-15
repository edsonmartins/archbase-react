import React, { useMemo, useCallback } from 'react';
import { Stack } from '../UI/Stack';
import { ToolsPanel } from './components/ToolsPanel';
import { createPortal } from 'react-dom';
import { EASY_EMAIL_EDITOR_ID, FIXED_CONTAINER_ID } from '@emaileditor/editor/constants';
import { useArchbaseEmailActiveTab } from '@emaileditor/editor/hooks/useArchbaseEmailActiveTab';
import { ActiveTabKeys } from '../Provider/BlocksProvider';
import { DesktopEmailPreview } from './components/DesktopEmailPreview';
import { MobileEmailPreview } from './components/MobileEmailPreview';
import { EditEmailPreview } from './components/EditEmailPreview';
import { ArchbaseEmailIconFont } from '../IconFont';
import { TabPane, Tabs } from '@emaileditor/editor/components/UI/Tabs';
import { useArchbaseEmailEditorProps } from '@emaileditor/editor/hooks/useArchbaseEmailEditorProps';
import './index.scss';
import '@emaileditor/editor/assets/font/iconfont.css';
import { EventManager, EventType } from '@emaileditor/editor/utils/EventManager';

(window as any).global = window; // react-codemirror


/**
 * Exemplo:
 * ```tsx
 *   import React from 'react'
 *   import { ArchbaseEmailEditor, ArchbaseEmailEditorProvider, BasicType, BlockManager, StandardLayout } from 'archbase-react'
 *   import { useWindowSize } from 'react-use'
 *   import '../../styles/arco.css'
 *
 *   const initialValues = {
 *     subject: 'Bem vindo ao Archbase-Email',
 *     subTitle: 'Prazer em conhecê-lo!',
 *     content: BlockManager.getBlockByType(BasicType.PAGE)!.create({}),
 *   };
 * 
 *   const ArchbaseEmailEditorExample = () => {
 *       const { width } = useWindowSize();
 *
 *     const smallScene = width < 1400;
 *
 *     return (
 *       <ArchbaseEmailEditorProvider
 *         data={initialValues}
 *         height={'calc(100vh - 72px)'}
 *         autoComplete
 *         dashed={false}
 *       >
 *         {({ values }) => {
 *           return (
 *             <StandardLayout
 *                   compact={!smallScene}
 *                   showSourceCode={true} categories={[]}          >
 *               <ArchbaseEmailEditor />
 *             </StandardLayout>
 *           );
 *         }}
 *       </ArchbaseEmailEditorProvider>
 *     );
 *   }
 * ``` 
 */



export const ArchbaseEmailEditor = () => {
  const { height: containerHeight } = useArchbaseEmailEditorProps();
  const { setActiveTab, activeTab } = useArchbaseEmailActiveTab();

  const fixedContainer = useMemo(() => {
    return createPortal(<div id={FIXED_CONTAINER_ID} />, document.body);
  }, []);

  const onBeforeChangeTab = useCallback((currentTab: any, nextTab: any) => {
    return EventManager.exec(EventType.ACTIVE_TAB_CHANGE, { currentTab, nextTab });
  }, []);

  const onChangeTab = useCallback((nextTab: string) => {
    setActiveTab(nextTab as any);
  }, [setActiveTab]);

  return useMemo(
    () => (
      <div
        id={EASY_EMAIL_EDITOR_ID}
        style={{
          display: 'flex',
          flex: '1',
          overflow: 'hidden',
          justifyContent: 'center',
          minWidth: 640,
          height: containerHeight,
        }}
      >
        <Tabs
          activeTab={activeTab}
          onBeforeChange={onBeforeChangeTab}
          onChange={onChangeTab}
          style={{ height: '100%', width: '100%' }}
          tabBarExtraContent={<ToolsPanel />}
        >
          <TabPane
            style={{ height: 'calc(100% - 50px)' }}
            tab={(
              <Stack spacing='tight'>
                <ArchbaseEmailIconFont iconName='icon-editor' />
              </Stack>
            )}
            key={ActiveTabKeys.EDIT}
          >
            <EditEmailPreview />
          </TabPane>
          <TabPane
            style={{ height: 'calc(100% - 50px)' }}
            tab={(
              <Stack spacing='tight'>
                <ArchbaseEmailIconFont iconName='icon-desktop' />
              </Stack>
            )}
            key={ActiveTabKeys.PC}
          >
            <DesktopEmailPreview />
          </TabPane>
          <TabPane
            style={{ height: 'calc(100% - 50px)' }}
            tab={(
              <Stack spacing='tight'>
                <ArchbaseEmailIconFont iconName='icon-mobile' />
              </Stack>
            )}
            key={ActiveTabKeys.MOBILE}
          >
            <MobileEmailPreview />
          </TabPane>
        </Tabs>
        <>{fixedContainer}</>
      </div>
    ),
    [activeTab, containerHeight, fixedContainer, onBeforeChangeTab, onChangeTab]
  );
};
