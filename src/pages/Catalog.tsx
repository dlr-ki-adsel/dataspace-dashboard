import { useEffect, useState } from 'react';
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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  FormControlLabel,
  Switch
} from '@mui/material';

// Import icons for different file types
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FileIcon from '@mui/icons-material/InsertDriveFile';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DocumentIcon from '@mui/icons-material/Article';
import ZipIcon from '@mui/icons-material/FolderZip';
import PresentationIcon from '@mui/icons-material/Slideshow';
import SpreadsheetIcon from '@mui/icons-material/GridOn';
import AudioIcon from '@mui/icons-material/AudioFile';
import VideoIcon from '@mui/icons-material/VideoFile';
import CodeIcon from '@mui/icons-material/Code';
import LaunchIcon from '@mui/icons-material/Launch';
import FilterListIcon from '@mui/icons-material/FilterList';

import { handleNegotiate } from '../services/negotiateAsset';
import { handleGetCatalogData } from '../services/getCatalogData';
import useKeycloakToken from '../hooks/useKeycloakToken';
import useConnectors from '../hooks/useConnectors';
import NoConnectorsMessage from '../components/connector/NoConnectorsMessage';
import WithKeycloakAuthentication from '../components/auth/WithKeycloakAuthentication';

// Define interface for dataset structure
interface Dataset {
  assetId?: string;
  assetName?: string;
  policy?: any;
  originator?: string;
  participantId?: string;
  participantName?: string;
}

