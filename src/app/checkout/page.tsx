
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/lib/types";
import { useEffect } from "react";

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

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart, isLoaded: isCartLoaded } = useCart();
    const { user, loading: isAuthLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
        },
    });
    
    useEffect(() => {
        if (user) {
            form.setValue('name', user.displayName || '');
            form.setValue('email', user.email || '');
        }
    }, [user, form]);

    if (!isCartLoaded || isAuthLoading) {
        return <div>Loading...</div>;
    }

    if (cart.length === 0) {
        router.replace('/shop');
        return null;
    }

    const onSubmit = (data: CheckoutFormValues) => {
        const newOrder: Order = {
            id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            customer: {
                ...data,
                userId: user?.uid
            },
            items: cart,
            total: cartTotal,
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
                description: "Thank you for your purchase. Your order is being processed.",
            });
            
            clearCart();
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

    return (
        <div className="container mx-auto py-12">
            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                    <Button type="submit" className="w-full mt-6" size="lg">Place Order</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline">Your Order</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {cart.map(({ product, quantity }) => (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                            <Image src={product.images?.[0] || "https://placehold.co/100x100.png"} alt={product.name} fill className="object-cover" />
                                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs">
                                                {quantity}
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-medium">{product.name}</p>
                                        </div>
                                        <p>₹{(parseFloat(product.price) * quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Subtotal</p>
                                    <p>₹{cartTotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Shipping</p>
                                    <p>Free</p>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <p>Total</p>
                                    <p>₹{cartTotal.toFixed(2)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
