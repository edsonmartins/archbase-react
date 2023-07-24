import type { MandalaDataSource } from '../datasource/MandalaDataSource'

export type UseMandalaDataSourceProps<T, ID> = {
  initialData: any[]
}

export type UseMandalaDataSourceReturnType<T, ID> = {
  dataSource?: MandalaDataSource<T, ID>
}

export const useMandalaDataSource = <T, ID>(
  props: UseMandalaDataSourceProps<T, ID>
): UseMandalaDataSourceReturnType<T, ID> => {
  return {}
}
