export interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
}
export interface AuthSuccessResponse {
  message: string;
  user: User;
  token: string;
}
export interface AuthErrorResponse {
  statusMsg?: string;
  message: string;
}
export interface DecodedToken {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}
