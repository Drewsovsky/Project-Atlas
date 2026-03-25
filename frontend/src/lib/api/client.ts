import axios from 'axios';

// Create axios instance with default configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5177',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // TODO: Add Supabase JWT token when auth is implemented
    // const token = getSupabaseToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Handle unauthorized - redirect to login
      console.error('Unauthorized - redirecting to login');
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