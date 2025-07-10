const useKeycloakUrl = (): string => {
  const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;

  if (keycloakUrl) {
    return keycloakUrl;
  } else {
    throw new Error(
      "Environment variable not correctly set. Create a .env.local file in the root directory and add 'VITE_KEYCLOAK_URL=https://example-auth-url'",
    );
  }
};
export default useKeycloakUrl;
