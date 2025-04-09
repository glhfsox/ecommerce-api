// Global type definitions
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  _id?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Order {
  _id: string;
  user: string | User;
  products: CartItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
}

// Utility type for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 