
export type Garment = {
    name: string;
    description: string;
    link: string;
};

export type Recommendation = {
    id: string;
    recommendation: string;
    garments: Garment[];
    preferences: {
        occasion: string;
        weather: string;
        style: string;
    }
};

export type Advertisement = {
    id: string;
    text: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    appliesTo: 'categories' | 'products' | 'hero';
    selectedCategories: string[];
    status: 'Active' | 'Inactive';
    heroImageUrl?: string;
    heroHeadline?: string;
    heroSubtext?: string;
    heroButton?: string;
};

export type Product = {
  id: string;
  name: string;
  images: string[];
  aiHint: string;
  category: string;
  price: string;
  originalPrice: string | null;
  stock: number;
  brand?: string;
  description?: string;
  colors?: string;
  textSizes?: string;
  numericSizes?: string;
  new?: boolean;
  displaySection: 'shop' | 'accessories';
  discount: string | null;
  videoUrl?: string;
};
