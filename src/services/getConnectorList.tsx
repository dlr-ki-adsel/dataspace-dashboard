import getBackendUrl from '../hooks/useBackendUrl';

export const handleGetConnectorList = async (getAccessTokenSilently: () => Promise<string>) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${backendUrl}/connectors`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch connectors');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching connectors:', error);
    throw error;
  }
};
