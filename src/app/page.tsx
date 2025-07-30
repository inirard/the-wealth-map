
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CircleDollarSign, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useI18n } from '@/hooks/use-i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';


export default function AuthPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { t } = useI18n();
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            await updateProfile(userCredential.user, { displayName: name });
        }
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: error.message,
        });
    } finally {
        setIsLoading(false);
    }
  }


  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        backgroundImage: `
          radial-gradient(circle at 10% 20%, hsl(var(--primary) / 0.1) 0, transparent 25%),
          radial-gradient(circle at 80% 90%, hsl(var(--accent) / 0.1) 0, transparent 25%)
        `
      }}></div>

      <main className="relative z-10 flex w-full max-w-md flex-col items-center justify-center text-center">
        <Link href="/" className="mb-8">
          <CircleDollarSign className="h-24 w-24 text-primary drop-shadow-lg" />
        </Link>
        <h1 className="font-headline text-5xl font-bold tracking-tight text-primary md:text-7xl">
          The Wealth Map
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80 md:text-xl">
          {t('welcome_subtitle')}
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-10">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to continue your journey.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2 relative">
                        <Label htmlFor="login-password">Password</Label>
                        <Input id="login-password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:bg-transparent hover:text-primary" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                 </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Start your journey to financial freedom today.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <form onSubmit={handleSignUp} className="space-y-4 text-left">
                     <div className="space-y-2">
                        <Label htmlFor="signup-name">{t('what_is_your_name')}</Label>
                        <Input id="signup-name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input id="signup-email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2 relative">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input id="signup-password" type={showPassword ? "text" : "password"} placeholder="Must be 6+ characters" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:bg-transparent hover:text-primary" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating Account..." : "Sign Up"}
                    </Button>
                 </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="absolute bottom-4 text-xs text-muted-foreground z-10">
        <div className="flex gap-4">
          <Link href="/legal/terms" className="hover:text-primary">{t('terms_of_service')}</Link>
          <Link href="/legal/privacy" className="hover:text-primary">{t('privacy_policy')}</Link>
        </div>
      </footer>
    </div>
  );
}
