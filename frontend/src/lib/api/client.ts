import axios from 'axios';
import { supabase } from '@/lib/supabase/client';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5177',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include Supabase JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await supabase.auth.signOut();
    }
    return Promise.reject(error);
  }
);

// API endpoints configuration
export const API_ENDPOINTS = {
  profiles: {
    list: '/profiles',
    create: '/profiles',
    get: (id: string) => `/profiles/${id}`,
    update: (id: string) => `/profiles/${id}`,
    delete: (id: string) => `/profiles/${id}`,
  },
  // TODO: Add other endpoints when backend implements them
  // posts: {
  //   list: '/posts',
  //   create: '/posts',
  //   get: (id: string) => `/posts/${id}`,
  // },
  // events: {
  //   list: '/events',
  //   create: '/events',
  //   get: (id: string) => `/events/${id}`,
  // },
} as const;