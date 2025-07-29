
import Link from "next/link";
import { Instagram, Star } from "lucide-react";
import Image from "next/image";

const WhiteWolfLogo = () => (
    <div className="flex items-center">
        <Image src="https://firebasestorage.googleapis.com/v0/b/white-wolf-style-advisor.firebasestorage.app/o/WhiteWolfLogo.png?alt=media&token=3accae8b-9687-41f4-99a3-31856cdeaa91" alt="White Wolf Logo" width={40} height={40} className="w-10 h-10 rounded-md mr-2" />
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
