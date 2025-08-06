
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { useI18n } from '@/hooks/use-i18n';
import { Apple, Download, Share, PlusSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const InstallInstructions = () => {
    const { t } = useI18n();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-muted-foreground">
                    {t('how_to_install_button')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('install_instructions_title')}</DialogTitle>
                    <DialogDescription>
                        {t('install_instructions_desc')}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-2">
                    {/* iOS Instructions */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Apple className="h-5 w-5" />
                            {t('for_iphone_ipad')}
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>{t('ios_step_1')}</li>
                            <li>{t('ios_step_2', { icon: 'Partilhar' })} <Share className="inline-block h-4 w-4 mx-1" /></li>
                            <li>{t('ios_step_3', { icon: 'Adicionar ao Ecrã Principal' })} <PlusSquare className="inline-block h-4 w-4 mx-1" /></li>
                            <li>{t('ios_step_4')}</li>
                        </ol>
                    </div>

                    <Separator />

                    {/* Android/Desktop Instructions */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                             <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 14.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z"/><path d="M15 14.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z"/><path d="M10 9.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z"/><path d="M15 9.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z"/><path d="M5.5 22a3.5 3.5 0 0 0 3.5-3.5V17a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1.5a3.5 3.5 0 0 0 3.5 3.5Z"/><path d="M18.5 22a3.5 3.5 0 0 1-3.5-3.5V17a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5a3.5 3.5 0 0 1-3.5 3.5Z"/><path d="M12 2a10 10 0 0 0-9.94 9.06 10 10 0 0 0 19.88 0A10 10 0 0 0 12 2Z"/></svg>
                             {t('for_android_desktop')}
                        </h3>
                         <p className="text-sm text-muted-foreground">
                            {t('android_step_1')} <Download className="inline-block h-4 w-4 mx-1" />
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InstallInstructions;
