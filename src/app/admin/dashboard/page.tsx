
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, ShoppingCart, Package, Users, DollarSign, TrendingUp, PackageX } from "lucide-react";
import type { Product as ProductType, Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import * as db from '@/lib/firestore';
import { Timestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isDataLoading, setIsDataLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsDataLoading(true);
        try {
            const [productsData, ordersData] = await Promise.all([
                db.products.getAll(),
                db.orders.getAll()
            ]);
            setProducts(productsData);
            setOrders(ordersData);
        } catch (error) {
            console.error("Failed to load data from Firestore", error);
            toast({
                title: "Error",
                description: "Could not fetch data. Please try again.",
                variant: "destructive"
            });
        }
        setIsDataLoading(false);
    }, [toast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const analyticsData = useMemo(() => {
        const deliveredOrders = orders.filter(order => order.status === 'Delivered');

        // Monthly Sales
        const monthlySales: { [key: string]: number } = {};
        deliveredOrders.forEach(order => {
            const date = order.orderDate instanceof Timestamp ? order.orderDate.toDate() : new Date(order.orderDate);
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthlySales[month]) {
                monthlySales[month] = 0;
            }
            monthlySales[month] += order.total;
        });

        const salesChartData = Object.entries(monthlySales)
            .map(([month, sales]) => ({ month, sales }))
            .sort((a, b) => new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime());


        // Top Selling Products
        const productSales: { [key: string]: { name: string; count: number } } = {};
        deliveredOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.product.id]) {
                    productSales[item.product.id] = { name: item.product.name, count: 0 };
                }
                productSales[item.product.id].count += item.quantity;
            });
        });

        const topSellingProducts = Object.values(productSales)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        
        // Low Stock Products
        const lowStockProducts = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);

        return { salesChartData, topSellingProducts, lowStockProducts };
    }, [orders, products]);


    const totalRevenue = orders
        .filter(order => order.status === 'Delivered')
        .reduce((sum, order) => sum + order.total, 0);

    const newOrdersCount = orders.filter(order => order.status === 'Pending').length;
    
    const productsCount = products.length;

    const totalUsers = new Set(orders.map(order => order.customer.email)).size;

    const stats = [
        { title: "Total Revenue", value: `${totalRevenue.toFixed(2)}`, description: "Based on delivered orders", icon: BarChart },
        { title: "New Orders", value: newOrdersCount.toString(), description: "Orders pending fulfillment", icon: ShoppingCart },
        { title: "Total Products", value: productsCount.toString(), description: "Total products in catalog", icon: Package },
        { title: "Total Users", value: totalUsers.toString(), description: "Unique customers with orders", icon: Users },
    ];

    return (
        <div className="container mx-auto py-10 space-y-8">
            <h1 className="text-4xl font-bold font-headline text-accent">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             {isDataLoading ? (
                                <Skeleton className="h-8 w-1/2" />
                            ) : (
                                <div className="text-2xl font-bold">{stat.value}</div>
                            )}
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline text-accent flex items-center gap-2">
                            <DollarSign className="h-6 w-6" /> Monthly Sales Overview
                        </CardTitle>
                        <CardDescription>A summary of your revenue from delivered orders each month.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {isDataLoading ? (
                            <Skeleton className="w-full h-full" />
                        ) : analyticsData.salesChartData.length > 0 ? (
                           <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData.salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                     <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent 
                                            formatter={(value) => `${value.toLocaleString()}`}
                                            labelClassName="font-bold"
                                            indicator="dot"
                                        />}
                                    />
                                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No sales data available yet.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-headline text-accent flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" /> Top Selling Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {isDataLoading ? <Skeleton className="h-24 w-full" /> : analyticsData.topSellingProducts.length > 0 ? (
                               <ul className="space-y-2">
                                {analyticsData.topSellingProducts.map(p => (
                                    <li key={p.name} className="flex justify-between items-center text-sm">
                                        <span className="font-medium truncate pr-2">{p.name}</span>
                                        <Badge variant="secondary">{p.count} sold</Badge>
                                    </li>
                                ))}
                               </ul>
                           ) : <p className="text-sm text-muted-foreground">No sales data yet.</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-headline text-accent flex items-center gap-2">
                                <PackageX className="h-5 w-5" /> Low Stock Alerts
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {isDataLoading ? <Skeleton className="h-24 w-full" /> : analyticsData.lowStockProducts.length > 0 ? (
                               <ul className="space-y-2">
                                {analyticsData.lowStockProducts.map(p => (
                                    <li key={p.id} className="flex justify-between items-center text-sm">
                                        <span className="font-medium truncate pr-2">{p.name}</span>
                                        <Badge variant="destructive">{p.stock} left</Badge>
                                    </li>
                                ))}
                               </ul>
                           ) : <p className="text-sm text-muted-foreground">All products are well-stocked.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
