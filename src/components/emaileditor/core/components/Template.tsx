import { RecursivePartial } from '@emaileditor/core/typings';
import React from 'react';
import { ITemplate } from '@emaileditor/core/blocks';

export type TemplateProps = RecursivePartial<ITemplate['data']> &
  RecursivePartial<ITemplate['attributes']> & {
    children:
    | string
    | React.ReactNode;
    idx?: string | null;
  };

export function Template(props: TemplateProps) {

  return props.children;
}
