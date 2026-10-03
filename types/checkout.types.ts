import { EgyptianGovernorate } from "@/constants/governorates";
import { CartItem } from "./cart.types";
export interface ShippingAddress {
  details: string;
  phone: string;
  city: EgyptianGovernorate | string;
}
export type PaymentMethod = "cash" | "online";
export interface CheckoutFormData {
  details: string;
  phone: string;
  city: EgyptianGovernorate;
  paymentMethod: PaymentMethod;
}
export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category?: {
      name: string;
    };
    ratingsAverage?: number;
  };
  price: number;
  count: number;
}
export interface Order {
  _id: string;
  id?: string;
  user:
    | string
    | {
        _id: string;
        name: string;
        email: string;
        phone: string;
      };
  cartItems: CartItem[] | OrderItem[];
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt?: string;
}
export interface CashOrderApiResponse {
  status?: string;
  message?: string;
  data?: Order;
}
export interface StripeCheckoutApiResponse {
  status?: string;
  message?: string;
  session?: {
    url: string;
    success_url?: string;
    cancel_url?: string;
  };
}
