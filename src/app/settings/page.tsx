
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from 'next-themes';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { theme, setTheme } = useTheme();
  const { isAdmin, deleteAccount } = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async () => {
    try {
        await deleteAccount();
        toast({
            title: "Account Deleted",
            description: "Your account has been permanently deleted.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "Failed to delete account.",
        });
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold font-headline text-accent">Settings</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-accent">Notifications</CardTitle>
            <CardDescription>
              Manage how you receive notifications from us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4 flex justify-between items-center">
                <div>
                    <Label htmlFor="email-notifications" className="font-medium text-base text-primary">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates on new products and offers.</p>
                </div>
                <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-accent">Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Label className="text-base text-primary">Theme</Label>
             <div className="grid grid-cols-3 gap-4">
                {!mounted ? (
                  <>
                    <Skeleton className="h-[98px] w-full" />
                    <Skeleton className="h-[98px] w-full" />
                    <Skeleton className="h-[98px] w-full" />
                  </>
                ) : (
                  <>
                    <button 
                        className={cn(
                            "p-4 rounded-lg border-2 text-center space-y-2 transition-colors",
                            theme === 'light' ? 'border-accent bg-accent/10' : 'border-input hover:bg-muted'
                        )}
                        onClick={() => setTheme('light')}
                    >
                        <div className="p-2 rounded-md bg-white border border-gray-200">
                             <div className="space-y-1">
                                <div className="h-2 w-full rounded-sm bg-gray-200" />
                                <div className="h-2 w-3/4 rounded-sm bg-gray-300" />
                             </div>
                        </div>
                        <span className={cn("text-sm", theme === 'light' ? 'text-accent' : 'text-muted-foreground')}>Light</span>
                    </button>
                     <button 
                        className={cn(
                            "p-4 rounded-lg border-2 text-center space-y-2 transition-colors",
                            theme === 'dark' ? 'border-accent bg-accent/10' : 'border-input hover:bg-muted'
                        )}
                        onClick={() => setTheme('dark')}
                    >
                        <div className="p-2 rounded-md bg-[#09090B] border border-gray-700">
                            <div className="space-y-1">
                                <div className="h-2 w-full rounded-sm bg-gray-600" />
                                <div className="h-2 w-3/4 rounded-sm bg-blue-500" />
                             </div>
                        </div>
                        <span className={cn("text-sm", theme === 'dark' ? 'text-accent' : 'text-muted-foreground')}>Dark</span>
                    </button>
                     <button 
                        className={cn(
                            "p-4 rounded-lg border-2 text-center space-y-2 transition-colors",
                            theme === 'system' ? 'border-accent bg-accent/10' : 'border-input hover:bg-muted'
                        )}
                        onClick={() => setTheme('system')}
                    >
                        <div className="p-2 rounded-md bg-white border border-gray-200 overflow-hidden relative h-[40px]">
                            <div className="absolute top-0 left-0 h-full w-1/2 bg-[#09090B] border-r border-gray-700"></div>
                             <div className="space-y-1 relative z-10">
                                <div className="h-2 w-full rounded-sm bg-gray-400" />
                                <div className="h-2 w-3/4 rounded-sm bg-gray-500" />
                             </div>
                        </div>
                        <span className={cn("text-sm", theme === 'system' ? 'text-accent' : 'text-muted-foreground')}>System</span>
                    </button>
                  </>
                )}
             </div>
          </CardContent>
        </Card>

        {!isAdmin && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-destructive">Account Management</CardTitle>
                    <CardDescription>
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
