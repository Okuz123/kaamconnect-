import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Terms — KaamConnect' };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="October 2026">
      <h2>1. Acceptance</h2>
      <p>By using KaamConnect, you agree to these Terms. If you do not agree, please do not use the platform.</p>

      <h2>2. Account</h2>
      <p>You must provide accurate information, keep your password secure, and not impersonate others.</p>

      <h2>3. Roles</h2>
      <ul>
        <li><strong>Customers</strong> post jobs, hire workers, and pay through the platform.</li>
        <li><strong>Workers</strong> create profiles, accept jobs, and complete them honestly.</li>
        <li><strong>Both</strong> can hire and be hired.</li>
      </ul>

      <h2>4. Payments</h2>
      <p>All payments flow through Razorpay. The platform charges a commission on completed jobs. Refunds follow our Refund Policy.</p>

      <h2>5. Conduct</h2>
      <ul>
        <li>No harassment, fraud, or illegal work.</li>
        <li>No sharing contact info to bypass platform payments.</li>
        <li>No fake reviews or false verification claims.</li>
      </ul>

      <h2>6. Liability</h2>
      <p>KaamConnect is a marketplace. We connect users but are not a party to the work agreement. We limit liability to the fees we charged.</p>

      <h2>7. Termination</h2>
      <p>We may suspend accounts for violations. You may delete your account anytime.</p>

      <h2>8. Governing Law</h2>
      <p>These Terms are governed by Indian law. Disputes are resolved in courts of Jammu &amp; Kashmir.</p>
    </LegalPage>
  );
}
