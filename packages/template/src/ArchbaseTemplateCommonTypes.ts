import { ArchbaseObjectToInspect } from '@archbase/components';

export interface ArchbaseDebugOptions {
	debugLayoutHotKey?: string;
	debugObjectInspectorHotKey?: string;
	objectsToInspect?: ArchbaseObjectToInspect[];
}
