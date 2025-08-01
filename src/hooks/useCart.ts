
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { CartItem, Product, Advertisement } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import * as db from "@/lib/firestore";

const CART_STORAGE_KEY = "cart";

export function useCart() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
        try {
            const items = window.localStorage.getItem(CART_STORAGE_KEY);
            if (items) {
                setCart(JSON.parse(items));
            }
            
            const adsData = await db.ads.getAll();
            const activeAds = adsData.filter(ad => ad.status === 'Active');
            setAds(activeAds);

        } catch (error) {
            console.error("Failed to load cart or ads from storage", error);
        } finally {
            setIsLoaded(true);
        }
    };
    loadInitialData();
  }, []);

  const saveToLocalStorage = (items: CartItem[]) => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
      toast({
        title: "Storage Error",
        description: "Could not save cart changes.",
        variant: "destructive",
      });
    }
  };

  const addToCart = useCallback(
    (product: Product, quantity: number = 1, size?: string) => {
      // A product must have a size to be added to cart, if sizes are available.
      if (product.textSizes && product.textSizes.length > 0 && !size) {
          toast({
              title: "Size Required",
              description: `Please select a size for ${product.name}.`,
              variant: "destructive",
          });
          return;
      }
      
      const existingIndex = cart.findIndex((item) => item.product.id === product.id && item.size === size);
      let newCart;

      if (existingIndex > -1) {
        newCart = [...cart];
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart = [...cart, { product, quantity, size }];
      }
      
      setCart(newCart);
      saveToLocalStorage(newCart);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} ${size ? `(Size: ${size})` : ''} has been added.`,
      });
    },
    [cart, toast]
  );

  const removeFromCart = useCallback(
    (productId: string, size?: string) => {
      const newCart = cart.filter(
          (item) => !(item.product.id === productId && (size ? item.size === size : true))
      );
      setCart(newCart);
      saveToLocalStorage(newCart);
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
      });
    },
    [cart, toast]
  );

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number, size?: string) => {
      if (newQuantity <= 0) {
        removeFromCart(productId, size);
        return;
      }
      const newCart = cart.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity: newQuantity } : item
      );
      setCart(newCart);
      saveToLocalStorage(newCart);
    },
    [cart, removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
    saveToLocalStorage([]);
  }, []);
  
  const { subtotal, comboDiscount } = useMemo(() => {
    let calculatedSubtotal = cart.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
    let calculatedComboDiscount = 0;
    
    const comboAds = ads.filter(ad => ad.discountType === 'buy-x-get-y' && ad.appliesTo === 'categories');

    for (const ad of comboAds) {
        const eligibleItems: CartItem[] = [];
        for (const cat of ad.selectedCategories) {
            const itemsInCategory = cart.filter(item => item.product.category.toLowerCase() === cat.toLowerCase());
            eligibleItems.push(...itemsInCategory);
        }

        const totalEligibleQuantity = eligibleItems.reduce((sum, item) => sum + item.quantity, 0);
        const buyQuantity = ad.buyQuantity || 1;
        const getQuantity = ad.getQuantity || 1;
        const groupSize = buyQuantity + getQuantity;

        if (totalEligibleQuantity >= groupSize) {
            const numberOfTimesToApply = Math.floor(totalEligibleQuantity / groupSize);
            const itemsToDiscount = eligibleItems.flatMap(item => Array(item.quantity).fill(item.product)).sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
            
            for(let i = 0; i < numberOfTimesToApply * getQuantity; i++) {
                if (itemsToDiscount[i]) {
                    calculatedComboDiscount += parseFloat(itemsToDiscount[i].price);
                }
            }
        }
    }
    
    return { subtotal: calculatedSubtotal, comboDiscount: calculatedComboDiscount };
  }, [cart, ads]);


  const cartTotal = subtotal - comboDiscount;
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, comboDiscount, cartTotal, cartCount, isLoaded };
}
