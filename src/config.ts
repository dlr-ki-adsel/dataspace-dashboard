// Application configuration

// Use a relative path for the API base URL
// This will be proxied through Vite in development
export const API_BASE_URL: string =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:8005/api/v1';

export const DEFAULT_PAGE_SIZE: number = 6;

export const THEME = {
  isDarkMode: false,
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 12,
};