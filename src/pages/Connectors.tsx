import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button, 
  IconButton, 
  Divider, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Collapse,
  Alert,
  Snackbar,
  AlertColor,
  Tooltip
} from '@mui/material';
import { 
  PlayArrow as StartIcon, 
  Stop as StopIcon, 
  Delete as DeleteIcon, 
  // Edit as EditIcon, 
  Refresh as RefreshIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

// Import AWS, Azure and HTTP icons
import AmazonS3Icon from '../assets/icons/amazon-s3.svg';
import AzureStorageIcon from '../assets/icons/azure-storage.svg';
import HttpDataIcon from '../assets/icons/http-data.svg';

import useKeycloakToken from '../hooks/useKeycloakToken';
import { handleGetConnectorList } from '../services/getConnectorList';
// Import service functions with aliases to avoid naming conflicts
import { handleStartConnector as startConnector } from '../services/startConnector';
import { handleStopConnector as stopConnector } from '../services/stopConnector';
import { handleDeleteConnector as deleteConnector } from '../services/deleteConnector';
import WithKeycloakAuthentication from '../components/auth/WithKeycloakAuthentication';
import Loading from '../components/utils/Loading';
import CreateConnectorModal from '../components/modals/CreateConnectorModal';
import { Socket } from 'socket.io-client';

import getBackendUrl from '../hooks/useBackendUrl';
import { io } from 'socket.io-client';

// TypeScript interfaces
interface Connector {
  id: number;
  connectorName: string;
  storageType?: string;
  bpn?: string;
  status?: string;
  bucketName?: string;
  region?: string;
  azureContainerName?: string;
  [key: string]: any;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

// Helper function to get connector icon
const getConnectorIcon = (storageType: string | undefined): string => {
  switch (storageType) {
    case 'AmazonS3':
      return AmazonS3Icon;
    case 'AzureStorage':
      return AzureStorageIcon;
    case 'HttpData':
      return HttpDataIcon;
    default:
      return '';
  }
};

// Status color mapping
const getStatusColor = (status: string | undefined): string => {
  switch (status?.toUpperCase()) {
    case 'RUNNING':
      return '#4caf50'; // Green
    case 'STOPPED':
      return '#f44336'; // Red
    case 'ERROR':
      return '#ff9800'; // Orange
    default:
      return '#9e9e9e'; // Grey
  }
};

interface ConnectorCardProps {
  connector: Connector;
  onStart: (connector: Connector) => void;
  onStop: (connector: Connector) => void;
  onDelete: (connector: Connector) => void;
  onEdit: (connector: Connector) => void;
  showButtons?: boolean;
  selected?: boolean;
  onClick: (connector: Connector) => void;
}

const ConnectorCard: React.FC<ConnectorCardProps> = ({ 
  connector, 
  onStart, 
  onStop, 
  onDelete, 
  // onEdit, 
  showButtons = true,
  selected = false,
  onClick
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const iconSrc = getConnectorIcon(connector.storageType);
  
  return (
    <Card 
      sx={{ 
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: selected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        boxShadow: selected ? '0 4px 20px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.05)',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          transform: 'translateY(-3px)'
        },
        position: 'relative',
        overflow: 'visible'
      }}
      onClick={() => onClick(connector)}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: -10,
          right: 16,
          backgroundColor: getStatusColor(connector.status),
          borderRadius: '12px',
          px: 1,
          py: 0.5,
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.7rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textTransform: 'uppercase'
        }}
      >
        {connector.status || 'Unknown'}
      </Box>
      
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {iconSrc && (
            <Box 
              component="img" 
              src={iconSrc} 
              alt={connector.storageType || 'Connector Type'}
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                p: 1,
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.03)'
              }} 
            />
          )}
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
              {connector.connectorName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {connector.storageType}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {connector.bpn && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              BPN
            </Typography>
            <Chip 
              label={connector.bpn} 
              size="small" 
              sx={{ 
                backgroundColor: '#e3f2fd', 
                fontFamily: 'monospace'
              }} 
            />
          </Box>
        )}
        
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Additional Details
            </Typography>
            <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: '#fafafa' }}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>ID:</strong> {connector.id}
              </Typography>
              {connector.bucketName && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Bucket:</strong> {connector.bucketName}
                </Typography>
              )}
              {connector.region && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Region:</strong> {connector.region}
                </Typography>
              )}
              {connector.azureContainerName && (
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Container:</strong> {connector.azureContainerName}
                </Typography>
              )}
            </Paper>
          </Box>
        </Collapse>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
          <IconButton 
            size="small" 
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          
          {showButtons && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {connector.status?.toUpperCase() !== 'RUNNING' ? (
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  startIcon={<StartIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStart(connector);
                  }}
                  sx={{ 
                    minWidth: '90px',
                    py: 0.5,
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  Start
                </Button>
              ) : (
                <Button 
                  variant="contained"
                  size="small"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStop(connector);
                  }}
                  sx={{ 
                    minWidth: '90px',
                    py: 0.5,
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  }}
                >
                  Stop
                </Button>
              )}
              
              {} 
              
              <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(connector);
                }}
                sx={{ 
                  minWidth: '80px',
                  py: 0.5,
                  borderRadius: '8px',
                }}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

