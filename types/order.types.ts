export interface OrderShippingAddress {
  details: string;
  phone: string;
  city: string;
}
export interface OrderProduct {
  _id: string;
  title: string;
  imageCover?: string;
  category?: {
    _id?: string;
    name: string;
    slug?: string;
  };
  ratingsAverage?: number;
}
export interface OrderItem {
  _id: string;
  product: OrderProduct | string | null;
  price: number;
  count?: number;
  quantity?: number;
}
export interface UserOrder {
  _id: string;
  id?: number | string;
  user:
    | string
    | {
        _id: string;
        name?: string;
        email?: string;
        phone?: string;
      };
  cartItems: OrderItem[];
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: "cash" | "card" | string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  shippingAddress?: OrderShippingAddress;
  createdAt: string;
  updatedAt?: string;
}
export interface OrdersApiResponse {
  success: boolean;
  message?: string;
  data: UserOrder[];
}
