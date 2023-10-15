import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IImage } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type ImageProps = RecursivePartial<IImage['data']> &
  RecursivePartial<IImage['attributes']> & {
    children?: MjmlBlockProps<IImage>['children'];
  };

export function Image(props: ImageProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.IMAGE}
    >
      {props.children}
    </MjmlBlock>
  );
}
