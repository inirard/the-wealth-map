
"use client";

import React from 'react';
import AppSidebar from "@/components/app-sidebar";
import Chatbot from "@/components/chatbot";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import UserProfile from '@/components/user-profile';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 no-print">
            <SidebarTrigger className="hover:text-primary" />
            <div className="flex items-center gap-2">
                <Chatbot />
                <UserProfile />
            </div>
        </header>
        <div className="p-6 pt-6 sm:p-6 lg:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
