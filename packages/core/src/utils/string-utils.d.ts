/**
 * Remove non-word chars.
 */
export declare function removeNonWord(str: any): any;
/**
 * Replaces all accented chars with regular ones
 */
export declare function replaceAccents(str: any): any;
/**
 * Remove chars from beginning of string.
 */
export declare function ltrim(str: any, chars?: any): any;
/**
 * Remove chars from end of string.
 */
export declare function rtrim(str: any, chars: any): any;
/**
 * Remove white-spaces from beginning and end of string.
 */
export declare function trim(str: any, chars?: string[]): any;
/**
 * "Safer" String.toLowerCase()
 */
export declare function lowerCase(str: any): any;
/**
 * "Safer" String.toUpperCase()
 */
export declare function upperCase(str: any): any;
/**
 * Convert string to camelCase text.
 */
export declare function camelCase(str: any): any;
/**
 * Add space between camelCase text.
 */
export declare function unCamelCase(str: any): any;
/**
 * UPPERCASE first char of each word.
 */
export declare function properCase(str: any): any;
/**
 * camelCase + UPPERCASE first char
 */
export declare function pascalCase(str: any): any;
/**
 * UPPERCASE first char of each sentence and lowercase other chars.
 */
export declare function sentenceCase(str: any): any;
/**
 * Convert to lower case, remove accents, remove non-word chars and
 * replace spaces with the specified delimeter.
 * Does not split camelCase text.
 */
export declare function slugify(str: any, delimeter: any): any;
/**
 * Replaces spaces with hyphens, split camelCase text, remove non-word chars, remove accents and convert to lower case.
 */
export declare function hyphenate(str: any): any;
/**
 * Replaces hyphens with spaces. (only hyphens between word chars)
 */
export declare function unhyphenate(str: any): any;
/**
 * Replaces spaces with underscores, split camelCase text, remove
 * non-word chars, remove accents and convert to lower case.
 */
export declare function underscore(str: any): any;
/**
 * Convert line-breaks from DOS/MAC to a single standard (UNIX by default)
 */
export declare function normalizeLineBreaks(str: any, lineEnd: any): any;
/**
 * Searches for a given substring
 */
export declare function contains(str: any, substring: any, fromIndex: any): boolean;
/**
 * Truncate string at full words.
 */
export declare function crop(str: any, maxChars: any, append: any): any;
/**
 * Escape RegExp string chars.
 */
export declare function escapeRegExp(str: any): any;
/**
 * Escapes a string for insertion into HTML.
 */
export declare function escapeHtml(str: any): any;
/**
 * Unescapes HTML special chars
 */
export declare function unescapeHtml(str: any): any;
/**
 * Escape string into unicode sequences
 */
export declare function escapeUnicode(str: any, shouldEscapePrintable: any): any;
/**
 * Remove HTML tags from string.
 */
export declare function stripHtmlTags(str: any): any;
/**
 * Remove non-printable ASCII chars
 */
export declare function removeNonASCII(str: any): any;
/**
 * String vazia
 */
export declare function isEmpty(str: any): boolean;
/**
 * String interpolation
 */
export declare function interpolate(template: any, replacements: any, syntax: any): any;
/**
 * Pad string with `char` if its' length is smaller than `minLen`
 */
export declare function rpad(str: any, minLen: any, ch: any): any;
/**
 * Pad string with `char` if its' length is smaller than `minLen`
 */
export declare function lpad(str: any, minLen: any, ch: any): any;
/**
 * Repeat string n times
 */
export declare function repeat(str: any, n: any): string;
/**
 * Limit number of chars.
 */
export declare function truncate(str: any, maxChars: any, append: any, onlyFullWords: any): any;
/**
 * Capture all capital letters following a word boundary (in case the
 * input is in all caps)
 */
export declare function abbreviate(str: any): any;
export declare function convertISOStringToDate(isoString: string): Date;
export declare function convertDateToISOString(date: Date): string;
export declare function formatStr(...values: any[]): any;
export declare const compressString: (str: any) => string;
export declare const decompressString: (str: any) => string;
export declare function isBase64(str: string): boolean;
//# sourceMappingURL=string-utils.d.ts.map