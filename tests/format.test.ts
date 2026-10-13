import { describe, it, expect } from 'vitest';
import { formatINR, formatDistance } from '../lib/utils/format';

describe('formatINR', () => {
  it('formats 0 as ₹0', () => expect(formatINR(0)).toBe('₹0'));
  it('formats 1000 with comma', () => expect(formatINR(1000)).toBe('₹1,000'));
  it('returns — for null', () => expect(formatINR(null)).toBe('—'));
});

describe('formatDistance', () => {
  it('shows meters under 1 km', () => expect(formatDistance(0.5)).toBe('500 m away'));
  it('shows km with one decimal', () => expect(formatDistance(3.25)).toBe('3.3 km away'));
});
