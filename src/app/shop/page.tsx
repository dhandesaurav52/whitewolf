
"use client";

import { useState } from 'react';
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

const products = [
  {
    name: 'Vintage Wash Tee',
    price: '28.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'streetwear fashion',
    discount: null,
    new: true,
  },
  {
    name: 'Slim-Fit Chinos',
    price: '55.00',
    originalPrice: '70.00',
    image: 'https://placehold.co/400x500.png',
    aiHint: 'mens trousers',
    discount: '21% OFF',
    new: false,
  },
  {
    name: 'Linen Button-Down',
    price: '48.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'summer shirt',
    discount: null,
    new: false,
  },
  {
    name: 'Dark Wash Jeans',
    price: '65.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'denim jeans',
    discount: null,
    new: false,
  },
    {
    name: 'Graphic Print Tee',
    price: '30.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'urban style',
    discount: null,
    new: true,
  },
  {
    name: 'Utility Cargo Pants',
    price: '75.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'cargo pants',
    discount: null,
    new: false,
  },
  {
    name: 'Anxious Tshirt',
    price: '25.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'graphic tee fashion',
    discount: null,
    new: false,
  },
    {
    name: 'Classic Tee',
    price: '22.00',
    originalPrice: '25.00',
    image: 'https://placehold.co/400x500.png',
    aiHint: 'mens fashion',
    discount: '12% OFF',
    new: false,
  },
];

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  return (
    <Card className="group overflow-hidden rounded-lg bg-card text-card-foreground border-border relative">
       <Link href="#" className="block">
        <div className="relative aspect-[4/5] bg-muted">
          <Image
            src={product.image}
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
           {product.new && (
            <Badge
              className="absolute top-3 left-3 bg-accent text-accent-foreground"
            >
              New
            </Badge>
          )}
        </div>
      </Link>
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background">
          <Heart className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="outline" className="h-9 w-9 bg-background/80 hover:bg-background">
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-headline text-lg text-primary truncate">{product.name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-accent font-semibold text-base">${product.price}</p>
          {product.originalPrice && (
            <p className="text-muted-foreground text-sm line-through">${product.originalPrice}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};


export default function ShopPage() {
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
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
