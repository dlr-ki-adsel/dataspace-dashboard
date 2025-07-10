import getBackendUrl from '../hooks/useBackendUrl';

export const handleGetConnector = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${backendUrl}/connectors/${selectedConnector}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch connectors');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching connectors:', error);
    throw error;
  }
};
