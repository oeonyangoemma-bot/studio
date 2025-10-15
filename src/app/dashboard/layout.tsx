"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Header } from "@/components/header";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // You can show a loading spinner here
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
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
  );
}
