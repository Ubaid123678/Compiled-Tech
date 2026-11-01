import { pricingTiers } from "@/data/pricing";

/**
 * Packages side by side. The audit asks for data tables with headers, and a
 * comparison table is the format buyers actually want when three packages are
 * on screen — so this replaces three paragraphs of "which one is right for me"
 * with one scannable grid.
 *
 * Real <table> with <th scope>, so it is extractable by crawlers and readable
 * by screen readers in the correct order.
 */
export function ComparisonTable() {
  return (
    <div className="mt-12 overflow-x-auto lg:mt-16">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <caption className="sr-only">
          Compiled Tech build packages compared by starting price, timeline, and what each includes.
        </caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="py-3 pr-4 font-display text-[0.72rem] uppercase tracking-[0.18em] text-steel">
              Package
            </th>
            <th scope="col" className="py-3 pr-4 font-display text-[0.72rem] uppercase tracking-[0.18em] text-steel">
              Starts at
            </th>
            <th scope="col" className="py-3 pr-4 font-display text-[0.72rem] uppercase tracking-[0.18em] text-steel">
              Timeline
            </th>
            <th scope="col" className="py-3 font-display text-[0.72rem] uppercase tracking-[0.18em] text-steel">
              Best for
            </th>
          </tr>
        </thead>
        <tbody>
          {pricingTiers.map((tier) => (
            <tr key={tier.name} className="border-b border-line align-top">
              <th scope="row" className="py-4 pr-4 font-display text-[0.95rem] font-semibold uppercase tracking-[0.02em] text-frost">
                {tier.name}
              </th>
              <td className="py-4 pr-4 text-mist">
                ${tier.from.toLocaleString("en-US")} {tier.currency}
              </td>
              <td className="py-4 pr-4 text-mist">{tier.timeline}</td>
              <td className="py-4 text-mist">{tier.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
