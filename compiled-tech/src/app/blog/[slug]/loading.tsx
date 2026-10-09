export default function Loading() {
  return (
    <div className="py-16 lg:py-26 animate-pulse">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 space-y-8">
        <div className="h-8 bg-slate/50 rounded w-1/3" />
        <div className="h-4 bg-slate/50 rounded w-1/2" />
        <div className="grid lg:grid-cols-[1fr_280px] gap-12">
          <div className="space-y-6">
            <div className="h-32 bg-slate/50 rounded" />
            <div className="h-96 bg-slate/50 rounded" />
          </div>
          <div className="h-64 bg-slate/50 rounded hidden lg:block" />
        </div>
      </div>
    </div>
  );
}