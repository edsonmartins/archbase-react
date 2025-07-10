export interface OptionsResult<T> {
  data: T[];
  total: number;
  page?: number;
  size?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}