
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, LogOut, User as UserIcon, Heart, Settings, LayoutDashboard, Package, Undo2, Megaphone, Clapperboard, ShoppingCart, Shirt, Menu } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const WhiteWolfLogo = () => (
    <div className="flex items-center">
        <Image src="https://firebasestorage.googleapis.com/v0/b/white-wolf-style-advisor.firebasestorage.app/o/WhiteWolfLogo.png?alt=media&token=3accae8b-9687-41f4-99a3-31856cdeaa91" alt="White Wolf Logo" width={40} height={40} className="w-10 h-10 rounded-md mr-2" />
        <div className="flex flex-col text-primary">
           <span className="text-xs font-bold tracking-widest">WHITE</span>
           <span className="text-xs font-bold tracking-widest">WOLF</span>
        </div>
    </div>
)

export default function Header() {
  const pathname = usePathname();
  const { user, loading, isAdmin, signOut } = useAuth();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/accessories", label: "Accessories" },
  ];

  return (
    <header className="bg-background border-b border-input shadow-sm sticky top-0 z-40">
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
                <Link href="/wishlist" className="text-muted-foreground hover:text-accent transition-colors">
                    <Heart className="h-6 w-6 text-accent" />
                </Link>
                <Link href="/cart" className="text-muted-foreground hover:text-accent transition-colors">
                    <ShoppingBag className="h-6 w-6 text-accent" />
                </Link>
                <div className="h-6 w-px bg-border mx-2"></div>
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
                        <p className="text-sm font-medium leading-none">Hi, {user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/products"><Shirt className="mr-2 h-4 w-4" />Products</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/orders"><Package className="mr-2 h-4 w-4" />Manage Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/ads"><Megaphone className="mr-2 h-4 w-4" />Advertise & Offers</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/reels"><Clapperboard className="mr-2 h-4 w-4" />Manage Reels</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/cart">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>Cart</span>
                      </Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link href="/wishlist">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
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
             <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                        </SheetHeader>
                        <nav className="grid gap-6 text-lg font-medium pt-8">
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
                    </SheetContent>
                </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
