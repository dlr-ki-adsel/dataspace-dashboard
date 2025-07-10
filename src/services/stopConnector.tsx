import getBackendUrl from '../hooks/useBackendUrl';

export const handleStopConnector = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${backendUrl}/connectors/${selectedConnector}/stop`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to stop connector');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error stopping connector:', error);
    throw error;
  }
};
