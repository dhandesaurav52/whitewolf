
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shirt, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
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

        {/* Categories Section */}
        <section className="bg-muted py-20">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative h-96 rounded-lg overflow-hidden group">
                     <Image
                      src={`https://placehold.co/800x600.png`}
                      alt="Casual Wear"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="mens casual"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h3 className="text-3xl font-headline font-bold">Casual Wear</h3>
                            <Button asChild variant="secondary" className="mt-4">
                                <Link href="/shop/casual">Shop Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
                 <div className="relative h-96 rounded-lg overflow-hidden group">
                     <Image
                      src={`https://placehold.co/800x600.png`}
                      alt="Formal Collection"
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint="mens formal"
                    />
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h3 className="text-3xl font-headline font-bold">Formal Collection</h3>
                            <Button asChild variant="secondary" className="mt-4">
                                <Link href="/shop/formal">Shop Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
