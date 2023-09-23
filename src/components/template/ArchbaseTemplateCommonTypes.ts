import { ArchbaseObjectToInspect } from '@components/views';

export interface ArchbaseDebugOptions {
  debugLayoutHotKey?: string;
  debugObjectInspectorHotKey?: string;
  objectsToInspect?: ArchbaseObjectToInspect[];
}
