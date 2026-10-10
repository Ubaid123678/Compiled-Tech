export function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`pb-12 pt-8 lg:pb-20 lg:pt-12 ${className}`}>
      {children}
    </section>
  );
}