import { deleteProperty, getProperty } from 'dot-prop';
import setValue from 'set-value';

const ASSIGN_VALUE = 'ASSIGN_VALUE' as const;
const PUSH_ITEM_TO_ARRAY = 'PUSH_ITEM_TO_ARRAY' as const;
const REMOVE = 'REMOVE' as const;

const SetNestedObjectValueOperations = [ASSIGN_VALUE, PUSH_ITEM_TO_ARRAY, REMOVE];
type SetNestedObjectValueOperation = (typeof SetNestedObjectValueOperations)[number];

const setNestedObjectValue = (object: any, path: string, value: any, operation?: SetNestedObjectValueOperation) => {
	switch (operation) {
		case PUSH_ITEM_TO_ARRAY:
			setValue(object, path, value, {
				merge: (object, value) => {
					return object.push(value);
				},
			});
			return;
		case REMOVE:
			deleteProperty(object, path);
			return;
		default:
			if (path === '') {
				object = value;
				return;
			}
			setValue(object, path, value);
	}
};

const getNestedObjectValue = (object: any, path: string) => {
	if (path === '') {
		return object;
	}
	return getProperty(object, path, undefined);
};

const getPathDepthLevel = (path: string) => {
	return path.match(/[.([)]/g) ? path.match(/[.([)]/g).length : 0;
};
export { setNestedObjectValue, getNestedObjectValue, getPathDepthLevel };
export type { SetNestedObjectValueOperation };
