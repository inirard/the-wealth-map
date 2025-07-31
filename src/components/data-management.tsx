
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { DatabaseBackup, DatabaseRestore } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEYS = ['username', 'goals', 'transactions', 'wealthWheel', 'reflections', 'monthlyMood', 'language'];

export default function DataManagement() {
  const { t } = useI18n();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        // Validate data before restoring
        const missingKeys = LOCAL_STORAGE_KEYS.filter(key => !(key in data) && localStorage.getItem(key) !== null);
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
        
        // Force a reload to apply all restored settings (like language)
        setTimeout(() => window.location.reload(), 1000);

      } catch (error) {
        console.error("Restore failed:", error);
        toast({
          variant: "destructive",
          title: t('restore_failed_title'),
          description: t('restore_failed_desc'),
        });
      } finally {
        // Reset the file input so the user can select the same file again
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="group-data-[collapsible=icon]:p-0 p-2">
        <div className="flex flex-col gap-2 group-data-[collapsible=icon]:items-center">
            <Button variant="outline" onClick={handleBackup} className="w-full justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center">
                <DatabaseBackup />
                <span className="group-data-[collapsible=icon]:hidden">{t('backup_data')}</span>
            </Button>
            <Button variant="outline" onClick={handleRestoreClick} className="w-full justify-start gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center">
                <DatabaseRestore />
                <span className="group-data-[collapsible=icon]:hidden">{t('restore_data')}</span>
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/json"
                className="hidden"
            />
        </div>
    </div>
  );
}
