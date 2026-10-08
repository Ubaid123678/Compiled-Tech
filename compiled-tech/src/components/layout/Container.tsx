export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}