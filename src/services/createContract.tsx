import getBackendUrl from '../hooks/useBackendUrl';

export const handleCreateContract = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
  contractDefinition: any,
) => {
  try {
    const backendUrl = getBackendUrl();
    const token = await getAccessTokenSilently();
    const response = await fetch(
      `${backendUrl}/ui/${selectedConnector}/contracts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contractDefinition),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to initiate request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating contract:', error);
  }
};
