
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Pencil, MapPin } from "lucide-react";
import type { CustomerDetails, CartItem } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

interface ConfirmPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: "online" | "cod") => void;
  cartTotal: number;
  shippingDetails: CustomerDetails;
  cartItems: CartItem[];
}

export default function ConfirmPurchaseDialog({
  isOpen,
  onClose,
  onConfirm,
  cartTotal,
  shippingDetails,
  cartItems,
}: ConfirmPurchaseDialogProps) {
  const [addressOption, setAddressOption] = useState<"default" | "new">("new");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  
  const { user } = useAuth();

  const productNames = cartItems.map(item => item.product.name).join(', ');

  const shippingCost = 100; // Hardcoded for now
  const totalAmount = cartTotal + shippingCost;
  
  // This is a mock check. In a real app, you'd check if the user has a saved address.
  const hasDefaultAddress = user?.displayName && shippingDetails.phone;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Confirm Purchase</DialogTitle>
          <DialogDescription>
            Confirm your shipping details for "{productNames}".
          </DialogDescription>
           <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogHeader>
        <div className="px-6 space-y-4">
            <RadioGroup value={addressOption} onValueChange={(val: "default" | "new") => setAddressOption(val)}>
                <Label
                    htmlFor="default-address"
                    className={`p-4 border rounded-md cursor-pointer ${addressOption === 'default' ? 'border-primary ring-2 ring-primary' : 'border-input'}`}
                >
                    <div className="flex items-start">
                        <RadioGroupItem value="default" id="default-address" className="mt-1" />
                        <div className="ml-4 flex-grow">
                            <p className="font-semibold">Use Default Address</p>
                            {hasDefaultAddress ? (
                                <div className="text-sm text-muted-foreground mt-1">
                                    <p>{shippingDetails.name}</p>
                                    <p>{shippingDetails.address}, {shippingDetails.city}</p>
                                    <p>{shippingDetails.phone}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-destructive mt-1">
                                    No default address and/or phone number found. Please add them in your profile.
                                </p>
                            )}
                        </div>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Pencil className="h-3 w-3" /> Change
                        </Button>
                    </div>
                </Label>
                 <Label
                    htmlFor="new-address"
                    className={`p-4 border rounded-md cursor-pointer ${addressOption === 'new' ? 'border-primary ring-2 ring-primary' : 'border-input'}`}
                 >
                    <div className="flex items-center">
                         <RadioGroupItem value="new" id="new-address" />
                         <span className="ml-4 font-semibold">Ship to a New Address</span>
                    </div>
                </Label>
            </RadioGroup>

            <Separator/>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>₹{shippingCost.toFixed(2)}</span>
                </div>
                 <Separator/>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <DialogFooter className="p-6 bg-muted/50 flex-row gap-2">
            <Button
                variant={paymentMethod === 'online' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => { onConfirm('online'); setPaymentMethod('online')}}
            >
                Pay Online
            </Button>
            <Button
                 variant={paymentMethod === 'cod' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => { onConfirm('cod'); setPaymentMethod('cod')}}
            >
                Cash on Delivery
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

