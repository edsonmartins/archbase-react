import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IText } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type TextProps = RecursivePartial<IText['data']> &
  RecursivePartial<IText['attributes']> & {
    children?: MjmlBlockProps<IText>['children'];
  };

export function Text(props: TextProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.TEXT}
    >
      {props.children}
    </MjmlBlock>
  );
}
