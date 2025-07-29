
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
import { uploadFile, storage } from "@/lib/firebase";

interface CreateReelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reel: Omit<Reel, 'id'>) => void;
  products: Product[];
}

export default function CreateReelDialog({ isOpen, onClose, onSave, products }: CreateReelDialogProps) {
  const [reelTitle, setReelTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [linkedProduct, setLinkedProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!reelTitle || !videoFile || !linkedProduct) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields and select a video.",
        variant: "destructive",
      });
      return;
    }

    if (!storage) {
        toast({
            title: "Firebase Not Configured",
            description: "Please set up your Firebase credentials in the .env.local file to upload media.",
            variant: "destructive",
        });
        return;
    }

    setIsLoading(true);
    try {
      const videoUrl = await uploadFile(videoFile, `reels/${Date.now()}-${videoFile.name}`);
      onSave({ reelTitle, linkedProduct, videoUrl });
    } catch (error) {
      console.error("Error creating reel: ", error);
      toast({
        title: "Save Failed",
        description: "There was an error processing your video. Please try again.",
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
            Provide a video and link it to a product to feature in the "Watch & Shop" section.
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
            <Label htmlFor="video-file" className="text-accent">Video File</Label>
            <Input
              id="video-file"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
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

    