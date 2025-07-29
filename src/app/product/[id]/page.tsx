
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Minus, Plus, Heart, Ruler, ShoppingBag } from 'lucide-react';
import type { Product as ProductType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const PRODUCTS_STORAGE_KEY = 'products';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const allProducts: ProductType[] = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY) || '[]');
      const foundProduct = allProducts.find(p => p.id === id);
      setProduct(foundProduct || null);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12">
                <Skeleton className="w-full aspect-square" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-16" />
                        <div className="flex gap-2">
                           <Skeleton className="h-10 w-16" />
                           <Skeleton className="h-10 w-16" />
                           <Skeleton className="h-10 w-16" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-40" />
                        <Skeleton className="h-12 flex-grow" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  }

  const increaseQuantity = () => {
    setQuantity(q => Math.min(q + 1, product.stock || 10));
  }
  
  const decreaseQuantity = () => {
    setQuantity(q => Math.max(1, q - 1));
  }

  const availableSizes = (product.textSizes?.split(',') || []).map(s => s.trim());


  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <Carousel className="w-full">
            <CarouselContent>
                {(product.images && product.images.length > 0 ? product.images : ["https://placehold.co/600x800.png"]).map((img, index) => (
                    <CarouselItem key={index}>
                        <Card className="overflow-hidden aspect-[4/5] relative">
                            <Image
                                src={img}
                                alt={`${product.name} image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </Card>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" />
        </Carousel>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">{product.name}</h1>
            <div className="flex items-center gap-4">
                <p className="text-2xl font-semibold text-accent">₹{product.price}</p>
                {product.originalPrice && (
                    <>
                        <p className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</p>
                        {product.discount && <Badge variant="destructive">{product.discount}</Badge>}
                    </>
                )}
            </div>
          </div>

          <p className="text-muted-foreground text-base">
            {product.description || 'No description available.'}
          </p>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-primary">Size</h3>
                <Button variant="link" size="sm" className="text-muted-foreground gap-1">
                    <Ruler className="h-4 w-4" /> Size Guide
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                    <Button 
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => handleSizeSelect(size)}
                        className="w-16"
                    >
                        {size}
                    </Button>
                ))}
            </div>
          </div>
          
           <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-primary">Quantity</h3>
            <div className="flex items-center gap-2 border rounded-md">
              <Button variant="ghost" size="icon" onClick={decreaseQuantity} className="h-9 w-9">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={increaseQuantity} className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-3">
             <Button variant="outline" size="lg" className="flex-1">
                <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
             <Button variant="destructive" size="lg" className="flex-1 bg-red-500 hover:bg-red-600">
                Buy Now
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
