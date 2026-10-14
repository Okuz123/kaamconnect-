import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Refund Policy — KaamConnect' };

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Cancellation & Refund Policy" updated="October 2026">
      <h2>1. Cancellation by Customer</h2>
      <ul>
        <li><strong>More than 24 hours before scheduled time:</strong> Full refund.</li>
        <li><strong>Within 24 hours:</strong> 50% refund; the worker keeps the rest.</li>
        <li><strong>After work has started:</strong> No refund.</li>
      </ul>

      <h2>2. Cancellation by Worker</h2>
      <p>If a worker cancels after accepting, the customer receives a full refund. The worker's rating may be affected.</p>

      <h2>3. Disputed Work</h2>
      <p>If the work is unsatisfactory, raise a dispute within 48 hours. Our team reviews and may issue:</p>
      <ul>
        <li>Full refund, or</li>
        <li>Partial refund, or</li>
        <li>No refund if the claim is not substantiated.</li>
      </ul>

      <h2>4. Refund Timeline</h2>
      <p>Approved refunds reach the original payment method within 5–7 working days.</p>

      <h2>5. Platform Fees</h2>
      <p>Platform commission is refunded proportionally with the job amount. Payment gateway fees are not refundable.</p>
    </LegalPage>
  );
}
