import getBackendUrl from '../hooks/useBackendUrl';

export const handleNegotiate = async (
  dataset: any,
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const negotiationPayload = {
      counterPartyAddress: dataset.originator,
      providerId: dataset.participantId,
      policy: dataset.policy,
      assetId: dataset.assetId, ///NEEDS TO BE TESTED
    };
    const response = await fetch(
      `${backendUrl}/ui/${selectedConnector}/negotiations`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(negotiationPayload),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to initiate negotiation');
    }
  } catch (error) {
    console.error('Error initiating negotiation:', error);
  }
};
