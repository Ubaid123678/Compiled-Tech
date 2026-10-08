import { plusStrip } from "@/data/services";

export function PlusStrip() {
  return (
    <div className="mt-12 rounded-card border border-line bg-night/50 p-6 lg:p-8" role="region" aria-label="Additional services">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-center gap-3 text-mist">
          <span className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel flex-shrink-0">+</span>
          <span>{plusStrip.left}</span>
        </div>
        <div className="flex items-center gap-3 text-mist justify-end">
          <span className="font-display uppercase text-[0.72rem] tracking-[0.22em] text-steel flex-shrink-0">!</span>
          <span>{plusStrip.right}</span>
        </div>
      </div>
    </div>
  );
}