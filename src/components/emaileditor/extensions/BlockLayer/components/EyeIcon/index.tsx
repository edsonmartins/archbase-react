import {ArchbaseEmailIconFont } from '@emaileditor/editor/index';
import { BasicType } from '@emaileditor/core/index';
import React from 'react';
import { IBlockDataWithId } from '../..';

export function EyeIcon({
  blockData,
  hidden,
  onToggleVisible,
}: {
  blockData: IBlockDataWithId;
  hidden?: boolean;
  onToggleVisible: (blockData: IBlockDataWithId, ev: React.MouseEvent) => void;
}) {
  if (hidden)
    return (
      <div style={{ visibility: 'hidden' }}>
        <ArchbaseEmailIconFont iconName='icon-eye' />
      </div>
    );
  if (blockData.type === BasicType.PAGE) return null;

  return blockData.data.hidden ? (
    <ArchbaseEmailIconFont
      onClick={(ev) => onToggleVisible(blockData, ev)}
      iconName='icon-eye-invisible'
    />
  ) : (
    <ArchbaseEmailIconFont
      onClick={(ev) => onToggleVisible(blockData, ev)}
      iconName='icon-eye'
    />
  );
}
