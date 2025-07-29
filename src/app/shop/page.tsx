
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal, Heart, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Advertisement } from '@/lib/types';
import type { Product as ProductType } from '@/lib/types';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';


const ADS_STORAGE_KEY = 'advertisements';
const PRODUCTS_STORAGE_KEY = 'products';

const initialProducts: ProductType[] = [];

const ProductCard = ({ product }: { product: ProductType }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  return (
    <Card className="group overflow-hidden rounded-lg bg-card text-card-foreground border-border relative">
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
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={() => toggleWishlist(product)}>
          <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-destructive text-destructive")} />
        </Button>
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={() => addToCart(product, 1)}>
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-headline text-lg text-primary truncate">{product.name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-accent font-semibold text-base">₹{product.price}</p>
          {product.originalPrice && (
            <p className="text-muted-foreground text-sm line-through">₹{product.originalPrice}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export default function ShopPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);

     useEffect(() => {
        let storedProducts: ProductType[] = [];
        try {
            const productsFromStorage = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            if (productsFromStorage) {
                storedProducts = JSON.parse(productsFromStorage);
            } else {
                storedProducts = initialProducts;
                localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
            }
        } catch (error) {
            console.error("Failed to load products from storage, using initial products.", error);
            storedProducts = initialProducts;
        }
        setAllProducts(storedProducts);
    }, []);

    useEffect(() => {
        const applyDiscountsAndFilter = () => {
            try {
                const storedAds = localStorage.getItem(ADS_STORAGE_KEY);
                const activeAds: Advertisement[] = storedAds ? JSON.parse(storedAds).filter((ad: Advertisement) => ad.status === 'Active') : [];
                const categoryAds = activeAds.filter(ad => ad.appliesTo === 'categories' && ad.selectedCategories.length > 0);
                
                let shopProducts = allProducts.filter(p => p.displaySection === 'shop');

                const updatedProducts = shopProducts.map(p => {
                    let productPrice = parseFloat(p.price);
                    let originalProductPrice = p.originalPrice ? parseFloat(p.originalPrice) : parseFloat(p.price);
                    let appliedDiscount = p.discount;
                    
                    const applicableAd = categoryAds.find(ad => ad.selectedCategories.includes(p.category));

                    if (applicableAd) {
                         if (applicableAd.discountType === 'percentage') {
                            productPrice = originalProductPrice * (1 - applicableAd.discountValue / 100);
                            appliedDiscount = `${applicableAd.discountValue}% OFF`;
                        } else { // fixed
                            productPrice = originalProductPrice - applicableAd.discountValue;
                            appliedDiscount = `₹${applicableAd.discountValue} OFF`;
                        }
                        return {
                            ...p,
                            price: Math.round(productPrice).toString(),
                            originalPrice: originalProductPrice.toString(),
                            discount: appliedDiscount,
                        }
                    }

                    // Reset if no ad applies
                    return {
                        ...p,
                        originalPrice: p.originalPrice, // Keep original if it existed
                        discount: p.discount, // Keep original discount
                    };
                });
                
                setProducts(updatedProducts);

            } catch (error) {
                console.error("Failed to apply discounts", error);
                setProducts(allProducts.filter(p => p.displaySection === 'shop'));
            }
        };

        applyDiscountsAndFilter();

        const handleStorageChange = (event: StorageEvent) => {
             if (event.key === ADS_STORAGE_KEY || event.key === PRODUCTS_STORAGE_KEY) {
                // Refetch all products from local storage to ensure we have the latest list
                let storedProducts: ProductType[] = [];
                try {
                    const productsFromStorage = localStorage.getItem(PRODUCTS_STORAGE_KEY);
                    if (productsFromStorage) {
                        storedProducts = JSON.parse(productsFromStorage);
                    }
                } catch (error) {
                    console.error("Failed to load products from storage on change event.", error);
                }
                setAllProducts(storedProducts);
                // The useEffect watching allProducts will then re-run applyDiscountsAndFilter
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [allProducts]);

    const filters = [
        { placeholder: 'All Categories', options: ['T-Shirts', 'Shirts', 'Pants', 'Jeans'] },
        { placeholder: 'All Brands', options: ['Brand A', 'Brand B'] },
        { placeholder: 'All Colors', options: ['Black', 'White', 'Blue', 'Beige'] },
        { placeholder: 'All Sizes', options: ['S', 'M', 'L', 'XL'] },
    ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-headline text-accent">Shop Our Collection</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Browse our curated selection of high-quality apparel and accessories.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products or brands..."
              className="w-full pl-10 h-12 text-base"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-grow grid grid-cols-2 sm:flex sm:flex-wrap sm:flex-grow-0 gap-4">
                {filters.map((filter, idx) => (
                <Select key={idx}>
                    <SelectTrigger className="w-full sm:w-auto h-11">
                    <SelectValue placeholder={filter.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                    {filter.options.map((option) => (
                        <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                ))}
            </div>
            <Button variant="outline" className="h-11">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Sort
            </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? products.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          )) : <p className="col-span-full text-center text-muted-foreground">No products found. Add some from the admin dashboard!</p>}
        </div>
      </main>
    </div>
  );
}

    