import { ArchbaseObjectToInspect } from '@components/debug';

export interface ArchbaseDebugOptions {
  debugLayoutHotKey?: string;
  debugObjectInspectorHotKey?: string;
  objectsToInspect?: ArchbaseObjectToInspect[];
}
