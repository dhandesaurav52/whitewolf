import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Garment } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface RecommendationCardProps {
  garment: Garment;
}

export default function RecommendationCard({ garment }: RecommendationCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden animate-fade-in transition-shadow hover:shadow-lg">
      <div className="relative w-full aspect-[4/3] bg-muted">
        <Image
          src={`https://placehold.co/400x300.png`}
          alt={garment.name}
          fill
          className="object-cover"
          data-ai-hint="mens fashion"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg font-headline">{garment.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{garment.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href={garment.link} target="_blank" rel="noopener noreferrer">
            Buy Now <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
