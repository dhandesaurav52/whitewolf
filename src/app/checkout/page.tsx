
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import ConfirmPurchaseDialog from "@/components/ConfirmPurchaseDialog";
import { useAuth } from "@/hooks/useAuth";

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

export default function CheckoutPage() {
    const { cart, cartTotal, isLoaded, clearCart } = useCart();
    const { user } = useAuth();
    const [isConfirming, setIsConfirming] = useState(false);

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: { name: user?.displayName || "", email: user?.email || "" },
    });

    if (!isLoaded) {
        return <div>Loading cart...</div>;
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Your cart is empty</h2>
                <Button asChild className="mt-4">
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
            </div>
        );
    }
    
    const handlePlaceOrder = () => {
        setIsConfirming(true);
    };

    return (
        <>
            <div className="container mx-auto py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-headline">Checkout</h1>
                </div>
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Review the items in your cart.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {cart.map(({ product, quantity }) => (
                                <div key={product.id} className="flex items-center gap-4">
                                    <div className="relative w-16 h-20 rounded-md overflow-hidden">
                                        <Image
                                            src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/100x100.png"}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {quantity}
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            ₹{product.price}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        ₹{(parseFloat(product.price) * quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                            <Separator />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="space-y-8">
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePlaceOrder}
                        >
                            Place Order
                        </Button>
                    </div>
                </div>
            </div>
            {isConfirming && (
                <ConfirmPurchaseDialog
                    isOpen={isConfirming}
                    onClose={() => setIsConfirming(false)}
                    cartItems={cart}
                    cartTotal={cartTotal}
                    clearCart={clearCart}
                />
            )}
        </>
    );
}
