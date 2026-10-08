export default function Loading() {
  return (
    <div className="py-16 lg:py-26 animate-pulse">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 space-y-8">
        <div className="h-8 bg-slate/50 rounded w-1/3" />
        <div className="h-4 bg-slate/50 rounded w-1/2" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-slate/50 rounded-[20px]" />
          ))}
        </div>
      </div>
    </div>
  );
}