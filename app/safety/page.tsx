import LegalPage from '@/components/legal/LegalPage';

export const metadata = { title: 'Safety Guidelines — KaamConnect' };

export default function SafetyPage() {
  return (
    <LegalPage title="Community & Safety Guidelines" updated="October 2026">
      <h2>For Customers</h2>
      <ul>
        <li>Verify the worker's profile and reviews before booking.</li>
        <li>Meet in a safe, visible place.</li>
        <li>Pay through the platform — never in cash off-platform.</li>
        <li>Report concerns immediately.</li>
      </ul>

      <h2>For Workers</h2>
      <ul>
        <li>Confirm the address and scope of work in writing (through the app).</li>
        <li>Inform a friend or family member of your job location.</li>
        <li>Refuse unsafe work.</li>
        <li>Report harassment immediately.</li>
      </ul>

      <h2>Emergency</h2>
      <p>In case of emergency, call <strong>112</strong> (India). Then notify us at safety@kaamconnect.app.</p>

      <h2>Report Abuse</h2>
      <p>Use the "Raise a dispute" button in any booking, or email abuse@kaamconnect.app.</p>
    </LegalPage>
  );
}
