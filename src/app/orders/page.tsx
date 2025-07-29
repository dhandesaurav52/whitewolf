
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Order } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, CheckCircle, Ban } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ORDERS_STORAGE_KEY = 'orders';

const statusStyles: { [key in Order['status']]: { icon: React.ElementType, color: string, text: string } } = {
  Pending: { icon: Package, color: "bg-yellow-500", text: "text-yellow-50" },
  Confirmed: { icon: CheckCircle, color: "bg-blue-500", text: "text-blue-50" },
  Shipped: { icon: Truck, color: "bg-green-500", text: "text-green-50" },
  Delivered: { icon: CheckCircle, color: "bg-emerald-600", text: "text-emerald-50" },
  Cancelled: { icon: Ban, color: "bg-red-500", text: "text-red-50" },
};

export default function OrdersPage() {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (user) {
            try {
                const allOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
                const allOrders: Order[] = allOrdersRaw ? JSON.parse(allOrdersRaw) : [];
                const userOrders = allOrders.filter(order => order.customer.userId === user.uid);
                setOrders(userOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
            } catch (error) {
                console.error("Failed to load orders", error);
            }
        }
    }, [user]);

    if (loading || !isClient) {
        return <div>Loading orders...</div>;
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
                                    <CardTitle>Order #{order.id.split('_')[1]}</CardTitle>
                                    <CardDescription>
                                        Placed on {new Date(order.orderDate).toLocaleDateString()}
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
                                            <Image src={item.product.images[0] || "https://placehold.co/100x100.png"} alt={item.product.name} width={64} height={64} className="rounded-md border" />
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="ml-auto font-medium">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end font-semibold text-lg">
                                Total: ₹{order.total.toFixed(2)}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}

    