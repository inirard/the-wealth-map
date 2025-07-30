
import AppSidebar from "@/components/app-sidebar";
import Chatbot from "@/components/chatbot";
import UserProfile from "@/components/user-profile";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import type { Viewport, Metadata } from 'next';
import UpgradeButton from "@/components/upgrade-button";
import { usePlan } from "@/hooks/use-plan";

export const metadata: Metadata = {
  // O título pode ser definido aqui se for comum a todo o dashboard
};

export const viewport: Viewport = {
  themeColor: '#007C7C',
};

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
                <UpgradeButton iconOnly />
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
