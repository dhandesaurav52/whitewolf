
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, Phone } from "lucide-react";

interface ContactUsDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactUsDialog({ isOpen, onClose }: ContactUsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold font-headline text-accent">Contact Us</DialogTitle>
                <DialogDescription>We're here to help. Reach out to us with any questions.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <a href="mailto:thewhitewolf0501@gmail.com" className="flex items-center gap-4 group p-3 rounded-lg hover:bg-muted transition-colors">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                    <div className="text-left">
                        <p className="font-semibold text-primary">Email</p>
                        <p className="text-sm text-primary group-hover:underline">thewhitewolf0501@gmail.com</p>
                    </div>
                </a>
                <a href="tel:+917219789870" className="flex items-center gap-4 group p-3 rounded-lg hover:bg-muted transition-colors">
                    <Phone className="h-6 w-6 text-muted-foreground" />
                    <div className="text-left">
                        <p className="font-semibold text-primary">Phone / WhatsApp</p>
                        <p className="text-sm text-primary group-hover:underline">+91 7219789870</p>
                    </div>
                </a>
            </div>
        </DialogContent>
    </Dialog>
  );
}
