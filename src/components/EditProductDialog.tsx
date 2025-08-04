
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, UploadCloud, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface EditProductDialogProps {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const initialCategories = [
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
    { value: 'sweater', label: 'Sweater' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'track-pants', label: 'Track Pants' },
    { value: 'oversized-t-shirts', label: 'Oversized T-shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'socks', label: 'Socks' },
    { value: 'accessories', label: 'Accessories' },
];

export default function EditProductDialog({ product, onSave, onClose }: EditProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [categories, setCategories] = useState(initialCategories);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  
  useEffect(() => {
    setEditedProduct(product);
    const productCategoryValue = product.category.toLowerCase().replace(/\s/g, '-');
    if (!categories.some(c => c.value === productCategoryValue)) {
      setCategories(prev => [...prev, {value: productCategoryValue, label: product.category}]);
    }
  }, [product]);

  const handleChange = (field: keyof Product, value: any) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedProduct);
  };
  
    const addNewCategory = (newCategoryLabel: string) => {
        const newCategoryValue = newCategoryLabel.toLowerCase().replace(/\s/g, '-');
        if (newCategoryLabel && !categories.some(cat => cat.value === newCategoryValue)) {
            const newCategory = { value: newCategoryValue, label: newCategoryLabel };
            setCategories(prev => [...prev, newCategory]);
            handleChange('category', newCategory.label);
            setCategorySearch("");
            setOpenCategoryPopover(false);
        }
    }

  const currentCategoryValue = editedProduct.category.toLowerCase().replace(/\s/g, '-');

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] grid-rows-[auto_1fr_auto] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-accent">Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to "{product.name}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden">
          <ScrollArea className="h-full max-h-[calc(90vh-160px)]">
            <div className="p-6 grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-accent">Product Name</Label>
                  <Input id="name" value={editedProduct.name} onChange={(e) => handleChange('name', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-accent">Brand Name</Label>
                  <Input id="brand" value={editedProduct.brand || ''} onChange={(e) => handleChange('brand', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="price" className="text-accent">Price</Label>
                  <Input id="price" type="number" value={editedProduct.price} onChange={(e) => handleChange('price', e.target.value)} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="currency" className="text-accent">Currency</Label>
                    <Select value={editedProduct.currency || 'INR'} onValueChange={(value) => handleChange('currency', value)}>
                        <SelectTrigger id="currency">
                            <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
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
                            {editedProduct.category || "Select or add category..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                           <Command>
                                <CommandInput 
                                    placeholder="Search or add category..." 
                                    value={categorySearch}
                                    onValueChange={setCategorySearch}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        <div className="p-2 text-center text-sm">
                                            No category found.
                                            {categorySearch && (
                                                <Button
                                                    variant="ghost"
                                                    className="w-full mt-2"
                                                    onClick={() => addNewCategory(categorySearch)}
                                                >
                                                    <PlusCircle className="mr-2 h-4 w-4" />
                                                    Add "{categorySearch}"
                                                </Button>
                                            )}
                                        </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                    {categories.map((cat) => (
                                        <CommandItem
                                            key={cat.value}
                                            value={cat.label}
                                            onSelect={(currentValue) => {
                                                const category = categories.find(c => c.label.toLowerCase() === currentValue.toLowerCase())
                                                if (category) {
                                                    handleChange('category', category.label);
                                                }
                                                setOpenCategoryPopover(false);
                                                setCategorySearch("");
                                            }}
                                        >
                                        <Check
                                            className={cn(
                                            "mr-2 h-4 w-4",
                                            currentCategoryValue === cat.value ? "opacity-100" : "opacity-0"
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
              <div className="space-y-2">
                <Label htmlFor="display-section" className="text-accent">Display In</Label>
                <Select value={editedProduct.displaySection} onValueChange={(value) => handleChange('displaySection', value)}>
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
                <Textarea id="description" value={editedProduct.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="images" className="text-accent">Image URLs (comma-separated)</Label>
                <Textarea id="images" value={Array.isArray(editedProduct.images) ? editedProduct.images.join(', ') : ''} onChange={(e) => handleChange('images', e.target.value.split(',').map(url => url.trim()))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="colors" className="text-accent">Colors (comma-separated)</Label>
                    <Input id="colors" value={editedProduct.colors || ''} onChange={(e) => handleChange('colors', e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="text-sizes" className="text-accent">Text-based Sizes (comma-separated)</Label>
                    <Input id="text-sizes" value={editedProduct.textSizes || ''} onChange={(e) => handleChange('textSizes', e.target.value)} />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="numeric-sizes" className="text-accent">Numeric Sizes (comma-separated)</Label>
                    <Input id="numeric-sizes" value={editedProduct.numericSizes || ''} onChange={(e) => handleChange('numericSizes', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock" className="text-accent">Stock Quantity</Label>
                    <Input id="stock" type="number" value={editedProduct.stock} onChange={(e) => handleChange('stock', Number(e.target.value))} />
                </div>
              </div>
               <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight" className="text-accent">Weight (kg)</Label>
                        <Input id="weight" type="number" value={editedProduct.weight || 0} onChange={(e) => handleChange('weight', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="length" className="text-accent">Length (cm)</Label>
                        <Input id="length" type="number" value={editedProduct.length || 0} onChange={(e) => handleChange('length', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="breadth" className="text-accent">Breadth (cm)</Label>
                        <Input id="breadth" type="number" value={editedProduct.breadth || 0} onChange={(e) => handleChange('breadth', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height" className="text-accent">Height (cm)</Label>
                        <Input id="height" type="number" value={editedProduct.height || 0} onChange={(e) => handleChange('height', Number(e.target.value))} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="product-video" className="text-accent">Product Video</Label>
                    <Input id="product-video" value={editedProduct.videoUrl || ''} onChange={(e) => handleChange('videoUrl', e.target.value)} placeholder="Enter video URL..."/>
                </div>
              <div className="flex items-center space-x-2">
                <Switch id="new-arrival" checked={!!editedProduct.new} onCheckedChange={(checked) => handleChange('new', checked)} />
                <Label htmlFor="new-arrival">Mark as New Arrival</Label>
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="p-6 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
