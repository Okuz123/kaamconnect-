export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 mx-auto rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mb-4" />
        <div className="text-sm text-gray-500">Loading…</div>
      </div>
    </div>
  );
}
