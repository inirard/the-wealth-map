
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CircleDollarSign, LayoutDashboard, Target, Donut, ListChecks, BookOpen, Quote, Trash2, Languages, ShieldCheck, FileText, Bot, LineChart, Gem, MoreHorizontal } from 'lucide-react';
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

  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/dashboard/goals', icon: Target, label: t('goals_mapping') },
    { href: '/dashboard/wealth-wheel', icon: Donut, label: t('wealth_wheel') },
    { href: '/dashboard/tracker', icon: ListChecks, label: t('monthly_tracker') },
    { href: '/dashboard/investments', icon: LineChart, label: t('investments') },
  ];
  
  const secondaryNavItems = [
    { href: '/dashboard/reflection', icon: BookOpen, label: t('reflection') },
    { href: '/dashboard/projections', icon: Bot, label: t('ai_projections_title') },
    { href: '/dashboard/quotes', icon: Quote, label: t('affirmations') },
  ];

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
            {mainNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  onClick={() => setOpenMobile(false)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          
          <SidebarSeparator className="my-2" />

          <SidebarMenu>
             {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  onClick={() => setOpenMobile(false)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

           <div className="mt-auto group-data-[collapsible=expanded]:contents hidden">
              <SidebarSeparator className="my-2" />
              <DataManagement />
              <div className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
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
              </div>

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t('terms_of_service')}>
                              <Link href="/legal/terms"><FileText /> <span className="group-data-[collapsible=icon]:hidden">{t('terms_of_service')}</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={t('privacy_policy')}>
                            <Link href="/legal/privacy"><ShieldCheck /> <span className="group-data-[collapsible=icon]:hidden">{t('privacy_policy')}</span></Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </div>

        </SidebarContent>
        <SidebarFooter>
            <SidebarSeparator className="my-2" />
            <SidebarMenu>
                <SidebarMenuItem>
                     <SidebarMenuButton
                        asChild
                        isActive={pathname === '/dashboard/upgrade'}
                        onClick={() => setOpenMobile(false)}
                        tooltip={t('unlock_pro_plan')}
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                       <Link href="/dashboard/upgrade">
                            <Gem />
                            <span className="group-data-[collapsible=icon]:hidden">{t('unlock_pro_plan')}</span>
                       </Link>
                      </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setResetDialogOpen(true)}
                        tooltip={mounted ? t('delete_data') : 'Delete Data'}
                    >
                        <Trash2 />
                        <span className="group-data-[collapsible=icon]:hidden">{mounted ? t('delete_data'): 'Delete Data'}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
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
