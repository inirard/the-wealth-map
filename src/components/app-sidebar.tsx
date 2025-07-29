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
import { useLocalStorage } from '@/hooks/use-local-storage';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Painel de Controlo' },
  { href: '/dashboard/goals', icon: Target, label: 'Mapeamento de Metas' },
  { href: '/dashboard/wealth-wheel', icon: Donut, label: 'Roda da Riqueza' },
  { href: '/dashboard/tracker', icon: ListChecks, label: 'Rastreador Mensal' },
  { href: '/dashboard/reflection', icon: BookOpen, label: 'Reflexão' },
  { href: '/dashboard/quotes', icon: Quote, label: 'Afirmações' },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [resetDialogOpen, setResetDialogOpen] = React.useState(false);
  const [name, setName] = useLocalStorage('username', '');

  const handleResetData = () => {
    window.localStorage.clear();
    setName('');
    window.location.href = '/';
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
            <span className="group-data-[collapsible=icon]:hidden">Apagar Dados</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá apagar permanentemente todos os seus dados deste navegador.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, apagar dados
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
