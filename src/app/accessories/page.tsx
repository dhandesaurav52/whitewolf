
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
    name: 'Classic Leather Belt',
    price: '45.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'leather belt',
    discount: null,
    new: true,
  },
  {
    name: 'Silver-plated Chain',
    price: '89.99',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'silver chain',
    discount: null,
    new: false,
  },
  {
    name: 'Chronograph Watch',
    price: '159.99',
    originalPrice: '199.99',
    image: 'https://placehold.co/400x500.png',
    aiHint: 'men\'s watch',
    discount: '20% OFF',
    new: false,
  },
  {
    name: 'Wool Knit Beanie',
    price: '35.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'wool beanie',
    discount: null,
    new: false,
  },
  {
    name: 'Aviator Sunglasses',
    price: '75.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'sunglasses fashion',
    discount: null,
    new: true,
  },
  {
    name: 'Canvas Backpack',
    price: '95.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'canvas backpack',
    discount: null,
    new: false,
  },
  {
    name: 'Leather Cardholder',
    price: '30.00',
    originalPrice: null,
    image: 'https://placehold.co/400x500.png',
    aiHint: 'leather wallet',
    discount: null,
    new: false,
  },
  {
    name: 'Patterned Silk Tie',
    price: '55.00',
    originalPrice: '65.00',
    image: 'https://placehold.co/400x500.png',
    aiHint: 'silk tie',
    discount: '15% OFF',
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


export default function AccessoriesPage() {
    const filters = [
        { placeholder: 'All Categories', options: ['Belts', 'Wallets', 'Watches', 'Ties'] },
        { placeholder: 'All Brands', options: ['Brand A', 'Brand B'] },
        { placeholder: 'All Colors', options: ['Black', 'Brown', 'Silver'] },
        { placeholder: 'All Sizes', options: ['S', 'M', 'L', 'XL'] },
    ];
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-headline text-accent">Shop Accessories</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Complete your look with our curated selection of high-quality accessories.
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
