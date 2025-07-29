

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
    appliesTo: 'categories' | 'products';
    selectedCategories: string[];
    status: 'Active' | 'Inactive';
};
