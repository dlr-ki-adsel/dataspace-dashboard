const useBackendUrl = (): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (backendUrl) {
    return backendUrl;
  } else {
    throw new Error(
      "Environment variable 'VITE_BACKEND_URL' is not set. Create a .env.local file in the root directory and add 'VITE_BACKEND_URL=https://example-backend-url/connectors/'",
    );
  }
};
export default useBackendUrl;
