import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Privacy Policy — KaamConnect' };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>KaamConnect respects your privacy. This policy explains what data we collect, why we collect it, and how we protect it.</p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>Account information: name, phone number, email, role.</li>
        <li>Location: approximate geolocation, only when you grant permission, to show nearby workers.</li>
        <li>Content: job descriptions, reviews, photos you upload.</li>
        <li>Payment records: transaction IDs (not card numbers) from our payment provider.</li>
        <li>Identity documents: for workers who choose verification. Stored privately.</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To operate the marketplace and connect workers with customers.</li>
        <li>To process payments and prevent fraud.</li>
        <li>To send notifications and support messages.</li>
        <li>To improve the platform.</li>
      </ul>

      <h2>3. What We Never Do</h2>
      <ul>
        <li>We never sell your personal data.</li>
        <li>We never expose identity documents or bank details on public profiles.</li>
        <li>We never store raw card numbers, CVVs, or UPI PINs.</li>
      </ul>

      <h2>4. Sharing</h2>
      <p>We share your data only with:</p>
      <ul>
        <li>Supabase (database and authentication).</li>
        <li>Razorpay (payments).</li>
        <li>Law enforcement, when legally required.</li>
      </ul>

      <h2>5. Your Rights</h2>
      <ul>
        <li>Access your data.</li>
        <li>Correct your data.</li>
        <li>Delete your account (email support@kaamconnect.app).</li>
        <li>Withdraw consent for geolocation.</li>
      </ul>

      <h2>6. Security</h2>
      <p>We use HTTPS, row-level security in the database, and encrypted storage for sensitive documents.</p>

      <h2>7. Contact</h2>
      <p>Questions? Email privacy@kaamconnect.app</p>
    </LegalPage>
  );
}
