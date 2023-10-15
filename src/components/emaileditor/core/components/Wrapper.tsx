import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IWrapper } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type WrapperProps = RecursivePartial<IWrapper['data']> &
  RecursivePartial<IWrapper['attributes']> & {
    children?: MjmlBlockProps<IWrapper>['children'];
  };

export function Wrapper(props: WrapperProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.WRAPPER}
    >
      {props.children}
    </MjmlBlock>
  );
}
