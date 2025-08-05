
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, useCarousel } from "@/components/ui/carousel";
import type { Product as ProductType } from '@/lib/types';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';

const getSymbol = (currencyCode: string) => {
    if (currencyCode === 'INR') return '₹';
    if (currencyCode === 'USD') return '$';
    return '₹';
}

function ProductCardCarousel({ product }: { product: ProductType }) {
  const { scrollPrev, scrollNext } = useCarousel();
  const productImages = product.images && product.images.length > 0 ? product.images : ["https://placehold.co/400x500.png"];

  return (
    <>
      <Link href={`/product/${product.id}`} className="block">
        <CarouselContent>
          {productImages.map((imgSrc, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[3/4] bg-muted">
                <Image
                  src={imgSrc}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={product.aiHint}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Link>
      {productImages.length > 1 && (
        <>
          <CarouselPrevious onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollPrev(); }} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollNext(); }} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
        </>
      )}
    </>
  );
}


export default function ProductCard({ product }: { product: ProductType }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
    } else {
      toggleWishlist(product);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
    } else {
      addToCart(product, 1);
    }
  };

  return (
    <Card className="group overflow-hidden rounded-lg bg-card text-card-foreground border-border relative transition-all duration-300 hover:border-primary hover:shadow-md">
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={handleWishlistClick}>
          <Heart className={cn("h-4 w-4", user && isInWishlist(product.id) && "fill-destructive text-destructive")} />
        </Button>
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={handleAddToCartClick}>
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>

      <Carousel className="w-full" opts={{ loop: product.images && product.images.length > 1 }}>
        <ProductCardCarousel product={product} />
        {product.offerType === 'buy-x-get-y' && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Combo
            </Badge>
          )}
          {product.discount && (
            <Badge variant="destructive" className={cn("absolute left-3", product.offerType === 'buy-x-get-y' ? "top-10" : "top-3")}>
              {product.discount}
            </Badge>
          )}
          {product.new && !product.discount && product.offerType !== 'buy-x-get-y' && (
            <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
              New
            </Badge>
          )}
      </Carousel>
      
      <CardContent className="p-3 space-y-1">
        {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
        <h3 className="font-headline text-lg text-primary truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <div className="flex items-baseline gap-2 pt-1">
          <p className="text-accent font-semibold text-base">{getSymbol(product.currency)}{product.price}</p>
          {product.originalPrice && (
            <p className="text-muted-foreground text-sm line-through">{getSymbol(product.currency)}{product.originalPrice}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
