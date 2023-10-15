import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IDivider } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type DividerProps = RecursivePartial<IDivider['data']> &
  RecursivePartial<IDivider['attributes']> & {
    children?: MjmlBlockProps<IDivider>['children'];
  };

export function Divider(props: DividerProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.DIVIDER}
    >
      {props.children}
    </MjmlBlock>
  );
}
