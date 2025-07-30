
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Privacy Policy | White Wolf',
  description: 'Our commitment to your privacy and how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Privacy Policy
          </h1>
          <div className="space-y-8 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              Your privacy is important to us. It is White Wolf's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Information We Collect
            </h2>
            <p>
              We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              How We Use Your Information
            </h2>
            <p>
             We use the information we collect to process orders, improve our services, and communicate with you about products and promotions. We do not share your personally identifying information with third-parties, except when required to by law.
            </p>
             <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Security
            </h2>
            <p>
             We take the security of your data seriously and use industry-standard measures to protect it from loss, theft, and unauthorized access.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
