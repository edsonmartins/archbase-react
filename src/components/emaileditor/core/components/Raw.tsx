import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IRaw } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type RawProps = RecursivePartial<IRaw['data']> &
  RecursivePartial<IRaw['attributes']> & {
    children?: MjmlBlockProps<IRaw>['children'];
  };

export function Raw(props: RawProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.RAW}
    >
      {props.children}
    </MjmlBlock>
  );
}
