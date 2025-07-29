"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

const WolfIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 1.5a8.25 8.25 0 1 1 0 16.5 8.25 8.25 0 0 1 0-16.5ZM12 6a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 12 6Zm0 6a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3A.75.75 0 0 0 12 12Z" />
    </svg>
)

const WhiteWolfLogo = () => (
    <div className="flex items-center">
        <div className="w-10 h-10 bg-white p-2 flex items-center justify-center rounded-md mr-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M50,5 L95,40 L80,95 L20,95 L5,40 Z" fill="none" stroke="black" strokeWidth="5" />
                <path d="M50,20 L75,40 L65,70 L35,70 L25,40 Z" fill="black" />
                <path d="M50,15 L55,30 L45,30 Z" fill="white" />
                <path d="M40,45 C45,40 55,40 60,45" fill="none" stroke="white" strokeWidth="3" />
            </svg>
        </div>
        <div className="flex flex-col">
           <span className="text-xs font-bold text-white tracking-widest">WHITE</span>
           <span className="text-xs font-bold text-white tracking-widest">WOLF</span>
        </div>
    </div>
)


export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/premium", label: "Premium Products" },
  ];

  return (
    <header className="bg-background border-b border-gray-800 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <WhiteWolfLogo />
              <span className="text-2xl font-bold text-accent">White Wolf</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-muted-foreground transition-colors hover:text-accent",
                    pathname === link.href && "text-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="text-muted-foreground hover:text-accent transition-colors">
                <Heart className="h-6 w-6 text-accent" />
            </Link>
            <Link href="/cart" className="text-muted-foreground hover:text-accent transition-colors">
                <ShoppingBag className="h-6 w-6 text-accent" />
            </Link>
            <div className="h-6 w-px bg-gray-700 mx-2"></div>
            <Link href="/login" className="text-sm font-medium text-accent hover:underline">
                Login
            </Link>
            <Button asChild variant="default" className="bg-white text-black hover:bg-gray-200">
                <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
