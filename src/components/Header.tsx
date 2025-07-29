
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, LogOut, User as UserIcon, Heart, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const { user, loading, signOut } = useAuth();

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
            {loading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            ) : user ? (
              <>
                <Link href="/cart" className="text-muted-foreground hover:text-accent transition-colors">
                    <ShoppingBag className="h-6 w-6 text-accent" />
                </Link>
                <div className="h-6 w-px bg-gray-700 mx-2"></div>
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />}
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Saved</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-accent hover:underline">
                    Login
                </Link>
                <Button asChild variant="default" className="bg-white text-black hover:bg-gray-200">
                    <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
