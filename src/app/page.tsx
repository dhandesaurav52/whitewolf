
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

export default function Home() {
  const oversizeTees = [
    {
      name: "Anxious Tshirt",
      category: "Oversized T Shirts",
      price: "25.00",
      image: "https://placehold.co/400x500.png",
      aiHint: "graphic tee fashion"
    },
    {
      name: "Classic Tee",
      category: "Oversized T Shirts",
      price: "22.00",
      image: "https://placehold.co/400x500.png",
      aiHint: "mens fashion"
    },
    {
      name: "Vintage Wash Tee",
      category: "Oversized T Shirts",
      price: "28.00",
      image: "https://placehold.co/400x500.png",
      aiHint: "streetwear fashion"
    },
    {
      name: "Graphic Print Tee",
      category: "Oversized T Shirts",
      price: "30.00",
      image: "https://placehold.co/400x500.png",
      aiHint: "urban style"
    },
     {
      name: "Minimalist Tee",
      category: "Oversized T Shirts",
      price: "24.00",
      image: "https://placehold.co/400x500.png",
      aiHint: "simple fashion"
    },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white bg-black">
          <Image
            src="https://placehold.co/1600x900.png"
            alt="Fashion display in a store window"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 opacity-40"
            data-ai-hint="storefront fashion"
          />
          <div className="relative z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-bold font-headline drop-shadow-md">
              Define Your Style
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-neutral-300 drop-shadow-md">
              Timeless style, uncompromising quality, and conscious craftsmanship for the modern individual.
            </p>
            <Button asChild size="lg" className="mt-8 bg-white text-black hover:bg-neutral-200">
              <Link href="/new-arrivals">Shop New Arrivals</Link>
            </Button>
          </div>
        </section>

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
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="mens fashion"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-headline">Stylish Shirt {i+1}</h3>
                  <p className="text-accent font-semibold">$49.99</p>
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
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint={tee.aiHint}
                              />
                          </div>
                           <div className="p-4">
                              <p className="text-sm text-muted-foreground">White Wolf</p>
                              <h3 className="text-lg font-headline text-primary">{tee.name}</h3>
                              <p className="text-sm text-muted-foreground">{tee.category}</p>
                              <p className="text-accent font-bold mt-2">${tee.price}</p>
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
      </main>
    </div>
  );
}
