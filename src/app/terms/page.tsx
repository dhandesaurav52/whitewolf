
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Terms & Conditions | White Wolf',
  description: 'The terms and conditions for using the White Wolf website.',
};

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Terms & Conditions
          </h1>
          <div className="space-y-8 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Use License
            </h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on White Wolf's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
             Disclaimer
            </h2>
            <p>
              The materials on White Wolf's website are provided on an 'as is' basis. White Wolf makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
             <h2 className="text-2xl font-bold font-headline text-accent pt-6 border-t mt-12">
              Governing Law
            </h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
