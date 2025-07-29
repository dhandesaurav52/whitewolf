
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, ShoppingCart, Package, Users, UploadCloud, Pencil, Trash2, Search, Check, ChevronsUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import EditProductDialog from "@/components/EditProductDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { Product as ProductType, Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2 } from "lucide-react";


const PRODUCTS_STORAGE_KEY = 'products';
const ORDERS_STORAGE_KEY = 'orders';

const initialProducts: ProductType[] = [];

const generateUniqueId = () => `prod_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;

const categoriesList = [
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'accessories', label: 'Accessories' },
];

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
    const [categories, setCategories] = useState(categoriesList);
    const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
    
    // Form state
    const [newProductName, setNewProductName] = useState('');
    const [newBrandName, setNewBrandName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newSelectedCategory, setNewSelectedCategory] = useState('');
    const [newDisplaySection, setNewDisplaySection] = useState<'shop' | 'accessories'>('shop');
    const [newDescription, setNewDescription] = useState('');
    const [newColors, setNewColors] = useState('');
    const [newTextSizes, setNewTextSizes] = useState('');
    const [newNumericSizes, setNewNumericSizes] = useState('');
    const [isNewArrival, setIsNewArrival] = useState(false);
    const [newStock, setNewStock] = useState(0);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const loadData = () => {
            let storedProducts: ProductType[] = [];
            try {
                const productsFromStorage = localStorage.getItem(PRODUCTS_STORAGE_KEY);
                storedProducts = productsFromStorage ? JSON.parse(productsFromStorage) : initialProducts;
            } catch (error) {
                console.error("Failed to load products from storage, using initial products.", error);
                storedProducts = initialProducts;
            }
            setProducts(storedProducts);

            let storedOrders: Order[] = [];
            try {
                const ordersFromStorage = localStorage.getItem(ORDERS_STORAGE_KEY);
                storedOrders = ordersFromStorage ? JSON.parse(ordersFromStorage) : [];
            } catch (error) {
                console.error("Failed to load orders from storage.", error);
            }
            setOrders(storedOrders);
        };
        
        loadData();
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);

    }, []);

    const updateProducts = (newProducts: ProductType[]) => {
        setProducts(newProducts);
        try {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error("Failed to save products to localStorage", error);
        }
    };

    const handleEdit = (product: ProductType) => {
        setEditingProduct(product);
    };

    const handleDelete = (productId: string) => {
        const newProducts = products.filter(p => p.id !== productId);
        updateProducts(newProducts);
        toast({
            title: "Product Deleted",
            description: "The product has been successfully removed.",
        });
    };

    const handleSave = (updatedProduct: ProductType) => {
        const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        updateProducts(newProducts);
        setEditingProduct(null);
        toast({
            title: "Product Updated",
            description: `${updatedProduct.name} has been successfully updated.`,
        });
    };

    const totalRevenue = orders
        .filter(order => order.status === 'Delivered')
        .reduce((sum, order) => sum + order.total, 0);

    const newOrdersCount = orders.filter(order => order.status === 'Pending').length;

    const totalUsers = new Set(orders.map(order => order.customer.email)).size;

    const stats = [
        { title: "Total Revenue", value: `${totalRevenue.toFixed(2)}`, description: "Based on delivered orders", icon: BarChart },
        { title: "New Orders", value: newOrdersCount.toString(), description: "Orders pending fulfillment", icon: ShoppingCart },
        { title: "Products in Stock", value: products.length.toString(), description: "Total active products", icon: Package },
        { title: "Total Users", value: totalUsers.toString(), description: "Unique customers with orders", icon: Users },
    ];

    const handleCategorySelect = (currentValue: string) => {
        const lowerCaseValue = currentValue.toLowerCase();
        setNewSelectedCategory(lowerCaseValue === newSelectedCategory ? '' : lowerCaseValue);
        const exists = categories.some(cat => cat.value === lowerCaseValue);
        if (!exists && currentValue) {
            setCategories([...categories, { value: lowerCaseValue, label: currentValue }]);
        }
        setOpenCategoryPopover(false);
    }

    const resetForm = () => {
        setNewProductName('');
        setNewBrandName('');
        setNewPrice('');
        setNewSelectedCategory('');
        setNewDisplaySection('shop');
        setNewDescription('');
        setNewColors('');
        setNewTextSizes('');
        setNewNumericSizes('');
        setIsNewArrival(false);
        setNewStock(0);
        setNewImageFiles([]);
        setNewVideoFile(null);
    };

    const uploadFile = async (file: File, path: string): Promise<string> => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    }

    const handleAddProduct = async () => {
        if (!newProductName || !newPrice || !newSelectedCategory || newImageFiles.length === 0) {
            toast({
                title: "Missing Information",
                description: "Product Name, Price, Category, and at least one image are required.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            const imageUrls: string[] = [];
            for (const file of newImageFiles) {
                const imagePath = `products/${Date.now()}_${file.name}`;
                const imageUrl = await uploadFile(file, imagePath);
                imageUrls.push(imageUrl);
            }

            let videoUrl = '';
            if (newVideoFile) {
                const videoPath = `videos/${Date.now()}_${newVideoFile.name}`;
                videoUrl = await uploadFile(newVideoFile, videoPath);
            }

            const newProduct: ProductType = {
                id: generateUniqueId(),
                name: newProductName,
                brand: newBrandName,
                price: newPrice,
                category: newSelectedCategory,
                displaySection: newDisplaySection,
                description: newDescription,
                colors: newColors,
                textSizes: newTextSizes,
                numericSizes: newNumericSizes,
                new: isNewArrival,
                stock: newStock,
                images: imageUrls,
                videoUrl: videoUrl,
                aiHint: newProductName.toLowerCase(),
                originalPrice: null,
                discount: null,
            };

            const newProducts = [...products, newProduct];
            updateProducts(newProducts);

            toast({
                title: "Product Added",
                description: `${newProduct.name} has been added to the store.`,
            });

            resetForm();
        } catch (error) {
            console.error("Error adding product: ", error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading files. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleImageFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImageFiles(Array.from(e.target.files));
        }
    };


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
                            <Input id="product-name" placeholder="e.g. Charcoal Crew-Neck Tee" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand-name" className="text-accent">Brand Name</Label>
                            <Input id="brand-name" placeholder="e.g. White Wolf" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-accent">Price</Label>
                                <Input id="price" type="number" placeholder="e.g. 999" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label className="text-accent">Category</Label>
                                 <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openCategoryPopover}
                                        className="w-full justify-between"
                                        >
                                        {newSelectedCategory
                                            ? categories.find((cat) => cat.value === newSelectedCategory)?.label
                                            : "Select or add category..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command onValueChange={setNewSelectedCategory}>
                                            <CommandInput placeholder="Search or add category..." />
                                            <CommandList>
                                                <CommandEmpty>No category found.</CommandEmpty>
                                                <CommandGroup>
                                                {categories.map((cat) => (
                                                    <CommandItem
                                                    key={cat.value}
                                                    value={cat.label}
                                                    onSelect={handleCategorySelect}
                                                    >
                                                    <Check
                                                        className={cn(
                                                        "mr-2 h-4 w-4",
                                                        newSelectedCategory === cat.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {cat.label}
                                                    </CommandItem>
                                                ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="display-section" className="text-accent">Display In</Label>
                            <Select value={newDisplaySection} onValueChange={(value: 'shop' | 'accessories') => setNewDisplaySection(value)}>
                                <SelectTrigger id="display-section">
                                    <SelectValue placeholder="Select a section" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="shop">Shop</SelectItem>
                                    <SelectItem value="accessories">Accessories</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-accent">Description</Label>
                            <Textarea id="description" placeholder="e.g. A classic crew-neck t-shirt..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="colors" className="text-accent">Colors (comma-separated)</Label>
                            <Input id="colors" placeholder="e.g., Black, White, Blue" value={newColors} onChange={(e) => setNewColors(e.target.value)} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="text-sizes" className="text-accent">Text-based Sizes (comma-separated)</Label>
                                <Input id="text-sizes" placeholder="e.g., S, M, L, XL, XXL" value={newTextSizes} onChange={(e) => setNewTextSizes(e.target.value)} />
                            </div>
                           <div className="space-y-2">
                               <Label htmlFor="numeric-sizes" className="text-accent">Numeric Sizes (comma-separated)</Label>
                               <Input id="numeric-sizes" placeholder="e.g., 28, 30, 32" value={newNumericSizes} onChange={(e) => setNewNumericSizes(e.target.value)} />
                           </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="stock" className="text-accent">Stock Quantity</Label>
                            <Input id="stock" type="number" placeholder="e.g., 100" value={newStock} onChange={(e) => setNewStock(Number(e.target.value))} />
                        </div>

                         <div className="space-y-2">
                            <Label htmlFor="product-images" className="text-accent">Product Images</Label>
                            <div className="flex items-center justify-center w-full">
                                <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        {newImageFiles.length > 0 ? (
                                            <p className="font-semibold text-primary">{newImageFiles.length} file(s) selected</p>
                                        ) : (
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Drag & drop images here,</span> or click to select</p>
                                        )}
                                    </div>
                                    <Input id="dropzone-file" type="file" className="hidden" accept="image/*" multiple onChange={handleImageFilesSelect} />
                                </Label>
                            </div> 
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="product-video" className="text-accent">Product Video</Label>
                            <div className="flex items-center justify-center w-full">
                                <Label htmlFor="dropzone-video-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                                        {newVideoFile ? (
                                            <p className="font-semibold text-primary">{newVideoFile.name}</p>
                                        ) : (
                                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Drag & drop video here,</span> or click to select</p>
                                        )}
                                    </div>
                                    <Input id="dropzone-video-file" type="file" className="hidden" accept="video/*" onChange={(e) => setNewVideoFile(e.target.files ? e.target.files[0] : null)}/>
                                </Label>
                            </div>
                        </div>


                        <div className="flex items-center space-x-2">
                            <Switch id="new-arrival" checked={isNewArrival} onCheckedChange={setIsNewArrival}/>
                            <Label htmlFor="new-arrival">Mark as New Arrival</Label>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={resetForm} disabled={isUploading}>Cancel</Button>
                            <Button onClick={handleAddProduct} disabled={isUploading}>
                                {isUploading ? <Loader2 className="animate-spin" /> : "Add Product"}
                            </Button>
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
                                    <TableRow key={product.id || index}>
                                        <TableCell>
                                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                                                <Image 
                                                    src={(product.images && product.images.length > 0) ? product.images[0] : "https://placehold.co/100x100.png"} 
                                                    alt={product.name} 
                                                    fill 
                                                    className="object-cover" 
                                                    data-ai-hint={product.aiHint} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{product.category}</Badge>
                                        </TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.stock}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
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
}

    
