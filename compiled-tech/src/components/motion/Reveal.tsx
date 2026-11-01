type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Scroll-in reveal with no JavaScript.
 *
 * This used to be a framer-motion client component wrapped around server
 * sections. That shipped the whole wrapped subtree into the RSC payload a
 * second time (as props) and pulled framer-motion into the critical path
 * just to fade a div in. CSS `animation-timeline: view()` does the same job
 * in the browser, and the content is in the HTML either way.
 *
 * ponytail: animation-timeline is progressive — browsers without it show the
 * content immediately, which is the correct fallback for a reveal.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <div
      className={className}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      data-reveal=""
    >
      {children}
    </div>
  );
}
