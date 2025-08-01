
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
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
import Image from "next/image";
import CreateHeroDialog from "@/components/CreateHeroDialog";
import { uploadFile, storage } from "@/lib/firebase";
import * as db from "@/lib/firestore";

const productCategories = [
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'belts', label: 'Belts' },
    { value: 'chains', label: 'Chains' },
    { value: 'watches', label: 'Watches' },
    { value: 'headwear', label: 'Headwear' },
    { value: 'eyewear', label: 'Eyewear' },
    { value: 'bags', label: 'Bags' },
    { value: 'wallets', label: 'Wallets' },
    { value: 'ties', label: 'Ties' },
];


export default function AdvertiseOffersPage() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const { toast } = useToast();
    const [isCreateOfferDialogOpen, setIsCreateOfferDialogOpen] = useState(false);
    const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Advertisement | null>(null);
    const [editingHero, setEditingHero] = useState<Advertisement | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isSavingHero, setIsSavingHero] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const loadAds = useCallback(async () => {
        setIsLoading(true);
        try {
            const adsData = await db.ads.getAll();
            setAds(adsData);
        } catch (error) {
            console.error("Failed to load ads from Firestore", error);
            toast({ title: "Error", description: "Could not load ads.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        setIsMounted(true);
        loadAds();
    }, [loadAds]);

    const handleDeleteAd = async (id: string) => {
        try {
            await db.ads.remove(id);
            setAds(ads.filter(ad => ad.id !== id));
            toast({
                title: "Item Removed",
                description: "The item has been successfully deleted.",
            });
        } catch (error) {
            toast({ title: "Error", description: "Could not delete item.", variant: "destructive" });
        }
    };

    const handleCreateOffer = async (newOfferData: { text: string; discountType: any; discountValue: string; buyQuantity: string, getQuantity: string, appliesTo: any; selectedCategories: string[]; isActive: boolean; }) => {
        const newAd: Omit<Advertisement, 'id'> = {
            text: newOfferData.text,
            discountType: newOfferData.discountType,
            discountValue: parseFloat(newOfferData.discountValue) || 0,
            buyQuantity: parseInt(newOfferData.buyQuantity) || undefined,
            getQuantity: parseInt(newOfferData.getQuantity) || undefined,
            appliesTo: newOfferData.appliesTo,
            selectedCategories: newOfferData.selectedCategories,
            status: newOfferData.isActive ? 'Active' : 'Inactive',
        };
        try {
            const addedAd = await db.ads.add(newAd);
            setAds([...ads, addedAd]);
            toast({
                title: "Offer Created",
                description: "The new promotional offer has been successfully added.",
            });
            setIsCreateOfferDialogOpen(false);
        } catch(error) {
            toast({ title: "Error", description: "Could not create offer.", variant: "destructive" });
        }
    };

    const handleUpdateOffer = async (updatedOfferData: { text: string; discountType: any; discountValue: string; buyQuantity: string, getQuantity: string, appliesTo: any; selectedCategories: string[]; isActive: boolean; }) => {
        if (!editingOffer) return;

        const updatedAd: Advertisement = {
            ...editingOffer,
            text: updatedOfferData.text,
            discountType: updatedOfferData.discountType,
            discountValue: parseFloat(updatedOfferData.discountValue) || 0,
            buyQuantity: parseInt(updatedOfferData.buyQuantity) || undefined,
            getQuantity: parseInt(updatedOfferData.getQuantity) || undefined,
            appliesTo: updatedOfferData.appliesTo,
            selectedCategories: updatedOfferData.selectedCategories,
            status: updatedOfferData.isActive ? 'Active' : 'Inactive',
        };
        try {
            await db.ads.update(updatedAd.id, updatedAd);
            setAds(ads.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
            toast({
                title: "Offer Updated",
                description: "The promotional offer has been successfully updated.",
            });
            setEditingOffer(null);
        } catch (error) {
            toast({ title: "Error", description: "Could not update offer.", variant: "destructive" });
        }
    };
    
    const handleSaveHero = async (heroData: Partial<Advertisement>, imageFile: File | null) => {
        setIsSavingHero(true);
        if (!storage && imageFile) {
            toast({
                title: "Firebase Not Configured",
                description: "Please set up your Firebase credentials in the .env file to upload media.",
                variant: "destructive",
            });
            setIsSavingHero(false);
            return;
        }

        try {
            let imageUrl = heroData.heroImageUrl;
            if (imageFile) {
                imageUrl = await uploadFile(imageFile, `hero-banners/${Date.now()}-${imageFile.name}`);
            }

            const finalHeroData = { ...heroData, heroImageUrl: imageUrl };

            if (editingHero) { // Update existing
                const updatedHero = { ...editingHero, ...finalHeroData, status: finalHeroData.status || editingHero.status };
                await db.ads.update(editingHero.id, updatedHero);
                setAds(ads.map(ad => ad.id === editingHero.id ? updatedHero : ad));
                toast({ title: "Hero Updated", description: "The hero banner has been successfully updated." });
            } else { // Create new
                const newHeroAd: Omit<Advertisement, 'id'> = {
                    text: 'Hero Banner',
                    appliesTo: 'hero',
                    status: 'Active',
                    discountType: 'fixed',
                    discountValue: 0,
                    selectedCategories: [],
                    ...finalHeroData
                };
                const addedHero = await db.ads.add(newHeroAd);
                setAds(prevAds => [...prevAds, addedHero]);
                toast({ title: "Hero Created", description: "The new hero banner has been added." });
            }
        } catch (error) {
             console.error("Error saving hero: ", error);
             toast({
                title: "Save Failed",
                description: "There was an error saving the hero banner.",
                variant: "destructive",
            });
        } finally {
            setIsSavingHero(false);
            setEditingHero(null);
            setIsHeroDialogOpen(false);
        }
    };
    
    const getDiscountDisplay = (ad: Advertisement) => {
        if (ad.discountType === 'buy-x-get-y') {
            return `Buy ${ad.buyQuantity || 'X'} Get ${ad.getQuantity || 'Y'}`;
        }
        if (!ad.discountValue) return 'N/A';
        return ad.discountType === 'percentage' ? `${ad.discountValue}%` : `₹${ad.discountValue}`;
    }
    
    const getAppliesToDisplay = (ad: Advertisement) => {
        if (ad.appliesTo === 'categories') {
            const categoryLabels = ad.selectedCategories.map(catValue => 
                productCategories.find(c => c.value === catValue)?.label || catValue
            ).join(', ');
            return `Categories (${categoryLabels || 'None'})`
        }
        if (ad.appliesTo === 'products') {
            return 'Specific Products' // This can be expanded later
        }
        return "All Orders";
    }

    if (!isMounted) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8"/></div>;
    }

    const nonHeroAds = ads.filter(ad => ad.appliesTo !== 'hero');
    const heroAds = ads.filter(ad => ad.appliesTo === 'hero');

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-4xl font-bold font-headline text-accent">Advertise & Offers</h1>
            
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Manage Hero Section</CardTitle>
                        <CardDescription>Update the main rotating banners on the homepage.</CardDescription>
                    </div>
                    <Button onClick={() => { setEditingHero(null); setIsHeroDialogOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Hero
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead>Headline</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="animate-spin mx-auto"/></TableCell></TableRow>
                            ) : heroAds.length > 0 ? heroAds.map((ad) => (
                                <TableRow key={ad.id}>
                                    <TableCell>
                                        <Image src={ad.heroImageUrl || "https://placehold.co/100x100.png"} alt={ad.heroHeadline || "Hero Image"} width={80} height={45} className="rounded-md object-cover" />
                                    </TableCell>
                                    <TableCell className="font-medium">{ad.heroHeadline}</TableCell>
                                    <TableCell>
                                        <Badge variant={ad.status === 'Active' ? "default" : "outline"} className={ad.status === 'Active' ? 'bg-primary text-primary-foreground' : ''}>
                                            {ad.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingHero(ad); setIsHeroDialogOpen(true); }}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteAd(ad.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No hero banners found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Current Offers & Advertisements</CardTitle>
                        <CardDescription>Manage your promotional offers and view their status.</CardDescription>
                    </div>
                     <Button onClick={() => setIsCreateOfferDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Offer
                    </Button>
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
                             {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="text-center"><Loader2 className="animate-spin mx-auto"/></TableCell></TableRow>
                            ) : nonHeroAds.length > 0 ? nonHeroAds.map((ad) => (
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
                                        No promotional offers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isCreateOfferDialogOpen && (
                <CreateOfferDialog
                    isOpen={isCreateOfferDialogOpen}
                    onClose={() => setIsCreateOfferDialogOpen(false)}
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
            {isHeroDialogOpen && (
                 <CreateHeroDialog
                    isOpen={isHeroDialogOpen}
                    onClose={() => { setEditingHero(null); setIsHeroDialogOpen(false); }}
                    onSave={handleSaveHero}
                    hero={editingHero}
                    isSaving={isSavingHero}
                />
            )}
        </div>
    );
}

