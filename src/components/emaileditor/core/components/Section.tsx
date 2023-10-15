import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { ISection } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type SectionProps = RecursivePartial<ISection['data']> &
  RecursivePartial<ISection['attributes']> & {
    children?: MjmlBlockProps<ISection>['children'];
  };

export function Section(props: SectionProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.SECTION}
    >
      {props.children}
    </MjmlBlock>
  );
}
