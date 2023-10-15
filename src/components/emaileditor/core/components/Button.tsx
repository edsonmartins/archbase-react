import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IButton } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type ButtonProps = RecursivePartial<IButton['data']> &
  RecursivePartial<IButton['attributes']> & {
    children?: MjmlBlockProps<IButton>['children'];
  };

export function Button(props: ButtonProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.BUTTON}
    >
      {props.children}
    </MjmlBlock>
  );
}