// Function to get the correct icon based on file extension
const getFileIcon = (fileName?: string) => {
  if (!fileName) return <FileIcon sx={{ fontSize: 36 }} />;
  
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'pdf':
      return <PdfIcon sx={{ fontSize: 36, color: '#f44336' }} />;
    case 'doc':
    case 'docx':
    case 'rtf':
    case 'txt':
      return <DocumentIcon sx={{ fontSize: 36, color: '#2196f3' }} />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <SpreadsheetIcon sx={{ fontSize: 36, color: '#4caf50' }} />;
    case 'ppt':
    case 'pptx':
      return <PresentationIcon sx={{ fontSize: 36, color: '#ff9800' }} />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
    case 'ico':
      return <ImageIcon sx={{ fontSize: 36, color: '#e91e63' }} />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <ZipIcon sx={{ fontSize: 36, color: '#9c27b0' }} />;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return <AudioIcon sx={{ fontSize: 36, color: '#00bcd4' }} />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <VideoIcon sx={{ fontSize: 36, color: '#673ab7' }} />;
    case 'js':
    case 'py':
    case 'java':
    case 'html':
    case 'css':
    case 'php':
      return <CodeIcon sx={{ fontSize: 36, color: '#607d8b' }} />;
    default:
      return <FileIcon sx={{ fontSize: 36, color: '#9e9e9e' }} />;
  }
};

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Dataset | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  // New states for confirmation dialog and success notification
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [assetToNegotiate, setAssetToNegotiate] = useState<Dataset | null>(null);
  const [negotiationSuccess, setNegotiationSuccess] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  // New state for group filter toggle
  const [filterByGroup, setFilterByGroup] = useState<boolean>(true);
  
  const getAccessTokenSilently = useKeycloakToken();
  
  // Get connector data from global state
  const { connectors, selectedConnector, isLoadingConnectors } = useConnectors();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Add the filter_group parameter based on the toggle state
      const data = await handleGetCatalogData(
        getAccessTokenSilently, 
        selectedConnector,
        filterByGroup // Pass the filter state to the API call
      );
      
      const datasets = data.flatMap((entry: any) => {
        let datasetsArray = entry['dcat:dataset'];
        if (!Array.isArray(datasetsArray)) {
          datasetsArray = [datasetsArray];
        }
        return datasetsArray.map((dataset: any) => ({
          assetId: dataset['id'],
          assetName: dataset['name'],
          policy: dataset['odrl:hasPolicy'],
          originator: entry.originator,
          participantId: entry['dspace:participantId'],
          participantName: entry['participantName']
        }));
      });
      
      setDatasets(datasets);
      setFilteredDatasets(datasets);
    } catch (err) {
      console.error('Error fetching catalog data:', err);
      setError('Failed to fetch catalog data');
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDatasets(datasets);
    } else {
      const filtered = datasets.filter((dataset) => 
        dataset.assetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.participantName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDatasets(filtered);
    }
  }, [searchTerm, datasets]);

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
  }, [getAccessTokenSilently, selectedConnector, isLoadingConnectors, filterByGroup]); // Added filterByGroup dependency

  // Handle toggle change
  const handleFilterToggle = () => {
    setFilterByGroup(!filterByGroup);
  };

  const handleOpenDetails = (asset: Dataset) => {
    setSelectedAsset(asset);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedAsset(null);
  };

  // Updated to open confirmation dialog
  const handleNegotiateAsset = (dataset: Dataset, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setAssetToNegotiate(dataset);
    setConfirmDialogOpen(true);
  };
  
  // Function to handle confirmation and actual negotiation
  const handleConfirmNegotiation = async () => {
    if (!assetToNegotiate) return;
    
    try {
      await handleNegotiate(assetToNegotiate, getAccessTokenSilently, selectedConnector);
      setNegotiationSuccess(true);
      setSnackbarOpen(true);
      // Close the confirmation dialog
      setConfirmDialogOpen(false);
      // Also close the details dialog if it's open
      if (detailsOpen) {
        setDetailsOpen(false);
      }
    } catch (error) {
      console.error('Negotiation failed:', error);
      setNegotiationSuccess(false);
      setSnackbarOpen(true);
      setConfirmDialogOpen(false);
    }
  };
  
  const handleCancelNegotiation = () => {
    setConfirmDialogOpen(false);
    setAssetToNegotiate(null);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
      
    <Typography 
      variant="h5" 
      component="h1" 
      sx={{ 
        fontWeight: 600,
        color: '#000000',
        letterSpacing: '0.5px'
      }}
    >
      Federated Catalog
    </Typography>
      <Box sx={{ 
        mb: 4, 
        mt: 2, 
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
          placeholder="Filter assets by name or provider..."
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
        <FormControlLabel
          control={
            <Switch
              checked={filterByGroup}
              onChange={handleFilterToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FilterListIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {filterByGroup ? "Toggle to show all assets" : "Toggle to show only my group's assets"}
              </Typography>
            </Box>
          }
          sx={{ 
            ml: { xs: 0, sm: 1 },
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 1,
            px: 1,
            bgcolor: 'background.paper',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}
        />
      </Box>
      
      {}
      {filteredDatasets.length === 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No assets match your search criteria
          </Typography>
        </Box>
      )}
      
      {}
      <Grid container spacing={3}>
        {filteredDatasets.map((dataset, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper 
              elevation={0}
              onClick={() => handleOpenDetails(dataset)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 220,
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
                  p: 2,
                  borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                  alignItems: 'flex-start',
                  gap: 2
                }}
              >
                <Box>
                  {getFileIcon(dataset.assetName)}
                </Box>
                
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {dataset.assetName || 'Unnamed Asset'}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 1.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Provider: {dataset.participantName || 'Unknown'}
                  </Typography>
                </Box>
              </Box>
              
              {}
              <Box sx={{ p: 2, pt: 1, flex: 1 }}>
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
                    whiteSpace: 'nowrap'
                  }}
                >
                  {dataset.assetId || 'Unknown ID'}
                </Typography>
              </Box>
              
              {}
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 2,
                  pt: 0,
                  mt: 'auto'
                }}
              >
                <Button
                  size="small"
                  startIcon={<LaunchIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetails(dataset);
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
                  onClick={(e) => handleNegotiateAsset(dataset, e)}
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1565c0'
                    }
                  }}
                >
                  Negotiate
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {}
      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedAsset && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              pb: 2
            }}>
              {getFileIcon(selectedAsset.assetName)}
              <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                {selectedAsset.assetName || 'Unnamed Asset'}
              </Typography>
            </DialogTitle>
            
            <DialogContent sx={{ px: 3, py: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Provider
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedAsset.participantName || 'Unknown'}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Asset ID
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}
                  >
                    {selectedAsset.assetId || 'Unknown'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Participant ID
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}
                  >
                    {selectedAsset.participantId || 'Unknown'}
                  </Typography>
                  
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Originator
                  </Typography>
                  <Typography 
                    variant="body2" 
                    paragraph
                    sx={{ 
                      fontFamily: 'monospace',
                      wordBreak: 'break-all'
                    }}
                  >
                    {selectedAsset.originator || 'Unknown'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Policy
                  </Typography>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      borderRadius: 1,
                      maxHeight: 300,
                      overflow: 'auto'
                    }}
                  >
                    <pre style={{ 
                      margin: 0, 
                      fontFamily: 'monospace', 
                      fontSize: '0.75rem',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all'
                    }}>
                      {typeof selectedAsset.policy === 'object' 
                        ? JSON.stringify(selectedAsset.policy, null, 2) 
                        : selectedAsset.policy}
                    </pre>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
              <Button onClick={handleCloseDetails}>
                Close
              </Button>
              <Button 
                variant="contained"
                onClick={() => handleNegotiateAsset(selectedAsset)}
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1565c0'
                  }
                }}
              >
                Negotiate Access
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelNegotiation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Negotiation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to initiate a negotiation request for 
            <Typography component="span" fontWeight="bold"> {assetToNegotiate?.assetName}</Typography> from 
            <Typography component="span" fontWeight="bold"> {assetToNegotiate?.participantName}</Typography>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelNegotiation} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmNegotiation} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Confirm
          </Button>
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
          severity={negotiationSuccess ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {negotiationSuccess 
            ? `Negotiation request for "${assetToNegotiate?.assetName}" has been initiated successfully.` 
            : `Failed to initiate negotiation for "${assetToNegotiate?.assetName}". Please try again.`}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WithKeycloakAuthentication(Catalog, {
  onRedirecting: () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <CircularProgress />
    </Box>
  ),
});