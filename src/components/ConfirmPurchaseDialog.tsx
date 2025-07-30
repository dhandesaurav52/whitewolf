
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
import type { CustomerDetails, CartItem, Order, ProfileAddress } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import * as db from '@/lib/firestore';
import { serverTimestamp } from "firebase/firestore";

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
  const [addressOption, setAddressOption] = useState("default");
  const [profileAddress, setProfileAddress] = useState<ProfileAddress | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  const itemsToPurchase = productToBuy ? [productToBuy] : cartItems;
  const totalToCharge = productToBuy ? (parseFloat(productToBuy.product.price) * productToBuy.quantity) : cartTotal;
  const shippingCost = 100.00;
  const totalAmount = totalToCharge + shippingCost;
  const productNames = itemsToPurchase.map(item => item.product.name).join(', ');

  const form = useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: { name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" },
  });
  
  useEffect(() => {
    if (user && isOpen) {
        setIsLoading(true);
        db.profiles.get(user.uid).then(profileData => {
            if (profileData) {
                setProfileAddress(profileData);
                form.reset({
                    name: user.displayName || '',
                    email: user.email || '',
                    phone: profileData.mobile || '',
                    address: profileData.address?.street || '',
                    city: profileData.address?.city || '',
                    state: profileData.address?.state || '',
                    pincode: profileData.address?.pincode || '',
                });
                if (!profileData.address?.street || !profileData.mobile) {
                    setAddressOption('new');
                } else {
                    setAddressOption('default');
                }
            } else {
                 setProfileAddress(null);
                 setAddressOption('new');
            }
        }).catch(e => {
            console.error("Failed to load profile data", e);
            setProfileAddress(null);
            setAddressOption('new');
        }).finally(() => {
            setIsLoading(false);
        });
    }
  }, [user, isOpen, form]);
  
  const placeOrder = async (shippingDetails: CustomerDetails, paymentId?: string) => {
    if (!user) {
        toast({ title: "Not Authenticated", description: "You must be logged in to place an order.", variant: "destructive" });
        return;
    }
    const newOrder: Omit<Order, 'id'> = {
        customer: { ...shippingDetails, userId: user.uid },
        items: itemsToPurchase,
        total: totalAmount,
        status: 'Pending',
        orderDate: serverTimestamp(),
        ...(paymentId && { paymentId }),
    };

    try {
        await db.orders.add(newOrder);
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

  const handleRazorpayPayment = (shippingDetails: CustomerDetails) => {
    setIsLoading(true);

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100, // Amount in paise
        currency: "INR",
        name: "White Wolf",
        description: `Purchase of ${productNames}`,
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
            color: "#111827" // This can be your primary theme color
        },
        modal: {
            ondismiss: function() {
                setIsLoading(false);
                setPaymentMethod(null);
            }
        }
    };

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        toast({
            variant: 'destructive',
            title: 'Razorpay Not Configured',
            description: 'The Razorpay Key ID is not set. Please contact support.',
        });
        setIsLoading(false);
        return;
    }

    try {
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
    } catch (error) {
        console.error("Razorpay Error:", error);
        toast({ title: "Error", description: "Could not initiate payment.", variant: "destructive" });
        setIsLoading(false);
    }
  }
  
  const handleCashOnDelivery = (shippingDetails: CustomerDetails) => {
    setIsLoading(true);
    placeOrder(shippingDetails).finally(() => {
        setIsLoading(false);
        setPaymentMethod(null);
    });
  };

  const onFormSubmit = (data: CheckoutFormValues) => {
    if (paymentMethod === 'online') {
      handleRazorpayPayment(data);
    } else if (paymentMethod === 'cod') {
      handleCashOnDelivery(data);
    }
  };
  
  const handlePayment = async (method: "online" | "cod") => {
    const isFormValid = await form.trigger();
    if (!isFormValid) {
        toast({ title: "Invalid Address", description: "Please fill in all the required address fields.", variant: "destructive"});
        return;
    }
    setPaymentMethod(method);
    form.handleSubmit(onFormSubmit)();
  }

  const hasDefaultAddress = profileAddress && profileAddress.address && profileAddress.address.street && profileAddress.mobile;

  const handleEditAddressClick = () => {
    onClose();
    router.push('/profile');
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
             <RadioGroup value={addressOption} onValueChange={(value) => {
                 setAddressOption(value);
                 if(value === 'default' && profileAddress) {
                    form.reset({
                        name: user?.displayName || '',
                        email: user?.email || '',
                        phone: profileAddress.mobile,
                        address: profileAddress.address.street,
                        city: profileAddress.address.city,
                        state: profileAddress.address.state,
                        pincode: profileAddress.address.pincode,
                    });
                 } else if (value === 'new') {
                     form.reset({
                        name: user?.displayName || '',
                        email: user?.email || '',
                        phone: '', address: '', city: '', state: '', pincode: ''
                     });
                 }
             }}>
                <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <RadioGroupItem value="default" id="default-address" disabled={!hasDefaultAddress} />
                            <Label htmlFor="default-address" className="font-semibold">Use Default Address</Label>
                        </div>
                         {hasDefaultAddress && <Button variant="ghost" size="sm" onClick={handleEditAddressClick}><Pencil className="mr-2 h-3 w-3" />Change</Button>}
                    </div>
                    {hasDefaultAddress ? (
                        <div className="pl-7 pt-2 text-sm text-muted-foreground">
                            <p className="font-medium">{profileAddress?.address?.street}</p>
                            <p>{profileAddress?.address?.city}, {profileAddress?.address?.state} - {profileAddress?.address?.pincode}</p>
                            <p>Mobile: {profileAddress?.mobile}</p>
                        </div>
                    ) : (
                        <div className="pl-7 pt-2 text-sm text-destructive">
                           No default address and/or phone number found. Please add them in your profile.
                        </div>
                    )}
                </div>
                <div className="rounded-md border p-4">
                     <div className="flex items-center gap-3">
                        <RadioGroupItem value="new" id="new-address" />
                        <Label htmlFor="new-address" className="font-semibold">Ship to a New Address</Label>
                    </div>
                </div>
            </RadioGroup>

            {addressOption === 'new' && (
              <Form {...form}>
                <form id="shipping-form" className="space-y-4 pt-4 border-t">
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
                className="flex-1"
                onClick={() => handlePayment('online')}
                disabled={isLoading}
            >
                {isLoading && paymentMethod === 'online' ? <Loader2 className="animate-spin" /> : "Pay Online"}
            </Button>
            <Button
                variant={'secondary'}
                className="flex-1"
                onClick={() => handlePayment('cod')}
                disabled={isLoading}
            >
                {isLoading && paymentMethod === 'cod' ? <Loader2 className="animate-spin" /> : "Cash on Delivery"}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
