import { Children } from 'react'

import getElementName from './getElementName'
import isBase64 from './isBase64'
import { archbaseLogo, archbaseLogo2, archbaseLogo3 } from './archbaseLogo'
import { convertImageToBase64 } from './convertImageToBase64'
import filter from './filter'

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
  formatStr,
  compressString,
  decompressString
} from './string-utils'

export {
  getElementName,
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
  convertImageToBase64,
  filter
}

export default {
  ...Children,
  getElementName
}
