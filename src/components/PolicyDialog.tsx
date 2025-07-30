
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, Truck, Undo } from "lucide-react";

interface PolicyDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PolicyDialog({ isOpen, onClose }: PolicyDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0">
            <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle className="text-2xl font-bold font-headline text-accent">Policies</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
                <div className="p-6 space-y-8">
                    <section>
                        <h3 className="flex items-center gap-2 text-xl font-bold font-headline text-primary mb-3">
                            <Truck className="h-5 w-5" /> Shipping Policy
                        </h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div>
                                <h4 className="font-semibold text-primary">Order Processing Time</h4>
                                <p>All orders are processed within 1–2 business days.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary">Delivery Time</h4>
                                <ul className="list-disc list-inside">
                                    <li><span className="font-medium">Urban Areas:</span> Estimated delivery in 4–5 business days</li>
                                    <li><span className="font-medium">Rural Areas:</span> Estimated delivery in 5–7 business days</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-primary">Shipping Charges</h4>
                                 <ul className="list-disc list-inside">
                                    <li>Shipping is chargeable and will be deducted from the order amount in case of return or cancellation after dispatch.</li>
                                    <li>Charges vary by location and will be shown at checkout.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="flex items-center gap-2 text-xl font-bold font-headline text-primary mb-3">
                            <Undo className="h-5 w-5" /> Return & Exchange Policy
                        </h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div>
                                <h4 className="font-semibold text-primary">Return Pickup Time</h4>
                                <ul className="list-disc list-inside">
                                    <li><span className="font-medium">Urban Areas:</span> Return pickup within 3–4 business days</li>
                                    <li><span className="font-medium">Rural Areas:</span> Return pickup within 5–6 business days</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold text-primary">Conditions for Return</h4>
                                 <ul className="list-disc list-inside">
                                    <li>The product is unused, unwashed, and in original packaging.</li>
                                    <li>Return is initiated within 7 days of delivery.</li>
                                    <li>In case of return, shipping charges will be deducted from the refund amount.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                    
                     <section className="!mt-6 pt-6 border-t">
                        <h3 className="flex items-center gap-2 text-xl font-bold font-headline text-primary mb-3">
                            📩 Need Help?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">For any questions or assistance with your order:</p>
                        <div className="space-y-2 text-sm">
                            <a href="mailto:thewhitewolf0501@gmail.com" className="flex items-center gap-3 group">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-primary group-hover:underline">thewhitewolf0501@gmail.com</span>
                            </a>
                            <a href="tel:+917219789870" className="flex items-center gap-3 group">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-primary group-hover:underline">+91 7219789870 (Call/WhatsApp)</span>
                            </a>
                        </div>
                    </section>
                </div>
            </ScrollArea>
        </DialogContent>
    </Dialog>
  );
}
