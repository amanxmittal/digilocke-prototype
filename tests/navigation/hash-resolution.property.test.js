/**
 * Property-based test for hash chaining resolution correctness.
 *
 * Feature: desktop-navigation-flows, Property 1: Hash chaining resolution correctness
 * Validates: Requirements 14.7, 14.8
 *
 * Tests that nextTarget() correctly decodes #next= hash parameters and falls back
 * to '06-home.html' when no #next= parameter is present.
 */
const fc = require('fast-check');

// Replicate the nextTarget() function as implemented in 04-otp.html, 05-mpin.html, 64-set-mpin.html
function nextTarget() {
  var m = location.hash.match(/next=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : '06-home.html';
}

// Save original location descriptor so we can mock location.hash
const originalLocation = global.location;

beforeEach(() => {
  // Define a mutable location object for testing
  delete global.location;
  global.location = { hash: '' };
});

afterEach(() => {
  global.location = originalLocation;
});

/**
 * Arbitrary: generates valid HTML filenames matching the pattern used across the prototype.
 * Format: alphanumeric characters and hyphens followed by .html
 */
const validFilenameArb = fc
  .tuple(
    fc.stringOf(
      fc.oneof(
        fc.char().filter(c => /[a-z0-9]/.test(c)),
        fc.constant('-')
      ),
      { minLength: 1, maxLength: 30 }
    ),
    fc.constant('.html')
  )
  .map(([name, ext]) => name.replace(/^-+|-+$/g, 'x') + ext)
  .filter(name => name.length > 5 && /^[a-z0-9][a-z0-9-]*[a-z0-9]\.html$/.test(name));

/**
 * Arbitrary: generates filenames optionally with URL-encoded nested #next= fragments.
 * This simulates multi-step hash chaining like: 64-set-mpin.html%23next=66-add-mobile.html
 */
const filenameWithOptionalNestedHash = fc.oneof(
  // Simple filename
  validFilenameArb,
  // Filename with nested #next= (URL-encoded)
  fc.tuple(validFilenameArb, validFilenameArb).map(
    ([first, second]) => `${first}${encodeURIComponent('#next=' + second)}`
  )
);

describe('Feature: desktop-navigation-flows, Property 1: Hash chaining resolution correctness', () => {
  it('should decode #next= hash parameter and return the decoded filename for any valid target', () => {
    fc.assert(
      fc.property(filenameWithOptionalNestedHash, (targetFilename) => {
        // Set location.hash with a properly encoded #next= parameter
        global.location.hash = `#next=${encodeURIComponent(targetFilename)}`;

        const result = nextTarget();

        // The function should decode and return the target filename
        expect(result).toBe(targetFilename);
      }),
      { numRuns: 100, verbose: true }
    );
  });

  it('should return "06-home.html" when no #next= parameter is present in location.hash', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(''),
          fc.constant('#'),
          fc.constant('#somethingelse=value'),
          fc.constant('#foo=bar&baz=qux'),
          // Random hash strings without 'next='
          fc.stringOf(fc.char().filter(c => /[a-z0-9]/.test(c)), { minLength: 0, maxLength: 20 })
            .filter(s => !s.includes('next='))
            .map(s => s ? `#${s}` : '')
        ),
        (hashValue) => {
          global.location.hash = hashValue;

          const result = nextTarget();

          expect(result).toBe('06-home.html');
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  it('should handle URL-encoded nested hash fragments correctly', () => {
    fc.assert(
      fc.property(
        fc.tuple(validFilenameArb, validFilenameArb),
        ([outerTarget, innerTarget]) => {
          // Simulate nested chaining: outer#next=inner encoded as outer%23next=inner
          const nestedValue = `${outerTarget}${encodeURIComponent('#next=' + innerTarget)}`;
          global.location.hash = `#next=${encodeURIComponent(nestedValue)}`;

          const result = nextTarget();

          // Should decode the first level and return the full nested value
          expect(result).toBe(nestedValue);
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });
});
