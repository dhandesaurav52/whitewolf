
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Truck, Package, CheckCircle, Ban, RefreshCw } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const ORDERS_STORAGE_KEY = 'orders';

const statusStyles: { [key in OrderStatus]: { color: string, text: string } } = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  Shipped: "bg-green-100 text-green-800 border-green-300",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusIcons: { [key in OrderStatus]: React.ElementType } = {
  Pending: Package,
  Confirmed: CheckCircle,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: Ban,
};

export default function ManageOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isClient, setIsClient] = useState(false);

    const loadOrders = () => {
        try {
            const allOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
            const allOrders: Order[] = allOrdersRaw ? JSON.parse(allOrdersRaw) : [];
            setOrders(allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        } catch (error) {
            console.error("Failed to load orders", error);
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadOrders();
    }, []);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
    };

    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold font-headline text-accent">Manage Orders</h1>
                    <p className="text-muted-foreground mt-1">View and process customer orders.</p>
                </div>
                <Button variant="outline" size="icon" onClick={loadOrders}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>
            
            <Card>
                <CardContent className="p-0">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.length > 0 ? orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id.split('_')[1]}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{order.customer.name}</div>
                                        <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                                    </TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                                    <TableCell>₹{order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("font-semibold", statusStyles[order.status])}>
                                            {React.createElement(statusIcons[order.status], { className: "mr-1 h-3 w-3" })}
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {Object.keys(statusStyles).map((status) => (
                                                    <DropdownMenuItem 
                                                        key={status} 
                                                        onClick={() => handleStatusChange(order.id, status as OrderStatus)}
                                                        disabled={order.status === status}
                                                    >
                                                        Mark as {status}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
