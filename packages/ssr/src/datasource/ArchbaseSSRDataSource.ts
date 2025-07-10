import { ArchbaseDataSource } from '@archbase/data';
import { serializeForSSR, deserializeFromSSR, isServer } from '../utils/ArchbaseSSRUtils';

/**
 * Interface for serializable DataSource state
 */
interface SerializableDataSourceState<T, ID> {
  records: T[];
  currentRecord: T | null;
  recordIndex: number;
  state: string;
  hasChanges: boolean;
  filter?: any;
  sort?: any;
  metadata?: Record<string, any>;
}

/**
 * Extended DataSource with SSR capabilities
 */
export class ArchbaseSSRDataSource<T extends Record<string, any>, ID> extends ArchbaseDataSource<T, ID> {
  private _ssrData?: SerializableDataSourceState<T, ID>;
  private _isHydrating = false;

  constructor(name: string, options: any = {}) {
    super(name, options);
  }

  /**
   * Serialize DataSource state for SSR
   */
  serializeState(): string {
    const state: SerializableDataSourceState<T, ID> = {
      records: this.getRecords(),
      currentRecord: this.getCurrentRecord(),
      recordIndex: this.getRecNo(),
      state: this.getState(),
      hasChanges: this.hasChanges(),
      filter: this.getCurrentFilter(),
      sort: this.getCurrentSort(),
      metadata: this.getMetadata()
    };

    return serializeForSSR(state);
  }

  /**
   * Restore DataSource state from serialized data
   */
  deserializeState(serializedState: string): void {
    const state = deserializeFromSSR<SerializableDataSourceState<T, ID>>(serializedState);
    
    if (!state) {
      console.warn('Failed to deserialize DataSource state');
      return;
    }

    this._isHydrating = true;
    this._ssrData = state;

    try {
      // Restore records
      if (state.records.length > 0) {
        this.setRecords(state.records);
      }

      // Restore current record position
      if (state.recordIndex >= 0) {
        this.gotoRecNo(state.recordIndex);
      }

      // Restore filter and sort
      if (state.filter) {
        this.applyFilter(state.filter);
      }

      if (state.sort) {
        this.applySort(state.sort);
      }

      // Restore metadata
      if (state.metadata) {
        Object.entries(state.metadata).forEach(([key, value]) => {
          this.setMetadata(key, value);
        });
      }

    } finally {
      this._isHydrating = false;
      this._ssrData = undefined;
    }
  }

  /**
   * Check if DataSource is currently hydrating from SSR
   */
  isHydrating(): boolean {
    return this._isHydrating;
  }

  /**
   * Get SSR data if available
   */
  getSSRData(): SerializableDataSourceState<T, ID> | undefined {
    return this._ssrData;
  }

  /**
   * Create a minimal state object for SSR
   * Only includes essential data to reduce payload size
   */
  serializeMinimalState(): string {
    const minimalState = {
      records: this.getRecords().slice(0, 50), // Limit records for performance
      currentRecord: this.getCurrentRecord(),
      recordIndex: this.getRecNo(),
      state: this.getState(),
      hasChanges: this.hasChanges()
    };

    return serializeForSSR(minimalState);
  }

  /**
   * Create a DataSource instance from server data
   */
  static fromServerData<T extends Record<string, any>, ID>(
    name: string,
    serverData: any,
    options: any = {}
  ): ArchbaseSSRDataSource<T, ID> {
    const dataSource = new ArchbaseSSRDataSource<T, ID>(name, options);
    
    if (serverData) {
      // If data is already serialized
      if (typeof serverData === 'string') {
        dataSource.deserializeState(serverData);
      } 
      // If data is a plain object
      else if (Array.isArray(serverData.records)) {
        dataSource.setRecords(serverData.records);
        if (serverData.currentIndex >= 0) {
          dataSource.gotoRecNo(serverData.currentIndex);
        }
      }
    }

    return dataSource;
  }

  /**
   * Enhanced method to handle SSR-safe operations
   */
  ssrSafeOperation<R>(operation: () => R, fallback: R): R {
    if (isServer) {
      try {
        return operation();
      } catch (error) {
        console.warn('SSR operation failed, using fallback:', error);
        return fallback;
      }
    }
    return operation();
  }

  /**
   * Override to handle SSR-safe filtering
   */
  applyFilter(filter: any): void {
    this.ssrSafeOperation(
      () => super.applyFilter(filter),
      undefined
    );
  }

  /**
   * Override to handle SSR-safe sorting
   */
  applySort(sort: any): void {
    this.ssrSafeOperation(
      () => super.applySort(sort),
      undefined
    );
  }

  /**
   * Get records with SSR safety
   */
  getRecords(): T[] {
    return this.ssrSafeOperation(
      () => super.getRecords(),
      []
    );
  }

  /**
   * Get current record with SSR safety
   */
  getCurrentRecord(): T | null {
    return this.ssrSafeOperation(
      () => super.getCurrentRecord(),
      null
    );
  }

  /**
   * Check if we have data available for rendering
   */
  hasData(): boolean {
    return this.getRecords().length > 0;
  }

  /**
   * Create a snapshot that can be safely transmitted between server/client
   */
  createSnapshot(): {
    records: T[];
    currentIndex: number;
    metadata: Record<string, any>;
    timestamp: number;
  } {
    return {
      records: this.getRecords(),
      currentIndex: this.getRecNo(),
      metadata: this.getAllMetadata(),
      timestamp: Date.now()
    };
  }

  /**
   * Restore from a snapshot
   */
  restoreFromSnapshot(snapshot: {
    records: T[];
    currentIndex: number;
    metadata: Record<string, any>;
    timestamp: number;
  }): void {
    this._isHydrating = true;

    try {
      this.setRecords(snapshot.records);
      if (snapshot.currentIndex >= 0) {
        this.gotoRecNo(snapshot.currentIndex);
      }
      
      Object.entries(snapshot.metadata).forEach(([key, value]) => {
        this.setMetadata(key, value);
      });
    } finally {
      this._isHydrating = false;
    }
  }

  /**
   * Helper method to get all metadata
   */
  private getAllMetadata(): Record<string, any> {
    // This would need to be implemented in the base DataSource class
    // For now, return empty object
    return {};
  }
}