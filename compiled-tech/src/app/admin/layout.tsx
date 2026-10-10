// app/admin/layout.tsx
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-screen bg-ink font-body text-mist">
      <div className="min-h-screen flex flex-col">{children}</div>
    </div>
  );
}