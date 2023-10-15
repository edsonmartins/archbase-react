import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { ISpacer } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type SpacerProps = RecursivePartial<ISpacer['data']> &
  RecursivePartial<ISpacer['attributes']> & {
    children?: MjmlBlockProps<ISpacer>['children'];
  };

export function Spacer(props: SpacerProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.SPACER}
    >
      {props.children}
    </MjmlBlock>
  );
}
