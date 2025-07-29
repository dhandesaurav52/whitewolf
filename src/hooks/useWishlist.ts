
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const WISHLIST_STORAGE_KEY = "wishlist";

export function useWishlist() {
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (items) {
        setWishlist(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to load wishlist from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const saveToLocalStorage = (items: Product[]) => {
    try {
      window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
      toast({
        title: "Storage Error",
        description: "Could not save wishlist changes.",
        variant: "destructive",
      });
    }
  };

  const toggleWishlist = useCallback(
    (product: Product) => {
      let newWishlist;
      const existingIndex = wishlist.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        // Remove from wishlist
        newWishlist = wishlist.filter((item) => item.id !== product.id);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        // Add to wishlist
        newWishlist = [...wishlist, product];
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
      setWishlist(newWishlist);
      saveToLocalStorage(newWishlist);
    },
    [wishlist, toast]
  );
  
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some(item => item.id === productId);
    },
    [wishlist]
  );

  return { wishlist, toggleWishlist, isInWishlist, isLoaded };
}
