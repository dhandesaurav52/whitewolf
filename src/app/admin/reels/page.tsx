
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, MoreHorizontal, Loader2 } from "lucide-react";
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
import * as db from '@/lib/firestore';


export default function ManageReelsPage() {
    const { toast } = useToast();
    const [reels, setReels] = useState<Reel[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [reelsData, productsData] = await Promise.all([
                db.reels.getAll(),
                db.products.getAll(),
            ]);
            setReels(reelsData);
            setProducts(productsData);
        } catch (error) {
             console.error("Error loading data from Firestore", error);
             toast({ title: "Error", description: "Could not load data.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        setIsMounted(true);
        loadData();
    }, [loadData]);


    const handleCreateReel = async (newReelData: Omit<Reel, 'id'>) => {
        try {
            const newReelWithId = await db.reels.add(newReelData);
            setReels([...reels, newReelWithId]);
            toast({
                title: "Reel Created",
                description: `The reel "${newReelWithId.reelTitle}" has been added.`,
            });
            setIsCreateDialogOpen(false);
        } catch (error) {
            toast({ title: "Error", description: "Could not create reel.", variant: "destructive" });
        }
    };
    
    const handleDeleteReel = async (reelId: string) => {
        try {
            await db.reels.remove(reelId);
            setReels(reels.filter(r => r.id !== reelId));
            toast({
                title: "Reel Deleted",
                description: "The reel has been successfully deleted.",
            });
        } catch (error) {
             toast({ title: "Error", description: "Could not delete reel.", variant: "destructive" });
        }
    }

    if (!isMounted) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8"/></div>;
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
                            {isLoading ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                            ) : reels.map((reel) => (
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
                                                <DropdownMenuItem disabled>Edit</DropdownMenuItem>
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
