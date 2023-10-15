import React, { useCallback } from 'react';
import { t } from 'i18next'
import { ToolItem } from '../ToolItem';
import { Link, LinkParams } from '../Link';
import {
  FIXED_CONTAINER_ID,
  getShadowRoot,
  ArchbaseEmailIconFont,
  useArchbaseEmailEditorProps,
  useArchbaseEmailFocusBlockLayout,
  MergeTagBadge,
} from '@emaileditor/editor/index';
import { FontFamily } from '../FontFamily';
import { MergeTags } from '../MergeTags';
import { useSelectionRange } from '@emaileditor/extensions/AttributePanel/hooks/useSelectionRange';
import { IconBgColor } from './IconBgColor';
import {ArchbaseEmailIconFontColor } from './IconFontColor';
import { BasicTools } from '../BasicTools';
import { Unlink } from '../Unlink';
import { StrikeThrough } from '../StrikeThrough';
import { Underline } from '../Underline';
import { Italic } from '../Italic';
import { Bold } from '../Bold';
import { FontSize } from '../FontSize';
import { RICH_TEXT_TOOL_BAR } from '@emaileditor/extensions/constants';

export interface ToolsProps {
  onChange: (content: string) => any;
}

export function Tools(props: ToolsProps) {
  const { mergeTags, enabledMergeTagsBadge } = useArchbaseEmailEditorProps();
  const { focusBlockNode } = useArchbaseEmailFocusBlockLayout();
  const { selectionRange, restoreRange, setRangeByElement } = useSelectionRange();

  const execCommand = useCallback(
    (cmd: string, val?: any) => {
      if (!selectionRange) {
        console.error(t('archbase:No selectionRange'));
        return;
      }
      if (!focusBlockNode?.contains(selectionRange?.commonAncestorContainer)) {
        console.error(t('archbase:Not commonAncestorContainer'));
        return;
      }

      restoreRange(selectionRange);
      const uuid = (+new Date()).toString();
      if (cmd === 'createLink') {
        const linkData = val as LinkParams;
        const target = linkData.blank ? '_blank' : '';
        let link: HTMLAnchorElement;
        if (linkData.linkNode) {
          link = linkData.linkNode;
        } else {
          document.execCommand(cmd, false, uuid);

          link = getShadowRoot().querySelector(`a[href="${uuid}"`)!;
        }

        if (target) {
          link.setAttribute('target', target);
        }
        link.style.color = 'inherit';
        link.style.textDecoration = linkData.underline ? 'underline' : 'none';
        link.setAttribute('href', linkData.link.trim());
      } else if (cmd === 'insertHTML') {
        let newContent = val;
        if (enabledMergeTagsBadge) {
          newContent = MergeTagBadge.transform(val, uuid);
        }

        document.execCommand(cmd, false, newContent);
        const insertMergeTagEle = getShadowRoot().getElementById(uuid);
        if (insertMergeTagEle) {
          insertMergeTagEle.focus();
          setRangeByElement(insertMergeTagEle);
        }
      } else {
        document.execCommand(cmd, false, val);
      }

      const contenteditableElement = getShadowRoot().activeElement;
      if (contenteditableElement?.getAttribute('contenteditable') === 'true') {
        const html = getShadowRoot().activeElement?.innerHTML || '';
        props.onChange(html);
      }
    },
    [
      enabledMergeTagsBadge,
      focusBlockNode,
      props,
      restoreRange,
      selectionRange,
      setRangeByElement,
    ],
  );

  const execCommandWithRange = useCallback(
    (cmd: string, val?: any) => {
      document.execCommand(cmd, false, val);
      const contenteditableElement = getShadowRoot().activeElement;
      if (contenteditableElement?.getAttribute('contenteditable') === 'true') {
        const html = getShadowRoot().activeElement?.innerHTML || '';
        props.onChange(html);
      }
    },
    [props.onChange],
  );

  const getPopoverMountNode = () => document.getElementById(FIXED_CONTAINER_ID)!;

  return (
    <div
      id={RICH_TEXT_TOOL_BAR}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <BasicTools />

        {mergeTags && (
          <MergeTags
            execCommand={execCommand}
            getPopupContainer={getPopoverMountNode}
          />
        )}
        <div className='archbase-email-extensions-divider' />
        <div className='archbase-email-extensions-divider' />
        <FontFamily
          execCommand={execCommand}
          getPopupContainer={getPopoverMountNode}
        />
        <div className='archbase-email-extensions-divider' />
        <FontSize
          execCommand={execCommand}
          getPopupContainer={getPopoverMountNode}
        />
        <div className='archbase-email-extensions-divider' />
        <Bold
          currentRange={selectionRange}
          onChange={() => execCommandWithRange('bold')}
        />
        <div className='archbase-email-extensions-divider' />
        <Italic
          currentRange={selectionRange}
          onChange={() => execCommandWithRange('italic')}
        />
        <div className='archbase-email-extensions-divider' />
        <StrikeThrough
          currentRange={selectionRange}
          onChange={() => execCommandWithRange('strikeThrough')}
        />
        <div className='archbase-email-extensions-divider' />
        <Underline
          currentRange={selectionRange}
          onChange={() => execCommandWithRange('underline')}
        />
        <div className='archbase-email-extensions-divider' />
        <ArchbaseEmailIconFontColor
          selectionRange={selectionRange}
          execCommand={execCommand}
          getPopoverMountNode={getPopoverMountNode}
        />
        <div className='archbase-email-extensions-divider' />
        <IconBgColor
          selectionRange={selectionRange}
          execCommand={execCommand}
          getPopoverMountNode={getPopoverMountNode}
        />

        <div className='archbase-email-extensions-divider' />
        <Link
          currentRange={selectionRange}
          onChange={values => execCommand('createLink', values)}
          getPopupContainer={getPopoverMountNode}
        />
        <div className='archbase-email-extensions-divider' />
        <Unlink
          currentRange={selectionRange}
          onChange={() => execCommand('')}
        />
        <div className='archbase-email-extensions-divider' />

        <ToolItem
          onClick={() => execCommand('justifyLeft')}
          icon={<ArchbaseEmailIconFont iconName='icon-align-left' />}
          title={t('archbase:Align left')}
        />
        <ToolItem
          onClick={() => execCommand('justifyCenter')}
          icon={<ArchbaseEmailIconFont iconName='icon-align-center' />}
          title={t('archbase:Align center')}
        />
        <ToolItem
          onClick={() => execCommand('justifyRight')}
          icon={<ArchbaseEmailIconFont iconName='icon-align-right' />}
          title={t('archbase:Align right')}
        />
        <div className='archbase-email-extensions-divider' />
        <ToolItem
          onClick={() => execCommand('insertOrderedList')}
          icon={<ArchbaseEmailIconFont iconName='icon-list-ol' />}
          title={t('archbase:Orderlist')}
        />
        <ToolItem
          onClick={() => execCommand('insertUnorderedList')}
          icon={<ArchbaseEmailIconFont iconName='icon-list-ul' />}
          title={t('archbase:Unorderlist')}
        />
        <div className='archbase-email-extensions-divider' />

        <ToolItem
          onClick={() => execCommand('insertHorizontalRule')}
          icon={<ArchbaseEmailIconFont iconName='icon-line' />}
          title={t('archbase:Line')}
        />
        <div className='archbase-email-extensions-divider' />
        <ToolItem
          onClick={() => execCommand('removeFormat')}
          icon={<ArchbaseEmailIconFont iconName='icon-close' />}
          title={t('archbase:Remove format')}
        />
        <div className='archbase-email-extensions-divider' />
      </div>
    </div>
  );
}
