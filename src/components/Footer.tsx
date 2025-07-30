
"use client";

import Link from "next/link";
import { Instagram, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import PolicyDialog from "./PolicyDialog";
import ContactUsDialog from "./ContactUsDialog";

const RATINGS_STORAGE_KEY = 'appRatings';

const WhiteWolfLogo = () => (
    <div className="flex items-center">
        <Image src="https://firebasestorage.googleapis.com/v0/b/white-wolf-style-advisor.firebasestorage.app/o/WhiteWolfLogo.png?alt=media&token=3accae8b-9687-41f4-99a3-31856cdeaa91" alt="White Wolf Logo" width={40} height={40} className="w-10 h-10 rounded-md mr-2" />
        <div className="flex flex-col text-primary-foreground">
           <span className="text-xs font-bold tracking-widest">WHITE</span>
           <span className="text-xs font-bold tracking-widest">WOLF</span>
        </div>
    </div>
)


export default function Footer() {
  const [ratings, setRatings] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleStorageChange = () => {
       try {
            const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
            if (storedRatings) {
                setRatings(JSON.parse(storedRatings));
            }
        } catch (error) {
            console.error("Error accessing localStorage", error);
        }
    }
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
    { id: "contact-us", label: "Contact Us", onClick: () => setIsContactUsOpen(true) },
  ];

  const supportLinks = [
    { id: "shipping", label: "Shipping & Returns", onClick: () => setIsPolicyDialogOpen(true) },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
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
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="font-bold text-sm text-accent-foreground tracking-wider uppercase mb-4">About</h3>
              <ul className="space-y-2">
                {aboutLinks.map((link) => (
                  <li key={link.id || link.href}>
                    {link.href ? (
                       <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent-foreground transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <button onClick={link.onClick} className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors bg-transparent border-none p-0 cursor-pointer">
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
                <li>
                  <Link href="/faqs" className="text-sm text-muted-foreground hover:text-accent-foreground transition-colors flex items-center">
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
                {supportLinks.map((link) => (
                  <li key={link.id || link.href}>
                    {link.href ? (
                       <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent-foreground transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <button onClick={link.onClick} className="text-sm text-left text-muted-foreground hover:text-accent-foreground transition-colors bg-transparent border-none p-0 cursor-pointer">
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
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
