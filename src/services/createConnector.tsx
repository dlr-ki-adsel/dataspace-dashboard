import getBackendUrl from '../hooks/useBackendUrl';


export const handleCreateConnector = async (
  getAccessTokenSilently: () => Promise<string>,
  connectorData: {
    connectorName: string;
    storageType: string;
    bucketName?: string;
    region?: string;
    endpointOverride?: string;
    accessKeyIdRead?: string;
    secretAccessKeyRead?: string;
    accessKeyIdWrite?: string;
    secretAccessKeyWrite?: string;
    azureContainerName?: string;
    blobStoreEndpoint?: string;
    azureAccountNameRead?: string;
    azureAccountKeyRead?: string;
    azureAccountNameWrite?: string;
    azureAccountKeyWrite?: string;
  }
) => {
  const backendUrl = getBackendUrl();
  try {
    const token = await getAccessTokenSilently();
    
    // Define payload for HttpData (Leeres Dict)
    const payloadHttpData = {};
    
    // Define payload for Amazon S3
    const payloadAmazonS3 = {
      bucketName: connectorData.bucketName,
      region: connectorData.region,
      endpointOverride: connectorData.endpointOverride,
      accessKeyIdRead: connectorData.accessKeyIdRead,
      secretAccessKeyRead: connectorData.secretAccessKeyRead,
      accessKeyIdWrite: connectorData.accessKeyIdWrite,
      secretAccessKeyWrite: connectorData.secretAccessKeyWrite,
    };
    
    // Define payload for Azure Storage
    const payloadAzureStorage = {
      containerName: connectorData.azureContainerName,
      blobstoreEndpointTemplate: connectorData.blobStoreEndpoint,
      accountNameRead: connectorData.azureAccountNameRead,
      accountKeyRead: connectorData.azureAccountKeyRead,
      accountNameWrite: connectorData.azureAccountNameWrite,
      accountKeyWrite: connectorData.azureAccountKeyWrite,
    };
    
    // Select the correct payload based on storageType
    let payload;
    if (connectorData.storageType === 'AmazonS3') {
      payload = payloadAmazonS3;
    } else if (connectorData.storageType === 'AzureStorage') {
      payload = payloadAzureStorage;
    } else if (connectorData.storageType === 'HttpData') {
      payload = payloadHttpData;
    } else {
      throw new Error('Invalid storageType specified');
    }
    
    // Make the request to initiate connector creation
    const response = await fetch(`${backendUrl}/connectors/${connectorData.connectorName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    
    // Check the response status and print the response
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      const errorData = await response.text();
      console.error('Failed to create connector:', errorData);
      throw new Error(errorData);
    }
  } catch (error) {
    console.error('Error initiating connector creation:', error);
    throw error;
  }
};
