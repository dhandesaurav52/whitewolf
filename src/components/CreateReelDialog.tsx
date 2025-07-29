
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Product = {
  name: string;
};

type Reel = {
  reelTitle: string;
  linkedProduct: string;
};

interface CreateReelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reel: Reel) => void;
  products: Product[];
}

export default function CreateReelDialog({ isOpen, onClose, onSave, products }: CreateReelDialogProps) {
  const [reelTitle, setReelTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [linkedProduct, setLinkedProduct] = useState("");

  const handleSave = () => {
    if (reelTitle && videoFile && linkedProduct) {
      onSave({ reelTitle, linkedProduct });
    } else {
      // Basic validation feedback
      alert("Please fill out all fields.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent">Create New Reel</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="reel-title" className="text-accent">Reel Title</Label>
            <Input
              id="reel-title"
              value={reelTitle}
              onChange={(e) => setReelTitle(e.target.value)}
              placeholder="e.g., Summer Collection Highlights"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-file" className="text-accent">Video File</Label>
            <Input
              id="video-file"
              type="file"
              onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)}
              accept="video/*"
              className="file:text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-product" className="text-accent">Link to Product</Label>
            <Select onValueChange={setLinkedProduct} value={linkedProduct}>
              <SelectTrigger id="link-product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.name} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Reel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
