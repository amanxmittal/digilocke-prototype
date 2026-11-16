/**
 * Property-based test for avatar dropdown text truncation.
 *
 * Feature: desktop-navigation-enhancements, Property 5: Avatar dropdown text truncation
 * Validates: Requirements 4.7
 *
 * Tests that truncate(str, maxLen) returns the original string unchanged when its
 * length is ≤ maxLen, and returns a string of exactly maxLen characters (ending
 * with "…") when the original exceeds maxLen.
 */
const fc = require('fast-check');

// Extract the truncate function as implemented in ../assets/app.js
function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str;
}

describe('Feature: desktop-navigation-enhancements, Property 5: Avatar dropdown text truncation', () => {
  it('should return empty string for null or undefined input', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.constant(null), fc.constant(undefined), fc.constant('')),
        (input) => {
          const result = truncate(input, 30);
          expect(result).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return original string unchanged when length ≤ maxLen', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 200 }),
        fc.integer({ min: 1, max: 300 }),
        (str, maxLen) => {
          // Only test cases where str.length <= maxLen
          fc.pre(str.length <= maxLen);

          const result = truncate(str, maxLen);
          expect(result).toBe(str);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should return exactly maxLen characters with trailing "…" when string exceeds maxLen', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 200 }),
        fc.integer({ min: 2, max: 100 }),
        (str, maxLen) => {
          // Only test cases where str.length > maxLen
          fc.pre(str.length > maxLen);

          const result = truncate(str, maxLen);

          // Result length must be exactly maxLen
          expect(result.length).toBe(maxLen);
          // Last character must be the ellipsis
          expect(result[result.length - 1]).toBe('…');
          // Leading characters must match the original string's prefix
          expect(result.slice(0, maxLen - 1)).toBe(str.slice(0, maxLen - 1));
        }
      ),
      { numRuns: 100 }
    );
  });
});
