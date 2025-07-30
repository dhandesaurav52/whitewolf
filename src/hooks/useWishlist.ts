
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import * as db from "@/lib/firestore";

export function useWishlist() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (user) {
      const profileData = await db.profiles.get(user.uid);
      if (profileData && profileData.wishlist) {
        // To keep product details up-to-date, we fetch the latest product info
        const allProducts = await db.products.getAll();
        const wishlistProducts = allProducts.filter(p => profileData.wishlist!.includes(p.id));
        setWishlist(wishlistProducts);
      } else {
        setWishlist([]);
      }
    } else {
      setWishlist([]); // Clear wishlist if user logs out
    }
    setIsLoaded(true);
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(
    async (product: Product) => {
      if (!user) {
        toast({ title: "Please Log In", description: "You must be logged in to manage your wishlist.", variant: "destructive" });
        return;
      }

      let newWishlistProductIds;
      const existingIndex = wishlist.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Remove from wishlist
        newWishlistProductIds = wishlist.filter((item) => item.id !== product.id).map(p => p.id);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        // Add to wishlist
        newWishlistProductIds = [...wishlist.map(p => p.id), product.id];
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
      
      try {
        await db.profiles.set(user.uid, { wishlist: newWishlistProductIds });
        // Refetch wishlist from DB to ensure UI is in sync
        fetchWishlist();
      } catch (error) {
        console.error("Failed to update wishlist in Firestore", error);
        toast({ title: "Error", description: "Could not update your wishlist. Please try again.", variant: "destructive" });
      }
    },
    [user, wishlist, fetchWishlist, toast]
  );
  
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some(item => item.id === productId);
    },
    [wishlist]
  );

  return { wishlist, toggleWishlist, isInWishlist, isLoaded };
}
