
"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { MoreHorizontal, Truck, Package, CheckCircle, Ban, RefreshCw, Undo2, Check, Star } from "lucide-react";
import type { Order, OrderStatus, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import CollapsibleTableRow from "@/components/CollapsibleTableRow";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


const ORDERS_STORAGE_KEY = 'orders';

const statusStyles: { [key in OrderStatus]: { color: string, text: string } } = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  Shipped: "bg-green-100 text-green-800 border-green-300",
  Delivered: "bg-emerald-100 text-emerald-800 border-emerald-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
  "Return Requested": "bg-orange-100 text-orange-800 border-orange-300",
  "Return Accepted": "bg-cyan-100 text-cyan-800 border-cyan-300",
  "Return Confirmed": "bg-indigo-100 text-indigo-800 border-indigo-300",
  "Return Successful": "bg-purple-100 text-purple-800 border-purple-300",
};

const statusIcons: { [key in OrderStatus]: React.ElementType } = {
  Pending: Package,
  Confirmed: CheckCircle,
  Shipped: Truck,
  Delivered: CheckCircle,
  Cancelled: Ban,
  "Return Requested": Undo2,
  "Return Accepted": Check,
  "Return Confirmed": Truck,
  "Return Successful": Star,
};

export default function ManageOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [imagesInView, setImagesInView] = useState<string[] | null>(null);

    const loadOrders = useCallback(() => {
        try {
            const allOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
            const allOrders: Order[] = allOrdersRaw ? JSON.parse(allOrdersRaw) : [];
            setOrders(allOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        } catch (error) {
            console.error("Failed to load orders", error);
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
        loadOrders();
        window.addEventListener('storage', loadOrders);
        return () => {
            window.removeEventListener('storage', loadOrders);
        }
    }, [loadOrders]);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        try {
            const allOrdersRaw = localStorage.getItem(ORDERS_STORAGE_KEY);
            const allOrders: Order[] = allOrdersRaw ? JSON.parse(allOrdersRaw) : [];
            const updatedOrders = allOrders.map(order => {
                if (order.id === orderId) {
                    const updatedOrder = { ...order, status: newStatus };
                    if (newStatus === 'Delivered') {
                        updatedOrder.deliveryDate = new Date().toISOString();
                    }
                    return updatedOrder;
                }
                return order;
            });
            localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
            window.dispatchEvent(new Event('storage')); // This will trigger the re-load
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };
    
    const getActionableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
        if (currentStatus === 'Return Requested') return ['Return Accepted'];
        if (currentStatus === 'Return Accepted') return ['Return Confirmed'];
        if (currentStatus === 'Return Confirmed') return ['Return Successful'];
        return (Object.keys(statusStyles) as OrderStatus[]).filter(s => !s.startsWith('Return'));
    }

    if (!isMounted) {
      return (
        <div className="container mx-auto py-10 space-y-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-10 w-10" />
            </div>
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {[...Array(7)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                {[...Array(7)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
      );
    }

    return (
        <>
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
                                    <TableHead className="w-8"></TableHead>
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
                                    <CollapsibleTableRow
                                      key={order.id}
                                      content={
                                          <div className="p-4 bg-muted/50">
                                              <h4 className="font-semibold mb-2">Order Items:</h4>
                                              <div className="space-y-2">
                                                  {order.items.map(item => {
                                                      const imageUrls = item.product.images?.length > 0 ? item.product.images : ["https://placehold.co/100x100.png"];
                                                      return (
                                                        <div key={item.product.id} className="flex items-center gap-4">
                                                            <button onClick={() => setImagesInView(imageUrls)} className="cursor-pointer">
                                                              <Image src={imageUrls[0]} alt={item.product.name} width={48} height={48} className="rounded-md border" />
                                                            </button>
                                                            <div className="flex-grow">
                                                                <p className="font-medium">{item.product.name}</p>
                                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-medium">{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                      )
                                                  })}
                                              </div>
                                          </div>
                                      }
                                    >
                                        <TableCell className="font-medium">#{order.id.split('_')[1]}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customer.name}</div>
                                            <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                                        </TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{order.items.reduce((acc, item) => acc + item.quantity, 0)}</TableCell>
                                        <TableCell>{order.total.toFixed(2)}</TableCell>
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
                                                    {getActionableStatuses(order.status).map((status) => (
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
                                    </CollapsibleTableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {imagesInView && (
                <Dialog open={!!imagesInView} onOpenChange={(open) => !open && setImagesInView(null)}>
                    <DialogContent className="max-w-xl">
                        <DialogHeader>
                            <DialogTitle>Product Images</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                           <Carousel>
                                <CarouselContent>
                                    {imagesInView.map((img, index) => (
                                        <CarouselItem key={index}>
                                            <div className="relative aspect-square">
                                                <Image src={img} alt={`Product image ${index + 1}`} fill className="object-contain" />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
