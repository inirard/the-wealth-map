
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CircleDollarSign, LayoutDashboard, Target, Donut, ListChecks, BookOpen, Quote, Trash2, Languages, ShieldCheck, FileText, Bot, DatabaseZap } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useI18n } from '@/hooks/use-i18n';
import type { Language } from '@/lib/types';
import DataManagement from './data-management';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const { t, language, setLanguage } = useI18n();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/dashboard/goals', icon: Target, label: t('goals_mapping') },
    { href: '/dashboard/wealth-wheel', icon: Donut, label: t('wealth_wheel') },
    { href: '/dashboard/tracker', icon: ListChecks, label: t('monthly_tracker') },
    { href: '/dashboard/reflection', icon: BookOpen, label: t('reflection') },
    { href: '/dashboard/projections', icon: Bot, label: t('ai_projections_title') },
    { href: '/dashboard/quotes', icon: Quote, label: t('affirmations') },
  ];
  
  const legalItems = [
    { href: '/legal/terms', icon: FileText, label: t('terms_of_service') },
    { href: '/legal/privacy', icon: ShieldCheck, label: t('privacy_policy') },
  ]

  const languages: { code: Language, name: string }[] = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  const handleResetData = () => {
    window.localStorage.clear();
    router.push('/');
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <CircleDollarSign className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">Wealth Map</span>
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
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    {mounted ? <span className="group-data-[collapsible=icon]:hidden">{item.label}</span> : <span className="group-data-[collapsible=icon]:hidden">{t('dashboard')}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarSeparator className="my-2" />
             {legalItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  onClick={() => setOpenMobile(false)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    {mounted ? <span className="group-data-[collapsible=icon]:hidden">{item.label}</span> : <span className="group-data-[collapsible=icon]:hidden">...</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-2">
            <DataManagement />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground">
                      <Languages/>
                      <span className="group-data-[collapsible=icon]:hidden">{mounted ? languages.find(l => l.code === language)?.name : 'English'}</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map(lang => (
                    <DropdownMenuItem key={lang.code} onSelect={() => setLanguage(lang.code)}>
                        {lang.name}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setResetDialogOpen(true)}
          >
            <Trash2 />
            <span className="group-data-[collapsible=icon]:hidden">{mounted ? t('delete_data'): 'Delete Data'}</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{mounted ? t('are_you_sure') : 'Are you absolutely sure?'}</AlertDialogTitle>
            <AlertDialogDescription>
                {mounted ? t('delete_data_warning'): 'This action cannot be undone. This will permanently delete all your data from this browser.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{mounted ? t('cancel'): 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {mounted ? t('yes_delete_data') : 'Yes, delete data'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
