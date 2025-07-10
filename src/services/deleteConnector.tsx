import getBackendUrl from '../hooks/useBackendUrl';


export const handleDeleteConnector = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
) => {
  try {
    const backendUrl = getBackendUrl();
    const token = await getAccessTokenSilently();
    const response = await fetch(`${backendUrl}/connectors/${selectedConnector}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete connector');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting connector:', error);
    throw error;
  }
};
