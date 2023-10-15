// export components
export * from './components/Provider/EmailEditorProvider';

export { BlockAvatarWrapper } from './components/wrapper';

export { ArchbaseEmailEditor } from './components/EmailEditor';

// exposing more granular components
export { EditEmailPreview } from './components/EmailEditor/components/EditEmailPreview';
export { MobileEmailPreview } from './components/EmailEditor/components/MobileEmailPreview';
export { DesktopEmailPreview } from './components/EmailEditor/components/DesktopEmailPreview';
export { ToolsPanel } from './components/EmailEditor/components/ToolsPanel';

// export utils
export * from './utils/index';

// export hooks
export { useArchbaseEmailActiveTab } from './hooks/useArchbaseEmailActiveTab';
export { useArchbaseEmailEditorProps } from './hooks/useArchbaseEmailEditorProps';
export { useArchbaseEmailBlock } from './hooks/useArchbaseEmailBlock';
export { useArchbaseEmailEditorContext } from './hooks/useArchbaseEmailEditorContext';
export { useArchbaseEmailDomScrollHeight } from './hooks/useArchbaseEmailDomScrollHeight';
export { useArchbaseEmailRefState } from './hooks/useArchbaseEmailRefState';
export { useArchbaseEmailLazyState } from './hooks/useArchbaseEmailLazyState';
export { useArchbaseEmailFocusBlockLayout } from './hooks/useArchbaseEmailFocusBlockLayout';
export * from './hooks/useArchbaseEmailDataTransfer';
export * from './hooks/useArchbaseEmailFocusIdx';
export * from './hooks/useArchbaseEmailHoverIdx';

export { ActiveTabKeys } from './components/Provider/BlocksProvider';

// UI
export { ArchbaseEmailIconFont } from './components/IconFont';
export { TextStyle } from './components/UI/TextStyle';
export { Stack } from './components/UI/Stack';
export { Tabs, TabPane } from './components/UI/Tabs';

export * from './typings';
export type { StackProps } from './components/UI/Stack';
export type { ArchbaseEmailPropsProviderProps } from './components/Provider/PropsProvider';
export type { BlockAvatarWrapperProps } from './components/wrapper';
export type { BlockGroup, CollectedBlock } from './components/Provider/PropsProvider';

export * from './constants';
