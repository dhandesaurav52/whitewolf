
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Reel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { uploadFile, storage } from "@/lib/firebase";

interface EditReelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reel: Reel) => void;
  products: Product[];
  reel: Reel;
}

export default function EditReelDialog({ isOpen, onClose, onSave, products, reel }: EditReelDialogProps) {
  const [reelTitle, setReelTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [linkedProduct, setLinkedProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
      if (reel) {
          setReelTitle(reel.reelTitle);
          setLinkedProduct(reel.linkedProduct);
      }
  }, [reel]);

  const handleSave = async () => {
    if (!reelTitle || !linkedProduct) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let videoUrl = reel.videoUrl;
      if (videoFile) {
        if (!storage) {
            toast({
                title: "Firebase Not Configured",
                description: "Please set up your Firebase credentials in the .env.local file to upload media.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }
        videoUrl = await uploadFile(videoFile, `reels/${Date.now()}-${videoFile.name}`);
      }
      
      onSave({
          ...reel,
          reelTitle,
          linkedProduct,
          videoUrl,
      });

    } catch (error) {
      console.error("Error updating reel: ", error);
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
          <DialogTitle className="text-2xl font-bold text-accent">Edit Reel</DialogTitle>
           <DialogDescription>
            Update the details for your reel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="reel-title-edit" className="text-accent">Reel Title</Label>
            <Input
              id="reel-title-edit"
              value={reelTitle}
              onChange={(e) => setReelTitle(e.target.value)}
              placeholder="e.g., Summer Collection Highlights"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-file-edit" className="text-accent">Upload New Video (Optional)</Label>
            <Input
              id="video-file-edit"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">If you upload a new video, it will replace the existing one.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-product-edit" className="text-accent">Link to Product</Label>
            <Select onValueChange={setLinkedProduct} value={linkedProduct} disabled={isLoading}>
              <SelectTrigger id="link-product-edit">
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
            {isLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
