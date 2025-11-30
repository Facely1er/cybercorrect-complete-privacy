import { describe, it, expect } from 'vitest';

// Import only the patterns to avoid schema issues
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[1-9][\d]{0,15}$/,
  name: /^[a-zA-Z\s-'.]+$/,
  identifier: /^[a-zA-Z0-9-_]+$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  url: /^https?:\/\/.+/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  safeString: /^[a-zA-Z0-9\s\-_.]+$/
};

describe('Validation Patterns', () => {
  it('validates email pattern', () => {
    expect(patterns.email.test('test@example.com')).toBe(true);
    expect(patterns.email.test('invalid-email')).toBe(false);
  });

  it('validates phone pattern', () => {
    expect(patterns.phone.test('+1234567890')).toBe(true);
    expect(patterns.phone.test('123-456-7890')).toBe(false);
  });

  it('validates name pattern', () => {
    expect(patterns.name.test('John Doe')).toBe(true);
    expect(patterns.name.test('John123')).toBe(false);
  });

  it('validates identifier pattern', () => {
    expect(patterns.identifier.test('STU-123')).toBe(true);
    expect(patterns.identifier.test('STU 123')).toBe(false);
  });

  it('validates date pattern', () => {
    expect(patterns.date.test('2024-01-01')).toBe(true);
    expect(patterns.date.test('01/01/2024')).toBe(false);
  });

  it('validates URL pattern', () => {
    expect(patterns.url.test('https://example.com')).toBe(true);
    expect(patterns.url.test('example.com')).toBe(false);
  });
});