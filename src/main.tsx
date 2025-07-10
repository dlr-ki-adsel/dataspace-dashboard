import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import getKeycloakUrl from './hooks/useKeycloakUrl';

const keycloakUrl = getKeycloakUrl();

const keycloak = new Keycloak({
  url: keycloakUrl,
  realm: 'user',
  clientId: 'react-app',
});

const initOptions = {
  onLoad: 'login-required',
  redirectUri: window.location.origin + window.location.pathname, // Modified this line
  checkLoginIframe: false,
  fragmentType: 'hash', // Added this line
  pkceMethod: 'S256' // Added this for better security
};

// Handle the initial route
const currentPath = window.location.hash.split('#')[1] || '/home';
if (!currentPath.includes('state=')) {
  localStorage.setItem('lastRoute', currentPath);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider 
    authClient={keycloak} 
    initOptions={initOptions}
  >
    <App />
  </ReactKeycloakProvider>,
);