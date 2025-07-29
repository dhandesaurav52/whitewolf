"use client";

import { useState, useEffect, useCallback } from "react";
import type { Recommendation } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "savedOutfits";

export function useSavedOutfits() {
  const { toast } = useToast();
  const [savedOutfits, setSavedOutfits] = useState<Recommendation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(STORAGE_KEY);
      if (items) {
        setSavedOutfits(JSON.parse(items));
      }
    } catch (error) {
      console.error("Failed to load saved outfits from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  const saveToLocalStorage = (outfits: Recommendation[]) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
    } catch (error) {
      console.error("Failed to save outfits to localStorage", error);
      toast({
        title: "Error",
        description: "Could not save outfit. Your browser storage might be full.",
        variant: "destructive",
      });
    }
  };

  const addOutfit = useCallback(
    (outfit: Recommendation) => {
      const newSavedOutfits = [...savedOutfits, outfit];
      setSavedOutfits(newSavedOutfits);
      saveToLocalStorage(newSavedOutfits);
      toast({
        title: "Outfit Saved!",
        description: "Your new style has been saved for later.",
      });
    },
    [savedOutfits, toast]
  );

  const removeOutfit = useCallback(
    (outfitId: string) => {
      const newSavedOutfits = savedOutfits.filter(
        (outfit) => outfit.id !== outfitId
      );
      setSavedOutfits(newSavedOutfits);
      saveToLocalStorage(newSavedOutfits);
      toast({
        title: "Outfit Removed",
        description: "The style has been removed from your saved list.",
      });
    },
    [savedOutfits, toast]
  );
  
  const isOutfitSaved = useCallback(
    (outfitId: string) => {
      return savedOutfits.some(outfit => outfit.id === outfitId);
    },
    [savedOutfits]
  );

  return { savedOutfits, addOutfit, removeOutfit, isOutfitSaved, isLoaded };
}
