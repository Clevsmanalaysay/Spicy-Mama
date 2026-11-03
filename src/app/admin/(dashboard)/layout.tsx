import { AuthGuard } from "@/components/admin/AuthGuard";
import { AdminShell } from "@/components/admin/AdminShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AdminShell>{children}</AdminShell>
    </AuthGuard>
  );
}
