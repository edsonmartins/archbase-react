import { PopoverProps, Tooltip } from '@arco-design/web-react';
import React, { useCallback, useMemo } from 'react';
import { t } from 'i18next'
import {ArchbaseEmailIconFont } from '@emaileditor/editor/index';
import { ToolItem } from '../ToolItem';
import { EMAIL_BLOCK_CLASS_NAME } from '@emaileditor/core/index';
import { useSelectionRange } from '@emaileditor/extensions/AttributePanel/hooks/useSelectionRange';

export interface LinkProps extends PopoverProps {
  currentRange: Range | null | undefined;
  onChange: () => void;
}

function getStrikeThroughNode(
  node: Node | null | undefined,
): Element | null {
  if (!node) return null;
  if (node instanceof Element && node.classList.contains(EMAIL_BLOCK_CLASS_NAME)) return null;
  if (node instanceof Element && node.tagName.toLocaleLowerCase() === 'strike') return node;
  return getStrikeThroughNode(node.parentNode);
}

export function StrikeThrough(props: LinkProps) {
  const { onChange } = props;
  const { setRangeByElement } = useSelectionRange();
  const node = useMemo(() => {
    return getStrikeThroughNode(props.currentRange?.commonAncestorContainer);

  }, [props.currentRange]);

  const onClick = useCallback(() => {
    if (node) {
      setRangeByElement(node);
    }
    onChange();
  }, [node, onChange, setRangeByElement]);

  return (
    <Tooltip
      color='#fff'
      position='tl'
      content={t('archbase:Strikethrough')}
    >
      <ToolItem title={t('archbase:Strikethrough')} isActive={Boolean(node)} icon={<ArchbaseEmailIconFont iconName='icon-strikethrough' />} onClick={onClick} />
    </Tooltip>
  );
}
