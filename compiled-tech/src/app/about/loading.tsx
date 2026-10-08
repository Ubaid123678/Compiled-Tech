export default function Loading() {
  return (
    <div className="py-16 lg:py-26 animate-pulse">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 space-y-12">
        <div className="h-8 bg-slate/50 rounded w-1/3" />
        <div className="h-4 bg-slate/50 rounded w-1/2" />
        <div className="space-y-6">
          <div className="h-4 bg-slate/50 rounded w-1/4" />
          <div className="h-32 bg-slate/50 rounded" />
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-slate/50 rounded-[12px]" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate/50 rounded-[20px]" />
          ))}
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 bg-slate/50 rounded-[12px]" />
          ))}
        </div>
      </div>
    </div>
  );
}