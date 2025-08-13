
"use client";

import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { useI18n, useCurrency } from '@/hooks/use-i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { User, Palette, Languages, HelpCircle, MessageSquare, Trash2, ChevronRight, FileText, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import DataManagement from '@/components/data-management';

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n();
  const { currency, setCurrency, availableCurrencies } = useCurrency();
  const router = useRouter();
  const { toast } = useToast();

  const [username, setUsername] = useLocalStorage('username', '');
  const [name, setName] = useState(username);
  const [isClient, setIsClient] = useState(false);
  
  const languages: { code: any; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ];

  useEffect(() => {
    setIsClient(true);
    setName(username);
  }, [username]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveName = () => {
    setUsername(name);
    toast({
      title: t('user_profile_updated', {defaultValue: "Profile updated"}),
      description: t('name_saved_success', {defaultValue: "Your name has been saved successfully."}),
    });
  };

  const handleResetData = () => {
    // Clear all relevant keys instead of the entire localStorage
    const keys = ['username', 'goals', 'transactions', 'wealthWheel', 'reflections', 'monthlyMood', 'aiProjections', 'investments', 'aiInsight', 'license_key', 'language', 'currency'];
    keys.forEach(key => window.localStorage.removeItem(key));
    router.push('/activate');
     toast({
      title: t('data_deleted_title', {defaultValue: "Data Deleted"}),
      description: t('data_deleted_desc', {defaultValue: "All application data has been cleared."}),
    });
  };
  
  const handleSendFeedback = () => {
    const subject = encodeURIComponent("Feedback/Suporte - The Wealth Map");
    const body = encodeURIComponent("Olá, estou a entrar em contato para...");
    window.location.href = `mailto:thewealthmap.app@gmail.com?subject=${subject}&body=${body}`;
  };

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">{t('loading', {defaultValue: "Loading..."})}</div>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <div className="space-y-8">
        <div className="max-w-4xl mx-auto">
          <div>
              <h1 className="text-3xl font-bold font-headline">{t('settings')}</h1>
              <p className="text-muted-foreground mt-2">{t('settings_desc')}</p>
          </div>

          {/* Perfil do Usuário */}
          <Card className="mt-8">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> {t('user_profile')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="username">{t('full_name')}</Label>
                  <div className="flex gap-2">
                  <Input id="username" value={name} onChange={handleNameChange} />
                  <Button onClick={handleSaveName} disabled={name === username || name.trim() === ''}>{t('save')}</Button>
                  </div>
              </div>
              </CardContent>
          </Card>
          
          {/* Preferências */}
          <Card className="mt-8">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette/> {t('app_preferences')}</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <Label htmlFor="language">{t('language')}</Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                  <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                      {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                  </SelectContent>
                  </Select>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="currency">{t('currency_format')}</Label>
                  <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
                  <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                      {availableCurrencies.map(curr => (
                      <SelectItem key={curr.code} value={curr.code}>{curr.name} ({curr.symbol})</SelectItem>
                      ))}
                  </SelectContent>
                  </Select>
              </div>
              </CardContent>
          </Card>
          
          {/* Privacidade e Dados */}
          <Card className="mt-8">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck /> {t('privacy_and_data')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                  <DataManagement />
                  <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                      <Label>{t('delete_all_data')}</Label>
                      <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />{t('delete')}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>{t('are_you_sure')}</AlertDialogTitle>
                          <AlertDialogDescription>{t('delete_data_warning')}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">{t('yes_delete_data')}</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                      </AlertDialog>
                  </div>
                  <Link href="/legal/privacy" className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer">
                      <Label className="cursor-pointer">{t('privacy_policy')}</Label>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link href="/legal/terms" className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer">
                      <Label className="cursor-pointer">{t('terms_of_service')}</Label>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
              </CardContent>
          </Card>
          
          {/* Suporte e Feedback */}
          <Card className="mt-8">
              <CardHeader>
              <CardTitle className="flex items-center gap-2"><HelpCircle /> {t('support_and_feedback')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer" onClick={handleSendFeedback}>
                      <Label className="cursor-pointer">{t('send_feedback')}</Label>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer" onClick={handleSendFeedback}>
                      <Label className="cursor-pointer">{t('contact_support')}</Label>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
