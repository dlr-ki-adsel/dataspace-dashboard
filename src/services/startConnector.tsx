import getBackendUrl from '../hooks/useBackendUrl';

export const handleStartConnector = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${backendUrl}/connectors/${selectedConnector}/start`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to start connector');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error starting connector:', error);
    throw error;
  }
};
