
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, ShoppingCart, Package, Users, UploadCloud, Pencil, Trash2, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import EditProductDialog from "@/components/EditProductDialog";

type Product = {
  name: string;
  image: string;
  aiHint: string;
  category: string;
  price: string;
  stock: number;
  brand?: string;
  description?: string;
  colors?: string;
  textSizes?: string;
  numericSizes?: string;
  isNew?: boolean;
};

export default function AdminDashboardPage() {
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
    };

    const handleSave = (updatedProduct: Product) => {
        // Here you would typically update the product in your database
        console.log("Saving product:", updatedProduct);
        setEditingProduct(null);
    };


    const stats = [
        { title: "Total Revenue", value: "₹4,800", description: "Based on delivered orders", icon: BarChart },
        { title: "New Orders", value: "15", description: "Orders pending fulfillment", icon: ShoppingCart },
        { title: "Products in Stock", value: "13", description: "Total active products", icon: Package },
        { title: "Total Users", value: "2", description: "Unique customers with orders", icon: Users },
    ];

    const products: Product[] = [
      {
        name: "Vintage Wash Tee",
        image: "https://placehold.co/100x100.png",
        aiHint: "streetwear fashion",
        category: "T-Shirts",
        price: "1299",
        stock: 50,
        brand: "White Wolf",
        description: "A classic oversized tee with a vintage wash.",
        colors: "Charcoal, Black",
        textSizes: "S, M, L, XL",
        isNew: true
      },
      {
        name: "Slim-Fit Chinos",
        image: "https://placehold.co/100x100.png",
        aiHint: "mens trousers",
        category: "Trousers",
        price: "1599",
        stock: 30,
        brand: "Urban Threads",
        description: "Versatile slim-fit chinos for any occasion.",
        colors: "Beige, Navy",
        numericSizes: "30, 32, 34, 36",
        isNew: false
      },
      {
        name: "Linen Button-Down",
        image: "https://placehold.co/100x100.png",
        aiHint: "summer shirt",
        category: "Shirts",
        price: "1499",
        stock: 45,
        brand: "White Wolf",
        description: "A breathable linen shirt, perfect for summer.",
        colors: "White, Sky Blue",
        textSizes: "M, L, XL",
        isNew: false
      },
       {
        name: "Dark Wash Jeans",
        image: "https://placehold.co/100x100.png",
        aiHint: "denim jeans",
        category: "Jeans",
        price: "1899",
        stock: 25,
        brand: "Denim Co.",
        description: "Classic dark wash jeans with a modern fit.",
        colors: "Indigo",
        numericSizes: "28, 30, 32, 34, 36",
        isNew: false
      },
    ];

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-4xl font-bold font-headline text-accent">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-accent">Add New Product</CardTitle>
                        <CardDescription>Fill out the form below to add a new product to your store.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2">
                            <Label htmlFor="product-name" className="text-accent">Product Name</Label>
                            <Input id="product-name" placeholder="e.g. Charcoal Crew-Neck Tee" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand-name" className="text-accent">Brand Name</Label>
                            <Input id="brand-name" placeholder="e.g. White Wolf" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-accent">Price</Label>
                                <Input id="price" type="number" placeholder="e.g. 999" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="category" className="text-accent">Category</Label>
                                <Select>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                                        <SelectItem value="shirts">Shirts</SelectItem>
                                        <SelectItem value="jeans">Jeans</SelectItem>
                                        <SelectItem value="trousers">Trousers</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-accent">Description</Label>
                            <Textarea id="description" placeholder="e.g. A classic crew-neck t-shirt..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="colors" className="text-accent">Colors (comma-separated)</Label>
                            <Input id="colors" placeholder="e.g., Black, White, Blue" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="text-sizes" className="text-accent">Text-based Sizes (comma-separated)</Label>
                                <Input id="text-sizes" placeholder="e.g., S, M, L, XL, XXL" />
                            </div>
                           <div className="space-y-2">
                               <Label htmlFor="numeric-sizes" className="text-accent">Numeric Sizes (comma-separated)</Label>
                               <Input id="numeric-sizes" placeholder="e.g., 28, 30, 32" />
                           </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="product-images" className="text-accent">Product Images</Label>
                            <div className="flex items-center justify-center w-full">
                                <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Drag & drop files here,</span> or click to select files</p>
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" multiple />
                                </Label>
                            </div> 
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="new-arrival" />
                            <Label htmlFor="new-arrival">Mark as New Arrival</Label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Add Product</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-2xl font-headline text-accent">Manage Products</CardTitle>
                                <CardDescription>View, edit, or delete products currently in your store.</CardDescription>
                             </div>
                             <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search products..." className="pl-9 h-9" />
                                </div>
                                <Select>
                                    <SelectTrigger className="w-[180px] h-9">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        <SelectItem value="t-shirts">T-Shirts</SelectItem>
                                        <SelectItem value="shirts">Shirts</SelectItem>
                                        <SelectItem value="jeans">Jeans</SelectItem>
                                        <SelectItem value="trousers">Trousers</SelectItem>
                                        <SelectItem value="accessories">Accessories</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Image</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                                <Image src={product.image} alt={product.name} fill className="object-cover" data-ai-hint={product.aiHint} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>₹{product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
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
            {editingProduct && (
                <EditProductDialog
                    product={editingProduct}
                    onSave={handleSave}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    );

    