
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import type { Advertisement, Product as ProductType } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import * as db from "@/lib/firestore";

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
    
    const fuse = useMemo(() => {
        if (allProducts.length > 0) {
            return new Fuse(allProducts, {
                keys: ['name', 'brand', 'category'],
                includeScore: true,
                threshold: 0.4, // Adjust for more or less strict matching
            });
        }
        return null;
    }, [allProducts]);

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
                    
                    const applicableAd = categoryAds.find(ad => ad.selectedCategories.map(c=>c.toLowerCase()).includes(p.category.toLowerCase()));

                    if (applicableAd) {
                        if (applicableAd.discountType === 'percentage') {
                            const productPrice = originalProductPrice * (1 - applicableAd.discountValue / 100);
                            return { 
                                ...p, 
                                price: productPrice.toFixed(2), 
                                originalPrice: originalProductPrice.toString(), 
                                discount: `${applicableAd.discountValue}% OFF`, 
                                offerType: 'percentage' 
                            };
                        } else if (applicableAd.discountType === 'fixed') {
                            const productPrice = originalProductPrice - applicableAd.discountValue;
                            return { 
                                ...p, 
                                price: productPrice.toFixed(2), 
                                originalPrice: originalProductPrice.toString(), 
                                discount: `₹${applicableAd.discountValue} OFF`, 
                                offerType: 'fixed' 
                            };
                        } else if (applicableAd.discountType === 'buy-x-get-y') {
                            return { 
                                ...p, 
                                offerType: 'buy-x-get-y',
                                price: originalProductPrice.toFixed(2),
                                originalPrice: null,
                                discount: null,
                            };
                        }
                    }
                    
                    // Reset if no ad applies
                    return {
                        ...p,
                        price: originalProductPrice.toFixed(2),
                        originalPrice: null, // No discount, so no original price to show
                        discount: null,
                        offerType: undefined,
                    };
                });
                
            } catch (error) {
                console.error("Failed to apply discounts", error);
            }

            let processedProducts = productsWithDiscounts;

            // Fuzzy Search
            if (searchTerm && fuse) {
                processedProducts = fuse.search(searchTerm).map(result => result.item);
            }

            // Filtering
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
        
    }, [allProducts, searchTerm, selectedCategory, selectedBrand, selectedColor, selectedSize, sortOption, fuse]);

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
              placeholder="Search for products, brands, or categories..."
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
