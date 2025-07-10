import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Paper, Tabs, Tab, useTheme, Fab } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import DashboardDoc from '../components/docs/DashboardDoc';
import CatalogDoc from '../components/docs/CatalogDoc';
import AssetsDoc from '../components/docs/AssetsDoc';
import AgreementsDoc from '../components/docs/AgreementsDoc';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`documentation-tabpanel-${index}`}
      aria-labelledby={`documentation-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `documentation-tab-${index}`,
    'aria-controls': `documentation-tabpanel-${index}`,
  };
}

const Home: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const tabValueRef = useRef(tabValue);
  const theme = useTheme();

  useEffect(() => {
    tabValueRef.current = tabValue;
  }, [tabValue]);

  const scrollToTitle = (tabIndex: number) => {
    const titles = [
      'Welcome to the DLR Dataspace',
      'Dashboard', 
      'Federated Catalog',
      'Your Assets',
      'Agreements'
    ];
    
    const titleText = titles[tabIndex];
    const titleElement = Array.from(document.querySelectorAll('h2, h4')).find(
      el => el.textContent?.trim() === titleText
    ) as HTMLElement;
    
    if (titleElement) {
      titleElement.style.scrollMarginTop = '80px';
      titleElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  const scrollToCurrentTabTitle = () => {
    scrollToTitle(tabValue);
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    
    setTimeout(() => {
      scrollToTitle(newValue);
    }, 25);
  };

  const handleScroll = () => {
    const titles = [
      'Welcome to the DLR Dataspace',
      'Dashboard', 
      'Federated Catalog',
      'Your Assets',
      'Agreements'
    ];
    
    const currentTab = tabValueRef.current;
    const titleText = titles[currentTab];
    
    const titleElement = Array.from(document.querySelectorAll('h2, h4')).find(
      el => el.textContent?.trim() === titleText
    ) as HTMLElement;
    
    if (titleElement) {
      const rect = titleElement.getBoundingClientRect();
      const shouldShow = rect.bottom < 0;
      setShowBackToTop(shouldShow);
    }
  };

  useEffect(() => {
    const mainElement = document.querySelector('main.MuiBox-root') as HTMLElement;
    
    if (!mainElement) {
      return;
    }
    
    let lastScrollTop = mainElement.scrollTop;
    
    const checkScroll = () => {
      const currentScrollTop = mainElement.scrollTop;
      
      if (currentScrollTop !== lastScrollTop) {
        handleScroll();
        lastScrollTop = currentScrollTop;
      }
      
      requestAnimationFrame(checkScroll);
    };
    
    requestAnimationFrame(checkScroll);
    handleScroll();
    
    return () => {};
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={3} sx={{ borderRadius: 0, overflow: 'hidden', mb: 0 }}>
        <Box sx={{ 
          p: 4, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
          color: 'white'
        }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            DLR Dataspace
          </Typography>
          <Typography variant="h6">
            Your complete guide to navigating and leveraging the DLR Dataspace platform effectively
          </Typography>
        </Box>
      </Paper>
        
      <Box sx={{ 
        position: 'sticky',
        top: '10px',
        zIndex: 100,
        backgroundColor: 'background.paper',
        borderBottom: 1, 
        borderRadius: 0,
        borderColor: 'divider',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 0
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleChange} 
          aria-label="documentation tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              fontWeight: 'medium',
              fontSize: '0.9rem',
              px: 3
            },
            '& .MuiTab-root:hover': {
              color: 'primary.main',
              opacity: 1
            }
          }}
        >
          <Tab label="Overview" {...a11yProps(0)} />
          <Tab label="Dashboard" {...a11yProps(1)} />
          <Tab label="Catalog" {...a11yProps(2)} />
          <Tab label="Your Assets" {...a11yProps(3)} />
          <Tab label="Agreements" {...a11yProps(4)} />
        </Tabs>
      </Box>
      
      <Paper elevation={3} sx={{ borderRadius: 0, overflow: 'hidden' }}>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="medium" color="primary">
              Welcome to the DLR Dataspace
            </Typography>
            <Typography variant="body1" paragraph>
              The DLR Dataspace provides a secure, collaborative environment for sharing and accessing data assets across organizations.
              With our intuitive platform, you can connect your data sources, discover valuable assets from other participants,
              and establish data sharing agreements based on clear policies and permissions.
            </Typography>
            <Typography variant="body1" paragraph>
              This documentation provides a comprehensive overview of all platform features to help you get started
              and make the most of the dataspace capabilities.
            </Typography>
          </Box>
          
          <Typography variant="h5" component="h3" gutterBottom fontWeight="medium" color="primary">
            Key Features
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
            {[
              {
                title: "Dashboard",
                description: "Configure storage connectors for S3, Azure, and more. Monitor your connector status and visualize group memberships."
              },
              {
                title: "Federated Catalog",
                description: "Discover available data assets across the entire dataspace."
              },
              {
                title: "Your Assets", 
                description: "Manage your data assets and create offers for other participants."
              },
              {
                title: "Agreements",
                description: "Approve data sharing requests and manage access permissions."
              }
            ].map((item, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                <Typography variant="h6" component="h4" gutterBottom fontWeight="medium">
                  {item.title}
                </Typography>
                <Typography variant="body2">
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
          <Box sx={{ 
            p: 3, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Pro Tip
            </Typography>
            <Typography variant="body1">
              To learn more about any specific feature, select the corresponding tab above to access detailed documentation. You can come back to this page by clicking on the "DLR DATASPACE" logo in the to left.
            </Typography>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <DashboardDoc />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <CatalogDoc />
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <AssetsDoc />
        </TabPanel>
        
        <TabPanel value={tabValue} index={4}>
          <AgreementsDoc />
        </TabPanel>
      </Paper>

      {showBackToTop && (
        <Fab 
          color="primary" 
          aria-label="back to top"
          onClick={scrollToCurrentTabTitle}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <KeyboardArrowUp />
        </Fab>
      )}
    </Container>
  );
};

export default Home;