export function PostSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-zinc-200 animate-pulse">
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-zinc-200 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 bg-zinc-200 rounded" />
          <div className="h-3 w-20 bg-zinc-100 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-zinc-200 rounded w-full" />
        <div className="h-3 bg-zinc-200 rounded w-4/5" />
      </div>
      <div className="mt-4 flex gap-6">
        <div className="h-3 w-16 bg-zinc-100 rounded" />
        <div className="h-3 w-16 bg-zinc-100 rounded" />
      </div>
    </div>
  );
}