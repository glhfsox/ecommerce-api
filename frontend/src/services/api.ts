import axios from 'axios';
import { Product, User, CartItem, Order } from '../types.ts';

// Define AuthResponse since it's not in the types.ts file
interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData: Omit<User, 'id' | 'role'> & { password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
  },
  addToCart: async (productId: string, quantity: number): Promise<CartItem> => {
    const response = await api.post<CartItem>('/cart', { productId, quantity });
    return response.data;
  },
  updateCartItem: async (productId: string, quantity: number): Promise<CartItem> => {
    const response = await api.put<CartItem>(`/cart/${productId}`, { quantity });
    return response.data;
  },
  removeFromCart: async (productId: string): Promise<void> => {
    await api.delete(`/cart/${productId}`);
  },
};

export const orderService = {
  createOrder: async (cartItems: CartItem[]): Promise<Order> => {
    const response = await api.post<Order>('/checkout', { items: cartItems });
    return response.data;
  },
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/checkout');
    return response.data;
  },
};

export default api; 