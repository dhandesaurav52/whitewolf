
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, UploadCloud } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ADS_STORAGE_KEY = 'advertisements';
const HERO_AD_ID = 'hero_banner_ad';

const generateUniqueId = () => `ad_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;

const initialAds: Advertisement[] = [
    { id: generateUniqueId(), text: '20% off all T-Shirts for a limited time!', discountType: 'percentage', discountValue: 20, appliesTo: 'categories', selectedCategories: ['t-shirts'], status: 'Active' },
    { id: generateUniqueId(), text: 'Free shipping on orders over ₹1000.', discountType: 'fixed', discountValue: 0, appliesTo: 'products', selectedCategories: [], status: 'Active' },
    { id: generateUniqueId(), text: 'New summer collection just dropped. Shop now!', discountType: 'fixed', discountValue: 0, appliesTo: 'products', selectedCategories: [], status: 'Inactive' },
];

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
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Advertisement | null>(null);

    // State for hero section
    const [heroHeadline, setHeroHeadline] = useState("Define Your Style");
    const [heroSubtext, setHeroSubtext] = useState("Timeless style, uncompromising quality, and conscious craftsmanship for the modern individual.");
    const [heroButton, setHeroButton] = useState("Shop New Arrivals");
    const [heroImage, setHeroImage] = useState<string | null>("https://placehold.co/1600x900.png");

    const updateAds = useCallback((newAds: Advertisement[]) => {
        setAds(newAds);
        try {
            localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(newAds));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Failed to save ads to localStorage", error);
            toast({
                title: "Storage Error",
                description: "Could not save changes to local storage.",
                variant: "destructive"
            });
        }
    }, [toast]);

    useEffect(() => {
        try {
            const storedAds = localStorage.getItem(ADS_STORAGE_KEY);
            if (storedAds) {
                const parsedAds = JSON.parse(storedAds);
                setAds(parsedAds);
                const heroAd = parsedAds.find((ad: Advertisement) => ad.id === HERO_AD_ID);
                if (heroAd) {
                    setHeroHeadline(heroAd.heroHeadline || "");
                    setHeroSubtext(heroAd.heroSubtext || "");
                    setHeroButton(heroAd.heroButton || "");
                    setHeroImage(heroAd.heroImageUrl || null);
                }
            } else {
                setAds(initialAds);
                localStorage.setItem(ADS_STORAGE_KEY, JSON.stringify(initialAds));
            }
        } catch (error) {
            console.error("Failed to load ads from localStorage", error);
            setAds(initialAds);
        }
    }, []);

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
            id: generateUniqueId(),
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

    const handleSaveHero = () => {
        const heroAd: Advertisement = {
            id: HERO_AD_ID,
            text: 'Hero Banner',
            appliesTo: 'hero',
            status: 'Active',
            discountType: 'fixed',
            discountValue: 0,
            selectedCategories: [],
            heroHeadline: heroHeadline,
            heroSubtext: heroSubtext,
            heroButton: heroButton,
            heroImageUrl: heroImage || '',
        };

        const otherAds = ads.filter(ad => ad.id !== HERO_AD_ID);
        updateAds([...otherAds, heroAd]);
        toast({
            title: "Hero Section Updated",
            description: "The homepage hero banner has been saved.",
        });
    };
    
    const getDiscountDisplay = (ad: Advertisement) => {
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

    const nonHeroAds = ads.filter(ad => ad.appliesTo !== 'hero');


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
                    <CardTitle>Manage Hero Section</CardTitle>
                    <CardDescription>Update the main banner on the homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="hero-headline" className="text-accent">Headline</Label>
                        <Input id="hero-headline" value={heroHeadline} onChange={e => setHeroHeadline(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero-subtext" className="text-accent">Subtext</Label>
                        <Textarea id="hero-subtext" value={heroSubtext} onChange={e => setHeroSubtext(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="hero-button" className="text-accent">Button Text</Label>
                        <Input id="hero-button" value={heroButton} onChange={e => setHeroButton(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="hero-image" className="text-accent">Hero Image</Label>
                        <div className="flex items-center justify-center w-full">
                            <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Drag & drop an image,</span> or click to select</p>
                                </div>
                                <Input id="dropzone-file" type="file" className="hidden" accept="image/*" />
                            </Label>
                        </div> 
                    </div>
                    <Button onClick={handleSaveHero}>Save Hero Section</Button>
                </CardContent>
            </Card>
            
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
                            {nonHeroAds.length > 0 ? nonHeroAds.map((ad) => (
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
