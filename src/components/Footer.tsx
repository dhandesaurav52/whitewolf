import Link from "next/link";
import { Instagram, Star } from "lucide-react";

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


export default function Footer() {
  const shopLinks = [
    { href: "/products", label: "All Products" },
    { href: "/new-arrivals", label: "New Arrivals" },
    { href: "/t-shirts", label: "T-Shirts" },
    { href: "/jeans", label: "Jeans" },
  ];

  const aboutLinks = [
    { href: "/about", label: "Our Story" },
    { href: "/contact", label: "Contact Us" },
  ];

  const supportLinks = [
    { href: "/shipping", label: "Shipping Policy" },
    { href: "/returns", label: "Cancellations & Refunds" },
    { href: "/size-guide", label: "Size Guide" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ];

  return (
    <footer className="bg-background text-muted-foreground border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <WhiteWolfLogo />
              <span className="text-2xl font-bold text-accent">White Wolf</span>
            </Link>
            <p className="text-sm max-w-xs">
              Timeless style, uncompromising quality, and conscious craftsmanship for the modern individual.
            </p>
            <div className="flex mt-4 space-x-4">
              <Link href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-sm text-accent tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-bold text-sm text-accent tracking-wider uppercase mb-4">About</h3>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/faqs" className="text-sm hover:text-accent transition-colors flex items-center">
                  FAQs
                  <span className="ml-2 inline-flex items-center">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1 text-xs">4.7</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-bold text-sm text-accent tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} White Wolf Co. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
