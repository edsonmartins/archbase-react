import React from 'react'
import type { ArchbaseDataSource } from '../datasource'

export type ArchbaseTableTemplateProps<T, ID> = {
  title: string
  dataSource: ArchbaseDataSource<T, ID>
}
export function ArchbaseTableTemplate<T, ID>(props: ArchbaseTableTemplateProps<T, ID>) {
  return <div>TABLE TEMPLATE{props.title}</div>
}
