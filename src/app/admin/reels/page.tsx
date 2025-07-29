
"use client";

import { useState } from "react";
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


type Reel = {
  id: string;
  reelTitle: string;
  linkedProduct: string;
};

export default function ManageReelsPage() {
    const [reels, setReels] = useState<Reel[]>([
        { id: "1", reelTitle: "Summer Vibes", linkedProduct: "Vintage Wash Tee" },
        { id: "2", reelTitle: "Urban Explorer", linkedProduct: "Slim-Fit Chinos" },
        { id: "3", reelTitle: "Office Look", linkedProduct: "Linen Button-Down" },
    ]);

    return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-4xl font-bold font-headline text-accent">Watch & Shop Reels</h1>
                 <Button>
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
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reels.map((reel) => (
                                <TableRow key={reel.id}>
                                    <TableCell className="font-medium">
                                        <Link href="#" className="text-accent hover:underline">{reel.reelTitle}</Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link href="#" className="text-accent hover:underline">{reel.linkedProduct}</Link>
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
                                                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
