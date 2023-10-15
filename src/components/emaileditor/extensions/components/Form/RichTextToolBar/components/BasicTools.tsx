import {ArchbaseEmailIconFont, useArchbaseEmailBlock, useArchbaseEmailEditorProps, useArchbaseEmailFocusIdx } from '@emaileditor/editor/index';
import { useAddToCollection } from '@emaileditor/extensions/hooks/useAddToCollection';
import { getParentIdx } from '@emaileditor/core/index';
import React from 'react';
import { t } from 'i18next'
import { ToolItem } from './ToolItem';

export function BasicTools() {
  const { copyBlock, removeBlock } = useArchbaseEmailBlock();
  const { focusIdx, setFocusIdx } = useArchbaseEmailFocusIdx();
  const { modal, setModalVisible } = useAddToCollection();
  const { onAddCollection } = useArchbaseEmailEditorProps();

  const handleAddToCollection = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setModalVisible(true);
  };

  const handleCopy: React.MouseEventHandler<any> = (ev) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    copyBlock(focusIdx);
  };

  const handleDelete = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    removeBlock(focusIdx);
  };

  const handleSelectParent = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setFocusIdx(getParentIdx(focusIdx)!);
  };

  return (
    <div style={{ marginRight: 40 }}>
      <span style={{ position: 'relative', marginRight: 10, color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI' }}>Text</span>
      <ToolItem
        onClick={handleSelectParent}
        title={t('archbase:Select parent block')}
        icon={<ArchbaseEmailIconFont iconName='icon-back-parent' />}
      />
      <ToolItem
        onClick={handleCopy}
        title={t('archbase:Copy')}
        icon={<ArchbaseEmailIconFont iconName='icon-copy' />}
      />
      {
        onAddCollection && (
          <ToolItem
            onClick={handleAddToCollection}
            title={t('archbase:Add to collection')}
            icon={<ArchbaseEmailIconFont iconName='icon-collection' />}
          />
        )
      }
      <ToolItem
        onClick={handleDelete}
        title={t('archbase:Delete')}
        icon={<ArchbaseEmailIconFont iconName='icon-delete' />}
      />
      {modal}
    </div>
  );
}
