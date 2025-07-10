import { API_BASE_URL } from '../config';

// Simple fetch-based API client
const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    const url = `${API_BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-request-from': 'internal',
        },
        // No credentials for now to avoid CORS preflight
        // If your API needs auth, we can add them back later
        credentials: 'omit',
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json() as T;
  }
};

export default apiClient;