
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Reel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


interface CreateReelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reel: Omit<Reel, 'id'>) => void;
  products: Product[];
}

export default function CreateReelDialog({ isOpen, onClose, onSave, products }: CreateReelDialogProps) {
  const [reelTitle, setReelTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkedProduct, setLinkedProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!reelTitle || !videoUrl || !linkedProduct) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      onSave({ reelTitle, linkedProduct, videoUrl });
    } catch (error) {
      console.error("Error creating reel: ", error);
      toast({
        title: "Save Failed",
        description: "There was an error saving your reel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent">Create New Reel</DialogTitle>
           <DialogDescription>
            Provide a video URL and link it to a product to feature in the "Watch & Shop" section.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="reel-title" className="text-accent">Reel Title</Label>
            <Input
              id="reel-title"
              value={reelTitle}
              onChange={(e) => setReelTitle(e.target.value)}
              placeholder="e.g., Summer Collection Highlights"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-url" className="text-accent">Video URL</Label>
            <Input
              id="video-url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-product" className="text-accent">Link to Product</Label>
            <Select onValueChange={setLinkedProduct} value={linkedProduct} disabled={isLoading}>
              <SelectTrigger id="link-product">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.name}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Save Reel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    