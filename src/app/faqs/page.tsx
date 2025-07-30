
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, StarHalf } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';

const RATINGS_STORAGE_KEY = 'appRatings';
const USER_HAS_RATED_KEY = 'userHasRated';

const faqData = [
    {
      question: "What is your shipping policy?",
      answer: "We offer free standard shipping on all orders. Expedited shipping options are available at checkout for an additional fee. Orders are typically processed within 1-2 business days."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can also find your tracking information in the 'My Orders' section of your account."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 7 days of delivery for a full refund. Items must be in their original condition, unworn, and with all tags attached. To initiate a return, please visit the 'My Orders' page."
    },
    {
      question: "How do I know what size to order?",
      answer: "We have a comprehensive size guide available on every product page to help you find the perfect fit. If you're between sizes, we generally recommend sizing up for a more relaxed fit."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), as well as payments through Razorpay for a secure and seamless checkout experience. We also offer Cash on Delivery (COD) for most locations."
    }
];

export default function FaqsPage() {
    const { toast } = useToast();
    const [ratings, setRatings] = useState<number[]>([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [hasRated, setHasRated] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
            if (storedRatings) {
                setRatings(JSON.parse(storedRatings));
            }
            const userRated = localStorage.getItem(USER_HAS_RATED_KEY);
            if (userRated) {
                setHasRated(true);
                setSelectedRating(parseInt(userRated, 10));
            }
        } catch (error) {
            console.error("Error accessing localStorage", error);
        }
    }, []);

    const ratingSummary = useMemo(() => {
        if (ratings.length === 0) {
            return {
                average: 0,
                total: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }
        const total = ratings.length;
        const sum = ratings.reduce((acc, r) => acc + r, 0);
        const average = sum / total;
        const distribution = ratings.reduce((acc, r) => {
            acc[r as keyof typeof acc]++;
            return acc;
        }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

        return {
            average,
            total,
            distribution
        };
    }, [ratings]);

    const handleRatingSubmit = () => {
        if (selectedRating === 0) {
            toast({ title: "Select a Rating", description: "Please select a star rating before submitting.", variant: "destructive" });
            return;
        }
        const newRatings = [...ratings, selectedRating];
        setRatings(newRatings);
        setHasRated(true);
        try {
            localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(newRatings));
            localStorage.setItem(USER_HAS_RATED_KEY, selectedRating.toString());
        } catch (error) {
             console.error("Error saving to localStorage", error);
        }
        toast({ title: "Thank you!", description: "Your rating has been submitted successfully." });
    };
    
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        return (
            <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} className="w-5 h-5 fill-current" />)}
                {halfStar && <StarHalf key="half" className="w-5 h-5 fill-current" />}
                {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />)}
            </div>
        );
    }

    if (!isMounted) {
        return <div>Loading...</div>; // Or a skeleton loader
    }

    return (
        <div className="container mx-auto py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold font-headline">Frequently Asked Questions</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rate Our App</CardTitle>
                            <CardDescription>Let us know what you think!</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {hasRated ? (
                                <div className='text-center'>
                                    <p className="font-semibold text-lg">Thanks for your rating!</p>
                                    <div className="flex justify-center mt-2">
                                        {[...Array(5)].map((_, index) => {
                                            const ratingValue = index + 1;
                                            return <Star key={ratingValue} className={cn("w-8 h-8", selectedRating >= ratingValue ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />;
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <div className="flex" onMouseLeave={() => setHoverRating(0)}>
                                        {[...Array(5)].map((_, index) => {
                                            const ratingValue = index + 1;
                                            return (
                                                <Star
                                                    key={ratingValue}
                                                    className={cn(
                                                        "w-8 h-8 cursor-pointer transition-colors",
                                                        ratingValue <= (hoverRating || selectedRating)
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300"
                                                    )}
                                                    onMouseEnter={() => setHoverRating(ratingValue)}
                                                    onClick={() => setSelectedRating(ratingValue)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <Button className="mt-4 w-full" onClick={handleRatingSubmit}>Submit Rating</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Community Rating</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                {renderStars(ratingSummary.average)}
                                <span className="font-bold text-lg">{ratingSummary.average.toFixed(1)}</span>
                                <span className="text-sm text-muted-foreground">({ratingSummary.total} ratings)</span>
                            </div>
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map(star => (
                                    <div key={star} className="flex items-center gap-2 text-sm">
                                        <span>{star}</span>
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <Progress value={ratingSummary.total > 0 ? (ratingSummary.distribution[star as keyof typeof ratingSummary.distribution] / ratingSummary.total) * 100 : 0} className="w-full h-2" />
                                        <span className="w-8 text-right text-muted-foreground">{ratingSummary.distribution[star as keyof typeof ratingSummary.distribution]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-2">
                    <Card>
                        <CardContent className="p-6">
                            <Accordion type="single" collapsible className="w-full">
                                {faqData.map((faq, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-base text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
