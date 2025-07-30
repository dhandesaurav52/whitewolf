
import { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Terms & Conditions | White Wolf',
  description: 'The terms and conditions for using the White Wolf website.',
};

export default function TermsPage() {
  redirect('https://merchant.razorpay.com/policy/QoAs3QqvUvUpdi/terms');
  
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Redirecting to Terms & Conditions...
          </h1>
            <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
                <p>If you are not redirected automatically, please <a href="https://merchant.razorpay.com/policy/QoAs3QqvUvUpdi/terms" className="underline">click here</a>.</p>
            </div>
        </div>
      </main>
    </div>
  );
}
