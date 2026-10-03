export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
export interface ProductBrand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}
export interface Product {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: ProductCategory;
  brand?: ProductBrand;
  ratingsAverage: number;
  ratingsQuantity: number;
  sold?: number;
  subcategory?: {
    _id: string;
    name: string;
    slug?: string;
  }[];
}
export interface PaginationMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}
export interface ProductsApiResponse {
  results: number;
  metadata: PaginationMetadata;
  data: Product[];
}
export interface ProductDetailsApiResponse {
  data: Product;
}
