
"use client";

import React, { ReactNode, useState, useEffect } from "react";
import AppSidebar from "@/components/app-sidebar";
import Chatbot from "@/components/chatbot";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "@/components/auth-provider";
import { Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">A carregar...</div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 no-print">
            <SidebarTrigger className="hover:text-primary" />
            <div className="flex items-center gap-2">
              <Chatbot />
              <Button asChild variant="ghost" size="icon">
                <Link href="/dashboard/settings">
                  <Settings className="h-6 w-6" />
                </Link>
              </Button>
            </div>
          </header>
          <main className="p-6 pt-0 sm:p-6 lg:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
