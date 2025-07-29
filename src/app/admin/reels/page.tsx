
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Pencil, Trash2, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

type Reel = {
  productName: string;
  mainImage: string;
  mainAiHint: string;
  productImage: string;
  productAiHint: string;
  price: string;
  originalPrice?: string;
};

export default function ManageReelsPage() {
    const [reels, setReels] = useState<Reel[]>([
        {
          mainImage: "https://placehold.co/400x600.png",
          mainAiHint: "blue tshirt",
          productImage: "https://placehold.co/100x100.png",
          productAiHint: "orange shirt",
          productName: "Supima: Sparkling Orange",
          price: "999",
          originalPrice: "1199"
        },
        {
          mainImage: "https://placehold.co/400x600.png",
          mainAiHint: "stadium soccer",
          productImage: "https://placehold.co/100x100.png",
          productAiHint: "red backpack",
          productName: "Fcb: Legacy",
          price: "2999",
          originalPrice: ""
        },
        {
          mainImage: "https://placehold.co/400x600.png",
          mainAiHint: "bear mask",
          productImage: "https://placehold.co/100x100.png",
          productAiHint: "white tshirt space",
          productName: "Ted: Space",
          price: "1199",
          originalPrice: ""
        },
    ]);

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-4xl font-bold font-headline text-accent">Manage Reels</h1>
            <p className="text-muted-foreground">Here you can manage the "Watch and Shop" reels on your homepage.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-accent">Add New Reel</CardTitle>
                        <CardDescription>Fill out the form to add a new reel to the "Watch and Shop" section.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="product-name" className="text-accent">Product Name</Label>
                            <Input id="product-name" placeholder="e.g. Supima: Sparkling Orange" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-accent">Price (₹)</Label>
                                <Input id="price" type="number" placeholder="e.g. 999" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="original-price" className="text-accent">Original Price (₹)</Label>
                                <Input id="original-price" type="number" placeholder="e.g. 1199" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="main-image" className="text-accent">Main Image</Label>
                                <div className="flex items-center justify-center w-full">
                                    <Label htmlFor="main-image-dropzone" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span><br/>(400x600 recommended)</p>
                                        </div>
                                        <Input id="main-image-dropzone" type="file" className="hidden" />
                                    </Label>
                                </div> 
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="product-image" className="text-accent">Product Image</Label>
                                <div className="flex items-center justify-center w-full">
                                    <Label htmlFor="product-image-dropzone" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span><br/>(100x100 recommended)</p>
                                        </div>
                                        <Input id="product-image-dropzone" type="file" className="hidden" />
                                    </Label>
                                </div> 
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Add Reel</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-2xl font-headline text-accent">Manage Reels</CardTitle>
                                <CardDescription>View, edit, or delete existing reels.</CardDescription>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search reels..." className="pl-9 h-9" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Main Image</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reels.map((reel, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="relative h-24 w-16 rounded-md overflow-hidden">
                                                <Image src={reel.mainImage} alt={reel.productName} fill className="object-cover" data-ai-hint={reel.mainAiHint} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                                                    <Image src={reel.productImage} alt={reel.productName} fill className="object-cover" data-ai-hint={reel.productAiHint}/>
                                                </div>
                                                <span>{reel.productName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-semibold">₹{reel.price}</span>
                                                {reel.originalPrice && <span className="text-muted-foreground line-through text-xs">₹{reel.originalPrice}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
