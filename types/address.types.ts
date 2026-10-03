export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}
export interface AddressInput {
  name: string;
  details: string;
  phone: string;
  city: string;
}
export interface AddressApiResponse {
  status: string;
  message?: string;
  data: Address[];
}
