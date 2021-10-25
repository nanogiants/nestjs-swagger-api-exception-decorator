import { isClass, isFunction } from '../../lib/utils';

describe('index.ts', () => {
  describe('isClass()', () => {
    describe('given class reference', () => {
      it('should return true', () => {
        class TestClass {}
        expect(isClass(TestClass)).toBe(true);
      });
    });

    describe('given just a string', () => {
      it('should return false', () => {
        expect(isClass('no-class-ref')).toBe(false);
      });
    });

    describe('given a function', () => {
      it('should return false', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        function X() {}
        expect(isClass(X)).toBe(false);
      });
    });
  });
});
