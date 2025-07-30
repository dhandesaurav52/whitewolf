
"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const CART_STORAGE_KEY = "cart";

export function useCart() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(CART_STORAGE_KEY);
      if (items) {
        setCart(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
    setIsLoaded(true);
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
  
  const cartTotal = cart.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount, isLoaded };
}
