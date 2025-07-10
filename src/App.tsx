import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { AuthenticationContext, SessionContext, Session } from '@toolpad/core';
import type { Navigation } from '@toolpad/core';
import { useKeycloak } from "@react-keycloak/web";
import './App.css';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard.tsx';
import Catalog from './pages/Catalog';
// import About from './pages/About';
import Assets from './pages/Assets.tsx';
import Agreements from './pages/Agreements';
// import TransferHistory from './pages/Transfers';
// import Connectors from './pages/Connectors.tsx';
import Profile from './views/Profile';
import Loading from './components/utils/Loading.tsx';
import Login from './pages/Login';
// import SearchResults from './pages/SearchResults';
import customTheme from './theme/theme';
import Logo from './components/misc/SwitchLogos.tsx';
import SidebarFooter from './components/navigation/SidebarFooter';
import ToolbarActions from './components/misc/ToolbarActions.tsx';
import ThemedIcon from './components/ThemedIcon.tsx';
// Graphics
import logoWhite from './assets/DLR_Banner_arial_white.svg';
import logoBlack from './assets/DLR_Banner_arial_black.svg';

const logoPath = (logoName: string) => {
  return '/nav_bar_icons/' + logoName;
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Provider',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <ThemedIcon iconForLight={logoPath('dashboard.svg')} iconForDark={logoPath('dashboard_white.svg')} />,
  },
  {
    kind: 'page',
    segment: 'assets',
    title: 'Your Assets',
    icon: <ThemedIcon iconForLight={logoPath('asset.svg')} iconForDark={logoPath('asset_white.svg')} />,
  },
  {
    kind: 'header',
    title: 'Consumer',
  },
  {
    segment: 'catalog',
    title: 'Catalog',
    icon: <Logo lightLogo={logoPath('catalog.svg')} darkLogo={logoPath('catalog_white.svg')} />,
  },
  {
    segment: 'agreements',
    title: 'Agreements',
    icon: <ThemedIcon iconForLight={logoPath('agreement.svg')} iconForDark={logoPath('agreement_white.svg')} />,
  }
];

function App() {
  const { keycloak, initialized } = useKeycloak();
  const isLoggedIn = keycloak.authenticated;
  const [restoredLocation, setRestoredLocation] = useState(false);

  const session: Session | null = isLoggedIn
    ? {
        user: {
          name: keycloak.tokenParsed?.preferred_username || '',
          email: keycloak.tokenParsed?.email || '',
          image: '',
        },
      }
    : null;

  const authentication = React.useMemo(
    () => ({
      signIn: () => keycloak.login(),
      signOut: () => {
        const currentPath = window.location.hash.split('#')[1];
        if (currentPath && !currentPath.includes('state=')) {
          localStorage.setItem('lastRoute', currentPath);
        }
        keycloak.logout({ redirectUri: window.location.origin });
      },
    }),
    [keycloak],
  );

  useEffect(() => {
    if (initialized && isLoggedIn && !restoredLocation) {
      const savedRoute = localStorage.getItem('lastRoute');
      if (savedRoute && !window.location.hash.includes(savedRoute)) {
        window.location.hash = savedRoute;
        setRestoredLocation(true);
      }
    }
  }, [initialized, isLoggedIn, restoredLocation]);

  useEffect(() => {
    const handleHashChange = () => {
      const currentPath = window.location.hash.split('#')[1];
      if (currentPath && !currentPath.includes('state=')) {
        localStorage.setItem('lastRoute', currentPath);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!initialized) {
    return <Loading />;
  }

  return (
    <Provider store={store}>
      <Router>
        <AppProvider
          navigation={NAVIGATION}
          branding={{
            logo: (
              <ThemedIcon
                iconForLight={logoBlack}
                iconForDark={logoWhite}
                style={{ width: 'auto', height: '300px' }}
              />
            ),
            title: '',
          }}
          theme={customTheme}
        >
          <AuthenticationContext.Provider value={authentication}>
            <SessionContext.Provider value={session}>
              {isLoggedIn ? (
                <DashboardLayout
                  slots={{
                    sidebarFooter: SidebarFooter,
                    toolbarActions: ToolbarActions
                  }}
                >
                  <div className="content-wrapper">
                    <div className="content">
                      <Routes>
                        <Route path="/" element={
                          <Navigate replace to={'/home'} />
                        } />
                        <Route path="/home" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        {}
                        <Route path="/assets" element={<Assets />} />
                        
                        <Route path="/agreements" element={<Agreements />} />
                        {}
                        
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/profile" element={<Profile />} />
                        {}
                        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
                      </Routes>
                    </div>
                  </div>
                </DashboardLayout>
              ) : (
                <Login />
              )}
            </SessionContext.Provider>
          </AuthenticationContext.Provider>
        </AppProvider>
      </Router>
    </Provider>
  );
}

export default App;