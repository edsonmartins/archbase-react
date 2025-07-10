export { Children } from 'react';
export { isBase64 } from './isBase64';
export { isEmail } from './isEmail';
export { getElementName } from './getElementName';
export { archbaseLogo, archbaseLogo2, archbaseLogo3 } from './archbaseLogo';
export { convertImageToBase64 } from './convertImageToBase64';
export { filter } from './filter';
export { hasComplexChildren } from './hasComplexChildren';
export { hasChildren } from './hasChildren';
export { getPropertyValue } from './propertyUtils';
export { onlyValid } from './onlyValid';
export { childToString, onlyText } from './onlyText';
export { groupByType } from './groupByType';
export { createElementFromHTML, applyFontFamily } from './dom';
export { deepMap } from './deepMap';
export { deepForEach } from './deepForEach';
export { deepFind } from './deepFind';
export { deepFilter } from './deepFilter';
export { isLastElementOfArray } from './array';
export { getNestedObjectValue, setNestedObjectValue, getPathDepthLevel } from './nestedObject';
export type { SetNestedObjectValueOperation } from './nestedObject';

export {
	removeNonWord,
	replaceAccents,
	ltrim,
	rtrim,
	trim,
	lowerCase,
	upperCase,
	camelCase,
	unCamelCase,
	properCase,
	pascalCase,
	sentenceCase,
	slugify,
	hyphenate,
	unhyphenate,
	underscore,
	normalizeLineBreaks,
	contains as stringContains,
	crop,
	escapeRegExp,
	escapeHtml,
	unescapeHtml,
	escapeUnicode,
	stripHtmlTags,
	removeNonASCII,
	isEmpty as stringIsEmpty,
	interpolate,
	rpad,
	lpad,
	repeat,
	truncate,
	abbreviate,
	convertDateToISOString,
	convertISOStringToDate,
	formatStr,
	compressString,
	decompressString,
} from './string-utils';

export { getKeyByEnumValue } from './enum-utils';
export { ArchbaseFilterDSL } from './ArchbaseFilterDSL';
