
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
    LayoutDashboard, 
    Target, 
    Donut, 
    ListChecks, 
    BookOpen, 
    Quote, 
    Trash2, 
    Gem, 
    Bot, 
    LineChart,
    Settings // Alterado
} from 'lucide-react';
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

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from '@/components/ui/sidebar';
import { useSidebar } from '@/components/ui/sidebar';
import { useI18n } from '@/hooks/use-i18n';
import { WealthMapIcon } from '@/components/icons/WealthMapIcon';
import { useToast } from '@/hooks/use-toast';


export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const { t } = useI18n();
  const [mounted, setMounted] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/dashboard/goals', icon: Target, label: t('goals_mapping') },
    { href: '/dashboard/wealth-wheel', icon: Donut, label: t('wealth_wheel') },
    { href: '/dashboard/tracker', icon: ListChecks, label: t('monthly_tracker') },
    { href: '/dashboard/investments', icon: LineChart, label: t('investments') },
    { href: '/dashboard/reflection', icon: BookOpen, label: t('reflection') },
    { href: '/dashboard/projections', icon: Bot, label: t('ai_projections_title') },
    { href: '/dashboard/quotes', icon: Quote, label: t('affirmations') },
  ];
  
  const handleResetData = () => {
    // Clear all relevant keys instead of the entire localStorage
    const keys = ['username', 'goals', 'transactions', 'wealthWheel', 'reflections', 'monthlyMood', 'aiProjections', 'investments', 'aiInsight', 'license_key', 'language', 'currency'];
    keys.forEach(key => window.localStorage.removeItem(key));
    router.push('/activate');
     toast({
      title: t('data_deleted_title', {defaultValue: "Data Deleted"}),
      description: t('data_deleted_desc', {defaultValue: "All application data has been cleared."}),
    });
    setResetDialogOpen(false);
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <WealthMapIcon />
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
        </SidebarContent>
        <SidebarFooter>
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
                 <SidebarSeparator className="my-1" />
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'} tooltip={t('settings')}>
                        <Link href="/dashboard/settings"><Settings /><span className="group-data-[collapsible=icon]:hidden">{t('settings')}</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setResetDialogOpen(true)}
                        tooltip={mounted ? t('delete_all_data') : 'Delete All Data'}
                    >
                        <Trash2 />
                        <span className="group-data-[collapsible=icon]:hidden">{mounted ? t('delete_all_data'): 'Delete All Data'}</span>
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
