
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Order, OrderStatus } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CheckCircle, Ban, Undo2, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import * as db from "@/lib/firestore";
import { Timestamp } from "firebase/firestore";

const statusStyles: { [key in Order['status']]: { icon: React.ElementType, color: string, text: string } } = {
  Pending: { icon: Package, color: "bg-yellow-500", text: "text-yellow-50" },
  Confirmed: { icon: CheckCircle, color: "bg-blue-500", text: "text-blue-50" },
  Shipped: { icon: Truck, color: "bg-green-500", text: "text-green-50" },
  Delivered: { icon: CheckCircle, color: "bg-emerald-600", text: "text-emerald-50" },
  Cancelled: { icon: Ban, color: "bg-red-500", text: "text-red-50" },
  "Return Requested": { icon: Undo2, color: "bg-orange-500", text: "text-orange-50" },
  "Return Accepted": { icon: CheckCircle, color: "bg-cyan-500", text: "text-cyan-50" },
  "Return Confirmed": { icon: Truck, color: "bg-indigo-500", text: "text-indigo-50" },
  "Return Successful": { icon: Star, color: "bg-purple-500", text: "text-purple-50" },
};

const formatDate = (timestamp: any): string => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toLocaleDateString();
    }
    if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString();
    }
    return 'N/A';
};

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const loadUserOrders = useCallback(async () => {
        if (user) {
            setIsLoading(true);
            try {
                const userOrders = await db.orders.getByUser(user.uid);
                // Sort orders by date on the client side
                const sortedOrders = userOrders.sort((a, b) => {
                    const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
                    const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
                    return dateB - dateA;
                });
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Failed to load orders", error);
                 toast({ title: "Error", description: "Could not fetch your orders.", variant: "destructive" });
            } finally {
                setIsLoading(false);
            }
        } else {
            setOrders([]);
            setIsLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        setIsClient(true);
        if (!authLoading) {
            loadUserOrders();
        }
    }, [authLoading, loadUserOrders]);
    
    const handleOrderStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await db.orders.update(orderId, { status: newStatus });
            loadUserOrders(); // Reload orders to reflect the change
            toast({
                title: `Order Updated`,
                description: `Your order status is now "${newStatus}".`,
            });
        } catch (error) {
            console.error(`Failed to update order to ${newStatus}`, error);
             toast({
                title: "Error",
                description: "Failed to update the order. Please try again.",
                variant: "destructive",
            });
        }
    };

    const isReturnEligible = (order: Order): boolean => {
        if (order.status !== 'Delivered' || !order.deliveryDate) {
            return false;
        }
        const deliveryDate = order.deliveryDate instanceof Timestamp ? order.deliveryDate.toDate() : new Date(order.deliveryDate);
        const sevenDaysAfterDelivery = new Date(deliveryDate);
        sevenDaysAfterDelivery.setDate(deliveryDate.getDate() + 7);
        
        const now = new Date();
        
        return now <= sevenDaysAfterDelivery;
    };


    if (authLoading || !isClient || isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8"/></div>;
    }

    if (!user) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-3xl font-bold">Please log in</h1>
                <p className="text-muted-foreground">You need to be logged in to view your orders.</p>
            </div>
        );
    }
    
    if (orders.length === 0) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h1 className="text-3xl font-bold font-headline">No Orders Yet</h1>
                <p className="text-muted-foreground mt-2">You haven't placed any orders with us.</p>
                <Button asChild className="mt-6">
                    <Link href="/shop">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-4xl font-bold font-headline text-accent">My Orders</h1>
            
            <div className="space-y-6">
                {orders.map(order => {
                    const statusInfo = statusStyles[order.status];
                    return (
                        <Card key={order.id}>
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle>Order #{order.id.substring(0,6)}</CardTitle>
                                    <CardDescription>
                                        Placed on {formatDate(order.orderDate)}
                                        {order.status === 'Delivered' && order.deliveryDate && ` | Delivered on ${formatDate(order.deliveryDate)}`}
                                    </CardDescription>
                                </div>
                                 <Badge className={cn("text-sm", statusInfo.color, statusInfo.text)}>
                                    <statusInfo.icon className="mr-2 h-4 w-4" />
                                    {order.status}
                                 </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map(item => (
                                        <div key={item.product.id} className="flex items-center gap-4">
                                            <Image src={(item.product.images && item.product.images[0]) || "https://placehold.co/100x100.png"} alt={item.product.name} width={64} height={64} className="rounded-md border" />
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="ml-auto font-medium">{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <span className="font-semibold text-lg">Total: {order.total.toFixed(2)}</span>
                                {order.status === 'Pending' && (
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">Cancel Order</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will cancel your order.
                                                You will not be charged.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Go Back</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleOrderStatusUpdate(order.id, 'Cancelled')}>
                                                Yes, Cancel Order
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                                {isReturnEligible(order) && (
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline">Return Order</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Request a Return</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to request a return for this order? Our team will review your request.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleOrderStatusUpdate(order.id, 'Return Requested')}>
                                                Confirm Return Request
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
