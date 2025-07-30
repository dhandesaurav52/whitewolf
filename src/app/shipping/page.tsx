
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Shipping Policy | White Wolf',
  description: 'Information about our shipping process and policies.',
};

export default function ShippingPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Shipping Policy
          </h1>
          <div className="space-y-8 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              We are committed to delivering your White Wolf products in a timely and efficient manner. All orders are processed within 1-2 business days. We offer free standard shipping on all orders within India.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Shipping Times
            </h2>
            <p>
              - Standard Shipping: 5-7 business days.
            </p>
            <p>
              - Expedited Shipping: 2-3 business days (available at an additional cost).
            </p>
             <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Order Tracking
            </h2>
            <p>
              Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can use this to track the progress of your shipment.
            </p>
            <p className="mt-4">
              Please note that shipping times are estimates and may vary depending on your location and external factors beyond our control.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
