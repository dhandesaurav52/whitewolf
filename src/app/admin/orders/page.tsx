
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
import { MoreHorizontal, Truck, Package, CheckCircle, Ban, RefreshCw, Undo2, Check, Star, Search, MapPin, Phone, Loader2 } from "lucide-react";
import type { Order, OrderStatus, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import CollapsibleTableRow from "@/components/CollapsibleTableRow";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as db from '@/lib/firestore';
import { useToast } from "@/hooks/use-toast";
import { Timestamp } from "firebase/firestore";

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

const formatDate = (timestamp: any): string => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toLocaleDateString();
    }
    if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleDateString();
    }
    return 'N/A';
};

export default function ManageOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [imagesInView, setImagesInView] = useState<string[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const allOrders = await db.orders.getAll();
            setOrders(allOrders.sort((a, b) => {
                const dateA = a.orderDate instanceof Timestamp ? a.orderDate.toMillis() : new Date(a.orderDate).getTime();
                const dateB = b.orderDate instanceof Timestamp ? b.orderDate.toMillis() : new Date(b.orderDate).getTime();
                return dateB - dateA;
            }));
        } catch (error) {
            console.error("Failed to load orders", error);
            toast({ title: "Error", description: "Failed to load orders.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        setIsMounted(true);
        loadOrders();
    }, [loadOrders]);

    const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
        try {
            let updateData: Partial<Order> = { status: newStatus };
            if (newStatus === 'Delivered') {
                updateData.deliveryDate = new Date();
            }
            await db.orders.update(orderId, updateData);
            setOrders(orders.map(order => order.id === orderId ? { ...order, ...updateData } : order));
            toast({ title: "Status Updated", description: `Order marked as ${newStatus}.` });
        } catch (error) {
            console.error("Failed to update order status", error);
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };
    
    const getActionableStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
        if (currentStatus === 'Return Requested') return ['Return Accepted'];
        if (currentStatus === 'Return Accepted') return ['Return Confirmed'];
        if (currentStatus === 'Return Confirmed') return ['Return Successful'];
        return (Object.keys(statusStyles) as OrderStatus[]).filter(s => !s.startsWith('Return'));
    }

    const filteredOrders = orders.filter(order => {
        const searchTermLower = searchTerm.toLowerCase();
        const statusMatches = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
        
        const searchMatches = searchTermLower === '' ||
            order.id.toLowerCase().includes(searchTermLower) ||
            order.customer.name.toLowerCase().includes(searchTermLower) ||
            order.customer.email.toLowerCase().includes(searchTermLower) ||
            order.status.toLowerCase().includes(searchTermLower);

        return statusMatches && searchMatches;
    });

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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold font-headline text-accent">Manage Orders</h1>
                        <p className="text-muted-foreground mt-1">View and process customer orders.</p>
                    </div>
                     <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search..." 
                                className="pl-9" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                         <Select onValueChange={setStatusFilter} defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {Object.keys(statusStyles).map(status => (
                                    <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={loadOrders}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
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
                                {isLoading ? (
                                     <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
                                ) : filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                    <CollapsibleTableRow
                                      key={order.id}
                                      content={
                                          <div className="p-4 bg-muted/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                              <div>
                                                <h4 className="font-semibold mb-2">Order Items:</h4>
                                                <div className="space-y-2">
                                                    {order.items.map(item => {
                                                        const imageUrls = item.product.images?.length > 0 ? item.product.images : ["https://placehold.co/100x100.png"];
                                                        return (
                                                          <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-4">
                                                              <button onClick={() => setImagesInView(imageUrls)} className="cursor-pointer">
                                                                <Image src={imageUrls[0]} alt={item.product.name} width={48} height={48} className="rounded-md border" />
                                                              </button>
                                                              <div className="flex-grow">
                                                                  <p className="font-medium">{item.product.name}</p>
                                                                  <div className="flex gap-2 text-sm text-muted-foreground">
                                                                    <p>Qty: {item.quantity}</p>
                                                                    {item.size && <p>Size: {item.size}</p>}
                                                                  </div>
                                                              </div>
                                                              <p className="font-medium">{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                                          </div>
                                                        )
                                                    })}
                                                </div>
                                              </div>
                                              <div>
                                                <h4 className="font-semibold mb-2">Shipping Details:</h4>
                                                <div className="space-y-2 text-sm">
                                                   <div className="flex items-start gap-2">
                                                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">{order.customer.name}</p>
                                                            <p className="text-muted-foreground">{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <p className="text-muted-foreground">{order.customer.phone}</p>
                                                    </div>
                                                </div>
                                              </div>
                                          </div>
                                      }
                                    >
                                        <TableCell className="font-medium">#{order.id.substring(0, 6)}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customer.name}</div>
                                            <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                                        </TableCell>
                                        <TableCell>{formatDate(order.orderDate)}</TableCell>
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

    
