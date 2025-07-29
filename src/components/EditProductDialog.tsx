
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
  displaySection?: 'shop' | 'accessories';
};

interface EditProductDialogProps {
  product: Product;
  onSave: (product: Product) => void;
  onClose: () => void;
}

export default function EditProductDialog({ product, onSave, onClose }: EditProductDialogProps) {
  const [editedProduct, setEditedProduct] = useState(product);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleChange = (field: keyof Product, value: string | number | boolean) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editedProduct);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] grid-rows-[auto_1fr_auto] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-accent">Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to "{product.name}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-hidden">
          <ScrollArea className="h-full px-6">
            <div className="grid gap-6">
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
                    <Label htmlFor="category" className="text-accent">Category</Label>
                    <Select value={editedProduct.category} onValueChange={(value) => handleChange('category', value)}>
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                            <SelectItem value="Shirts">Shirts</SelectItem>
                            <SelectItem value="Jeans">Jeans</SelectItem>
                            <SelectItem value="Trousers">Trousers</SelectItem>
                            <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                    </Select>
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
              <div className="flex items-center space-x-2">
                <Switch id="new-arrival" checked={editedProduct.isNew} onCheckedChange={(checked) => handleChange('isNew', checked)} />
                <Label htmlFor="new-arrival">Mark as New Arrival</Label>
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="p-6 pt-0 border-t mt-auto">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
