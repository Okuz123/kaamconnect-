const COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  requested: 'bg-blue-50 text-blue-700',
  accepted: 'bg-green-50 text-green-700',
  declined: 'bg-red-50 text-red-700',
  quotation_pending: 'bg-amber-50 text-amber-700',
  quotation_accepted: 'bg-brand-50 text-brand-700',
  awaiting_payment: 'bg-orange-50 text-orange-700',
  confirmed: 'bg-success-50 text-success-700',
  worker_en_route: 'bg-purple-50 text-purple-700',
  work_started: 'bg-purple-50 text-purple-700',
  work_completed: 'bg-blue-50 text-blue-700',
  payment_processing: 'bg-amber-50 text-amber-700',
  paid: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  disputed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-700',
};

export default function BookingStatusBadge({ status }: { status: string }) {
  const cls = COLORS[status] || 'bg-gray-100 text-gray-700';
  return (
    <span className={'text-xs font-medium px-2.5 py-1 rounded-full capitalize ' + cls}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
