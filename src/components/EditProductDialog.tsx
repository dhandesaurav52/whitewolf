
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
import { Check, ChevronsUpDown, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface EditProductDialogProps {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const categoriesList = [
    { value: 't-shirts', label: 'T-Shirts' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'jeans', label: 'Jeans' },
    { value: 'trousers', label: 'Trousers' },
    { value: 'accessories', label: 'Accessories' },
];

export default function EditProductDialog({ product, onSave, onClose }: EditProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState(product);
  const [categories, setCategories] = useState(categoriesList);
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  
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
  
  const handleCategorySelect = (currentValue: string) => {
      const lowerCaseValue = currentValue.toLowerCase();
      const existingCategory = categories.find(cat => cat.value === lowerCaseValue);
      if (existingCategory) {
          handleChange('category', existingCategory.label);
      } else if (currentValue) {
          const newCategory = { value: lowerCaseValue, label: currentValue };
          setCategories(prev => [...prev, newCategory]);
          handleChange('category', newCategory.label);
      }
      setOpenCategoryPopover(false)
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-accent">Price (₹)</Label>
                  <Input id="price" type="number" value={editedProduct.price} onChange={(e) => handleChange('price', e.target.value)} />
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
                <Textarea id="images" value={editedProduct.images.join(', ')} onChange={(e) => handleChange('images', e.target.value.split(',').map(url => url.trim()))} />
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
               <div className="space-y-2">
                    <Label htmlFor="numeric-sizes" className="text-accent">Numeric Sizes (comma-separated)</Label>
                    <Input id="numeric-sizes" value={editedProduct.numericSizes || ''} onChange={(e) => handleChange('numericSizes', e.target.value)} />
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
