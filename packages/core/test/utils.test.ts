import { describe, it, expect } from 'vitest';
import { isEmptyString, capitalize, deepClone, uniqueBy, chunk } from '../src/utils';

describe('String Utils', () => {
  it('should check if string is empty', () => {
    expect(isEmptyString('')).toBe(true);
    expect(isEmptyString('  ')).toBe(true);
    expect(isEmptyString('hello')).toBe(false);
    expect(isEmptyString(null)).toBe(false);
  });

  it('should capitalize string', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('WORLD');
    expect(capitalize('')).toBe('');
  });
});

describe('Object Utils', () => {
  it('should deep clone objects', () => {
    const obj = { a: 1, b: { c: 2 }, d: [1, 2, 3] };
    const cloned = deepClone(obj);
    
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
    expect(cloned.b).not.toBe(obj.b);
    expect(cloned.d).not.toBe(obj.d);
  });
});

describe('Array Utils', () => {
  it('should filter unique items by key', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 2, name: 'b' },
      { id: 1, name: 'c' }
    ];
    
    const unique = uniqueBy(items, item => item.id);
    expect(unique).toHaveLength(2);
    expect(unique[0].name).toBe('a');
  });

  it('should chunk array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    const chunks = chunk(arr, 3);
    
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toEqual([1, 2, 3]);
    expect(chunks[1]).toEqual([4, 5, 6]);
    expect(chunks[2]).toEqual([7]);
  });
});