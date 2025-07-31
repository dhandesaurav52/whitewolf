
"use client";

import Link from "next/link";
import { Instagram, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import PolicyDialog from "./PolicyDialog";
import ContactUsDialog from "./ContactUsDialog";

const RATINGS_STORAGE_KEY = 'appRatings';

const WhiteWolfLogo = () => (
    <div className="flex items-center">
        <Image src="https://firebasestorage.googleapis.com/v0/b/white-wolf-style-advisor.firebasestorage.app/o/WhiteWolfLogo.png?alt=media&token=3accae8b-9687-41f4-99a3-31856cdeaa91" alt="White Wolf Logo" width={40} height={40} />
        <span className="ml-2 text-2xl font-bold font-headline">White Wolf</span>
    </div>
)


export default function Footer() {
  const [ratings, setRatings] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);
  const router = useRouter();

  const handleStorageChange = useCallback(() => {
     try {
          const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
          if (storedRatings) {
              setRatings(JSON.parse(storedRatings));
          }
      } catch (error) {
          console.error("Error accessing localStorage", error);
      }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);

  const averageRating = useMemo(() => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return (sum / ratings.length);
  }, [ratings]);

  const shopLinks = [
    { href: "/shop", label: "All Products" },
    { href: "/shop?sort=latest", label: "New Arrivals" },
    { href: "/shop?category=t-shirts", label: "T-Shirts" },
    { href: "/shop?category=jeans", label: "Jeans" },
  ];

  const aboutLinks = [
    { href: "/about", label: "Our Story" },
  ];

  return (
    <>
      <footer className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <WhiteWolfLogo />
              </Link>
              <p className="text-sm max-w-xs text-muted-foreground">
                Timeless style, uncompromising quality, and conscious craftsmanship for the modern individual.
              </p>
              <div className="flex mt-4 space-x-4">
                <a href="https://www.instagram.com/thewhitewolf0501/" target="_blank" rel="noopener noreferrer" className="hover:text-accent-foreground transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div className="col-span-1">
              <h3 className="font-bold text-sm text-accent-foreground tracking-wider uppercase mb-4">Shop</h3>
              <ul className="space-y-2">
                {shopLinks.map(link => (
                    <li key={link.href}>
                        <Link href={link.href} className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-bold text-sm text-accent-foreground tracking-wider uppercase mb-4">About</h3>
              <ul className="space-y-2">
                {aboutLinks.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors">{link.label}</Link>
                  </li>
                ))}
                 <li>
                    <button onClick={() => setIsContactUsOpen(true)} className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors bg-transparent border-none p-0 cursor-pointer">
                        Contact Us
                    </button>
                  </li>
                <li>
                  <Link href="/faqs" className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors flex items-center">
                    FAQs
                    {isMounted && averageRating > 0 && (
                        <span className="ml-2 flex items-center gap-1 text-yellow-400">
                          {averageRating.toFixed(1)} <Star className="w-4 h-4 fill-current" />
                        </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-1">
              <h3 className="font-bold text-sm text-accent-foreground tracking-wider uppercase mb-4">Support</h3>
              <ul className="space-y-2">
                  <li>
                    <button onClick={() => setIsPolicyDialogOpen(true)} className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors bg-transparent border-none p-0 cursor-pointer">
                        Shipping & Returns
                    </button>
                  </li>
                  <li>
                    <Link href="/size-guide" className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors">Size Guide</Link>
                  </li>
                  <li>
                    <a href="https://merchant.razorpay.com/policy/QoAs3QqvUvUpdi/privacy" target="_blank" rel="noopener noreferrer" className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors">
                    Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="https://merchant.razorpay.com/policy/QoAs3QqvUvUpdi/terms" target="_blank" rel="noopener noreferrer" className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors">
                    Terms & Conditions
                    </a>
                  </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-border/20">
          <div className="container mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} White Wolf Co. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
      <PolicyDialog isOpen={isPolicyDialogOpen} onClose={() => setIsPolicyDialogOpen(false)} />
      <ContactUsDialog isOpen={isContactUsOpen} onClose={() => setIsContactUsOpen(false)} />
    </>
  );
}
