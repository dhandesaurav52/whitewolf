
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { updateProfile } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Pencil, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { ProfileAddress } from "@/lib/types";
import * as db from '@/lib/firestore';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState({
      street: "",
      city: "",
      state: "",
      pincode: ""
  });
  
  useEffect(() => {
    if (user) {
      setIsDataLoading(true);
      setDisplayName(user.displayName || "");
      db.profiles.get(user.uid).then(profileData => {
        if (profileData) {
          setMobile(profileData.mobile || "");
          setAddress(profileData.address || { street: "", city: "", state: "", pincode: "" });
        }
      }).catch(e => {
        console.error("Failed to load profile data from Firestore", e);
        toast({ title: "Error", description: "Could not load your profile data.", variant: "destructive" });
      }).finally(() => {
        setIsDataLoading(false);
      });
    } else if (!loading) {
        setIsDataLoading(false);
    }
  }, [user, loading, toast]);

  if (loading || isDataLoading) {
    return (
      <div className="container mx-auto py-10">
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
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <div className="w-full space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-5 w-1/2" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h2 className="text-2xl font-semibold">Please log in</h2>
        <p className="text-muted-foreground mt-2">
          You need to be logged in to view your profile.
        </p>
      </div>
    );
  }
  
  const profileDetails = [
      { icon: User, label: "Full Name", value: displayName || "Not provided" },
      { icon: Mail, label: "Email Address", value: user.email || "Not provided" },
      { icon: Phone, label: "Mobile Number", value: mobile || "Not provided" },
      { icon: MapPin, label: "Address", value: address.street ? `${address.street}, ${address.city}, ${address.state} - ${address.pincode}` : "Not provided" },
  ];

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
        await updateProfile(user, { displayName });

        const profileData: ProfileAddress = { mobile, address };
        await db.profiles.set(user.uid, profileData);
        
        await refreshUser();
        toast({
            title: "Success",
            description: "Your profile has been updated.",
        });
        setIsEditing(false);
    } catch (error: any) {
        toast({
            title: "Error",
            description: "Failed to update profile. " + error.message,
            variant: "destructive",
        });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-headline text-accent">My Profile</h1>
                {!isEditing && (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                )}
            </div>
        
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-accent">{user.displayName || 'Welcome!'}</CardTitle>
                    <CardDescription>
                        Your personal account details.
                    </CardDescription>
                </CardHeader>
                {isEditing ? (
                    <CardContent className="space-y-6 pt-6 max-w-lg mx-auto">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-accent">Full Name</Label>
                            <Input id="fullName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-accent">Email Address</Label>
                            <Input id="email" value={user.email || ''} readOnly disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile" className="text-accent">Mobile Number</Label>
                            <Input id="mobile" placeholder="Enter your mobile number" value={mobile} onChange={e => setMobile(e.target.value)} disabled={isSaving} />
                        </div>
                        <div className="space-y-4">
                            <Label className="text-accent">Address</Label>
                            <div className="space-y-2">
                                <Input placeholder="Street" value={address.street} onChange={e => setAddress({...address, street: e.target.value})} disabled={isSaving}/>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input placeholder="City" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} disabled={isSaving}/>
                                <Input placeholder="State" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} disabled={isSaving}/>
                                <Input placeholder="Pincode" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} disabled={isSaving}/>
                            </div>
                        </div>
                        <CardFooter className="px-0 pb-0 pt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className="animate-spin" /> : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </CardContent>
                ) : (
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
                )}
            </Card>
        </div>
    </div>
  );
}
