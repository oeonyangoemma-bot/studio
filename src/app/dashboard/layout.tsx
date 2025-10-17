import { AuthProvider } from "@/components/auth-provider";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Header } from "@/components/header";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <main className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-secondary/30">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
