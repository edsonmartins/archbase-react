import { ArchbaseObjectToInspect } from '../debug';

export interface ArchbaseDebugOptions {
	debugLayoutHotKey?: string;
	debugObjectInspectorHotKey?: string;
	objectsToInspect?: ArchbaseObjectToInspect[];
}
