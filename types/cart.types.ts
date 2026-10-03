export interface CartProductSummary {
  _id: string;
  title: string;
  imageCover: string;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  brand?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
  ratingsAverage?: number;
  id?: string;
}
export interface CartItem {
  _id: string;
  product: CartProductSummary;
  price: number;
  count: number;
}
export interface Cart {
  cartId: string | null;
  cartOwner?: string;
  products: CartItem[];
  totalCartPrice: number;
  numOfCartItems: number;
  updatedAt?: string;
}
export interface CartApiResponse {
  status?: string;
  message?: string;
  numOfCartItems?: number;
  cartId?: string;
  data?: {
    _id?: string;
    cartOwner?: string;
    products?: Array<{
      _id: string;
      product: CartProductSummary | string;
      price: number;
      count: number;
    }>;
    totalCartPrice?: number;
    updatedAt?: string;
  };
}
export interface CartContextType {
  cart: Cart | null;
  cartId: string | null;
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  mutatingProductId: string | null;
  addToCart: (
    productId: string,
    quantity?: number,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  updateQuantity: (
    productId: string,
    count: number,
  ) => Promise<{
    success: boolean;
    message?: string;
  }>;
  removeItem: (productId: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  clearCart: () => Promise<{
    success: boolean;
    message?: string;
  }>;
  clearLocalCart: () => void;
  refreshCart: () => Promise<void>;
}
