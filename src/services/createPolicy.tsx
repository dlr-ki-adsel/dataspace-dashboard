import getBackendUrl from '../hooks/useBackendUrl';


export const handleCreatePolicies = async (
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
  policyDefinition: any,
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(
      `${backendUrl}/ui/${selectedConnector}/policies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(policyDefinition),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to initiate request');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating policy:', error);
  }
};
