
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Pencil } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-40 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-5 w-1/2" />
                    </div>
                </div>
            </CardContent>
        </Card>
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
  
  const profileDetails = [
      { icon: User, label: "Full Name", value: user.displayName || "Not provided" },
      { icon: Mail, label: "Email Address", value: user.email || "Not provided" },
      { icon: Phone, label: "Mobile Number", value: user.phoneNumber || "Not provided" },
      { icon: MapPin, label: "Address", value: "Not provided" },
  ];

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
             <h1 className="text-4xl font-bold font-headline text-accent">My Profile</h1>
             <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
             </Button>
        </div>
      
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline text-accent">{user.displayName || 'Welcome!'}</CardTitle>
            <CardDescription>
                Your personal account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6 max-w-lg mx-auto">
            {profileDetails.map((detail, index) => (
                 <div key={index} className="flex items-start gap-4">
                    <detail.icon className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="w-full">
                        <p className="text-sm text-muted-foreground">{detail.label}</p>
                        <p className="text-base text-primary font-medium">{detail.value}</p>
                    </div>
                 </div>
            ))}
          </CardContent>
        </Card>
    </div>
  );
}
