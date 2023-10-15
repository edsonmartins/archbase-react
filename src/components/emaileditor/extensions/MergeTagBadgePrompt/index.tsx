import {
  useArchbaseEmailEditorContext,
  useArchbaseEmailEditorProps,
  getShadowRoot,
  getBlockNodeByChildEle,
 ArchbaseEmailIconFont,
  useArchbaseEmailRefState,
  getEditorRoot,
} from '@emaileditor/editor/index';
import { get } from 'lodash';
import { t } from 'i18next'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import stylesText from './MergeTagBadge.scss';
import { classnames } from '@emaileditor/extensions/utils/classnames';
import { useSelectionRange } from '@emaileditor/extensions/AttributePanel/hooks/useSelectionRange';

const removeAllActiveBadge = () => {
  getShadowRoot()
    .querySelectorAll('.archbase-email-merge-tag')
    .forEach((item) => {
      item.classList.remove('archbase-email-merge-tag-focus');
    });

  const popoverNode = getShadowRoot().querySelectorAll(
    '.archbase-email-merge-tag-popover'
  );
  if (popoverNode) {
  }
};

export function MergeTagBadgePrompt() {
  const { initialized } = useArchbaseEmailEditorContext();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const { onChangeMergeTag, mergeTags } = useArchbaseEmailEditorProps();
  const [text, setText] = useState('');
  const { setRangeByElement } = useSelectionRange();

  const root = initialized && getShadowRoot();
  const [target, setTarget] = React.useState<HTMLElement | null>(null);
  const targetRef = useArchbaseEmailRefState(target);

  const textContainer = getBlockNodeByChildEle(target);

  const focusMergeTag = useCallback((ele: HTMLElement) => {
    if (!ele) return;

    setRangeByElement(ele);
  }, [setRangeByElement]);

  useEffect(() => {

    const onBlur = (ev: MouseEvent) => {
      if (ev.target === getEditorRoot()) {
        return;
      }
      setTarget(null);
    };
    window.addEventListener('click', onBlur);
    return () => {
      window.removeEventListener('click', onBlur);
    };
  }, [targetRef, popoverRef]);

  const onClose = useCallback(() => {
    let ele = targetRef.current;

    setTimeout(() => {
      if (!ele) return;
      focusMergeTag(ele);
    }, 100);

    setTarget(null);
  }, [focusMergeTag, targetRef]);

  useEffect(() => {
    if (!root) return;
    const onClick: EventListenerOrEventListenerObject = (e) => {
      removeAllActiveBadge();
      const target = e.target;
      if (
        target instanceof HTMLInputElement &&
        target.classList.contains('archbase-email-merge-tag')
      ) {
        target.classList.add('archbase-email-merge-tag-focus');
        const namePath = target.value;
        if (!onChangeMergeTag) {
          focusMergeTag(target);
          return;
        }
        setText(get(mergeTags, namePath, ''));
        setTarget(target);

      } else {
        if (popoverRef.current?.contains(e.target as any)) return;
        setTarget(null);

      }
    };

    root.addEventListener('click', onClick);
    return () => {
      root.removeEventListener('click', onClick);
    };
  }, [focusMergeTag, mergeTags, onChangeMergeTag, root]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    setText(ev.target.value);
  }, []);

  const onSave = useCallback(() => {
    if (!(target instanceof HTMLInputElement)) return;
    onChangeMergeTag?.(target.value, text);
    onClose();
  }, [onChangeMergeTag, onClose, target, text]);

  const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback((ev) => {
    ev.stopPropagation();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {

      if (e.code?.toLocaleLowerCase() === 'escape') {
        onClose();
      }

    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, onSave]);

  return (
    <>

      {root && createPortal(<style>{stylesText}</style>, root as any)}
      {textContainer && createPortal(
        <div ref={popoverRef} onClick={onClick} className={classnames('archbase-email-merge-tag-popover')}>
          <div className='archbase-email-merge-tag-popover-container'>
            <h3>
              <span>{t('archbase:Default value')}</span>
              <ArchbaseEmailIconFont style={{ color: 'rgb(92, 95, 98)' }} iconName='icon-close' onClick={onClose} />
            </h3>
            <div className={'archbase-email-merge-tag-popover-desc'}>
              <p>
                {t('archbase:If a personalized text value isn\"t available, then a default value is shown.')}
              </p>
              <div className='archbase-email-merge-tag-popover-desc-label'>
                <input autoFocus value={text} onChange={onChange} type="text" autoComplete='off' maxLength={40} />
                <div className='archbase-email-merge-tag-popover-desc-label-count'>
                  {text.length}/40
                </div>
              </div>
              <div className='archbase-email-merge-tag-popover-desc-label-button'>
                <button onClick={onSave}>{t('archbase:Save')}</button>
              </div>
            </div>
          </div>

        </div>, textContainer)}
    </>
  );
}
