import { IBlockData } from '@emaileditor/core/index';
import React, { useMemo } from 'react';

export interface CollectedBlock {
  label: string;
  helpText: string;
  thumbnail: string;
  data: IBlockData;
  id: string;
}

export interface BlockGroup {
  title: string;
  blocks: Array<CollectedBlock>;
}

export interface ArchbaseEmailPropsProviderProps {
  children?: React.ReactNode;
  height: string;
  fontList?: { value: string; label: string }[];
  onAddCollection?: (payload: CollectedBlock) => void;
  onRemoveCollection?: (payload: { id: string }) => void;
  onUploadImage?: (data: Blob) => Promise<string>;
  interactiveStyle?: {
    hoverColor?: string;
    selectedColor?: string;
    dragoverColor?: string;
    tangentColor?: string;
  };
  autoComplete?: boolean;
  dashed?: boolean;
  socialIcons?: Array<{ content: string; image: string }>;

  mergeTagGenerate?: (m: string) => string;
  onChangeMergeTag?: (ptah: string, val: any) => any;
  renderMergeTagContent?: (props: {
    onChange: (val: string) => void;
    isSelect: boolean;
    value: string;
  }) => React.ReactNode;
  enabledMergeTagsBadge?: boolean;
  mergeTags?: Record<string, any>;
  previewInjectData?: Record<string, any>;
  onBeforePreview?: (
    html: string,
    mergeTags: ArchbaseEmailPropsProviderProps['previewInjectData'] | ArchbaseEmailPropsProviderProps['mergeTags'],
  ) => string | Promise<string>;
  enabledLogic?: boolean;
}

const defaultMergeTagGenerate = (m: string) => `{{${m}}}`;

export const ArchbaseEmailEditorPropsContext = React.createContext<
  ArchbaseEmailPropsProviderProps & {
    mergeTagGenerate: Required<ArchbaseEmailPropsProviderProps['mergeTagGenerate']>;
  }
>({
  children: null,
  height: '100vh',
  fontList: [],
  onAddCollection: undefined,
  onRemoveCollection: undefined,
  onUploadImage: undefined,
  autoComplete: false,
  dashed: true,
  mergeTagGenerate: defaultMergeTagGenerate,
  enabledLogic: false,
});

export const ArchbaseEmailPropsProvider: React.FC<ArchbaseEmailPropsProviderProps> = props => {
  const { dashed = true, mergeTagGenerate = defaultMergeTagGenerate } = props;
  const formatProps = useMemo(() => {
    return {
      ...props,
      mergeTagGenerate,
      dashed,
    };
  }, [mergeTagGenerate, props, dashed]);

  return (
    <ArchbaseEmailEditorPropsContext.Provider value={formatProps}>
      {props.children}
    </ArchbaseEmailEditorPropsContext.Provider>
  );
};
