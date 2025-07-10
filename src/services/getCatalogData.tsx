import getBackendUrl from '../hooks/useBackendUrl';

export const handleGetCatalogData = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
  filterByGroup: boolean = false // Add the filter parameter with default value
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    
    const url = `${backendUrl}/ui/${selectedConnector}/catalog?filter_group=${filterByGroup ? 'True' : 'False'}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch catalog data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching catalog data:', error);
    throw error;
  }
};