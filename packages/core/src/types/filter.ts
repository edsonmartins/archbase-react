/**
 * Filter and Query types for Archbase Core
 */

// Basic filter types
export interface IQueryFilterEntity {
  id?: any;
  companyId?: any;
  filter?: string;
  name?: string;
  description?: string;
  userOwner?: string;
  shared?: boolean;
  readOnly?: boolean;
  componentId?: string;
}

export class QueryFilterEntity implements IQueryFilterEntity {
  id?: any;
  companyId?: any;
  filter?: string;
  name?: string;
  description?: string;
  userOwner?: string;
  shared?: boolean;
  readOnly?: boolean;
  componentId?: string;

  constructor(data?: Partial<IQueryFilterEntity>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}

// Filter delegator types
export type DelegatorCallback = (error: string | null, result?: any) => void;

export interface ArchbaseQueryFilterDelegator {
  onSaveFilter?: DelegatorCallback;
  onRemoveFilter?: DelegatorCallback;
  onSelectFilter?: DelegatorCallback;
  onClearFilter?: DelegatorCallback;
  addNewFilter?(filter: IQueryFilterEntity, onResult: DelegatorCallback): void;
  saveFilter?(filter: IQueryFilterEntity, onResult: DelegatorCallback): void;
  removeFilterBy?(filter: IQueryFilterEntity, onResult: DelegatorCallback): void;
  getFilterById?(id: any): IQueryFilterEntity | undefined;
  getFirstFilter?(): IQueryFilterEntity | undefined;
  getFilters?(): IQueryFilterEntity[];
}

// Query filter types
export interface ArchbaseQueryFilter {
  filter?: any;
  sort?: any;
  searchText?: string;
  activeFilterIndex?: number;
  quickFilterText?: string;
  activeFilter?: IQueryFilterEntity;
}

// Filter constants
export const FILTER_TYPE = {
  QUICK: 'QUICK',
  NORMAL: 'NORMAL', 
  ADVANCED: 'ADVANCED'
} as const;

export type FilterType = typeof FILTER_TYPE[keyof typeof FILTER_TYPE];

// Export constants for backward compatibility
export const QUICK = FILTER_TYPE.QUICK;
export const NORMAL = FILTER_TYPE.NORMAL;
export const ADVANCED = FILTER_TYPE.ADVANCED;