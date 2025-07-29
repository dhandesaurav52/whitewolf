
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Pencil } from "lucide-react";
import type { CustomerDetails, CartItem, Order } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const ORDERS_STORAGE_KEY = 'orders';

const checkoutSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "A valid phone number is required"),
    address: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    pincode: z.string().min(6, "A valid pincode is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

interface ConfirmPurchaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  cartItems: CartItem[];
  clearCart: () => void;
  productToBuy?: CartItem;
}

export default function ConfirmPurchaseDialog({
  isOpen,
  onClose,
  cartTotal,
  cartItems,
  clearCart,
  productToBuy
}: ConfirmPurchaseDialogProps) {
  const [addressOption, setAddressOption] = useState<"default" | "new">("new");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const itemsToPurchase = productToBuy ? [productToBuy] : cartItems;
  const totalToCharge = productToBuy ? (parseFloat(productToBuy.product.price) * productToBuy.quantity) : cartTotal;
  const shippingCost = 100;
  const totalAmount = totalToCharge + shippingCost;
  const productNames = itemsToPurchase.map(item => item.product.name).join(', ');

  const form = useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: { name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" },
  });
  
  useEffect(() => {
    if (user) {
        form.setValue('name', user.displayName || '');
        form.setValue('email', user.email || '');
        // In a real app, you'd fetch saved address here
        // For now, we just pre-fill name and email
    }
  }, [user, form]);
  
  const handleConfirm = (payment: "online" | "cod", shippingDetails: CustomerDetails) => {
    const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        customer: { ...shippingDetails, userId: user?.uid },
        items: itemsToPurchase,
        total: totalAmount,
        status: 'Pending',
        orderDate: new Date().toISOString(),
    };

    try {
        const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
        const updatedOrders = [...existingOrders, newOrder];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        
        toast({
            title: "Order Placed!",
            description: `Thank you for your purchase. Your order is being processed with ${payment === 'cod' ? 'Cash on Delivery' : 'Online Payment'}.`,
        });
        
        clearCart();
        onClose();
        router.push('/orders');
    } catch (error) {
        console.error("Failed to save order:", error);
        toast({
            title: "Order Failed",
            description: "There was an issue placing your order. Please try again.",
            variant: "destructive",
        });
    }
  };

  const onFormSubmit = (data: CheckoutFormValues) => {
    handleConfirm(paymentMethod, data);
  };
  
  const hasDefaultAddress = user?.displayName && user.email; // Mock check

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Confirm Purchase</DialogTitle>
          <DialogDescription>
            Confirm your shipping details for "{productNames}".
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <RadioGroup value={addressOption} onValueChange={(val: "default" | "new") => setAddressOption(val)}>
                <Label
                    htmlFor="default-address"
                    className={`p-4 border rounded-md cursor-pointer ${addressOption === 'default' ? 'border-primary ring-2 ring-primary' : 'border-input'}`}
                >
                    <div className="flex items-start">
                        <RadioGroupItem value="default" id="default-address" className="mt-1" disabled={!hasDefaultAddress} />
                        <div className="ml-4 flex-grow">
                            <p className="font-semibold">Use Default Address</p>
                            {!hasDefaultAddress && (
                                <p className="text-sm text-destructive mt-1">
                                    No default address and/or phone number found. Please add them in your profile.
                                </p>
                            )}
                        </div>
                         {hasDefaultAddress && <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <Pencil className="h-3 w-3" /> Change
                        </Button>}
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

            {addressOption === 'new' && (
              <Form {...form}>
                <form id="shipping-form" onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 border-t pt-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    </div>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="pincode" render={({ field }) => (
                        <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    </div>
                </form>
              </Form>
            )}

            <Separator/>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalToCharge.toFixed(2)}</span>
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
                onClick={() => { setPaymentMethod('online'); form.handleSubmit(onFormSubmit)(); }}
                disabled={addressOption === 'default' && !hasDefaultAddress}
            >
                Pay Online
            </Button>
            <Button
                variant={paymentMethod === 'cod' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => { setPaymentMethod('cod'); form.handleSubmit(onFormSubmit)(); }}
                disabled={addressOption === 'default' && !hasDefaultAddress}
            >
                Cash on Delivery
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
