
"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isLoaded } = useWishlist();
  const { addToCart } = useCart();

  if (!isLoaded) {
    return <div>Loading...</div>; // Or a skeleton loader
  }
  
  if (isLoaded && wishlist.length === 0) {
    return (
      <div className="text-center py-20 bg-card border rounded-lg container mx-auto">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Your Wishlist is Empty</h3>
          <p className="mt-1 text-sm text-muted-foreground">
              You haven't added any items to your wishlist yet.
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
            <h1 className="text-4xl font-bold font-headline">My Wishlist</h1>
            <p className="text-muted-foreground mt-2">Your favorite styles, all in one place.</p>
        </div>

      {isLoaded && wishlist.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
             <Card key={product.id} className="group overflow-hidden rounded-lg bg-card text-card-foreground border-border relative transition-all duration-300 hover:border-primary hover:shadow-md">
                <Link href={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[4/5] bg-muted">
                    <Image
                        src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/400x500.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={product.aiHint}
                    />
                    {product.discount && (
                        <Badge
                        variant="destructive"
                        className="absolute top-3 left-3"
                        >
                        {product.discount}
                        </Badge>
                    )}
                    {product.new && !product.discount && (
                        <Badge
                        className="absolute top-3 left-3 bg-accent text-accent-foreground"
                        >
                        New
                        </Badge>
                    )}
                    </div>
                </Link>
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                    <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={() => toggleWishlist(product)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={() => addToCart(product, 1)}>
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                </div>
                <CardContent className="p-4 space-y-1">
                    {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
                    <h3 className="font-headline text-lg text-primary truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <p className="text-accent font-semibold text-base">{product.price}</p>
                      {product.originalPrice && (
                          <p className="text-muted-foreground text-sm line-through">{product.originalPrice}</p>
                      )}
                    </div>
                </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
