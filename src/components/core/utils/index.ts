import { Children } from 'react';

import deepFilter from './deepFilter';
import deepFind from './deepFind';
import deepForEach from './deepForEach';
import deepMap from './deepMap';
import filter from './filter';
import getElementName from './getElementName';
import groupByType from './groupByType';
import hasChildren from './hasChildren';
import hasComplexChildren from './hasComplexChildren';
import onlyText from './onlyText';
import onlyValid from './onlyValid';
import isBase64 from './isBase64';
import { archbaseLogo, archbaseLogo2, archbaseLogo3 } from './archbaseLogo';
import {convertImageToBase64} from './convertImageToBase64';

import {
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
  contains,
  crop,
  escapeRegExp,
  escapeHtml,
  unescapeHtml,
  escapeUnicode,
  stripHtmlTags,
  removeNonASCII,
  isEmpty,
  interpolate,
  rpad,
  lpad,
  repeat,
  truncate,
  convertDateToISOString,
  convertISOStringToDate,
  formatStr
} from './string-utils';

export {
  deepFilter,
  deepFind,
  deepForEach,
  deepMap,
  filter,
  getElementName,
  groupByType,
  hasChildren,
  hasComplexChildren,
  onlyText,
  onlyValid,
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
  contains,
  crop,
  escapeRegExp,
  escapeHtml,
  unescapeHtml,
  escapeUnicode,
  stripHtmlTags,
  removeNonASCII,
  isEmpty,
  interpolate,
  rpad,
  lpad,
  repeat,
  truncate,
  isBase64,
  archbaseLogo,
  archbaseLogo2,
  archbaseLogo3,
  convertDateToISOString,
  convertISOStringToDate,
  formatStr,
  convertImageToBase64
};

export default {
  ...Children,
  deepFilter,
  deepFind,
  deepForEach,
  deepMap,
  filter,
  getElementName,
  groupByType,
  hasChildren,
  hasComplexChildren,
  onlyText,
  onlyValid,
};
