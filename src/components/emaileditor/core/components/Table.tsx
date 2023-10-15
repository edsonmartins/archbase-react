import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { ITable } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type TableProps = RecursivePartial<ITable['data']> &
  RecursivePartial<ITable['attributes']> & {
    children?: MjmlBlockProps<ITable>['children'];
  };

export function Table(props: TableProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.TABLE}
    >
      {props.children}
    </MjmlBlock>
  );
}
