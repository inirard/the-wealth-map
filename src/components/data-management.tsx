
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatabaseZap, Database } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEYS = ['username', 'goals', 'transactions', 'wealthWheel', 'reflections', 'monthlyMood', 'language', 'currency', 'aiProjections', 'investments', 'aiInsight', 'license_key'];

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
          // Attempt to parse, but store as string if it fails
          try {
            backupData[key] = JSON.parse(item);
          } catch {
            backupData[key] = item;
          }
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
        description: String(error),
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
             // Stringify the value before setting it, as localStorage only stores strings
             const valueToStore = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
             localStorage.setItem(key, valueToStore);
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
          description: String(error),
        });
      } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <Label>{t('backup_data')}</Label>
        <Button variant="outline" onClick={handleBackup}>
          <DatabaseZap className="mr-2 h-4 w-4" />
          {t('backup_data')}
        </Button>
      </div>
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
        <Label>{t('restore_data')}</Label>
        <Button variant="outline" onClick={handleRestoreClick}>
          <Database className="mr-2 h-4 w-4" />
          {t('restore_data')}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/json"
          className="hidden"
        />
      </div>
    </>
  );
}
