import { omit } from 'lodash';
import { BasicType } from '@emaileditor/core/constants';
import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { IAccordionElement } from '@emaileditor/core/blocks';
import MjmlBlock, { MjmlBlockProps } from '@emaileditor/core/components/MjmlBlock';

export type AccordionElementProps = RecursivePartial<IAccordionElement['data']> &
  RecursivePartial<IAccordionElement['attributes']> & {
    children?: MjmlBlockProps<IAccordionElement>['children'];
  };

export function AccordionElement(props: AccordionElementProps) {
  return (
    <MjmlBlock
      attributes={omit(props, ['data', 'children', 'value'])}
      value={props.value}
      type={BasicType.ACCORDION_ELEMENT}
    >
      {props.children}
    </MjmlBlock>
  );
}
