
"use client";

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { usePlan } from '@/hooks/use-plan';
import { useI18n } from '@/hooks/use-i18n';
import { Crown, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import UpgradeButton from './upgrade-button';
import { auth } from '@/lib/firebase';
import type { User } from 'firebase/auth';
import { Skeleton } from './ui/skeleton';

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { plan, setPlan } = usePlan();
    const { t } = useI18n();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const getInitials = (name: string | null | undefined) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }
    
    if (isLoading) {
        return <Skeleton className="h-10 w-10 rounded-full" />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {getInitials(user?.displayName)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                    <p className="font-bold text-base">{user?.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground font-normal">
                       {user?.email}
                    </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem disabled>
                    <div className="flex justify-between items-center w-full">
                       <span className="font-medium">{t('current_plan')}</span>
                       <span className={cn(
                           "font-semibold flex items-center gap-1.5",
                           plan === 'premium' ? 'text-primary' : 'text-muted-foreground'
                        )}>
                            {plan === 'premium' && <Crown className="h-4 w-4" />}
                           {plan === 'premium' ? t('premium_plan') : t('basic_plan')}
                       </span>
                    </div>
                </DropdownMenuItem>
                
                {plan === 'basic' ? (
                     <DropdownMenuItem asChild>
                        <UpgradeButton asChild fullWidth >
                           <span><Crown className="mr-2 h-4 w-4" />{t('upgrade_to_premium')}</span>
                        </UpgradeButton>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem 
                        className="focus:bg-primary/10 focus:text-primary cursor-pointer"
                        onSelect={() => setPlan('basic')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>{t('manage_plan')}</span>
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
