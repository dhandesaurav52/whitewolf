
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { Advertisement } from "@/lib/types";
import { UploadCloud } from "lucide-react";


interface CreateHeroDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Advertisement>) => void;
  hero: Advertisement | null;
}

export default function CreateHeroDialog({ isOpen, onClose, onSave, hero }: CreateHeroDialogProps) {
    const [headline, setHeadline] = useState("");
    const [subtext, setSubtext] = useState("");
    const [buttonText, setButtonText] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

    useEffect(() => {
        if (hero) {
            setHeadline(hero.heroHeadline || "");
            setSubtext(hero.heroSubtext || "");
            setButtonText(hero.heroButton || "");
            setImageUrl(hero.heroImageUrl || "");
            setStatus(hero.status || 'Inactive');
        } else {
            setHeadline("");
            setSubtext("");
            setButtonText("");
            setImageUrl("");
            setStatus('Active');
        }
    }, [hero]);

    const handleSave = () => {
        onSave({
            heroHeadline: headline,
            heroSubtext: subtext,
            heroButton: buttonText,
            heroImageUrl: imageUrl,
            status: status
        });
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
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="headline">Headline</Label>
                        <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subtext">Subtext</Label>
                        <Textarea id="subtext" value={subtext} onChange={(e) => setSubtext(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="button-text">Button Text</Label>
                        <Input id="button-text" value={buttonText} onChange={(e) => setButtonText(e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="image-url">Image URL</Label>
                        <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..."/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="status" checked={status === 'Active'} onCheckedChange={(checked) => setStatus(checked ? 'Active' : 'Inactive')} />
                        <Label htmlFor="status">Active</Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

