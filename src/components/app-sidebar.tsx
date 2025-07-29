"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleDollarSign, LayoutDashboard, Target, Donut, ListChecks, BookOpen, Quote, Trash2 } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSidebar } from '@/components/ui/sidebar';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/goals', icon: Target, label: 'Goal Mapping' },
  { href: '/dashboard/wealth-wheel', icon: Donut, label: 'Wealth Wheel' },
  { href: '/dashboard/tracker', icon: ListChecks, label: 'Monthly Tracker' },
  { href: '/dashboard/reflection', icon: BookOpen, label: 'Reflection' },
  { href: '/dashboard/quotes', icon: Quote, label: 'Affirmations' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);

  const handleResetData = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <CircleDollarSign className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-primary">Wealth Map</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === item.href}
                  onClick={() => setOpenMobile(false)}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => setResetDialogOpen(true)}
          >
            <Trash2 />
            <span className="group-data-[collapsible=icon]:hidden">Reset Data</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your data from this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Yes, reset data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
