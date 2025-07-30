
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Minus, Plus, Heart, Ruler, ShoppingBag } from 'lucide-react';
import type { Product as ProductType, CartItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import ConfirmPurchaseDialog from '@/components/ConfirmPurchaseDialog';
import { useAuth } from '@/hooks/useAuth';

const PRODUCTS_STORAGE_KEY = 'products';

const ProductCard = ({ product }: { product: ProductType }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  return (
    <Card className="group overflow-hidden rounded-lg bg-card text-card-foreground border-border relative transition-all duration-300 hover:border-primary hover:shadow-md">
       <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/5] bg-muted">
          <Image
            src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/400x500.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={product.aiHint}
          />
        </div>
      </Link>
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={() => toggleWishlist(product)}>
          <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-destructive text-destructive")} />
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
  );
};

const ProductCarousel = ({ title, products }: { title: string, products: ProductType[] }) => {
  if (products.length === 0) return null;

  return (
    <div className="py-12">
        <h2 className="text-3xl font-bold font-headline text-center mb-8">{title}</h2>
        <Carousel
            opts={{
            align: "start",
            loop: products.length > 4,
            }}
            className="w-full"
        >
            <CarouselContent>
            {products.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                    <ProductCard product={product} />
                </div>
                </CarouselItem>
            ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
    </div>
  );
}


export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [complementaryProducts, setComplementaryProducts] = useState<ProductType[]>([]);
  const [moreProducts, setMoreProducts] = useState<ProductType[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [productToBuy, setProductToBuy] = useState<CartItem | null>(null);
  
  const { user } = useAuth();
  const { addToCart, clearCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    let allProducts: ProductType[] = [];
    if (id) {
      try {
        const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedProducts) {
          allProducts = JSON.parse(storedProducts);
        }
      } catch (error) {
        console.error("Could not parse products from local storage", error);
      }
      
      const foundProduct = allProducts.find(p => p.id === id);
      setProduct(foundProduct || null);

      if (foundProduct) {
        const similar = allProducts.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id);
        setSimilarProducts(similar);

        const complementary = allProducts.filter(p => p.category !== foundProduct.category);
        setComplementaryProducts(complementary.slice(0, 8));
        setMoreProducts(allProducts.filter(p => p.id !== foundProduct.id).slice(0, 4));
      }

      setLoading(false);
    }
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (product) {
      setProductToBuy({ product, quantity });
      setIsConfirming(true);
    }
  }

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
    <>
      <div className="container mx-auto px-4">
          <div className="py-6 md:py-12">
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
                          <p className="text-2xl font-semibold text-accent">{product.price}</p>
                          {product.originalPrice && (
                              <>
                                  <p className="text-xl text-muted-foreground line-through">{product.originalPrice}</p>
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
                      <Button variant="outline" size="lg" className="flex-1" onClick={() => addToCart(product, quantity)}>
                          <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                      </Button>
                      <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                          Buy Now
                      </Button>
                      <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => toggleWishlist(product)}>
                          <Heart className={cn("h-5 w-5", isInWishlist(product.id) && "fill-destructive text-destructive")} />
                      </Button>
                  </div>
                  </div>
              </div>
          </div>
          <Separator/>
          <ProductCarousel title="Similar Products" products={similarProducts} />
          <Separator/>
          <ProductCarousel title="Complete The Look" products={complementaryProducts} />
          <Separator/>
           <div className="py-12">
              <h2 className="text-3xl font-bold font-headline text-center mb-8">More Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {moreProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
          </div>
      </div>

      {isConfirming && user && (
          <ConfirmPurchaseDialog
              isOpen={isConfirming}
              onClose={() => setIsConfirming(false)}
              cartItems={[]} 
              cartTotal={0} 
              clearCart={clearCart}
              productToBuy={productToBuy}
          />
      )}
    </>
  );
}
