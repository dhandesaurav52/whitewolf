
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Cancellations & Refunds | White Wolf',
  description: 'Our policy on cancellations, returns, and refunds.',
};

export default function ReturnsPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Cancellations & Refunds
          </h1>
          <div className="space-y-8 text-base md:text-lg text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-bold font-headline text-accent">Return Policy</h2>
            <p>
              We want you to be completely satisfied with your purchase. We accept returns within 7 days of delivery for a full refund. To be eligible for a return, your item must be in the same condition that you received it: unworn, unused, with all original tags attached, and in its original packaging.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              How to Initiate a Return
            </h2>
            <p>
              To start a return, please log in to your account and go to the "My Orders" page. Select the order you wish to return and follow the instructions.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Cancellations
            </h2>
            <p>
              You can cancel your order within 24 hours of placing it, provided it has not yet been shipped. Please contact our customer support team to request a cancellation.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Refunds
            </h2>
            <p>
              Once we receive and inspect your return, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-7 business days.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
