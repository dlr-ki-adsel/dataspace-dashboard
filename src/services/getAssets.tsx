import getBackendUrl from '../hooks/useBackendUrl';

export const handleGetAssets = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${backendUrl}/ui/v2/${selectedConnector}/assets`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to initiate request');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initiating asset request:', error);
  }
};
