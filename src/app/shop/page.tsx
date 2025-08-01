
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
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
import type { Advertisement, Product as ProductType } from '@/lib/types';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import * as db from "@/lib/firestore";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }: { product: ProductType }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleWishlistClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      toggleWishlist(product);
    }
  };

  const handleAddToCartClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      addToCart(product, 1);
    }
  };

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
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={handleWishlistClick}>
          <Heart className={cn("h-4 w-4", user && isInWishlist(product.id) && "fill-destructive text-destructive")} />
        </Button>
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background" onClick={handleAddToCartClick}>
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4 space-y-1">
        {product.brand && <p className="text-sm text-muted-foreground">{product.brand}</p>}
        <h3 className="font-headline text-lg text-primary truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <div className="flex items-baseline gap-2 pt-1">
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
    const [allProducts, setAllProducts] = useState<ProductType[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const searchParams = useSearchParams();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedBrand, setSelectedBrand] = useState('all');
    const [selectedColor, setSelectedColor] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [sortOption, setSortOption] = useState('latest');

    const loadData = useCallback(async () => {
        setIsMounted(true);
        try {
            const productsData = await db.products.getAll();
            const shopProducts = productsData.map(p => ({...p, originalPrice: p.originalPrice || p.price })).filter(p => p.displaySection === 'shop');
            setAllProducts(shopProducts);
        } catch (error) {
            console.error("Failed to load products from firestore", error);
        }
    }, []);

    useEffect(() => {
        const categoryQuery = searchParams.get('category');
        if (categoryQuery) {
            setSelectedCategory(categoryQuery);
        }
        const sortQuery = searchParams.get('sort');
        if(sortQuery) {
            setSortOption(sortQuery);
        }
    }, [searchParams]);
    
    useEffect(() => {
        loadData();
    }, [loadData]);


    useEffect(() => {
        const applyDiscountsAndFilters = async () => {
            let productsWithDiscounts = allProducts;
            try {
                const allAds = await db.ads.getAll();
                const activeAds: Advertisement[] = allAds.filter((ad: Advertisement) => ad.status === 'Active');
                const categoryAds = activeAds.filter(ad => ad.appliesTo === 'categories' && ad.selectedCategories.length > 0);
                
                productsWithDiscounts = allProducts.map(p => {
                    const originalProductPrice = parseFloat(p.originalPrice || p.price);
                    let productPrice = originalProductPrice;
                    let appliedDiscount = p.discount;
                    
                    const applicableAd = categoryAds.find(ad => ad.selectedCategories.map(c=>c.toLowerCase()).includes(p.category.toLowerCase()));

                    if (applicableAd) {
                         if (applicableAd.discountType === 'percentage') {
                            productPrice = originalProductPrice * (1 - applicableAd.discountValue / 100);
                            appliedDiscount = `${applicableAd.discountValue}% OFF`;
                        } else if (applicableAd.discountType === 'fixed') { // fixed
                            productPrice = originalProductPrice - applicableAd.discountValue;
                             appliedDiscount = `₹${applicableAd.discountValue} OFF`;
                        }
                        return {
                            ...p,
                            price: productPrice.toFixed(2),
                            originalPrice: originalProductPrice.toString(),
                            discount: appliedDiscount,
                        }
                    }
                    
                    // Reset if no ad applies
                    return {
                        ...p,
                        price: originalProductPrice.toFixed(2),
                        originalPrice: null, // No discount, so no original price to show
                        discount: null,
                    };
                });
                
            } catch (error) {
                console.error("Failed to apply discounts", error);
            }

            let processedProducts = productsWithDiscounts;

            // Filtering
            if (searchTerm) {
                processedProducts = processedProducts.filter(p => 
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }
            if (selectedCategory !== 'all') {
                processedProducts = processedProducts.filter(p => p.category.toLowerCase() === selectedCategory);
            }
            if (selectedBrand !== 'all') {
                processedProducts = processedProducts.filter(p => p.brand?.toLowerCase() === selectedBrand);
            }
            if (selectedColor !== 'all') {
                processedProducts = processedProducts.filter(p => p.colors?.toLowerCase().split(',').map(c => c.trim()).includes(selectedColor));
            }
            if (selectedSize !== 'all') {
                processedProducts = processedProducts.filter(p => p.textSizes?.toLowerCase().split(',').map(s => s.trim()).includes(selectedSize));
            }

            // Sorting
            if (sortOption === 'price-asc') {
                processedProducts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (sortOption === 'price-desc') {
                processedProducts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            } else if (sortOption === 'latest') {
                 processedProducts.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
            }

            setFilteredProducts(processedProducts);
        };
        
        applyDiscountsAndFilters();
        
    }, [allProducts, searchTerm, selectedCategory, selectedBrand, selectedColor, selectedSize, sortOption]);

    const filterOptions = useMemo(() => {
        const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
        const brands = [...new Set(allProducts.map(p => p.brand).filter(Boolean))];
        const colors = [...new Set(allProducts.flatMap(p => p.colors?.split(',').map(c => c.trim()) || []).filter(Boolean))];
        const sizes = [...new Set(allProducts.flatMap(p => p.textSizes?.split(',').map(s => s.trim()) || []).filter(Boolean))];
        return { categories, brands, colors, sizes };
    }, [allProducts]);

    if (!isMounted) {
      return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
      );
    }
  
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex-grow grid grid-cols-2 sm:flex sm:flex-wrap sm:flex-grow-0 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-auto h-11"><SelectValue placeholder="All Categories" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {filterOptions.categories.map((cat) => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="w-full sm:w-auto h-11"><SelectValue placeholder="All Brands" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {filterOptions.brands.map((brand) => <SelectItem key={brand} value={brand.toLowerCase()}>{brand}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full sm:w-auto h-11"><SelectValue placeholder="All Colors" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Colors</SelectItem>
                        {filterOptions.colors.map((color) => <SelectItem key={color} value={color.toLowerCase()}>{color}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full sm:w-auto h-11"><SelectValue placeholder="All Sizes" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        {filterOptions.sizes.map((size) => <SelectItem key={size} value={size.toLowerCase()}>{size}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="h-11 w-full sm:w-auto">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="latest">Latest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? filteredProducts.map((product, index) => (
            <ProductCard key={product.id || index} product={product} />
          )) : <p className="col-span-full text-center text-muted-foreground">No products found. Add some from the admin dashboard!</p>}
        </div>
      </main>
    </div>
  );
}

    