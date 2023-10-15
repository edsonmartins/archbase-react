import { classnames } from '@emaileditor/editor/utils/classnames';
import React from 'react';
import './index.scss';

export interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  title?: string;
  noBorder?: boolean;
  onClick?: React.DOMAttributes<HTMLButtonElement>['onClick'];
}
export const Button: React.FC<ButtonProps> = props => {
  return (
    <button
      onClick={props.onClick}
      className={classnames(
        'archbase-email-editor-button',
        props.noBorder && 'archbase-email-editor-noBorder',
      )}
      title={props.title}
      disabled={props.disabled}
      type='button'
    >
      <>{props.children}</>
    </button>
  );
};
