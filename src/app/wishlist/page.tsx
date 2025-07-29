
"use client";

import { useSavedOutfits } from "@/hooks/useSavedOutfits";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function WishlistPage() {
  const { savedOutfits, removeOutfit, isLoaded } = useSavedOutfits();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-headline">Wishlist</h1>
        <p className="text-muted-foreground mt-2">Your favorite styles, all in one place.</p>
      </div>

      {!isLoaded && (
         <div className="grid grid-cols-1 gap-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </CardContent>
            </Card>
         </div>
      )}

      {isLoaded && savedOutfits.length === 0 && (
        <div className="text-center py-20 bg-card border rounded-lg">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Items in Wishlist</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                You haven't added any items to your wishlist yet.
            </p>
            <Button asChild className="mt-6">
                <Link href="/shop">Start Shopping</Link>
            </Button>
        </div>
      )}

      {isLoaded && savedOutfits.length > 0 && (
        <div className="space-y-8">
          {savedOutfits.map((outfit) => (
            <Card key={outfit.id} className="overflow-hidden animate-fade-in">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">Outfit Recommendation</CardTitle>
                        <CardDescription className="pt-1">{outfit.recommendation}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeOutfit(outfit.id)}>
                        <Trash2 className="h-5 w-5" />
                        <span className="sr-only">Remove outfit</span>
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary">{outfit.preferences.occasion}</Badge>
                    <Badge variant="secondary">{outfit.preferences.weather}</Badge>
                    <Badge variant="secondary">{outfit.preferences.style}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {outfit.garments.map((garment) => (
                    <Card key={garment.name} className="flex flex-col">
                        <div className="relative w-full aspect-[4/3] bg-muted">
                             <Image
                                src={`https://placehold.co/400x300.png`}
                                alt={garment.name}
                                fill
                                className="object-cover"
                                data-ai-hint="mens fashion clothing"
                            />
                        </div>
                       <CardHeader>
                           <CardTitle className="text-base font-headline">{garment.name}</CardTitle>
                       </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-xs text-muted-foreground">{garment.description}</p>
                        </CardContent>
                       <CardFooter>
                           <Button asChild size="sm" className="w-full">
                               <Link href={garment.link} target="_blank" rel="noopener noreferrer">
                                   View Item <ExternalLink className="ml-2 h-3 w-3" />
                               </Link>
                           </Button>
                       </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
