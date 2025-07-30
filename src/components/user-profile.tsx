
"use client";

import React from 'react';
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
import { useLocalStorage } from '@/hooks/use-local-storage';
import { usePlan } from '@/hooks/use-plan';
import { useI18n } from '@/hooks/use-i18n';
import { Crown, User, Settings } from 'lucide-react';
import UpgradeButton from './upgrade-button';
import { cn } from '@/lib/utils';

export default function UserProfile() {
    const [name] = useLocalStorage('username', 'User');
    const { plan, setPlan } = usePlan();
    const { t } = useI18n();

    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                    <p className="font-bold text-base">{name}</p>
                    <p className="text-xs text-muted-foreground font-normal">
                        {t('profile_and_settings')}
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
                     <UpgradeButton asChild>
                        <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary cursor-pointer">
                            <Crown className="mr-2 h-4 w-4" />
                            <span>{t('upgrade_to_premium')}</span>
                        </DropdownMenuItem>
                    </UpgradeButton>
                ) : (
                    <DropdownMenuItem 
                        className="focus:bg-primary/10 focus:text-primary cursor-pointer"
                        onSelect={() => setPlan('basic')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Gerir Subscrição</span>
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
