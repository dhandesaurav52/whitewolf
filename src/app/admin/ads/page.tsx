
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, Tag } from "lucide-react";
import type { Advertisement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


const initialAds: Advertisement[] = [
    { id: '1', text: '20% off all T-Shirts for a limited time!' },
    { id: '2', text: 'Free shipping on orders over ₹1000.' },
    { id: '3', text: 'New summer collection just dropped. Shop now!' },
];

export default function AdvertiseOffersPage() {
    const [ads, setAds] = useState<Advertisement[]>(initialAds);
    const [newAdText, setNewAdText] = useState("");
    const { toast } = useToast();

    const handleAddAd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAdText.trim()) {
            toast({
                title: "Error",
                description: "Advertisement text cannot be empty.",
                variant: "destructive",
            });
            return;
        }

        const newAd: Advertisement = {
            id: (ads.length + 1).toString(),
            text: newAdText,
        };

        setAds(prev => [...prev, newAd]);
        setNewAdText("");
        toast({
            title: "Success",
            description: "New advertisement added.",
        });
    };

    const handleDeleteAd = (id: string) => {
        setAds(prev => prev.filter(ad => ad.id !== id));
        toast({
            title: "Advertisement Removed",
            description: "The ad has been successfully deleted.",
        });
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-4xl font-bold font-headline text-accent">Advertise & Offers</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Advertisements</CardTitle>
                            <CardDescription>View, add, or delete the scrolling advertisements shown on the site.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Advertisement Text</TableHead>
                                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ads.length > 0 ? ads.map((ad) => (
                                        <TableRow key={ad.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Tag className="h-4 w-4 text-muted-foreground" />
                                                {ad.text}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteAd(ad.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                                                No advertisements found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Add New Ad</CardTitle>
                            <CardDescription>Create a new scrolling advertisement.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <form onSubmit={handleAddAd} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ad-text" className="text-accent">Ad Text</Label>
                                    <Input 
                                        id="ad-text" 
                                        placeholder="e.g., Free shipping today!" 
                                        value={newAdText}
                                        onChange={(e) => setNewAdText(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Advertisement
                                </Button>
                           </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
