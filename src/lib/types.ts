
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
    discountType: 'percentage' | 'fixed' | 'buy-x-get-y';
    discountValue: number;
    buyQuantity?: number;
    getQuantity?: number;
    appliesTo: 'categories' | 'products' | 'hero';
    selectedCategories: string[];
    status: 'Active' | 'Inactive';
    heroImageUrl?: string;
    heroVideoUrl?: string;
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
  currency: string; // e.g., 'INR', 'USD'
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
  offerType?: 'percentage' | 'fixed' | 'buy-x-get-y';
  videoUrl?: string;
  createdAt?: any; // For Firestore timestamp
};

export type CartItem = {
    product: Product;
    quantity: number;
    size?: string;
};

export type Reel = {
  id: string;
  reelTitle: string;
  linkedProduct: string;
  videoUrl: string;
};

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Shipped' 
  | 'Delivered' 
  | 'Cancelled'
  | 'Return Requested'
  | 'Return Accepted'
  | 'Return Confirmed'
  | 'Return Successful'
  | 'Return Request Rejected';


export type CustomerDetails = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    userId?: string;
};

export type Order = {
    id: string;
    customer: CustomerDetails;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    orderDate: any; // For Firestore timestamp
    deliveryDate?: any; // For Firestore timestamp
    paymentId?: string;
    paymentMethod?: 'Online' | 'COD';
};

export type ProfileAddress = {
  mobile?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  },
  wishlist?: string[];
  emailNotifications?: boolean;
}

export type User = {
    id: string;
    email: string;
    displayName?: string;
    role: 'customer' | 'admin';
}
