
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
import { Pencil } from "lucide-react";
import type { CustomerDetails, CartItem, Order } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  productToBuy?: CartItem | null;
}

declare global {
    interface Window {
        Razorpay: any;
    }
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
  const [isLoading, setIsLoading] = useState(false);
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
    }
  }, [user, form]);
  
  const placeOrder = (shippingDetails: CustomerDetails, paymentId?: string) => {
    const newOrder: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        customer: { ...shippingDetails, userId: user?.uid },
        items: itemsToPurchase,
        total: totalAmount,
        status: 'Pending',
        orderDate: new Date().toISOString(),
        paymentId,
    };

    try {
        const existingOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
        const existingOrders: Order[] = existingOrdersRaw ? JSON.parse(existingOrdersRaw) : [];
        const updatedOrders = [...existingOrders, newOrder];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
        
        toast({
            title: "Order Placed!",
            description: `Thank you for your purchase. Your order is being processed.`,
        });
        
        if (!productToBuy) {
            clearCart();
        }
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

  const handleRazorpayPayment = async (shippingDetails: CustomerDetails) => {
    setIsLoading(true);
    try {
        // --- Step 1: Create Order on your backend ---
        // This is a placeholder. You need to implement an API route on your server
        // that calls Razorpay's Orders API and returns the order_id.
        const orderResponse = await fetch('/api/create-razorpay-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: totalAmount * 100 }), // amount in smallest currency unit (paise)
        });
        
        if (!orderResponse.ok) throw new Error('Failed to create Razorpay order.');
        
        const { orderId } = await orderResponse.json();
        
        // --- Step 2: Open Razorpay Checkout ---
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Replace with your Key ID
            amount: totalAmount * 100,
            currency: "INR",
            name: "White Wolf",
            description: "Test Transaction",
            order_id: orderId,
            handler: async function (response: any) {
                // --- Step 3: Verify Payment on your backend ---
                // This is a placeholder. You need to implement an API route to verify
                // the payment signature.
                const verificationResponse = await fetch('/api/verify-razorpay-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(response),
                });
                
                if (!verificationResponse.ok) throw new Error('Payment verification failed.');

                placeOrder(shippingDetails, response.razorpay_payment_id);
            },
            prefill: {
                name: shippingDetails.name,
                email: shippingDetails.email,
                contact: shippingDetails.phone,
            },
            notes: {
                address: `${shippingDetails.address}, ${shippingDetails.city}, ${shippingDetails.pincode}`
            },
            theme: {
                color: "#09090B"
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: response.error.description,
            });
        });
        rzp.open();

    } catch (error: any) {
        console.error("Razorpay Error:", error);
        toast({ title: "Error", description: error.message || "Could not initiate payment.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }

  const onFormSubmit = (data: CheckoutFormValues) => {
    if (paymentMethod === 'cod') {
        placeOrder(data);
    } else {
        handleRazorpayPayment(data);
    }
  };
  
  const hasDefaultAddress = false; // Mock check, implement your logic

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
                                    No default address found. Please add one in your profile.
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
                    <span>{totalToCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost.toFixed(2)}</span>
                </div>
                 <Separator/>
                <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>{totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <DialogFooter className="p-6 bg-muted/50 flex-col sm:flex-row gap-2">
            <Button
                variant={'default'}
                className="flex-1"
                onClick={() => { setPaymentMethod('online'); form.handleSubmit(onFormSubmit)(); }}
                disabled={isLoading || (addressOption === 'default' && !hasDefaultAddress)}
            >
                {isLoading && paymentMethod === 'online' ? <Loader2 className="animate-spin" /> : "Pay Online"}
            </Button>
            <Button
                variant={'outline'}
                className="flex-1"
                onClick={() => { setPaymentMethod('cod'); form.handleSubmit(onFormSubmit)(); }}
                disabled={isLoading || (addressOption === 'default' && !hasDefaultAddress)}
            >
                {isLoading && paymentMethod === 'cod' ? <Loader2 className="animate-spin" /> : "Cash on Delivery"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
