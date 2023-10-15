import React, { useCallback, useEffect, useRef } from 'react';
import { BlockType, getChildIdx } from '@emaileditor/core/index';
import { useArchbaseEmailHoverIdx } from '@emaileditor/editor/hooks/useArchbaseEmailHoverIdx';
import { useArchbaseEmailDataTransfer } from '@emaileditor/editor/hooks/useArchbaseEmailDataTransfer';
import { isUndefined } from 'lodash';
import { useArchbaseEmailBlock } from '@emaileditor/editor/hooks/useArchbaseEmailBlock';

export type BlockAvatarWrapperProps = {
  children?: React.ReactNode;
  type: BlockType | string;
  payload?: any;
  action?: 'add' | 'move';
  hideIcon?: boolean;
  idx?: string;
};

export const BlockAvatarWrapper: React.FC<BlockAvatarWrapperProps> = props => {
  const { type, children, payload, action = 'add', idx } = props;
  const { addBlock, moveBlock, values } = useArchbaseEmailBlock();
  const { setIsDragging, setHoverIdx } = useArchbaseEmailHoverIdx();
  const { setDataTransfer, dataTransfer } = useArchbaseEmailDataTransfer();
  const ref = useRef<HTMLDivElement>(null);

  const onDragStart = useCallback(
    (ev: React.DragEvent) => {
      if (action === 'add') {
        setDataTransfer({
          type: type,
          action,
          payload,
        });
      } else {
        setDataTransfer({
          type: type,
          action,
          sourceIdx: idx,
        });
      }

      setIsDragging(true);
    },
    [action, idx, payload, setDataTransfer, setIsDragging, type],
  );

  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setHoverIdx('');
    if (!dataTransfer) return;
    if (action === 'add' && !isUndefined(dataTransfer.parentIdx)) {
      addBlock({
        type,
        parentIdx: dataTransfer.parentIdx,
        positionIndex: dataTransfer.positionIndex,
        payload,
      });
    } else {
      if (
        idx &&
        !isUndefined(dataTransfer.sourceIdx) &&
        !isUndefined(dataTransfer.parentIdx) &&
        !isUndefined(dataTransfer.positionIndex)
      ) {
        moveBlock(
          dataTransfer.sourceIdx,
          getChildIdx(dataTransfer.parentIdx, dataTransfer.positionIndex),
        );
      }
    }
  }, [
    action,
    addBlock,
    idx,
    moveBlock,
    dataTransfer,
    payload,
    setHoverIdx,
    setIsDragging,
    type,
  ]);

  useEffect(() => {
    const ele = ref.current;
    if (!ele) return;

    ele.addEventListener('dragend', onDragEnd);
    return () => {
      ele.removeEventListener('dragend', onDragEnd);
    };
  }, [onDragEnd]);

  return (
    <div
      style={{ cursor: 'grab' }}
      ref={ref}
      onMouseDown={() => {
        window.getSelection()?.removeAllRanges();
      }}
      data-type={type}
      onDragStart={onDragStart}
      draggable
    >
      {children}
    </div>
  );
};
