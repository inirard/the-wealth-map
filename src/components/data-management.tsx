
"use client";

import React, { useRef } from 'react';
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DatabaseZap, Database } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEYS = ['username', 'goals', 'transactions', 'wealthWheel', 'reflections', 'monthlyMood', 'language', 'aiProjections', 'investments', 'aiInsight'];

export default function DataManagement({ isDropdown }: { isDropdown?: boolean }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const ItemWrapper = isDropdown ? DropdownMenuItem : SidebarMenuItem;
  const ButtonComp = isDropdown ? 'div' : SidebarMenuButton;

  const handleBackup = () => {
    try {
      const backupData: { [key: string]: any } = {};
      LOCAL_STORAGE_KEYS.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          backupData[key] = JSON.parse(item);
        }
      });

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `wealth-map-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: t('backup_successful_title'),
        description: t('backup_successful_desc'),
      });
    } catch (error) {
      console.error("Backup failed:", error);
      toast({
        variant: "destructive",
        title: t('backup_failed_title'),
        description: t('backup_failed_desc'),
      });
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("File is not a valid text file.");
        }
        const data = JSON.parse(text);

        if (Object.keys(data).length === 0) throw new Error("Backup file is empty or invalid.");

        Object.keys(data).forEach(key => {
          if (LOCAL_STORAGE_KEYS.includes(key)) {
            localStorage.setItem(key, JSON.stringify(data[key]));
          }
        });
        
        toast({
          title: t('restore_successful_title'),
          description: t('restore_successful_desc'),
        });
        
        setTimeout(() => window.location.reload(), 1000);

      } catch (error) {
        console.error("Restore failed:", error);
        toast({
          variant: "destructive",
          title: t('restore_failed_title'),
          description: t('restore_failed_desc'),
        });
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };
  
  const buttonProps = {
    variant: "ghost",
    className: "w-full justify-start",
    tooltip: t('backup_data')
  };

  return (
    <>
      <ItemWrapper>
        <ButtonComp {...(isDropdown ? { onSelect: handleBackup, className: "flex items-center gap-2" } : { ...buttonProps, onClick: handleBackup })}>
            <DatabaseZap />
            <span>{t('backup_data')}</span>
        </ButtonComp>
      </ItemWrapper>
      <ItemWrapper>
         <ButtonComp {...(isDropdown ? { onSelect: handleRestoreClick, className: "flex items-center gap-2" } : { ...buttonProps, onClick: handleRestoreClick, tooltip: t('restore_data') })}>
            <Database />
            <span>{t('restore_data')}</span>
        </ButtonComp>
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/json"
            className="hidden"
        />
      </ItemWrapper>
    </>
  );
}
