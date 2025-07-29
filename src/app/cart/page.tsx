
"use client";

import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ConfirmPurchaseDialog from "@/components/ConfirmPurchaseDialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, isLoaded, clearCart } = useCart();
  const [isConfirming, setIsConfirming] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

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

  const handleCheckout = () => {
    if (user) {
      setIsConfirming(true);
    } else {
      router.push('/login');
    }
  }

  return (
    <>
      <div className="container mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-headline">My Cart</h1>
          <p className="text-muted-foreground mt-2">You have {cartCount} item(s) in your cart.</p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12 items-start">
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
             <Button asChild variant="link" className="text-accent mt-4">
                <Link href="/shop"><ArrowLeft className="mr-2 h-4 w-4" />Continue Shopping</Link>
            </Button>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {isConfirming && user && (
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
