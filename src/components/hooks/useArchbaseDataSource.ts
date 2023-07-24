import type { ArchbaseDataSource } from '../datasource/ArchbaseDataSource'

export type UseArchbaseDataSourceProps<_T, _ID> = {
  initialData: any[]
}

export type UseArchbaseDataSourceReturnType<T, ID> = {
  dataSource?: ArchbaseDataSource<T, ID>
}

export const useArchbaseDataSource = <T, ID>(
  _props: UseArchbaseDataSourceProps<T, ID>
): UseArchbaseDataSourceReturnType<T, ID> => {
  return {}
}
