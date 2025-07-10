import React, { useState, useEffect } from 'react';
import WithKeycloakAuthentication from '../components/auth/WithKeycloakAuthentication';
import Loading from '../components/utils/Loading';
import getBackendUrl from '../hooks/useBackendUrl';
import useKeycloakToken from '../hooks/useKeycloakToken';
import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { handleGetConnectorList } from '../services/getConnectorList';
// Import service functions with aliases to avoid naming conflicts
import { handleStartConnector as startConnector } from '../services/startConnector';
import { handleStopConnector as stopConnector } from '../services/stopConnector';
import { handleDeleteConnector as deleteConnector } from '../services/deleteConnector';
import CreateConnectorModal from '../components/modals/CreateConnectorModal';

// Import AWS, Azure and HTTP icons
import AmazonS3Icon from '../assets/icons/amazon-s3.svg';
import AzureStorageIcon from '../assets/icons/azure-storage.svg';
import HttpDataIcon from '../assets/icons/http-data.svg';

import {
  Box, Typography, Paper, Grid, Card, CardContent,
  CircularProgress, Avatar, Chip, IconButton, Tooltip, useTheme,
  List, ListItem, ListItemAvatar, ListItemText, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  Collapse, Alert, Snackbar, AlertColor
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Icons
import GroupIcon from '@mui/icons-material/Group';
import RefreshIcon from '@mui/icons-material/Refresh';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { 
  PlayArrow as StartIcon, 
  Stop as StopIcon, 
  Delete as DeleteIcon, 
  // Edit as EditIcon, 
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

// Define types
type User = string;
type GroupsData = Record<string, User[]>;
type ChartDataItem = {
  name: string;
  value: number;
  color: string;
};

// Connector type definition
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

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

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

// Component for existing connector card with wider design
const ConnectorCardWide: React.FC<{
  connector: Connector;
  onStart: (connector: Connector) => void;
  onStop: (connector: Connector) => void;
  onDelete: (connector: Connector) => void;
  onClick: (connector: Connector) => void;
}> = ({ 
  connector, 
  onStart, 
  onStop, 
  onDelete, 
  onClick 
}) => {
  const iconSrc = getConnectorIcon(connector.storageType);
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  return (
    <Card 
      sx={{ 
        mb: 2,
        overflow: 'visible',
        position: 'relative',
        borderRadius: 2,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            position: 'relative',
            backgroundColor: 'rgba(0,0,0,0.02)'
          }}
        >
          <Chip 
            label={connector.status || 'Unknown'} 
            sx={{
              position: 'absolute',
              right: 16,
              top: 'calc(50% - 12px)',
              backgroundColor: getStatusColor(connector.status),
              color: 'white',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              height: 24
            }}
          />
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer',
              width: '100%',
              mr: 8
            }}
            onClick={() => onClick(connector)}
          >
            {iconSrc && (
              <Box 
                component="img" 
                src={iconSrc} 
                alt={connector.storageType || 'Connector Type'}
                sx={{ 
                  width: 42, 
                  height: 42, 
                  mr: 2,
                  p: 1,
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
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
        </Box>
        
        {}
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 2 }}>
            {connector.bpn && (
              <Box sx={{ mb: expanded ? 2 : 0 }}>
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
          </Box>
          
          {}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              p: 1.5,
              borderTop: '1px solid rgba(0,0,0,0.08)',
              backgroundColor: 'rgba(0,0,0,0.01)'
            }}
          >
            <IconButton size="small" onClick={toggleExpand}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {connector.status?.toUpperCase() !== 'RUNNING' ? (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<StartIcon />}
                  onClick={() => onStart(connector)}
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    py: 0.8,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  Start
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={() => onStop(connector)}
                  size="small"
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    py: 0.8,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                >
                  Stop
                </Button>
              )}
              
              {}
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete(connector)}
                size="small"
                sx={{ 
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  py: 0.8
                }}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

// New connector card with similar style to the screenshot

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

// Component to display group and user data with pie chart
const GroupsOverview = () => {
  const [groupsData, setGroupsData] = useState<GroupsData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const theme = useTheme();

  const backendUrl = getBackendUrl();
  const fetchGroupsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${backendUrl}/federated/group`);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json() as GroupsData;
      setGroupsData(data);
      
      // Set the first group as selected by default if there are groups
      const groupNames = Object.keys(data);
      if (groupNames.length > 0 && !selectedGroup) {
        setSelectedGroup(groupNames[0]);
      }
    } catch (err) {
      console.error('Error fetching groups data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);
  
  const handleGroupSelect = (groupName: string) => {
    setSelectedGroup(groupName);
  };

  // Prepare data for pie chart
  const prepareChartData = (): ChartDataItem[] => {
    return Object.entries(groupsData).map(([name, users]) => ({
      name,
      value: users.length,
      color: stringToColor(name + '123')
    }));
  };
  
  // Get the total number of users
  const getTotalUsers = (): number => {
    return Object.values(groupsData).reduce((sum, users) => sum + users.length, 0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mt: 2, 
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.contrastText 
        }}
      >
        <Typography variant="h6" gutterBottom>Error Loading Groups Data</Typography>
        <Typography variant="body1">{error}</Typography>
        <IconButton 
          color="inherit" 
          onClick={fetchGroupsData} 
          sx={{ mt: 1 }}
        >
          <RefreshIcon />
        </IconButton>
      </Paper>
    );
  }
  
  const chartData = prepareChartData();
  const totalUsers = getTotalUsers();
  const selectedGroupUsers = selectedGroup ? groupsData[selectedGroup] || [] : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
          <GroupIcon sx={{ mr: 1 }} />
          Federated Groups ({Object.keys(groupsData).length}) (click on any group to see its composition)
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchGroupsData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Grid container spacing={3}>
        {}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: theme.palette.primary.dark,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleAltIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Group Distribution</Typography>
              </Box>
              <Chip 
                label={`${totalUsers} Total Users`} 
                size="small"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.3)', 
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              />
            </Box>
            
            <CardContent sx={{ height: 350, position: 'relative' }}>
              {chartData.length >.0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      animationDuration={800}
                      onClick={(entry) => {
                        if (entry && entry.name) {
                          handleGroupSelect(entry.name);
                        }
                      }}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          stroke={entry.name === selectedGroup ? '#fff' : 'none'}
                          strokeWidth={entry.name === selectedGroup ? 3 : 0}
                          style={{ 
                            filter: entry.name === selectedGroup ? 'drop-shadow(0px 0px 8px rgba(0,0,0,0.5))' : 'none',
                            cursor: 'pointer',
                            opacity: entry.name === selectedGroup ? 1 : 0.8
                          }}
                        />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      formatter={(_, entry) => {
                        if (entry && entry.payload) {
                          // First convert to unknown, then to our type to avoid TS errors
                          const payload = entry.payload as unknown;
                          // Access properties safely with type checking
                          const item = payload as {name?: string};
                          if (item && typeof item.name === 'string') {
                            return (
                              <span style={{ 
                                color: theme.palette.text.primary,
                                fontWeight: selectedGroup === item.name ? 'bold' : 'normal',
                                cursor: 'pointer'
                              }}>
                                {item.name}
                              </span>
                            );
                          }
                        }
                        return null;
                      }}
                      onClick={(data) => {
                        if (data && data.payload) {
                          // First convert to unknown, then to our type to avoid TS errors
                          const payload = data.payload as unknown;
                          // Access properties safely with type checking
                          const item = payload as {name?: string};
                          if (item && typeof item.name === 'string') {
                            handleGroupSelect(item.name);
                          }
                        }
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    height: '100%' 
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No groups available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: theme.shadows[6],
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: selectedGroup ? stringToColor(selectedGroup + '123') : theme.palette.grey[700],
                color: '#fff',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  mr: 2
                }}
              >
                <GroupIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {selectedGroup || 'Select a Group'}
                </Typography>
                {selectedGroup && (
                  <Chip 
                    size="small" 
                    label={`${selectedGroupUsers.length} user${selectedGroupUsers.length !== 1 ? 's' : ''}`}
                    sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.3)', 
                      color: '#fff',
                      fontWeight: 'bold' 
                    }} 
                  />
                )}
              </Box>
            </Box>
            
            <CardContent sx={{ p: 0, maxHeight: 350, overflow: 'auto' }}>
              {selectedGroup ? (
                selectedGroupUsers.length > 0 ? (
                  <List disablePadding>
                    {selectedGroupUsers.map((user, index) => (
                      <ListItem
                        key={index}
                        divider={index < selectedGroupUsers.length - 1}
                        sx={{ 
                          backgroundColor: index % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.05)'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: stringToColor(user || 'User')
                            }}
                          >
                            {(user || 'U').charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                {user}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users in this group
                    </Typography>
                  </Box>
                )
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Typography variant="body1" color="text.secondary">
                    Select a group from the chart to view details
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
const Dashboard: React.FC = () => {
  // const { isLoadingConnectors, connectorStatusCounts } = useConnectors();
  const theme = useTheme();
  const getAccessTokenSilently = useKeycloakToken();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
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
          auth: {token: `${token}`}
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
      // Use the access token directly with handleGetConnectorList
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
      await stopConnector(getAccessTokenSilently, connector.connectorName);
      showSnackbar(`Stopping connector: ${connector.connectorName}`, 'success');
      setTimeout(fetchConnectors, 1000); // Refresh after a short delay
    } catch (error) {
      console.error('Error stopping connector:', error);
      showSnackbar(`Failed to stop connector: ${connector.connectorName}`, 'error');
    }
  };

  // Unused connector parameter is left in for consistency with the interface
  // const handleEditConnector = (_connector: Connector) => {
  //   // To be implemented in future - open edit modal
  //   showSnackbar('Edit functionality coming soon!', 'info');
  // };

  const handleDeleteConfirmation = (connector: Connector) => {
    setConnectorToDelete(connector);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConnector = async () => {
    if (!connectorToDelete) return;
    
    try {
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

  const activeConnectorsCount = connectors.filter(c => c.status?.toUpperCase() === 'RUNNING').length;
// TODO: remove the width here later of after azure is back
return (
    <Box sx={{ py: 3, px: { xs: 20, sm: 3 },   width: '1000px', mx: 'auto'}}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          backgroundImage: `linear-gradient(120deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: 'white'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar 
              sx={{ 
                width: 60, 
                height: 60, 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            >
              <DashboardIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              DLR Dataspace
            </Typography>
            <Typography variant="subtitle1">
              Welcome to your federated data management dashboard
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={10}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h5" fontWeight="medium" color="primary">
                {activeConnectorsCount} Active Connector{activeConnectorsCount !== 1 ? 's' : ''}
              </Typography>
              <Tooltip title="Refresh Connectors">
                <IconButton onClick={handleRefresh} sx={{ ml: 1 }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          
          <Grid item xs={6} md={12}>
            <Card 
              sx={{ 
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                height: '100%',
                cursor: 'pointer',
                border: '1px dashed #bdbdbd',
                backgroundColor: 'rgba(0,0,0,0.01)',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.03)',
                  transform: 'translateY(-3px)'
                }
              }}
              onClick={() => handleCreateModalOpen('AmazonS3')}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
              }}>
                <Box 
                  component="img" 
                  src={getConnectorIcon('AmazonS3')} 
                  alt="Amazon S3"
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    mr: 2,
                    opacity: 0.8
                  }} 
                />
                <Typography variant="body1" fontWeight="medium">
                  Amazon S3 Storage
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<AddIcon />}
                size="small"
                sx={{ 
                  textTransform: 'uppercase', 
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  minWidth: '90px'
                }}
              >
                Create
              </Button>
            </Card>
          </Grid>
          
          {}
        </Grid>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 8,
            backgroundColor: 'rgba(0,0,0,0.01)',
            borderRadius: 2
          }}>
            <CircularProgress />
          </Box>
        ) : connectors.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)',
            borderRadius: 2,
            border: '1px dashed #bdbdbd'
          }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No connectors found
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleCreateModalOpen('AmazonS3')}
              sx={{ 
                mt: 2,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderRadius: '8px'
              }}
            >
              Create Your First Connector
            </Button>
          </Box>
        ) : (
          <Box>
            {connectors.map(connector => (
              <ConnectorCardWide
                key={connector.id}
                connector={connector}
                onClick={handleCardClick}
                onStart={handleStartConnector}
                onStop={handleStopConnector}
                onDelete={handleDeleteConfirmation}
              />
            ))}
          </Box>
        )}
      </Box>

      {}
      <GroupsOverview />

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

export default WithKeycloakAuthentication(Dashboard, {
  onRedirecting: () => <Loading />,
});