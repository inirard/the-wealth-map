"use client";

import React, { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import Chatbot from "@/components/chatbot";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "@/components/auth-provider";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 no-print">
            <SidebarTrigger className="hover:text-primary" />
            <div className="flex items-center gap-2">
              <Chatbot />
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
