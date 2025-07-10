import getBackendUrl from '../hooks/useBackendUrl';

export const handleTransferAsset = async (
  agreement: any,
  getAccessTokenSilently: () => Promise<string>,
  selectedConnector: string,
  dataConnector: {}, ///REMOVE KEYS
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    const payloadHttpData = {
      assetId: agreement.assetId,
      counterPartyAddress: agreement.counterPartyAddress,
      contractId: agreement.contractAgreementId,
    };
    const payloadS3 = {
      assetId: agreement.assetId,
      counterPartyAddress: agreement.counterPartyAddress,
      contractId: agreement.contractAgreementId,
    };

    const payloadAzure = {
      assetId: agreement.assetId,
      counterPartyAddress: agreement.counterPartyAddress,
      contractId: agreement.contractAgreementId,
    };

    let payload;
    switch ((dataConnector as any).storageType) {
      case 'AmazonS3':
        payload = payloadS3;
        break;
      case 'AzureStorage':
        payload = payloadAzure;
        break;
      default:
        payload = payloadHttpData;
        break;
    }
    const response = await fetch(
      `${backendUrl}/ui/${selectedConnector}/transfers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to initiate negotiation');
    }
  } catch (error) {
    console.error('Error initiating negotiation:', error);
  }
};
