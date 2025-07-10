// services/downloadCertificate.ts
import getBackendUrl from '../hooks/useBackendUrl';

export const handleDownloadCertificate = async (
  getAccessTokenSilently: () => Promise<string>
) => {
  try {
    const backendUrl = getBackendUrl();
    const token = await getAccessTokenSilently();
    
    const response = await fetch(
      `${backendUrl}/certificate/cert.zip`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to download certificate');
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create an object URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.zip'; // Set the filename
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return true;
  } catch (error) {
    console.error('Error downloading certificate:', error);
    return false;
  }
};