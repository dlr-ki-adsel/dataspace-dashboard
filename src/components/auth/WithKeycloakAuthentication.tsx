import { ComponentType, ReactNode } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Loading from '../utils/Loading';

interface Props {
  onRedirecting?: () => ReactNode;
}

const WithKeycloakAuthentication = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: Props = {},
) => {
  return (props: P) => {
    const { keycloak, initialized } = useKeycloak();

    if (!initialized) {
      return options.onRedirecting ? options.onRedirecting() : <Loading />;
    }

    if (!keycloak.authenticated) {
      keycloak.login(); // Redirects to Keycloak login page
      return <Loading />; // Show loading while redirecting
    }

    return <WrappedComponent {...props} />;
  };
};

export default WithKeycloakAuthentication;
