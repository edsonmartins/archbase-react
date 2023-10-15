import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IGroup } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type GroupProps = RecursivePartial<IGroup['data']> &
  RecursivePartial<IGroup['attributes']> & {
    children?: MjmlBlockProps<IGroup>['children'];
  };

export function Group(props: GroupProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.GROUP}
    >
      {props.children}
    </MjmlBlock>
  );
}
