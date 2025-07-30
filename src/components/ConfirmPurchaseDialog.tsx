
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
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
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const itemsToPurchase = productToBuy ? [productToBuy] : cartItems;
  const totalToCharge = productToBuy ? (parseFloat(productToBuy.product.price) * productToBuy.quantity) : cartTotal;
  const shippingCost = 0; // Free shipping
  const totalAmount = totalToCharge + shippingCost;
  const productNames = itemsToPurchase.map(item => item.product.name).join(', ');

  const form = useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: { name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" },
  });
  
  useEffect(() => {
    if (user && isOpen) {
        form.setValue('name', user.displayName || '');
        form.setValue('email', user.email || '');
    }
  }, [user, form, isOpen]);
  
  const placeOrder = (shippingDetails: CustomerDetails, paymentId?: string) => {
    const newOrder: Order = {
        id: `order_${Date.now()}`,
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
        window.dispatchEvent(new Event('storage'));
        
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
    setPaymentMethod('online');

    const createOrderOnServer = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `mock_order_${Date.now()}`;
    };

    try {
        const orderId = await createOrderOnServer();
        
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
            amount: totalAmount * 100,
            currency: "INR",
            name: "White Wolf",
            description: `Purchase of ${productNames}`,
            order_id: orderId,
            handler: function (response: any) {
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
            },
            modal: {
                ondismiss: function() {
                    setIsLoading(false);
                    setPaymentMethod(null);
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response: any){
            toast({
                variant: 'destructive',
                title: 'Payment Failed',
                description: response.error.description || 'Something went wrong.',
            });
            setIsLoading(false);
            setPaymentMethod(null);
        });
        rzp.open();

    } catch (error: any) {
        console.error("Razorpay Error:", error);
        toast({ title: "Error", description: error.message || "Could not initiate payment.", variant: "destructive" });
        setIsLoading(false);
        setPaymentMethod(null);
    }
  }
  
  const handleCashOnDelivery = (shippingDetails: CustomerDetails) => {
    setIsLoading(true);
    setPaymentMethod('cod');
    // Simulate processing time for COD
    setTimeout(() => {
        placeOrder(shippingDetails);
        setIsLoading(false);
        setPaymentMethod(null);
    }, 1000);
  };


  const onFormSubmit = (data: CheckoutFormValues) => {
    if (paymentMethod === 'online') {
      handleRazorpayPayment(data);
    } else if (paymentMethod === 'cod') {
      handleCashOnDelivery(data);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsLoading(false);
        setPaymentMethod(null);
      }
      onClose();
    }}>
      <DialogContent className="sm:max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Confirm Purchase</DialogTitle>
          <DialogDescription>
            Confirm your shipping details for "{productNames}".
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <Form {...form}>
                <form id="shipping-form" onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4 pt-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="Your Name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} placeholder="your@email.com" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} placeholder="10-digit mobile number" /></FormControl><FormMessage /></FormItem>
                    )} />
                    </div>
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Street Address</FormLabel><FormControl><Input {...field} placeholder="House No, Street Name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} placeholder="City" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} placeholder="State" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="pincode" render={({ field }) => (
                        <FormItem><FormLabel>Pincode</FormLabel><FormControl><Input {...field} placeholder="6-digit Pincode" /></FormControl><FormMessage /></FormItem>
                    )} />
                    </div>
                </form>
              </Form>

            <Separator/>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{totalToCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">Free</span>
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
                onClick={() => {
                  setPaymentMethod('online');
                  form.handleSubmit(onFormSubmit)();
                }}
                disabled={isLoading}
            >
                {isLoading && paymentMethod === 'online' ? <Loader2 className="animate-spin" /> : "Pay Online"}
            </Button>
            <Button
                variant={'outline'}
                className="flex-1"
                onClick={() => {
                  setPaymentMethod('cod');
                  form.handleSubmit(onFormSubmit)();
                }}
                disabled={isLoading}
            >
                {isLoading && paymentMethod === 'cod' ? <Loader2 className="animate-spin" /> : "Cash on Delivery"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
