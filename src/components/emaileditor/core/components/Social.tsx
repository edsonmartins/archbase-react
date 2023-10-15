import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { ISocial } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type SocialProps = RecursivePartial<ISocial['data']> &
  RecursivePartial<ISocial['attributes']> & {
    children?: MjmlBlockProps<ISocial>['children'];
  };

export function Social(props: SocialProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.SOCIAL}
    >
      {props.children}
    </MjmlBlock>
  );
}
