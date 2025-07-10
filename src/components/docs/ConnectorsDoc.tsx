import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  useTheme, 
  Stepper, 
  Step, 
  StepLabel,
  Alert
} from '@mui/material';
import { 
  Storage as StorageIcon, 
  AddCircle as AddCircleIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  Cloud as CloudIcon,
  Key as KeyIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';

const ConnectorsDoc: React.FC = () => {
  const theme = useTheme();
  
  const connectorTypes = [
    {
      name: 'Amazon S3',
      icon: <CloudIcon sx={{ color: '#FF9900' }} />,
      description: 'Connect to AWS S3 buckets for object storage'
    },
    {
      name: 'Azure Storage',
      icon: <CloudIcon sx={{ color: '#0078D4' }} />,
      description: 'Connect to Microsoft Azure Blob Storage'
    }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <StorageIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h2" fontWeight="medium" color="primary.main">
          Connectors
        </Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
        Connect your storage resources to the dataspace
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Connectors page is central to your dataspace experience, allowing you to securely link your 
        storage systems to the platform. Connectors enable seamless data exchange while maintaining 
        control over your assets at all times.
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4, mt: 2 }}>
        Currently, the DLR Dataspace supports Amazon S3 and Azure Storage connectors, with more integrations planned for future releases.
      </Alert>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
              <AddCircleIcon sx={{ mr: 1 }} /> Creating a Connector
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              The connector creation process is straightforward and guided:
            </Typography>
            
            <Stepper orientation="vertical" sx={{ mb: 2 }}>
              <Step active completed>
                <StepLabel>Select connector type</StepLabel>
              </Step>
              <Step active completed>
                <StepLabel>Configure connection details</StepLabel>
              </Step>
              <Step active completed>
                <StepLabel>Set access permissions</StepLabel>
              </Step>
              <Step active completed>
                <StepLabel>Test and validate connection</StepLabel>
              </Step>
            </Stepper>
            
            <Typography variant="body1" paragraph>
              To create a new connector, click the <strong>"+ New Connector"</strong> button in the top-right 
              corner of the Connectors page and follow the setup wizard.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
              <SettingsIcon sx={{ mr: 1 }} /> Managing Connectors
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              Once created, you can manage your connectors from the main Connectors dashboard:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="View status and health" 
                  secondary="Monitor the connection status and synchronization health" 
                />
              </ListItem>
              {}
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Delete connector" 
                  secondary="Remove a connector when it's no longer needed" 
                />
              </ListItem>
              {}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'medium' }}>
        Supported Connector Types
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {connectorTypes.map((connector, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {connector.icon}
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'medium' }}>
                  {connector.name}
                </Typography>
              </Box>
              <Typography variant="body1">
                {connector.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} /> Authentication & Security
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          For secure access to your storage systems, you'll need to provide appropriate authentication:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                <KeyIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: '#FF9900' }} />
                Amazon S3 Authentication
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Access Key ID" />
                </ListItem>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Secret Access Key" />
                </ListItem>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Region" />
                </ListItem>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Bucket Name" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                <KeyIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle', color: '#0078D4' }} />
                Azure Storage Authentication
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Storage Account Name" />
                </ListItem>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Storage Account Key" />
                </ListItem>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Container Name" />
                </ListItem>
                <ListItem sx={{ pl: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ArrowForwardIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Connection String (optional)" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Note:</strong> All credentials are encrypted and securely stored. The DLR Dataspace platform 
          never stores your raw credentials in plain text and uses industry-standard encryption methods.
        </Typography>
      </Paper>
      
      {}
      
      
      
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
          Set up at least one connector before exploring other parts of the platform. Without an active connector, 
          you won't be able to share your data assets or create offers for other participants. Think of connectors 
          as the foundation for all other dataspace activities.
        </Typography>
      </Box>
    </Box>
  );
};

export default ConnectorsDoc;