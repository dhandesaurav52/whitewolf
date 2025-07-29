
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Advertisement } from "@/lib/types";
import { Loader2, UploadCloud } from "lucide-react";


interface CreateHeroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Advertisement>, imageFile: File | null) => void;
  hero: Advertisement | null;
  isSaving: boolean;
}

export default function CreateHeroDialog({ isOpen, onClose, onSave, hero, isSaving }: CreateHeroDialogProps) {
    const [headline, setHeadline] = useState("");
    const [subtext, setSubtext] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
    const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>("");

    useEffect(() => {
        if (hero) {
            setHeadline(hero.heroHeadline || "");
            setSubtext(hero.heroSubtext || "");
            setButtonText(hero.heroButton || "");
            setStatus(hero.status || 'Inactive');
            setImageFile(null);
            setCurrentImageUrl(hero.heroImageUrl);
        } else {
            setHeadline("");
            setSubtext("");
            setButtonText("");
            setImageFile(null);
            setCurrentImageUrl("");
            setStatus('Active');
        }
    }, [hero]);

    const handleSave = () => {
        onSave({
            heroHeadline: headline,
            heroSubtext: subtext,
            heroButton: buttonText,
            heroImageUrl: currentImageUrl,
            status: status
        }, imageFile);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>{hero ? 'Edit Hero Banner' : 'Create New Hero Banner'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the hero banner. This will be displayed on the homepage.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 px-6">
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} disabled={isSaving}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtext">Subtext</Label>
                        <Textarea id="subtext" value={subtext} onChange={(e) => setSubtext(e.target.value)} disabled={isSaving}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="button-text">Button Text</Label>
                        <Input id="button-text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} disabled={isSaving}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="image-file">Hero Image</Label>
                        <Input id="image-file" type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} disabled={isSaving}/>
                        {currentImageUrl && !imageFile && <p className="text-sm text-muted-foreground mt-1">Current image is set. Upload a new one to replace it.</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="status" checked={status === 'Active'} onCheckedChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')} disabled={isSaving}/>
                        <Label htmlFor="status">Active</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin" /> : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
