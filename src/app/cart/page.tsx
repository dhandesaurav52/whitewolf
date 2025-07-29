
"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isLoaded } = useCart();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  if (cart.length === 0) {
    return (
       <div className="text-center py-20 bg-card border rounded-lg container mx-auto">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Your Cart is Empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
            </p>
            <Button asChild className="mt-6">
                <Link href="/shop">Start Shopping</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold font-headline">My Cart</h1>
        <p className="text-muted-foreground mt-2">You have {cartCount} item(s) in your cart.</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <Card key={product.id} className="flex items-center p-4">
              <div className="relative h-24 w-24 rounded-md overflow-hidden mr-4">
                <Image
                  src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/100x100.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-muted-foreground text-sm">{product.category}</p>
                <p className="text-primary font-bold mt-1">₹{product.price}</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 border rounded-md">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, quantity - 1)} className="h-8 w-8">
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(product.id, quantity + 1)} className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                    </Button>
                 </div>
                 <Button variant="ghost" size="icon" className="text-destructive" onClick={() => removeFromCart(product.id)}>
                    <Trash2 className="h-5 w-5" />
                 </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg">Proceed to Checkout</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
