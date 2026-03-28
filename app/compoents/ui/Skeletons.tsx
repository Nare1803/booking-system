export function SkeletonSlots() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-shimmer h-10 rounded-xl" />
      ))}
    </div>
  );
}

export function SkeletonBookForm() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 max-w-lg">
      <div>
        <div className="animate-shimmer h-3 w-28 rounded mb-4" />
        <div className="space-y-2">
          <div className="animate-shimmer h-14 rounded-xl" />
          <div className="animate-shimmer h-14 rounded-xl" />
        </div>
      </div>
      <div>
        <div className="animate-shimmer h-3 w-24 rounded mb-4" />
        <div className="animate-shimmer h-12 rounded-xl" />
      </div>
      <div>
        <div className="animate-shimmer h-3 w-32 rounded mb-4" />
        <SkeletonSlots />
      </div>
    </div>
  );
}
