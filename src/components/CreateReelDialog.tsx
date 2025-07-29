
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, Reel } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, UploadCloud } from "lucide-react";


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
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);
    try {
      const videoPath = `reels/${Date.now()}_${videoFile.name}`;
      const storageRef = ref(storage, videoPath);
      await uploadBytes(storageRef, videoFile);
      const videoUrl = await getDownloadURL(storageRef);
      
      onSave({ reelTitle, linkedProduct, videoUrl });

    } catch (error) {
      console.error("Error uploading reel video: ", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent">Create New Reel</DialogTitle>
           <DialogDescription>
            Upload a video and link it to a product to feature in the "Watch & Shop" section.
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
              disabled={isUploading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="video-file" className="text-accent">Video File</Label>
            <Label htmlFor="dropzone-video-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    {videoFile ? (
                        <p className="font-semibold text-primary">{videoFile.name}</p>
                    ) : (
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    )}
                </div>
                <Input id="dropzone-video-file" type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files ? e.target.files[0] : null)} disabled={isUploading}/>
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-product" className="text-accent">Link to Product</Label>
            <Select onValueChange={setLinkedProduct} value={linkedProduct} disabled={isUploading}>
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
          <Button variant="outline" onClick={onClose} disabled={isUploading}>Cancel</Button>
          <Button onClick={handleSave} disabled={isUploading}>
            {isUploading ? <Loader2 className="animate-spin" /> : "Save Reel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
