import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IColumn } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type ColumnProps = RecursivePartial<IColumn['data']> &
  RecursivePartial<IColumn['attributes']> & {
    children?: MjmlBlockProps<IColumn>['children'];
  };

export function Column(props: ColumnProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.COLUMN}
    >
      {props.children}
    </MjmlBlock>
  );
}
