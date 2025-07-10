import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';

// Import icons
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import LaunchIcon from '@mui/icons-material/Launch';
import RepeatIcon from '@mui/icons-material/Repeat';

import { handleGetAgreements } from '../services/getAgreements';
import { handleTransferAsset } from '../services/transferAsset';
import { handleGetTransfers } from '../services/getTransfers';
import { handleGetNegotiations } from '../services/getNegotiations';
import { handleGetConnector } from '../services/getConnector';
import useKeycloakToken from '../hooks/useKeycloakToken';
import useConnectors from '../hooks/useConnectors';
import WithKeycloakAuthentication from '../components/auth/WithKeycloakAuthentication';
import NoConnectorsMessage from '../components/connector/NoConnectorsMessage';

// Define types
interface Agreement {
  id: number;
  contractAgreementId: string;
  contractAgreementIdShort: string;
  assetId: string;
  assetIdShort: string;
  providerId: string;
  consumerId: string;
  providerName: string;
  consumerName: string;
  timestamp: string;
  timestampDate: Date;
  counterPartyAddress?: string | null;
  fullAgreement: any;
  hasTransfer: boolean;
  transferState?: string;
  transferId?: string;
}

interface Transfer {
  id: number;
  transferId: string;
  transferAssetId: string;
  contractId: string;
  transferState: string;
  transferType: string;
  timestamp: string;
  fullTransfer: any;
}

type TimePeriod = '24h' | 'week' | 'month' | 'all';
type StatusFilter = 'all' | 'transferred' | 'pending';

