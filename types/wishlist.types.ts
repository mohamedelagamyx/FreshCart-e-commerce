import { Product } from "./product.types";
export type WishlistProduct = Product;
export interface WishlistApiResponse {
  status: string;
  count?: number;
  data: WishlistProduct[];
}
export interface WishlistMutationResponse {
  status: string;
  message: string;
  data: string[];
}
export interface WishlistContextType {
  wishlistItems: WishlistProduct[];
  wishlistIds: Set<string>;
  itemCount: number;
  isLoading: boolean;
  isMutating: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (
    productId: string,
    product?: WishlistProduct,
  ) => Promise<boolean>;
  removeFromWishlist: (productId: string) => Promise<boolean>;
  toggleWishlist: (
    product:
      | WishlistProduct
      | {
          id?: string;
          _id?: string;
          title: string;
        },
  ) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}
