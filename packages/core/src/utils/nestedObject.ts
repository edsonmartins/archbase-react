import { deleteProperty, getProperty, setProperty } from 'dot-prop';

const ASSIGN_VALUE = 'ASSIGN_VALUE' as const;
const PUSH_ITEM_TO_ARRAY = 'PUSH_ITEM_TO_ARRAY' as const;
const REMOVE_ITEM_FROM_ARRAY = 'REMOVE_ITEM_FROM_ARRAY' as const;
const REMOVE = 'REMOVE' as const;

const SetNestedObjectValueOperations = [ASSIGN_VALUE, PUSH_ITEM_TO_ARRAY, REMOVE_ITEM_FROM_ARRAY, REMOVE];
type SetNestedObjectValueOperation = (typeof SetNestedObjectValueOperations)[number];

const setNestedObjectValue = (object: any, path: string, value: any, operation?: SetNestedObjectValueOperation) => {
	switch (operation) {
		case PUSH_ITEM_TO_ARRAY:
			addItemToArray(object, path, value);
			return;
		case REMOVE_ITEM_FROM_ARRAY:
			removeItemFromArray(object, path, value);
			return;
		case REMOVE:
			deleteProperty(object, path);
			return;
		default:
			if (path === '') {
				object = value;
				return;
			}
			setProperty(object, path, value);
	}
};

const addItemToArray = (object, path, value) => {
	const length = getProperty(object, path, []).length;
	setProperty(object, `${path}[${length}]`, value);
};

const removeItemFromArray = (object, path, value) => {
	const newArray = getProperty(object, path, []);
	newArray.splice(newArray.indexOf(value), 1);
	setProperty(object, `${path}`, newArray);
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
