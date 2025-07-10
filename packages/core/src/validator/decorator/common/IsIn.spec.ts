import { isIn } from './IsIn';

describe('@IsIn decorator implementation', () => {
  describe('isIn validator', () => {
    it('archbase:should accept valid values', () => {
      expect(isIn('A', ['A', 'B'])).toBe(true);
      expect(isIn('A', ['B', 'C'])).toBe(false);
      expect(isIn('A', [1, 2])).toBe(false);
    });

    it('archbase:should not accept invalid values', () => {
      expect(isIn('A', 5 as any)).toBe(false);
      expect(isIn('A', 'ABC' as any)).toBe(false);
      expect(isIn('A', false as any)).toBe(false);
    });
  });
});
