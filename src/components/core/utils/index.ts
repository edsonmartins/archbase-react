import { Children } from 'react'

import deepFilter from './deepFilter.js'
import deepFind from './deepFind.js'
import deepForEach from './deepForEach.js'
import deepMap from './deepMap.js'
import filter from './filter.js'
import getElementName from './getElementName.js'
import groupByType from './groupByType.js'
import hasChildren from './hasChildren.js'
import hasComplexChildren from './hasComplexChildren.js'
import onlyText from './onlyText.js'
import onlyValid from './onlyValid.js'

import {removeNonWord,
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
  truncate} from './string-utils.js'

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
}

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
  onlyValid
}