interface NewConnectorCardProps {
  type: string;
  onClick: (type: string) => void;
}

const NewConnectorCard: React.FC<NewConnectorCardProps> = ({ type, onClick }) => {
  const iconSrc = getConnectorIcon(type);
  const labels: Record<string, string> = {
    AmazonS3: 'Amazon S3',
    AzureStorage: 'Azure Storage',
    HttpData: 'HTTP Data'
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        p: 3,
        textAlign: 'center',
        border: '1px dashed #bdbdbd',
        backgroundColor: 'rgba(0,0,0,0.01)',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.03)',
          transform: 'scale(1.03)'
        }
      }}
      onClick={() => onClick(type)}
    >
      {iconSrc && (
        <Box 
          component="img" 
          src={iconSrc} 
          alt={type}
          sx={{ 
            width: 64, 
            height: 64, 
            mb: 2,
            p: 1,
            opacity: 0.8
          }} 
        />
      )}
      <Typography variant="h6" fontWeight="medium" sx={{ mb: 1 }}>
        {labels[type] || type}
      </Typography>
      
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<AddIcon />}
        sx={{ mt: 2 }}
      >
        Create
      </Button>
    </Card>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, title, message, onConfirm, onCancel }) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Typography>{message}</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);

const Connectors = () => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const getAccessTokenSilently = useKeycloakToken();
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [selectedStorageType, setSelectedStorageType] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [connectorToDelete, setConnectorToDelete] = useState<Connector | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Initialize socket connection
  useEffect(() => {
    const setupSocket = async () => {
      try {
        // Get the token you're already using
        
        const token = await getAccessTokenSilently();
        const backendUrl = getBackendUrl();
        const newSocket = io(backendUrl, {
          path: '/socket.io',
          auth: {token: `${token}`
          }
        });
        
        setSocket(newSocket);
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    };
    
    setupSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getAccessTokenSilently]);

  // Set up socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on("update_connectors", () => {
        setRefreshTrigger(prev => !prev);
      });
    }

    return () => {
      if (socket) {
        socket.off("update_connectors");
      }
    };
  }, [socket]);

  // Fetch connectors on mount and when refresh is triggered
  useEffect(() => {
    fetchConnectors();
  }, [getAccessTokenSilently, refreshTrigger]);

  const fetchConnectors = async () => {
    setLoading(true);
    try {
      // Fix: Use the access token directly with handleGetConnectorList
      const data = await handleGetConnectorList(getAccessTokenSilently);
      const rows = Object.entries(data).map(([key, value], index) => {
        if (typeof value === 'object' && value !== null) {
          return {
            id: index + 1,
            connectorName: key,
            ...value as object,
          };
        } else {
          return {
            id: index + 1,
            connectorName: key,
          };
        }
      });
      setConnectors(rows as Connector[]);
    } catch (error) {
      console.error('Error loading connectors:', error);
      showSnackbar('Failed to load connectors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: AlertColor = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const handleRefresh = () => {
    fetchConnectors();
  };

  const handleCardClick = (connector: Connector) => {
    setSelectedConnector(selectedConnector?.id === connector.id ? null : connector);
  };

  const handleStartConnector = async (connector: Connector) => {
    try {
      // Fix: Use the imported function with alias (startConnector)
      await startConnector(getAccessTokenSilently, connector.connectorName);
      showSnackbar(`Starting connector: ${connector.connectorName}`, 'success');
      setTimeout(fetchConnectors, 1000); // Refresh after a short delay
    } catch (error) {
      console.error('Error starting connector:', error);
      showSnackbar(`Failed to start connector: ${connector.connectorName}`, 'error');
    }
  };

  const handleStopConnector = async (connector: Connector) => {
    try {
      // Fix: Use the imported function with alias (stopConnector)
      await stopConnector(getAccessTokenSilently, connector.connectorName);
      showSnackbar(`Stopping connector: ${connector.connectorName}`, 'success');
      setTimeout(fetchConnectors, 1000); // Refresh after a short delay
    } catch (error) {
      console.error('Error stopping connector:', error);
      showSnackbar(`Failed to stop connector: ${connector.connectorName}`, 'error');
    }
  };

  // Unused connector parameter is left in for consistency with the interface
  const handleEditConnector = (_connector: Connector) => {
    // To be implemented in future - open edit modal
    showSnackbar('Edit functionality coming soon!', 'info');
  };

  const handleDeleteConfirmation = (connector: Connector) => {
    setConnectorToDelete(connector);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConnector = async () => {
    if (!connectorToDelete) return;
    
    try {
      // Fix: Use the imported function with alias (deleteConnector)
      await deleteConnector(getAccessTokenSilently, connectorToDelete.connectorName);
      showSnackbar(`Connector ${connectorToDelete.connectorName} deleted successfully`, 'success');
      setDeleteDialogOpen(false);
      setConnectorToDelete(null);
      if (selectedConnector?.id === connectorToDelete.id) {
        setSelectedConnector(null);
      }
      fetchConnectors();
    } catch (error) {
      console.error('Error deleting connector:', error);
      showSnackbar(`Failed to delete connector: ${connectorToDelete.connectorName}`, 'error');
    }
  };

  const handleCreateModalOpen = (storageType: string) => {
    setSelectedStorageType(storageType);
    setCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
    setSelectedStorageType('');
  };

  const handleCreateSuccess = () => {
    handleCreateModalClose();
    showSnackbar('Connector created successfully!', 'success');
    fetchConnectors();
  };

  return (
    <Box sx={{ p: 3 }}>
      
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              backgroundColor: 'rgba(0,0,0,0.01)', 
              borderRadius: 2,
              minHeight: 400
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight="medium" 
              color="text.secondary" 
              sx={{ mb: 3 }}
            >
            {loading ? 'Loading connectors...' : `${connectors.length} Active Connector${connectors.length !== 1 ? 's' : ''}`}
            
            <Tooltip title="Refresh">
            
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            
            </Tooltip>
            
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <Loading />
              </Box>
            ) : connectors.length === 0 ? (
              <Box sx={{ 
                py: 8, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                border: '1px dashed #bdbdbd'
              }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  No connectors found
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleCreateModalOpen('AmazonS3')}
                >
                  Create Your First Connector
                </Button>
              </Box>
            ) : (
              <Box>
                {connectors.map(connector => (
                  <ConnectorCard
                    key={connector.id}
                    connector={connector}
                    selected={selectedConnector?.id === connector.id}
                    onClick={handleCardClick}
                    onStart={handleStartConnector}
                    onStop={handleStopConnector}
                    onEdit={handleEditConnector}
                    onDelete={handleDeleteConfirmation}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: 'rgba(25, 118, 210, 0.04)', 
              minHeight: 400
            }}
          >
            <Typography 
              variant="h6" 
              fontWeight="medium" 
              color="primary" 
              sx={{ mb: 3 }}
            >
              Create New Connector
            </Typography>
            
            <Grid container spacing={2}>
              {['AmazonS3', 'AzureStorage'].map(type => ( // There was also HttpData here
                <Grid item xs={12} key={type}>
                  <NewConnectorCard 
                    type={type} 
                    onClick={handleCreateModalOpen}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to delete connector "${connectorToDelete?.connectorName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConnector}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setConnectorToDelete(null);
        }}
      />
      
      {}
      {createModalOpen && (
        <CreateConnectorModal
          open={createModalOpen}
          onClose={handleCreateModalClose}
          onSuccess={handleCreateSuccess}
          getAccessTokenSilently={getAccessTokenSilently}
          initialStorageType={selectedStorageType}
        />
      )}
      
      {}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default WithKeycloakAuthentication(Connectors, {
  onRedirecting: () => <Loading />,
});