const UnifiedDashboard: React.FC = () => {
  // State variables
  const [loading, setLoading] = useState<boolean>(true);
  const [agreementsLoading, setAgreementsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [, setTransfers] = useState<Transfer[]>([]);
  const [filteredAgreements, setFilteredAgreements] = useState<Agreement[]>([]);
  const [dataConnector, setDataConnector] = useState<any[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
  // Dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [transferDialogOpen, setTransferDialogOpen] = useState<boolean>(false);
  const [transferStatus, setTransferStatus] = useState<string>('');
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);

  // Hooks
  const getAccessTokenSilently = useKeycloakToken();
  const { connectors, selectedConnector, isLoadingConnectors } = useConnectors();

  // Filter agreements based on search and status (time period handled by backend)
  useEffect(() => {
    let filtered = [...agreements];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((agreement) => 
        agreement.assetId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.consumerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.contractAgreementId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'transferred') {
        filtered = filtered.filter(agreement => agreement.hasTransfer);
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter(agreement => !agreement.hasTransfer);
      }
    }
    
    setFilteredAgreements(filtered);
  }, [searchTerm, agreements, statusFilter]);

  // Fetch data based on selected connector - initial load only
  useEffect(() => {
    if (isLoadingConnectors) {
      setLoading(true);
      return;
    }
    if (selectedConnector) {
      fetchData();
    } else if (!isLoadingConnectors && connectors.length === 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [getAccessTokenSilently, selectedConnector, isLoadingConnectors]);

  // Separate effect for time period changes - only reload agreements
  useEffect(() => {
    if (selectedConnector && !isLoadingConnectors && !loading) {
      fetchAgreementsOnly();
    }
  }, [timePeriod]);

  // Fetch all required data - initial load
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Determine time range for API call based on current filter
      let timeRange = 'all';
      if (timePeriod === '24h') timeRange = 'day';
      else if (timePeriod === 'week') timeRange = 'week';
      else if (timePeriod === 'month') timeRange = 'month';
      
      // Fetch agreements, negotiations, transfers, and connector data
      const dataAgreements = await handleGetAgreements(getAccessTokenSilently, selectedConnector, timeRange);
      const dataNegotiations = await handleGetNegotiations(getAccessTokenSilently, selectedConnector);
      const dataTransfers = await handleGetTransfers(getAccessTokenSilently, selectedConnector, timeRange);
      const connectorData = await handleGetConnector(getAccessTokenSilently, selectedConnector);
      setDataConnector(connectorData);

      // Process transfers
      const processedTransfers = dataTransfers
        .map((transfer: any, index: number) => {
          if (!transfer['state'] || 
              transfer['state'] === 'DEPROVISIONED' || 
              transfer['state'] === 'TERMINATED') {
            return null;
          }
          
          return {
            id: index + 1,
            transferId: transfer['@id'],
            transferIdShort: transfer['@id'].slice(0, 8),
            transferAssetId: transfer['assetId'],
            transferAssetIdShort: transfer['assetId'].slice(0, 8),
            contractId: transfer['contractId'],
            transferState: transfer['state'],
            transferType: transfer['type'],
            timestamp: new Date(transfer.stateTimestamp).toLocaleString(),
            fullTransfer: transfer,
          };
        })
        .filter(Boolean);
      
      setTransfers(processedTransfers);

      // Process agreements
      const rowsAgreements = dataAgreements.map((agreement: any, index: number) => {
        const relatedTransfer = processedTransfers.find(
          (t: any) => t.contractId === agreement['@id']
        );

        const signingDate = new Date(agreement['contractSigningDate'] * 1000);

        return {
          id: index + 1,
          contractAgreementId: agreement['@id'],
          contractAgreementIdShort: agreement['@id'].slice(0, 8),
          assetId: agreement['assetId'],
          assetIdShort: agreement['assetId'].slice(0, 8),
          providerId: agreement['providerId'],
          consumerId: agreement['consumerId'],
          providerName: agreement['providerName'],
          consumerName: agreement['consumerName'],
          timestamp: signingDate.toLocaleString(),
          timestampDate: signingDate,
          hasTransfer: !!relatedTransfer,
          transferState: relatedTransfer?.transferState,
          transferId: relatedTransfer?.transferId,
          fullAgreement: agreement,
        };
      });

      // Add negotiation info to agreements
      const rowsNegotiations = dataNegotiations.map((negotiation: any) => ({
        contractAgreementId: negotiation['contractAgreementId'],
        counterPartyAddress: negotiation['counterPartyAddress'],
      }));

      const combinedRows = rowsAgreements.map((agreement: any) => {
        const negotiation = rowsNegotiations.find(
          (neg: any) => neg.contractAgreementId === agreement.contractAgreementId,
        );
        return {
          ...agreement,
          counterPartyAddress: negotiation ? negotiation.counterPartyAddress : null,
        };
      });

      setAgreements(combinedRows);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch agreements data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch only agreements and transfers when time period changes
  const fetchAgreementsOnly = async () => {
    setAgreementsLoading(true);
    setAgreements([]);
    setTransfers([]);
    try {
      // Determine time range for API call based on current filter
      let timeRange = 'all';
      if (timePeriod === '24h') timeRange = 'day';
      else if (timePeriod === 'week') timeRange = 'week';
      else if (timePeriod === 'month') timeRange = 'month';
      
      // Fetch only agreements and transfers
      const dataAgreements = await handleGetAgreements(getAccessTokenSilently, selectedConnector, timeRange);
      const dataTransfers = await handleGetTransfers(getAccessTokenSilently, selectedConnector, timeRange);

      // Process transfers
      const processedTransfers = dataTransfers
        .map((transfer: any, index: number) => {
          if (!transfer['state'] || 
              transfer['state'] === 'DEPROVISIONED' || 
              transfer['state'] === 'TERMINATED') {
            return null;
          }
          
          return {
            id: index + 1,
            transferId: transfer['@id'],
            transferIdShort: transfer['@id'].slice(0, 8),
            transferAssetId: transfer['assetId'],
            transferAssetIdShort: transfer['assetId'].slice(0, 8),
            contractId: transfer['contractId'],
            transferState: transfer['state'],
            transferType: transfer['type'],
            timestamp: new Date(transfer.stateTimestamp).toLocaleString(),
            fullTransfer: transfer,
          };
        })
        .filter(Boolean);
      
      setTransfers(processedTransfers);

      // Process agreements
      const rowsAgreements = dataAgreements.map((agreement: any, index: number) => {
        const relatedTransfer = processedTransfers.find(
          (t: any) => t.contractId === agreement['@id']
        );

        const signingDate = new Date(agreement['contractSigningDate'] * 1000);

        return {
          id: index + 1,
          contractAgreementId: agreement['@id'],
          contractAgreementIdShort: agreement['@id'].slice(0, 8),
          assetId: agreement['assetId'],
          assetIdShort: agreement['assetId'].slice(0, 8),
          providerId: agreement['providerId'],
          consumerId: agreement['consumerId'],
          providerName: agreement['providerName'],
          consumerName: agreement['consumerName'],
          timestamp: signingDate.toLocaleString(),
          timestampDate: signingDate,
          hasTransfer: !!relatedTransfer,
          transferState: relatedTransfer?.transferState,
          transferId: relatedTransfer?.transferId,
          fullAgreement: agreement,
        };
      });

      // Re-fetch negotiations to get counterPartyAddress
      const dataNegotiations = await handleGetNegotiations(getAccessTokenSilently, selectedConnector);
      const rowsNegotiations = dataNegotiations.map((negotiation: any) => ({
        contractAgreementId: negotiation['contractAgreementId'],
        counterPartyAddress: negotiation['counterPartyAddress'],
      }));

      const combinedRows = rowsAgreements.map((agreement: any) => {
        const negotiation = rowsNegotiations.find(
          (neg: any) => neg.contractAgreementId === agreement.contractAgreementId,
        );
        return {
          ...agreement,
          counterPartyAddress: negotiation ? negotiation.counterPartyAddress : null,
        };
      });

      setAgreements(combinedRows);
    } catch (err) {
      console.error('Error fetching agreements data:', err);
    } finally {
      setAgreementsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchData();
  };

  // Handle agreement details
  const handleOpenDetails = (agreement: Agreement) => {
    setSelectedAgreement(agreement);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedAgreement(null);
  };

  // Handle transfer asset
  const handleTransfer = async (agreement: Agreement, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedAgreement(agreement);
    setConfirmDialogOpen(true);
  };

  // Confirm transfer
  const confirmTransfer = async () => {
    if (!selectedAgreement) return;
    
    setConfirmDialogOpen(false);
    setTransferDialogOpen(true);
    setTransferStatus('initiating');
    
    try {
      const transferPayload = {
        assetId: selectedAgreement.assetId,
        counterPartyAddress: selectedAgreement.counterPartyAddress,
        contractAgreementId: selectedAgreement.contractAgreementId,
        ...selectedAgreement.fullAgreement,
      };
      
      await handleTransferAsset(
        transferPayload,
        getAccessTokenSilently,
        selectedConnector,
        dataConnector,
      );
      
      setTransferStatus('success');
      setTransferSuccess(true);
      setSnackbarOpen(true);
      
      setTimeout(() => {
        fetchData();
        setTransferDialogOpen(false);
        if (detailsOpen) {
          setDetailsOpen(false);
        }
      }, 2000);
    } catch (error) {
      console.error('Transfer failed:', error);
      setTransferStatus('error');
      setTransferSuccess(false);
      setSnackbarOpen(true);
      setTransferDialogOpen(false);
    }
  };

  const handleCancelTransfer = () => {
    setConfirmDialogOpen(false);
    setSelectedAgreement(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Get status icon and color
  const getStatusDisplay = (agreement: Agreement) => {
    if (agreement.hasTransfer) {
      return {
        icon: <CheckCircleIcon sx={{ fontSize: 20 }} />,
        label: `Transferred (${agreement.transferState})`,
        color: '#4caf50',
        bgColor: 'rgba(76, 175, 80, 0.1)'
      };
    }
    return {
      icon: <HourglassEmptyIcon sx={{ fontSize: 20 }} />,
      label: 'Pending Transfer',
      color: '#ff9800',
      bgColor: 'rgba(255, 152, 0, 0.1)'
    };
  };

  // Loading state
  if (loading || isLoadingConnectors) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  
  // No connectors state
  if (!isLoadingConnectors && connectors.length === 0) {
    return <NoConnectorsMessage />;
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
      {}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: '#000000',
            letterSpacing: '0.5px'
          }}
        >
          Agreements Dashboard
        </Typography>
        
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {}
      <Box sx={{ 
        mb: 4, 
        width: '100%', 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2
      }}>
        {}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by asset ID, provider, consumer, or agreement ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setSearchTerm('')} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 1, 
              bgcolor: 'background.paper',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }
          }}
          sx={{ 
            maxWidth: { sm: 500 },
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.08)'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.12)'
            }
          }}
        />
        
        {}
        <FormControl 
          variant="outlined" 
          size="small"
          sx={{ 
            minWidth: 140,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
            label="Time Period"
            startAdornment={<HistoryIcon sx={{ mr: 1, fontSize: 18 }} />}
          >
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>

        {}
        <FormControl 
          variant="outlined" 
          size="small"
          sx={{ 
            minWidth: 120,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        >
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="transferred">Transferred</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip 
          icon={<AssignmentIcon />}
          label={`${agreements.length} Total Agreements`}
          color="primary"
          variant="outlined"
        />
        <Chip 
          icon={<CheckCircleIcon />}
          label={`${agreements.filter(a => a.hasTransfer).length} Transferred`}
          color="success"
          variant="outlined"
        />
        <Chip 
          icon={<HourglassEmptyIcon />}
          label={`${agreements.filter(a => !a.hasTransfer).length} Pending`}
          color="warning"
          variant="outlined"
        />
      </Box>
      
      {}
      {agreementsLoading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {}
          {filteredAgreements.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No agreements match your current filters
              </Typography>
            </Box>
          )}
          
          {}
          {filteredAgreements.length > 0 && (
            <Grid container spacing={3}>
              {filteredAgreements.map((agreement) => {
                const statusDisplay = getStatusDisplay(agreement);
                
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={agreement.contractAgreementId}>
                    <Paper 
                      elevation={0}
                      onClick={() => handleOpenDetails(agreement)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 380,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: statusDisplay.bgColor,
                          borderBottom: `2px solid ${statusDisplay.color}`,
                          minHeight: 56
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: statusDisplay.color }}>
                            {statusDisplay.icon}
                          </Box>
                          <Typography 
                            variant="body2" 
                            fontWeight={500}
                            sx={{ color: statusDisplay.color }}
                          >
                            {statusDisplay.label}
                          </Typography>
                        </Box>
                        
                        {agreement.hasTransfer && (
                          <Tooltip title="Re-transfer available">
                            <RepeatIcon sx={{ fontSize: 18, color: statusDisplay.color }} />
                          </Tooltip>
                        )}
                      </Box>
                      
                      {}
                      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 500,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '1rem'
                          }}
                        >
                          Agreement {agreement.contractAgreementIdShort}
                        </Typography>
                        
                        <Box sx={{ mb: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Asset ID
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'monospace',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              mb: 1
                            }}
                          >
                            {agreement.assetId}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary">
                            Provider → Consumer
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {agreement.providerName} → {agreement.consumerName}
                          </Typography>
                          
                          <Typography variant="caption" color="text.secondary">
                            Signed
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                            {agreement.timestamp}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                          mt: 'auto'
                        }}
                      >
                        <Button
                          size="small"
                          startIcon={<LaunchIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(agreement);
                          }}
                          sx={{
                            textTransform: 'none',
                            color: 'text.secondary'
                          }}
                        >
                          Details
                        </Button>
                        
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={agreement.hasTransfer ? <RepeatIcon /> : <SendIcon />}
                          onClick={(e) => handleTransfer(agreement, e)}
                          sx={{
                            textTransform: 'none',
                            bgcolor: agreement.hasTransfer ? '#ff9800' : '#1976d2',
                            '&:hover': {
                              bgcolor: agreement.hasTransfer ? '#f57c00' : '#1565c0'
                            }
                          }}
                        >
                          {agreement.hasTransfer ? 'Re-transfer' : 'Transfer'}
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </>
      )}
      
      {}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedAgreement && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              pb: 2
            }}>
              <AssignmentIcon sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                  Agreement {selectedAgreement.contractAgreementIdShort}
                </Typography>
                <Chip 
                  icon={getStatusDisplay(selectedAgreement).icon}
                  label={getStatusDisplay(selectedAgreement).label}
                  size="small"
                  sx={{ 
                    bgcolor: getStatusDisplay(selectedAgreement).bgColor,
                    color: getStatusDisplay(selectedAgreement).color,
                    mt: 0.5
                  }}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Provider
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedAgreement.providerName}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Consumer
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedAgreement.consumerName}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Signing Date
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedAgreement.timestamp}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Asset ID
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {selectedAgreement.assetId}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Agreement ID
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all',
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    {selectedAgreement.contractAgreementId}
                  </Typography>
                  
                  {selectedAgreement.counterPartyAddress && (
                    <>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Counterparty Address
                      </Typography>
                      <Typography 
                        variant="body2" 
                        paragraph
                        sx={{ 
                          fontFamily: 'monospace',
                          wordBreak: 'break-all',
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                          p: 1,
                          borderRadius: 1
                        }}
                      >
                        {selectedAgreement.counterPartyAddress}
                      </Typography>
                    </>
                  )}
                </Grid>
                
                {selectedAgreement.hasTransfer && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Transfer Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      <Typography variant="body1">
                        Transfer completed with state: <strong>{selectedAgreement.transferState}</strong>
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace',
                        wordBreak: 'break-all',
                        bgcolor: 'rgba(76, 175, 80, 0.05)',
                        p: 1,
                        borderRadius: 1,
                        border: '1px solid rgba(76, 175, 80, 0.2)'
                      }}
                    >
                      Transfer ID: {selectedAgreement.transferId}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <Button onClick={handleCloseDetails}>
                Close
              </Button>
              <Button 
                variant="contained"
                startIcon={selectedAgreement.hasTransfer ? <RepeatIcon /> : <SendIcon />}
                onClick={() => handleTransfer(selectedAgreement)}
                sx={{
                  bgcolor: selectedAgreement.hasTransfer ? '#ff9800' : '#1976d2',
                  '&:hover': {
                    bgcolor: selectedAgreement.hasTransfer ? '#f57c00' : '#1565c0'
                  }
                }}
              >
                {selectedAgreement.hasTransfer ? 'Re-transfer Asset' : 'Transfer Asset'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelTransfer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedAgreement?.hasTransfer ? 'Confirm Re-transfer' : 'Confirm Transfer'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedAgreement?.hasTransfer ? (
              <>
                This agreement has already been transferred. Are you sure you want to initiate another transfer for 
                <Typography component="span" fontWeight="bold"> Agreement {selectedAgreement?.contractAgreementIdShort}</Typography>?
              </>
            ) : (
              <>
                Are you sure you want to initiate a transfer for 
                <Typography component="span" fontWeight="bold"> Agreement {selectedAgreement?.contractAgreementIdShort}</Typography>?
              </>
            )}
          </DialogContentText>
          {selectedAgreement && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Asset ID:</strong> {selectedAgreement.assetIdShort}
              </Typography>
              <Typography variant="body2">
                <strong>Provider:</strong> {selectedAgreement.providerName}
              </Typography>
              <Typography variant="body2">
                <strong>Consumer:</strong> {selectedAgreement.consumerName}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelTransfer} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={confirmTransfer} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            {selectedAgreement?.hasTransfer ? 'Confirm Re-transfer' : 'Confirm Transfer'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {}
      <Dialog
        open={transferDialogOpen}
        onClose={() => transferStatus === 'error' && setTransferDialogOpen(false)}
      >
        <DialogTitle>Asset Transfer</DialogTitle>
        <DialogContent>
          {transferStatus === 'initiating' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <HourglassEmptyIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
              <Typography>Initiating asset transfer...</Typography>
            </Box>
          )}
          {transferStatus === 'success' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon fontSize="large" color="success" sx={{ mb: 2 }} />
              <Typography>Asset transfer initiated successfully!</Typography>
            </Box>
          )}
          {transferStatus === 'error' && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <ErrorIcon fontSize="large" color="error" sx={{ mb: 2 }} />
              <Typography>Error initiating asset transfer. Please try again.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {transferStatus === 'error' && (
            <Button onClick={() => setTransferDialogOpen(false)}>Close</Button>
          )}
        </DialogActions>
      </Dialog>
      
      {}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={transferSuccess ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {transferSuccess 
            ? `Transfer request for Agreement ${selectedAgreement?.contractAgreementIdShort} has been initiated successfully.` 
            : `Failed to initiate transfer for Agreement ${selectedAgreement?.contractAgreementIdShort}. Please try again.`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WithKeycloakAuthentication(UnifiedDashboard, {
  onRedirecting: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <CircularProgress />
    </Box>
  ),
});