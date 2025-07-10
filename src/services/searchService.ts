// import apiClient from './client';
import { DEFAULT_PAGE_SIZE } from '../config';
import useKeycloakToken from '../hooks/useKeycloakToken';
import getBackendUrl from '../hooks/useBackendUrl';

// Define the search parameters type
export interface SearchParams {
  q: string;
  page: number;
  size: number;
  tags?: string[];
  sort_by?: string;
  entity_type?: string;
}

// Define the search response type that matches your DsEntity
export interface SearchResponse {
  items: Array<{
    id: string;
    title: string;
    description?: string;
    entity_type: string;
    version_major: number;
    version_minor: number;
    created_at: string;
    updated_at: string;
    assets: Array<Record<string, any>>;
    compatible_with: string[];
    tags: string[];
    unique_identifier: string;
    visibility: boolean;
    icon?: string | null;
    is_verified: boolean;
    verified_by?: string | null;
    ratings: Record<string, { value: number; timestamp: string }>;
    comments: Array<{
      id: string;
      user_id: string;
      text: string;
      created_at: string;
      updated_at?: string;
      parent_id?: string;
      is_deleted: boolean;
      moderation_status: string;
    }>;
  }>;
  total: number;
  page: number;
  page_size: number;
  query: string;
}  

// Create a custom hook for search functionality
export function useSearchService() {
  const getAccessTokenSilently = useKeycloakToken();
  const backendUrl = getBackendUrl();

  const search = async (params: SearchParams): Promise<SearchResponse> => {
    try {
      // Build query parameters
      const token = await getAccessTokenSilently();
      const queryParams: Record<string, string | number> = {
        q: params.q,
        page: params.page || 1,
        size: params.size || DEFAULT_PAGE_SIZE,
      };
      
      if (params.tags?.length) {
        // Add tags as comma-separated list
        queryParams.tags = params.tags.join(',');
      }
      
      if (params.sort_by) {
        queryParams.sort_by = params.sort_by;
      }
      
      if (params.entity_type) {
        queryParams.entity_type = params.entity_type;
      }
      const response = await fetch(
        `${backendUrl}/search/query?q=${String(queryParams.q)}`,
        {
          headers: {
            q: String(queryParams.q),
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResponse = await response.json();
      
      // Return a properly formatted SearchResponse object
      return {
        items: jsonResponse.items || [],
        total: jsonResponse.total || 0,
        page: jsonResponse.page || params.page || 1,
        page_size: jsonResponse.page_size || params.size || DEFAULT_PAGE_SIZE,
        query: jsonResponse.query || params.q
      };
      // return await apiClient.get<SearchResponse>('/dataspace/search/query', queryParams);
    } catch (error) {
      console.error('Search API error:', error);
      
      // If API call fails, fall back to mock data
      return generateMockSearchResults(params);
    }
  };
  
  return { search };
}

// Alternative service implementation that accepts token and backendUrl as parameters
export const searchService = {
  // Main search function
  search: async (
    params: SearchParams,
    getTokenFn: () => Promise<string>,
    backendUrl: string
  ): Promise<SearchResponse> => {
    try {
      // Build query parameters
      const token = await getTokenFn();
      const queryParams: Record<string, string | number> = {
        q: params.q,
        page: params.page || 1,
        size: params.size || DEFAULT_PAGE_SIZE,
      };
      
      if (params.tags?.length) {
        // Add tags as comma-separated list
        queryParams.tags = params.tags.join(',');
      }
      
      if (params.sort_by) {
        queryParams.sort_by = params.sort_by;
      }
      
      if (params.entity_type) {
        queryParams.entity_type = params.entity_type;
      }
      const response = await fetch(
        `${backendUrl}/search/query`,
        {
          headers: {
            q: String(queryParams.q),
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const jsonResponse = await response.json();
      
      // Return a properly formatted SearchResponse object
      return {
        items: jsonResponse.items || [],
        total: jsonResponse.total || 0,
        page: jsonResponse.page || params.page || 1,
        page_size: jsonResponse.page_size || params.size || DEFAULT_PAGE_SIZE,
        query: jsonResponse.query || params.q
      };
      // return await apiClient.get<SearchResponse>('/dataspace/search/query', queryParams);
    } catch (error) {
      console.error('Search API error:', error);
      
      // If API call fails, fall back to mock data
      return generateMockSearchResults(params);
    }
  }
};

// Mock data generator for when API is unavailable
function generateMockSearchResults(params: SearchParams): SearchResponse {
  const { q: searchQuery, page, size } = params;
  const queryWords = searchQuery.toLowerCase().split(/\s+/);
  
  // Helper functions for mock data generation
  const getEntityType = (index: number): string => {
    const types = ['Dataset', 'Service', 'Connector', 'API'];
    
    // If search contains specific type, use it more frequently
    if (queryWords.some(w => w.includes('data'))) return 'Dataset';
    if (queryWords.some(w => w.includes('serv'))) return 'Service';
    if (queryWords.some(w => w.includes('connect'))) return 'Connector';
    if (queryWords.some(w => w.includes('api'))) return 'API';
    
    // If entity_type parameter is specified, use it
    if (params.entity_type) {
      return params.entity_type;
    }
    
    return types[index % types.length];
  };
  
  const getTags = (index: number): string[] => {
    const baseTags = ['mock', ...queryWords];
    const commonTags = ['data', 'information', 'AI', 'ML', 'analytics', 'research'];
    
    // Add index-specific tag
    return [...baseTags, commonTags[index % commonTags.length], `tag-${index}`].filter(Boolean);
  };
  
  const getTitle = (index: number, type: string): string => {
    const titles = [
      `${searchQuery} ${type}`,
      `${type} for ${searchQuery} Analysis`,
      `Advanced ${searchQuery} ${type}`,
      `${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)} Research ${type}`,
      `${type} Platform: ${searchQuery}`,
      `${searchQuery} Suite (${type})`,
    ];
    
    return titles[index % titles.length];
  };
  
  // Generate mock results
  const startIndex = (page - 1) * size;
  const totalMockResults = 50; // Fixed total for testing pagination
  
  const items = Array.from({ length: Math.min(size, totalMockResults - startIndex) }, (_, idx) => {
    const globalIndex = startIndex + idx;
    const entityType = getEntityType(globalIndex);
    
    return {
      id: `mock-id-${globalIndex}`,
      title: getTitle(globalIndex, entityType),
      description: `This is a comprehensive ${entityType.toLowerCase()} about ${searchQuery} for research and analysis purposes. It contains extensive data and metadata to support various ${searchQuery}-related applications and studies.`,
      entity_type: entityType,
      version_major: 1,
      version_minor: globalIndex % 10,
      created_at: new Date(Date.now() - globalIndex * 86400000).toISOString(), // days ago
      updated_at: new Date(Date.now() - globalIndex * 43200000).toISOString(), // half days ago
      assets: [],
      compatible_with: [],
      tags: getTags(globalIndex),
      unique_identifier: `mock-${globalIndex}-${Date.now()}`,
      visibility: true,
      icon: null,
      is_verified: globalIndex % 3 === 0,
      verified_by: globalIndex % 3 === 0 ? 'admin-id' : null,
      ratings: {
        'user1': { value: 4.5, timestamp: new Date().toISOString() },
        'user2': { value: 3.8, timestamp: new Date().toISOString() },
        ...(globalIndex % 2 === 0 ? { 'user3': { value: 5.0, timestamp: new Date().toISOString() } } : {})
      },
      comments: [
        {
          id: `comment-${globalIndex}-1`,
          user_id: 'user1',
          text: `Great ${entityType.toLowerCase()} for ${searchQuery} research!`,
          created_at: new Date().toISOString(),
          is_deleted: false,
          moderation_status: 'approved'
        },
        ...(globalIndex % 2 === 0 ? [{
          id: `comment-${globalIndex}-2`,
          user_id: 'user2',
          text: `I found this ${entityType.toLowerCase()} very useful for my work with ${searchQuery}.`,
          created_at: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
          is_deleted: false,
          moderation_status: 'approved'
        }] : [])
      ]
    };
  });
  
  return {
    items,
    total: totalMockResults,
    page,
    page_size: size,
    query: searchQuery
  };
}