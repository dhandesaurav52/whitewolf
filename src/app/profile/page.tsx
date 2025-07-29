
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                         <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                         <div className="flex justify-end">
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold">Please log in</h2>
        <p className="text-muted-foreground mt-2">
          You need to be logged in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline">
            {user.displayName || "Your Profile"}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Personal Information</CardTitle>
            <CardDescription>
                Your personal details as provided during sign-up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={user.displayName || ''} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={user.email || ''} disabled />
            </div>
            <div className="space-y-1">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" placeholder="No mobile number provided" disabled />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-accent">Shipping Address</CardTitle>
             <CardDescription>
                Your primary address for order delivery.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="123 Style St, Fashion City" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="e.g. Mumbai" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="e.g. 400001" />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" placeholder="e.g. Maharashtra" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value="India" disabled />
                </div>
            </div>
            <div className="flex justify-end">
                <Button>Save Address</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
