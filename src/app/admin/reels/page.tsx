
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import CreateReelDialog from "@/components/CreateReelDialog";
import type { Reel, Product as ProductType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";


const REELS_STORAGE_KEY = 'reels';
const PRODUCTS_STORAGE_KEY = 'products';

const initialReels: Reel[] = [];

export default function ManageReelsPage() {
    const { toast } = useToast();
    const [reels, setReels] = useState<Reel[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        try {
            const storedReels = localStorage.getItem(REELS_STORAGE_KEY);
            setReels(storedReels ? JSON.parse(storedReels) : initialReels);

            const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            setProducts(storedProducts ? JSON.parse(storedProducts) : []);
        } catch (error) {
            console.error("Error loading data from localStorage", error);
            setReels(initialReels);
        }
    }, []);

    const updateReels = (newReels: Reel[]) => {
        setReels(newReels);
        localStorage.setItem(REELS_STORAGE_KEY, JSON.stringify(newReels));
    };

    const handleCreateReel = (newReelData: Omit<Reel, 'id'>) => {
        const newReelWithId = { ...newReelData, id: `reel_${Date.now()}` };
        updateReels([...reels, newReelWithId]);
        toast({
            title: "Reel Created",
            description: `The reel "${newReelWithId.reelTitle}" has been added.`,
        });
        setIsCreateDialogOpen(false);
    };
    
    const handleDeleteReel = (reelId: string) => {
        const newReels = reels.filter(r => r.id !== reelId);
        updateReels(newReels);
        toast({
            title: "Reel Deleted",
            description: "The reel has been successfully deleted.",
        });
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-4xl font-bold font-headline text-accent">Watch & Shop Reels</h1>
                 <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Reel
                 </Button>
            </div>
           
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Manage Reels</CardTitle>
                    <CardDescription>Add, edit, or delete reels for the "Watch and Shop" section.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Reel Title</TableHead>
                                <TableHead>Linked Product</TableHead>
                                <TableHead>Video</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reels.map((reel) => (
                                <TableRow key={reel.id}>
                                    <TableCell className="font-medium">
                                        <Link href={reel.videoUrl || '#'} target="_blank" className="text-accent hover:underline">{reel.reelTitle}</Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href="#" className="text-accent hover:underline">{reel.linkedProduct}</Link>
                                    </TableCell>
                                    <TableCell>
                                        <a href={reel.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                                            Watch Reel
                                        </a>
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
                                                    onClick={() => handleDeleteReel(reel.id)} 
                                                    className="text-destructive"
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isCreateDialogOpen && (
                <CreateReelDialog 
                    isOpen={isCreateDialogOpen}
                    onClose={() => setIsCreateDialogOpen(false)}
                    onSave={handleCreateReel}
                    products={products}
                />
            )}
        </div>
    );
}
