
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
    (product: Product, quantity: number = 1) => {
      const existingIndex = cart.findIndex((item) => item.product.id === product.id);
      let newCart;

      if (existingIndex > -1) {
        newCart = [...cart];
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart = [...cart, { product, quantity }];
      }
      
      setCart(newCart);
      saveToLocalStorage(newCart);
      toast({
        title: "Added to Cart",
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    },
    [cart, toast]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      const newCart = cart.filter((item) => item.product.id !== productId);
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
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }
      const newCart = cart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
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
