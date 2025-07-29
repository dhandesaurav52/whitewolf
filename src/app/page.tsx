
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
import { useState, useEffect } from "react";
import type { Advertisement } from "@/lib/types";
import { cn } from "@/lib/utils";

const ADS_STORAGE_KEY = 'advertisements';

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
    const [heroSlides, setHeroSlides] = useState<Advertisement[]>([defaultHero]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const loadHeroSlides = () => {
        try {
            const storedAds = localStorage.getItem(ADS_STORAGE_KEY);
            if (storedAds) {
                const parsedAds: Advertisement[] = JSON.parse(storedAds);
                const activeHeroAds = parsedAds.filter(ad => ad.appliesTo === 'hero' && ad.status === 'Active');
                if (activeHeroAds.length > 0) {
                    setHeroSlides(activeHeroAds);
                } else {
                    setHeroSlides([defaultHero]);
                }
            }
        } catch (error) {
            console.error("Failed to load hero configuration from localStorage", error);
            setHeroSlides([defaultHero]);
        }
    };
    
    useEffect(() => {
        loadHeroSlides();
        window.addEventListener('storage', loadHeroSlides);
        return () => window.removeEventListener('storage', loadHeroSlides);
    }, []);

    useEffect(() => {
        if (heroSlides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [heroSlides.length]);

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
                    <Image
                        src={slide.heroImageUrl || defaultHero.heroImageUrl!}
                        alt={slide.heroHeadline || "Fashion display"}
                        fill
                        className="object-cover"
                        data-ai-hint="storefront fashion"
                        priority={index === 0}
                    />
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

export default function Home() {
  const oversizeTees = [
    {
      name: "Anxious Tshirt",
      category: "Oversized T Shirts",
      price: "1199",
      image: "https://placehold.co/400x500.png",
      aiHint: "graphic tee fashion"
    },
    {
      name: "Classic Tee",
      category: "Oversized T Shirts",
      price: "999",
      image: "https://placehold.co/400x500.png",
      aiHint: "mens fashion"
    },
    {
      name: "Vintage Wash Tee",
      category: "Oversized T Shirts",
      price: "1299",
      image: "https://placehold.co/400x500.png",
      aiHint: "streetwear fashion"
    },
    {
      name: "Graphic Print Tee",
      category: "Oversized T Shirts",
      price: "1399",
      image: "https://placehold.co/400x500.png",
      aiHint: "urban style"
    },
     {
      name: "Minimalist Tee",
      category: "Oversized T Shirts",
      price: "1099",
      image: "https://placehold.co/400x500.png",
      aiHint: "simple fashion"
    },
  ];

  const accessories = [
    {
      name: "Silver Chain",
      price: "899",
      image: "https://placehold.co/400x500.png",
      aiHint: "mens jewelry"
    },
    {
      name: "Leather Belt",
      price: "499",
      image: "https://placehold.co/400x500.png",
      aiHint: "leather good"
    },
    {
      name: "Classic Watch",
      price: "1999",
      image: "https://placehold.co/400x500.png",
      aiHint: "timepiece watch"
    },
    {
      name: "Wool Beanie",
      price: "349",
      image: "https://placehold.co/400x500.png",
      aiHint: "winter hat"
    }
  ];

  const watchAndShopItems = [
    {
      mainImage: "https://placehold.co/400x600.png",
      mainAiHint: "blue tshirt",
      productImage: "https://placehold.co/100x100.png",
      productAiHint: "orange shirt",
      productName: "Supima: Sparkling Orange",
      price: "999",
      originalPrice: "1199"
    },
    {
      mainImage: "https://placehold.co/400x600.png",
      mainAiHint: "stadium soccer",
      productImage: "https://placehold.co/100x100.png",
      productAiHint: "red backpack",
      productName: "Fcb: Legacy",
      price: "2999",
      originalPrice: ""
    },
    {
      mainImage: "https://placehold.co/400x600.png",
      mainAiHint: "bear mask",
      productImage: "https://placehold.co/100x100.png",
      productAiHint: "white tshirt space",
      productName: "Ted: Space",
      price: "1199",
      originalPrice: ""
    },
    {
      mainImage: "https://placehold.co/400x600.png",
      mainAiHint: "green sneaker",
      productImage: "https://placehold.co/100x100.png",
      productAiHint: "green shoe",
      productName: "Marvel: Doctor Doom",
      price: "2899",
      originalPrice: "3699"
    },
    {
      mainImage: "https://placehold.co/400x600.png",
      mainAiHint: "black tshirt",
      productImage: "https://placehold.co/100x100.png",
      productAiHint: "tshirt design",
      productName: "Anime Cloud Tee",
      price: "1299",
      originalPrice: ""
    }
  ];

  const categories = [
    { name: "T-Shirts", href: "/t-shirts", image: "https://placehold.co/400x500.png", aiHint: "t-shirt model" },
    { name: "Shirts", href: "/shirts", image: "https://placehold.co/400x500.png", aiHint: "button-up shirt" },
    { name: "Jeans", href: "/jeans", image: "https://placehold.co/400x500.png", aiHint: "denim jeans" },
    { name: "Trousers", href: "/trousers", image: "https://placehold.co/400x500.png", aiHint: "formal trousers" },
    { name: "Slippers", href: "/slippers", image: "https://placehold.co/400x500.png", aiHint: "sandals footwear" },
    { name: "Oversized T-shirts", href: "/oversized-t-shirts", image: "https://placehold.co/400x500.png", aiHint: "baggy shirt" },
    { name: "Shoes", href: "/shoes", image: "https://placehold.co/400x500.png", aiHint: "sneakers shoes" },
  ];

  return (
    <div className="flex flex-col">
        <HeroSection />

        {/* Features Section */}
        <section className="bg-background py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="h-10 w-10 text-accent" />
                <h3 className="mt-4 text-xl font-headline font-semibold">Exclusive Designs</h3>
                <p className="mt-2 text-muted-foreground">
                  Curated pieces you won't find anywhere else.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Shirt className="h-10 w-10 text-accent" />
                <h3 className="mt-4 text-xl font-headline font-semibold">Premium Quality</h3>
                <p className="mt-2 text-muted-foreground">
                  Crafted from the finest materials for lasting comfort.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-10 w-10 text-accent" />
                <h3 className="mt-4 text-xl font-headline font-semibold">Fast Shipping</h3>
                <p className="mt-2 text-muted-foreground">
                  Get your new look delivered to your door in days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold">New Arrivals</h2>
              <p className="text-muted-foreground mt-2">Check out the latest additions to our collection.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group">
                  <div className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={`https://placehold.co/400x500.png`}
                      alt={`New Arrival ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="mens fashion"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-headline">Stylish Shirt {i+1}</h3>
                  <p className="text-accent font-semibold">₹499</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/shop">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Oversize Tees Section */}
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
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {oversizeTees.map((tee, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div className="p-1">
                      <Card className="bg-card border-border overflow-hidden group">
                        <CardContent className="p-0">
                          <div className="relative aspect-[4/5] overflow-hidden">
                             <Image
                                src={tee.image}
                                alt={tee.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={tee.aiHint}
                              />
                          </div>
                           <div className="p-4">
                              <p className="text-sm text-muted-foreground">White Wolf</p>
                              <h3 className="text-lg font-headline text-primary">{tee.name}</h3>
                              <p className="text-sm text-muted-foreground">{tee.category}</p>
                              <p className="text-accent font-bold mt-2">₹{tee.price}</p>
                           </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>

        {/* Our Accessories Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold">Our Accessories</h2>
              <p className="text-muted-foreground mt-2">Complete your look with our curated selection of accessories.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {accessories.map((item, i) => (
                <div key={i} className="group">
                  <div className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={item.aiHint}
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-headline">{item.name}</h3>
                  <p className="text-accent font-semibold">₹{item.price}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/accessories">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Watch and Shop Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold">Watch and Shop</h2>
            </div>
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {watchAndShopItems.map((item, index) => (
                  <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="p-1">
                      <Card className="bg-card border-none overflow-hidden group relative aspect-[9/16]">
                        <Image
                          src={item.mainImage}
                          alt={item.productName}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={item.mainAiHint}
                        />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Card className="bg-background/80 backdrop-blur-sm p-2 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  className="object-cover"
                                  data-ai-hint={item.productAiHint}
                                />
                              </div>
                              <div className="overflow-hidden">
                                <h3 className="text-sm font-headline text-primary truncate">{item.productName}</h3>
                                <div className="flex items-baseline gap-2">
                                  <p className="text-accent font-bold text-sm">₹{item.price}</p>
                                  {item.originalPrice && (
                                    <p className="text-muted-foreground text-xs line-through">₹{item.originalPrice}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </div>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
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

        {/* Shop by Category Section */}
        <section className="py-16">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-headline font-bold text-accent">Shop by Category</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Explore our diverse range of apparel and accessories, categorized for your convenience.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {categories.slice(0, 5).map((category) => (
                <Link href={category.href} key={category.name} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={category.aiHint}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white font-headline text-2xl font-bold drop-shadow-md">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mt-4 md:mt-6">
              {categories.slice(5).map((category) => (
                <Link href={category.href} key={category.name} className="group relative aspect-[4/5] overflow-hidden rounded-lg lg:col-start-2 xl:col-start-auto">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={category.aiHint}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white font-headline text-2xl font-bold drop-shadow-md">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
    </div>
  );
}
