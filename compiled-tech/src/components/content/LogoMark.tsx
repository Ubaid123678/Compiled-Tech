/**
 * The brand mark, inlined as SVG.
 *
 * It used to be loaded through next/image as an <img src="...svg">. That is
 * wasted work: the browser downloads a file to render two paths, and the file
 * URL ends in .svg, so image-format audits count it as a legacy raster. Inline
 * SVG costs a few hundred bytes of markup, is crisp at any size, and can be
 * recoloured with currentColor.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      role="img"
      aria-label="Compiled Tech"
      className={className}
    >
      <path
        d="M85.7 26.5 L64 14 L20.7 39 V89 L64 114 L85.7 101.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinejoin="miter"
        strokeMiterlimit="10"
      />
      <path d="M38 54 L46 40 H110 L102 54 H80 V88 H66 V54 Z" fill="currentColor" />
    </svg>
  );
}
