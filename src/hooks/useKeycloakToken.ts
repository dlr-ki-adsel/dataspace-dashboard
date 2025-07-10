import { useEffect, useState, useCallback } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const useKeycloakToken = () => {
  const { keycloak, initialized } = useKeycloak();
  const [, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (initialized && keycloak.authenticated) {
        try {
          await keycloak.updateToken(30);
          setToken(keycloak.token || null);
        } catch (error) {
          console.error('Failed to update token:', error);
          setToken(null);
        }
      } else {
        console.warn('Keycloak not initialized or user not authenticated');
        setToken(null);
      }
    };

    if (initialized) {
      fetchToken();
    }
  }, [initialized, keycloak]);

  // Return a function to fetch the token as a promise
  const getAccessToken = useCallback(async () => {
    if (!initialized) {
      throw new Error('Keycloak is not initialized');
    }

    if (!keycloak.authenticated) {
      throw new Error('User is not authenticated');
    }

    try {
      await keycloak.updateToken(30);
      if (keycloak.token) {
        return keycloak.token;
      } else {
        throw new Error('Token not available');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  }, [initialized, keycloak]);

  return getAccessToken;
};

export default useKeycloakToken;
