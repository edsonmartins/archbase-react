import React, { useRef } from 'react';
import {ArchbaseEmailIconFont, TextStyle, scrollBlockEleIntoView, useArchbaseEmailBlock, useArchbaseEmailEditorProps } from '@emaileditor/editor/index';
import { getIndexByIdx, getSiblingIdx } from '@emaileditor/core/index';
import styles from './index.module.scss';
import { IBlockDataWithId } from '../../../BlockLayer';
import { useAddToCollection } from '@emaileditor/extensions/hooks/useAddToCollection';
import { t } from 'i18next';

export function ContextMenu({
  moveBlock,
  copyBlock,
  removeBlock,
  contextMenuData,
  onClose,
}: {
  onClose: (ev?: React.MouseEvent) => void;
  moveBlock: ReturnType<typeof useArchbaseEmailBlock>['moveBlock'];
  copyBlock: ReturnType<typeof useArchbaseEmailBlock>['copyBlock'];
  removeBlock: ReturnType<typeof useArchbaseEmailBlock>['removeBlock'];
  contextMenuData: {
    blockData: IBlockDataWithId;
    left: number;
    top: number;
  };
}) {
  const { blockData, left, top } = contextMenuData;
  const idx = blockData.id;
  const { modal, modalVisible, setModalVisible } = useAddToCollection();
  const props = useArchbaseEmailEditorProps();
  const ref = useRef<HTMLDivElement>(null);

  const handleMoveUp = () => {
    moveBlock(idx, getSiblingIdx(idx, -1));
    scrollBlockEleIntoView({
      idx: getSiblingIdx(idx, -1),
    });
    onClose();
  };

  const handleMoveDown = () => {
    moveBlock(idx, getSiblingIdx(idx, 1));
    scrollBlockEleIntoView({
      idx: getSiblingIdx(idx, 1),
    });
    onClose();
  };

  const handleCopy: React.MouseEventHandler<HTMLDivElement> = (ev) => {
    copyBlock(idx);
    scrollBlockEleIntoView({
      idx: getSiblingIdx(idx, 1),
    });
    onClose();
  };

  const handleAddToCollection = () => {
    setModalVisible(true);
  };

  const handleDelete = () => {
    removeBlock(idx);
    onClose();
  };

  const isFirst = getIndexByIdx(idx) === 0;

  return (
    <div ref={ref} style={{ visibility: modalVisible ? 'hidden' : undefined }}>
      <div
        style={{
          left: left,
          top: top,
        }}
        className={styles.wrap}
        onClick={(e) => e.stopPropagation()}
      >
        {!isFirst && (
          <div className={styles.listItem} onClick={handleMoveUp}>
            <ArchbaseEmailIconFont iconName='icon-top' style={{ marginRight: 10 }} />{' '}
            <TextStyle>{t('archbase:Move up')}</TextStyle>
          </div>
        )}
        <div className={styles.listItem} onClick={handleMoveDown}>
          <ArchbaseEmailIconFont iconName='icon-bottom' style={{ marginRight: 10 }} />{' '}
          <TextStyle>{t('archbase:Move down')}</TextStyle>
        </div>
        <div className={styles.listItem} onClick={handleCopy}>
          <ArchbaseEmailIconFont iconName='icon-copy' style={{ marginRight: 10 }} />{' '}
          <TextStyle>{t('archbase:Copy')}</TextStyle>
        </div>
        {props.onAddCollection && (
            <div className={styles.listItem} onClick={handleAddToCollection}>
              <ArchbaseEmailIconFont iconName='icon-start' style={{ marginRight: 10 }} />{' '}
              <TextStyle>Add to collection</TextStyle>
            </div>
        )}
        <div className={styles.listItem} onClick={handleDelete}>
          <ArchbaseEmailIconFont iconName='icon-delete' style={{ marginRight: 10 }} />{' '}
          <TextStyle>{t('archbase:Delete')}</TextStyle>
        </div>
      </div>
      <div
        className={styles.contextmenuMark}
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose(e);
        }}
      />
      {modal}
    </div>
  );
}
