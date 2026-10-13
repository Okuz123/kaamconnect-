import { describe, it, expect } from 'vitest';

const VALID: Record<string, string[]> = {
  draft: ['requested', 'cancelled'],
  requested: ['accepted', 'declined', 'cancelled'],
  accepted: ['worker_en_route', 'work_started', 'cancelled'],
  worker_en_route: ['work_started'],
  work_started: ['work_completed'],
  work_completed: ['payment_processing'],
  payment_processing: ['paid', 'failed'],
  paid: ['disputed'],
  cancelled: [],
  declined: [],
  disputed: ['refunded', 'paid'],
};

function canTransition(from: string, to: string): boolean {
  return (VALID[from] || []).includes(to);
}

describe('booking state machine', () => {
  it('allows requested → accepted', () => {
    expect(canTransition('requested', 'accepted')).toBe(true);
  });
  it('forbids paid → requested', () => {
    expect(canTransition('paid', 'requested')).toBe(false);
  });
  it('forbids work_started → paid (must go through work_completed)', () => {
    expect(canTransition('work_started', 'paid')).toBe(false);
  });
  it('allows work_completed → payment_processing', () => {
    expect(canTransition('work_completed', 'payment_processing')).toBe(true);
  });
});
