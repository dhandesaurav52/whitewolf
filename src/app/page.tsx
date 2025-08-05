
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shirt, ShieldCheck, Truck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useCallback } from "react";
import type { Advertisement, Reel, Product as ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import * as db from "@/lib/firestore";
import ProductCard from "@/components/ProductCard";

const defaultHero: Advertisement = {
    id: 'default-hero',
    appliesTo: 'hero',
    status: 'Active',
    text: '',
    discountType: 'fixed',
    discountValue: 0,
    selectedCategories: [],
    heroHeadline: "Define Your Style",
    heroSubtext: "Timeless style, uncompromising quality, and conscious craftsmanship for the modern individual.",
    heroButton: "Shop New Arrivals",
    heroImageUrl: "https://placehold.co/1600x900.png",
};

const HeroSection = () => {
    const [heroSlides, setHeroSlides] = useState<Advertisement[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const loadHeroSlides = useCallback(async () => {
        try {
            const allAds = await db.ads.getAll();
            const activeHeroAds = allAds.filter(ad => ad.appliesTo === 'hero' && ad.status === 'Active');
            
            if (activeHeroAds.length > 0) {
                setHeroSlides(activeHeroAds);
            } else {
                setHeroSlides([defaultHero]);
            }
        } catch (error) {
            console.error("Failed to load hero configuration from Firestore", error);
            setHeroSlides([defaultHero]);
        }
    }, []);
    
    useEffect(() => {
        setIsMounted(true);
        loadHeroSlides();
    }, [loadHeroSlides]);

    useEffect(() => {
        if (heroSlides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [heroSlides.length]);
    
    if (!isMounted || heroSlides.length === 0) {
        return (
             <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white bg-black overflow-hidden">
                <Skeleton className="absolute inset-0" />
             </section>
        );
    }

    return (
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white bg-black overflow-hidden">
            {heroSlides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={cn(
                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                        index === currentSlide ? "opacity-100" : "opacity-0"
                    )}
                >
                    {slide.heroVideoUrl ? (
                        <video
                            src={slide.heroVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={slide.heroImageUrl || defaultHero.heroImageUrl!}
                            alt={slide.heroHeadline || "Fashion display"}
                            fill
                            className="object-cover"
                            data-ai-hint="storefront fashion"
                            priority={index === 0}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-4">
                        <h1 className="text-5xl md:text-7xl font-bold font-headline drop-shadow-md">
                            {slide.heroHeadline}
                        </h1>
                        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 drop-shadow-md">
                            {slide.heroSubtext}
                        </p>
                        <Button asChild size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200">
                            <Link href="/shop">{slide.heroButton}</Link>
                        </Button>
                    </div>
                </div>
            ))}
        </section>
    );
};

const WatchAndShopItem = ({ reel, product }: { reel: Reel, product?: ProductType }) => {
  return (
    <Link href={product ? `/product/${product.id}` : '#'} className="block p-1">
      <Card className="bg-card border-none overflow-hidden group relative aspect-[9/16]">
        {reel.videoUrl ? (
          <video
            src={reel.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src="https://placehold.co/400x600.png"
            alt={reel.reelTitle}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="fashion reel"
          />
        )}
        <div className="absolute bottom-4 left-4 right-4">
          {product && (
            <Card className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={product.images?.[0] || "https://placehold.co/100x100.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    data-ai-hint={product.aiHint}
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-headline text-primary truncate">{product.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-accent font-bold text-sm">₹{product.price}</p>
                    {product.originalPrice && (
                      <p className="text-muted-foreground text-xs line-through">₹{product.originalPrice}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </Card>
    </Link>
  );
};

const ImageOnlyCard = ({ product }: { product: ProductType }) => (
    <Link href={`/product/${product.id}`} className="group block overflow-hidden">
        <div className="relative aspect-[3/4] bg-muted">
            <Image
                src={product.images?.[0] || "https://placehold.co/400x500.png"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint={product.aiHint}
            />
        </div>
    </Link>
);


export default function Home() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductType[]>([]);
  const [oversizeTees, setOversizeTees] = useState<ProductType[]>([]);
  const [accessories, setAccessories] = useState<ProductType[]>([]);
  const [topWear, setTopWear] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<{name: string, href: string, image: string, aiHint: string}[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [allReels, allProducts] = await Promise.all([
          db.reels.getAll(),
          db.products.getAll()
      ]);
      
      setReels(allReels);
      setProducts(allProducts);
      
      setNewArrivals(allProducts.filter(p => p.new).slice(0, 4));
      setOversizeTees(allProducts.filter(p => p.category.toLowerCase() === 'oversized t-shirts').slice(0, 5));
      setAccessories(allProducts.filter(p => p.displaySection === 'accessories'));
      const topWearCategories = ['t-shirts', 'shirts', 'oversized t-shirts', 'jackets', 'sweater'];
      setTopWear(allProducts.filter(p => topWearCategories.includes(p.category.toLowerCase())));
      
      const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
      const categoryData = uniqueCategories.map(cat => {
          const productForCategory = allProducts.find(p => p.category === cat && p.images && p.images.length > 0);
          return {
              name: cat,
              href: `/shop?category=${encodeURIComponent(cat.toLowerCase())}`,
              image: productForCategory?.images[0] || "https://placehold.co/400x500.png",
              aiHint: `${cat} model`
          };
      }).filter(c => c.name); // Filter out categories with no name
      setCategories(categoryData);
      
    } catch (error) {
      console.error("Failed to load data from Firestore", error);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, [loadData]);
  
    if (!isMounted) {
    return (
        <div className="flex flex-col">
            <Skeleton className="h-[60vh] w-full" />
             <div className="container mx-auto py-16">
                 <div className="grid grid-cols-3 gap-12 text-center">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                 </div>
            </div>
             <div className="container mx-auto py-16">
                 <Skeleton className="h-12 w-1/2 mx-auto mb-12" />
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                     {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                 </div>
             </div>
        </div>
    );
  }

  const duplicatedTopWear = topWear.length > 0 ? [...topWear, ...topWear] : [];
  const duplicatedAccessories = accessories.length > 0 ? [...accessories, ...accessories] : [];

  return (
    <div className="flex flex-col">
        <HeroSection />

        {/* Features Section */}
        <section className="bg-background py-12 md:py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-3 gap-4 md:gap-12 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                <h3 className="mt-4 text-base md:text-xl font-headline font-semibold">Exclusive Designs</h3>
                <p className="mt-1 md:mt-2 text-xs md:text-base text-muted-foreground">
                  Curated pieces you won't find anywhere else.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Shirt className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                <h3 className="mt-4 text-base md:text-xl font-headline font-semibold">Premium Quality</h3>
                <p className="mt-1 md:mt-2 text-xs md:text-base text-muted-foreground">
                  Crafted from the finest materials for lasting comfort.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-8 w-8 md:h-10 md:w-10 text-accent" />
                <h3 className="mt-4 text-base md:text-xl font-headline font-semibold">Fast Shipping</h3>
                <p className="mt-1 md:mt-2 text-xs md:text-base text-muted-foreground">
                  Get your new look delivered to your door in days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scrolling Top Wear */}
        {duplicatedTopWear.length > 0 && (
          <section className="py-8 bg-background overflow-hidden">
              <div className="flex animate-marquee hover:[animation-play-state:paused]">
                  {duplicatedTopWear.map((product, i) => (
                      <div key={`topwear-${i}`} className="w-64 flex-shrink-0">
                          <ImageOnlyCard product={product} />
                      </div>
                  ))}
              </div>
          </section>
        )}

        {/* Scrolling Accessories */}
        {duplicatedAccessories.length > 0 && (
          <section className="py-8 bg-background overflow-hidden">
              <div className="flex animate-marquee-reverse hover:[animation-play-state:paused]">
                  {duplicatedAccessories.map((product, i) => (
                      <div key={`accessory-${i}`} className="w-64 flex-shrink-0">
                          <ImageOnlyCard product={product} />
                      </div>
                  ))}
              </div>
          </section>
        )}

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold">New Arrivals</h2>
                <p className="text-muted-foreground mt-2">Check out the latest additions to our collection.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link href="/shop">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </section>
        )}


        {/* Oversize Tees Section */}
        {oversizeTees.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold text-accent">Oversize Tees</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Discover our collection of relaxed, comfortable, and stylish oversized t-shirts.
                </p>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: oversizeTees.length > 4,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {oversizeTees.map((tee, index) => (
                    <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                      <div className="p-1">
                        <ProductCard product={tee} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          </section>
        )}

        {/* Watch and Shop Section */}
        {reels.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold">Watch and Shop</h2>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  loop: reels.length > 4,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {reels.map((reel) => {
                    const product = products.find(p => p.name === reel.linkedProduct);
                    return (
                      <CarouselItem key={reel.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                        <WatchAndShopItem reel={reel} product={product} />
                      </CarouselItem>
                    )
                  })}
                  <CarouselItem className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex items-center justify-center">
                      <Button asChild variant="outline" size="icon" className="w-16 h-16 rounded-full">
                        <Link href="/shop" >
                          <ArrowRight className="h-8 w-8" />
                        </Link>
                      </Button>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          </section>
        )}


        {/* Shop by Category Section */}
        {categories.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-headline font-bold text-accent">Shop by Category</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Explore our diverse range of apparel and accessories, categorized for your convenience.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {categories.map((category) => (
                  <Link href={category.href} key={category.name} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={category.aiHint}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                      <h3 className="text-white font-headline text-2xl font-bold drop-shadow-md text-center">{category.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
