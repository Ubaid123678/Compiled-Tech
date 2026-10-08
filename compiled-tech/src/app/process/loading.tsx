export default function Loading() {
  return (
    <div className="py-16 lg:py-26 animate-pulse">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 space-y-12">
        <div className="h-8 bg-slate/50 rounded w-1/3" />
        <div className="h-4 bg-slate/50 rounded w-1/2" />
        <div className="space-y-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-96 bg-slate/50 rounded-[20px]" />
          ))}
        </div>
        <div className="h-64 bg-slate/50 rounded-[20px]" />
      </div>
    </div>
  );
}