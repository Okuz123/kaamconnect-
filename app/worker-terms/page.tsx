import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Worker Terms — KaamConnect' };

export default function WorkerTermsPage() {
  return (
    <LegalPage title="Worker Terms" updated="October 2026">
      <h2>1. Eligibility</h2>
      <p>You must be 18+, legally able to work, and provide accurate information about your skills and experience.</p>

      <h2>2. Your Commitments</h2>
      <ul>
        <li>Arrive on time and complete the agreed work.</li>
        <li>Charge the agreed rate — no surprise increases.</li>
        <li>Treat customers respectfully.</li>
        <li>Do not share customer contact details outside the platform.</li>
      </ul>

      <h2>3. Earnings &amp; Payouts</h2>
      <ul>
        <li>You earn the agreed amount minus the platform commission.</li>
        <li>Payouts are released after the customer confirms completion.</li>
        <li>Minimum payout threshold: ₹100.</li>
        <li>Payouts arrive within 3 working days of request.</li>
      </ul>

      <h2>4. Verification</h2>
      <p>Verification is optional. If you submit ID documents, they are stored privately and never shown on your public profile.</p>

      <h2>5. Suspension</h2>
      <p>We may suspend accounts for fraud, repeated cancellations, or customer complaints.</p>

      <h2>6. Insurance</h2>
      <p>KaamConnect does not provide insurance. Workers are independent contractors responsible for their own safety and coverage.</p>
    </LegalPage>
  );
}
