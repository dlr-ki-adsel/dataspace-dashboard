import { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

const Login: React.FC = () => {
  const { keycloak, initialized } = useKeycloak();
  useEffect(() => {
    if (initialized && !keycloak.authenticated) {
      keycloak.login();
    }
  }, [keycloak, initialized]);

  return <div>Redirecting to login...</div>;
};

export default Login;
