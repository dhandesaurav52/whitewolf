"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateRecommendationAction, improveRecommendationAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useSavedOutfits } from "@/hooks/useSavedOutfits";
import type { Recommendation } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import RecommendationCard from "./RecommendationCard";
import { Sparkles, Wand, Save, Heart, Trash2 } from "lucide-react";

const formSchema = z.object({
  occasion: z.string().min(1, { message: "Please select an occasion." }),
  weather: z.string().min(1, { message: "Please select the weather." }),
  style: z.string().min(1, { message: "Please select a style." }),
});

const occasions = ["Casual", "Business Casual", "Formal", "Party"];
const weathers = ["Sunny", "Cloudy", "Rainy", "Cold"];
const styles = ["Modern", "Classic", "Edgy", "Minimalist"];

export default function StyleAdvisor() {
  const { toast } = useToast();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const { addOutfit, removeOutfit, isOutfitSaved, isLoaded } = useSavedOutfits();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { occasion: "", weather: "", style: "" },
  });

  const feedbackForm = useForm({
    defaultValues: { feedback: "" },
  });

  const handleGenerate = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setRecommendation(null);
    const result = await generateRecommendationAction(values);
    if (result.success && result.data) {
      setRecommendation({
        ...result.data,
        id: new Date().toISOString(),
        preferences: values,
      });
    } else {
      toast({
        title: "Error Generating Recommendation",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleImprove = async (values: { feedback: string }) => {
    if (!recommendation || !values.feedback) return;
    setIsImproving(true);
    const result = await improveRecommendationAction({
        currentRecommendation: recommendation.recommendation,
        feedback: values.feedback,
        userPreferences: JSON.stringify(recommendation.preferences),
    });

    if (result.success && result.data) {
        setRecommendation({
            ...recommendation,
            recommendation: result.data,
        });
        feedbackForm.reset();
    } else {
        toast({
            title: "Error Refining Recommendation",
            description: result.error,
            variant: "destructive",
        });
    }
    setIsImproving(false);
  };

  const isSaved = recommendation ? isOutfitSaved(recommendation.id) : false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Sparkles className="text-accent"/> Find Your Style</CardTitle>
          <CardDescription>Tell us your preferences, and we'll curate the perfect outfit for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occasion</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="e.g., Casual" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>{occasions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weather"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="e.g., Sunny" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>{weathers.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="e.g., Modern" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>{styles.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" variant="default" disabled={isLoading}>
                {isLoading ? "Generating..." : "Get Recommendation"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-56 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {recommendation && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Your Curated Outfit</CardTitle>
              <CardDescription className="pt-2 text-base">{recommendation.recommendation}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {recommendation.garments.map((garment, index) => (
                  <RecommendationCard key={index} garment={garment} />
                ))}
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <h3 className="font-headline text-lg">Not quite right?</h3>
                <form onSubmit={feedbackForm.handleSubmit(handleImprove)} className="space-y-2">
                    <Textarea
                        {...feedbackForm.register("feedback")}
                        placeholder="e.g., 'I'd prefer something with darker colors' or 'Can you suggest a different jacket?'"
                    />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" variant="outline" disabled={isImproving}>
                            <Wand className="mr-2 h-4 w-4" />
                            {isImproving ? 'Refining...' : 'Refine Suggestion'}
                        </Button>
                        <Button
                          type="button"
                          variant={isSaved ? "secondary" : "default"}
                          onClick={() => {
                            if (isSaved) {
                              removeOutfit(recommendation.id)
                            } else {
                              addOutfit(recommendation)
                            }
                          }}
                          disabled={!isLoaded}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
                          {isSaved ? <Trash2 className="mr-2 h-4 w-4" /> : <Heart className="mr-2 h-4 w-4" />}
                          {isSaved ? "Remove from Saved" : "Save Outfit"}
                        </Button>
                    </div>
                </form>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
