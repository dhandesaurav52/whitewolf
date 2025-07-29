
"use client";

import { useState, useEffect } from "react";
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
import CreateOfferDialog from "@/components/CreateOfferDialog";
import EditOfferDialog from "@/components/EditOfferDialog";

const ADS_STORAGE_KEY = 'advertisements';

const initialAds: Advertisement[] = [
    { id: '1', text: '20% off all T-Shirts for a limited time!', discountType: 'percentage', discountValue: 20, appliesTo: 'categories', selectedCategories: ['t-shirts'], status: 'Active' },
    { id: '2', text: 'Free shipping on orders over ₹1000.', discountType: 'fixed', discountValue: 0, appliesTo: 'products', selectedCategories: [], status: 'Active' },
    { id: '3', text: 'New summer collection just dropped. Shop now!', discountType: 'fixed', discountValue: 0, appliesTo: 'products', selectedCategories: [], status: 'Inactive' },
];

const productCategories = [
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'accessories', label: 'Accessories' },
];


export default function AdvertiseOffersPage() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const { toast } = useToast();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Advertisement | null>(null);

    useEffect(() => {
        try {
            const storedAds = localStorage.getItem(ADS_STORAGE_KEY);
            if (storedAds) {
                setAds(JSON.parse(storedAds));
            } else {
                setAds(initialAds);
                localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(initialAds));
            }
        } catch (error) {
            console.error("Failed to load ads from localStorage", error);
            setAds(initialAds);
        }
    }, []);

    const updateAds = (newAds: Advertisement[]) => {
        setAds(newAds);
        try {
            localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(newAds));
        } catch (error) {
            console.error("Failed to save ads to localStorage", error);
            toast({
                title: "Storage Error",
                description: "Could not save changes to local storage.",
                variant: "destructive"
            });
        }
    }

    const handleDeleteAd = (id: string) => {
        const newAds = ads.filter(ad => ad.id !== id);
        updateAds(newAds);
        toast({
            title: "Advertisement Removed",
            description: "The ad has been successfully deleted.",
        });
    };

    const handleCreateOffer = (newOfferData: { text: string; discountType: any; discountValue: string; appliesTo: any; selectedCategories: string[]; isActive: boolean; }) => {
        const newAd: Advertisement = {
            id: `ad_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            text: newOfferData.text,
            discountType: newOfferData.discountType,
            discountValue: parseFloat(newOfferData.discountValue) || 0,
            appliesTo: newOfferData.appliesTo,
            selectedCategories: newOfferData.selectedCategories,
            status: newOfferData.isActive ? 'Active' : 'Inactive',
        };

        updateAds([...ads, newAd]);
        toast({
            title: "Offer Created",
            description: "The new promotional offer has been successfully added.",
        });
        setIsCreateDialogOpen(false);
    };

    const handleUpdateOffer = (updatedOfferData: { text: string; discountType: any; discountValue: string; appliesTo: any; selectedCategories: string[]; isActive: boolean; }) => {
        if (!editingOffer) return;

        const updatedAd: Advertisement = {
            ...editingOffer,
            text: updatedOfferData.text,
            discountType: updatedOfferData.discountType,
            discountValue: parseFloat(updatedOfferData.discountValue) || 0,
            appliesTo: updatedOfferData.appliesTo,
            selectedCategories: updatedOfferData.selectedCategories,
            status: updatedOfferData.isActive ? 'Active' : 'Inactive',
        };

        updateAds(ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
        toast({
            title: "Offer Updated",
            description: "The promotional offer has been successfully updated.",
        });
        setEditingOffer(null);
    };
    
    const getDiscountDisplay = (ad: Advertisement) => {
        if (!ad.discountValue) return 'N/A';
        return ad.discountType === 'percentage' ? `${ad.discountValue}%` : `₹${ad.discountValue}`;
    }
    
    const getAppliesToDisplay = (ad: Advertisement) => {
        if (ad.appliesTo === 'categories') {
            return `Categories (${ad.selectedCategories.length})`
        }
        if (ad.appliesTo === 'products') {
            return 'Specific Products' // This can be expanded later
        }
        return "All Orders";
    }


    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold font-headline text-accent">Advertise & Offers</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                                    <TableCell>{getDiscountDisplay(ad)}</TableCell>
                                    <TableCell>{getAppliesToDisplay(ad)}</TableCell>
                                    <TableCell>
                                        <Badge variant={ad.status === 'Active' ? "default" : "outline"} className={ad.status === 'Active' ? 'bg-primary text-primary-foreground' : ''}>
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
                                                <DropdownMenuItem onClick={() => setEditingOffer(ad)}>Edit</DropdownMenuItem>
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

            {isCreateDialogOpen && (
                <CreateOfferDialog
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onSave={handleCreateOffer}
                    categories={productCategories}
                />
            )}
            {editingOffer && (
                <EditOfferDialog
                    isOpen={!!editingOffer}
                    onClose={() => setEditingOffer(null)}
                    onSave={handleUpdateOffer}
                    offer={editingOffer}
                    categories={productCategories}
                />
            )}
        </div>
    );
}
