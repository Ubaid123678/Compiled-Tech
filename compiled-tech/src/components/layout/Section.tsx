export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`py-16 lg:py-26 ${className}`}>
      {children}
    </section>
  );
}