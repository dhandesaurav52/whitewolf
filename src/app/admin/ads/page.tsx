"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import type { Advertisement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialAds: Advertisement[] = [
    { id: '1', text: '20% off all T-Shirts for a limited time!', discount: '20%', appliesTo: 'Categories (1)', status: 'Active' },
    { id: '2', text: 'Free shipping on orders over ₹1000.', discount: 'N/A', appliesTo: 'All Orders', status: 'Active' },
    { id: '3', text: 'New summer collection just dropped. Shop now!', discount: 'N/A', appliesTo: 'All Visitors', status: 'Inactive' },
];

export default function AdvertiseOffersPage() {
    const [ads, setAds] = useState<Advertisement[]>(initialAds);
    const { toast } = useToast();

    const handleDeleteAd = (id: string) => {
        setAds(prev => prev.filter(ad => ad.id !== id));
        toast({
            title: "Advertisement Removed",
            description: "The ad has been successfully deleted.",
        });
    };

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-headline text-accent">Advertise & Offers</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Offer
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Current Offers & Advertisements</CardTitle>
                    <CardDescription>Manage your promotional offers and view their status.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/2">Offer Name</TableHead>
                                <TableHead>Discount</TableHead>
                                <TableHead>Applies To</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ads.length > 0 ? ads.map((ad) => (
                                <TableRow key={ad.id}>
                                    <TableCell className="font-medium">{ad.text}</TableCell>
                                    <TableCell>{ad.discount}</TableCell>
                                    <TableCell>{ad.appliesTo}</TableCell>
                                    <TableCell>
                                        <Badge variant={ad.status === 'Active' ? "default" : "outline"} className={ad.status === 'Active' ? 'bg-primary' : ''}>
                                            {ad.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteAd(ad.id)} 
                                                    className="text-destructive"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                        No offers or advertisements found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}