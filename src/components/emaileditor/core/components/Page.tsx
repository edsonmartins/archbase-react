import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IPage } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type PageProps = RecursivePartial<IPage['data']> &
  RecursivePartial<IPage['attributes']> & {
    children?: MjmlBlockProps<IPage>['children'];
  };

export function Page(props: PageProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.PAGE}
    >
      {props.children}
    </MjmlBlock>
  );
}
