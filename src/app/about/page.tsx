
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Our Story | White Wolf',
  description: 'The story behind White Wolf - a symbol of strength, purpose, and individuality for the modern man.',
};

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-accent mb-12 text-center">
            Our Story
          </h1>
          <div className="space-y-8 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p className="text-xl font-semibold text-primary/90">
              In 2020, in the heart of a world that was changing rapidly—where self-expression was beginning to roar louder than ever before—The White Wolf was born. Not just as a clothing brand, but as a bold statement. A symbol of strength, purpose, and individuality for the modern man. We didn't just want to create clothes. We wanted to challenge the way society saw men—and the way men saw themselves.
            </p>
            
            <h2 className="text-3xl font-bold font-headline text-accent pt-6 border-t mt-12">
              The name "The White Wolf" isn't just a name—it’s a philosophy.
            </h2>
            <p>
              The white wolf is rare. It walks alone, yet it never loses its way. It leads not through dominance, but through quiet confidence. It survives harsh winters, adapts, evolves, and emerges stronger each time. That’s what we see in today’s youth—especially young men who are often caught in the crossfire of outdated expectations and new-age realities.
            </p>
            
            <h2 className="text-3xl font-bold font-headline text-accent pt-6 border-t mt-12">
              We created this brand because we believe that men deserve more.
            </h2>
            <ul className="list-none space-y-2 pl-0">
                <li>More than being boxed into stereotypes.</li>
                <li>More than being told to “man up” in silence.</li>
                <li>More than being seen just for their toughness, instead of their sensitivity, creativity, and style.</li>
                <li>More than fast fashion that fades fast and says nothing.</li>
            </ul>
             <p>
              At The White Wolf, we stand for the modern man—one who is fierce, fashionable, and unapologetically himself.
            </p>
            
            <div className="bg-muted p-6 rounded-lg my-12">
              <h3 className="text-2xl font-bold font-headline text-accent mb-4">Why We Exist</h3>
              <p>
                Men's fashion has long been underwhelming. For too long, the racks have been filled with the same cuts, the same colors, the same lifeless designs that say nothing about who the wearer is. We thought: why shouldn’t men wear clothes that reflect their journey? Their fight? Their ambition? Their individuality?
              </p>
              <p className="mt-4 font-semibold text-primary/90">
                Our mission is simple: to redefine how men express themselves through clothing.
              </p>
            </div>

            <h3 className="text-2xl font-bold font-headline text-accent">Who We’re For</h3>
            <p>
              The White Wolf is for every man who walks his own path. Whether you're grinding through your early 20s, building your dream in silence, or figuring out your voice in a noisy world—this brand is for you.
            </p>

            <h3 className="text-2xl font-bold font-headline text-accent">What We Believe Men Deserve</h3>
            <p>We believe men deserve clothing that respects them—not just their bodies, but their stories. We believe men deserve to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Be stylish without losing masculinity or authenticity</li>
                <li>Wear designs that resonate, not just “look cool”</li>
                <li>Dress with freedom and identity, not conformity</li>
                <li>Be seen as multi-dimensional human beings—strong and sensitive, focused and free, fierce and kind</li>
            </ul>

            <h3 className="text-2xl font-bold font-headline text-accent">Our Style DNA</h3>
            <p>
              Minimal. Sharp. Versatile. Confident. We don’t believe in overdoing it. We believe in smart design, premium materials, and wearable silhouettes. Our drops are curated—not cluttered. We design pieces that fit into your life, not the other way around.
            </p>

            <h3 className="text-2xl font-bold font-headline text-accent">The Pack Mentality</h3>
            <p>
              Even though the white wolf walks alone, it never forgets its pack. We built this brand with community at the center. Every drop, every campaign, every collab—we listen to you. We’re shaped by your feedback, your spirit, your hustle.
            </p>
            
            <h3 className="text-2xl font-bold font-headline text-accent">From 2020 to the Future</h3>
            <p>
              What started in 2020 as a small idea is now a movement. From our first hoodie drop to our latest summer capsule, every collection reminds us that we’re not just making clothes—we’re making statements.
            </p>
            
            <div className="text-center pt-8 mt-12 border-t">
              <h2 className="text-3xl font-bold font-headline text-primary">The White Wolf Isn’t Just a Brand—It’s Who You Are</h2>
              <p className="mt-4 text-lg">
                When you wear The White Wolf, you’re not just wearing fashion. You’re wearing a belief: That men can be more. Do more. Deserve more.
              </p>
              <p className="mt-6 font-bold text-xl text-accent tracking-wider">
                Join the Pack. Walk Your Path. Be the White Wolf.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
