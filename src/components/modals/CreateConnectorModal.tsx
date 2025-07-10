import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

// Import AWS, Azure and HTTP icons
import AmazonS3Icon from '../../assets/icons/amazon-s3.svg';
import AzureStorageIcon from '../../assets/icons/azure-storage.svg';
import HttpDataIcon from '../../assets/icons/http-data.svg';

import InfoDrawer from '../utils/InfoDrawer';
import { handleCreateConnector } from '../../services/createConnector';
import connector_info from '../../assets/info_data/createConnector_info.json';

// TypeScript interfaces
interface CreateConnectorModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  getAccessTokenSilently: () => Promise<string>;
  initialStorageType?: string;
}

interface FormErrors {
  connectorName?: boolean;
  connectorNameFormat?: boolean;
  bucketName?: boolean;
  azureContainerName?: boolean;
  accessKeyIdRead?: boolean;
  secretAccessKeyRead?: boolean;
  accessKeyIdWrite?: boolean;
  secretAccessKeyWrite?: boolean;
  azureAccountNameRead?: boolean;
  azureAccountKeyRead?: boolean;
  azureAccountNameWrite?: boolean;
  azureAccountKeyWrite?: boolean;
  blobStoreEndpoint?: string | null;

}

interface ConnectorData {
  connectorName: string;
  storageType: string;
  bucketName?: string;
  region?: string;
  endpointOverride?: string;
  accessKeyIdRead?: string;
  secretAccessKeyRead?: string;
  accessKeyIdWrite?: string;
  secretAccessKeyWrite?: string;
  azureContainerName?: string;
  blobStoreEndpoint?: string;
  azureAccountNameRead?: string;
  azureAccountKeyRead?: string;
  azureAccountNameWrite?: string;
  azureAccountKeyWrite?: string;
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

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  outline: 'none',
  maxWidth: 700,
  width: '100%',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column' as 'column',
  overflow: 'hidden'
};

const CreateConnectorModal: React.FC<CreateConnectorModalProps> = ({
  open,
  onClose,
  onSuccess,
  getAccessTokenSilently,
  initialStorageType = ''
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeStep, setActiveStep] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [storageType, setStorageType] = useState<string>(initialStorageType || 'AmazonS3');
  const [connectorName, setConnectorName] = useState<string>('');
  
  // Amazon S3 specific fields
  const [bucketName, setBucketName] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [endpointOverride, setEndpointOverride] = useState<string>('');
  const [accessKeyIdWrite, setAccessKeyIdWrite] = useState<string>('');
  const [secretAccessKeyWrite, setSecretAccessKeyWrite] = useState<string>('');
  const [accessKeyIdRead, setAccessKeyIdRead] = useState<string>('');
  const [secretAccessKeyRead, setSecretAccessKeyRead] = useState<string>('');
  
  // Azure Storage specific fields
  const [azureAccountNameRead, setAzureAccountNameRead] = useState<string>('');
  const [azureAccountKeyRead, setAzureAccountKeyRead] = useState<string>('');
  const [azureAccountNameWrite, setAzureAccountNameWrite] = useState<string>('');
  const [azureAccountKeyWrite, setAzureAccountKeyWrite] = useState<string>('');
  const [azureContainerName, setAzureContainerName] = useState<string>('');
  const [blobStoreEndpoint, setBlobStoreEndpoint] = useState<string>('');
  
  // Form validation
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Set initial storage type based on props
  useEffect(() => {
    if (initialStorageType) {
      setStorageType(initialStorageType);
    }
  }, [initialStorageType]);
  
  // Reset form when closed
  const resetForm = () => {
    setConnectorName('');
    setStorageType(initialStorageType || 'AmazonS3');
    setBucketName('');
    setRegion('');
    setEndpointOverride('');
    setAccessKeyIdWrite('');
    setSecretAccessKeyWrite('');
    setAccessKeyIdRead('');
    setSecretAccessKeyRead('');
    setAzureAccountNameRead('');
    setAzureAccountKeyRead('');
    setAzureAccountNameWrite('');
    setAzureAccountKeyWrite('');
    setAzureContainerName('');
    setBlobStoreEndpoint('');
    setErrors({});
    setActiveStep(0);
    setSubmitSuccess(false);
    setError(null);
  };
  
  const handleCloseModal = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };
  
  // Step handling
  const steps = ['Type', 'Basic Info', 'Credentials', 'Review'];
  
  const handleNext = () => {
    if (activeStep === 0) {
      setActiveStep(1);
      return;
    }
    
    if (activeStep === 1) {
      // Validate basic info
      const newErrors: FormErrors = {};
      
      if (!connectorName.trim()) {
        newErrors.connectorName = true;
      } else if (!/^[a-z0-9]([-a-z0-9]{0,14}[a-z0-9])?$/.test(connectorName)) {
        newErrors.connectorNameFormat = true;
      }
      
      if (storageType === 'AmazonS3' && !bucketName.trim()) {
        newErrors.bucketName = true;
      }
      
      if (storageType === 'AzureStorage') {
        if (!azureContainerName.trim()) {
          newErrors.azureContainerName = true;
        }
        
        if (!blobStoreEndpoint.trim()) {
          newErrors.blobStoreEndpoint = 'Blob Store Endpoint is required';
        } else if (!isValidUrl(blobStoreEndpoint)) {
          newErrors.blobStoreEndpoint = 'Please enter a valid URL';
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    
    if (activeStep === 2) {
      // Validate credentials
      const newErrors: FormErrors = {};
      
      if (storageType === 'AmazonS3') {
        if (!accessKeyIdRead.trim()) {
          newErrors.accessKeyIdRead = true;
        }
        if (!secretAccessKeyRead.trim()) {
          newErrors.secretAccessKeyRead = true;
        }
        if (!accessKeyIdWrite.trim()) {
          newErrors.accessKeyIdWrite = true;
        }
        if (!secretAccessKeyWrite.trim()) {
          newErrors.secretAccessKeyWrite = true;
        }
      }
      
      if (storageType === 'AzureStorage') {
        if (!azureAccountNameRead.trim()) {
          newErrors.azureAccountNameRead = true;
        }
        if (!azureAccountKeyRead.trim()) {
          newErrors.azureAccountKeyRead = true;
        }
        if (!azureAccountNameWrite.trim()) {
          newErrors.azureAccountNameWrite = true;
        }
        if (!azureAccountKeyWrite.trim()) {
          newErrors.azureAccountKeyWrite = true;
        }
      }
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // const isValidUrl = (string: string) => {
  //   try {
  //     new URL(string);
  //     return string.includes('.blob.core.windows.net') || 
  //           /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]{1,61}[a-zA-Z0-9]\.blob\.core\.windows\.net/.test(string);
  //   } catch (err) {
  //     return false;
  //   }
  // }

  const isValidUrl = (string: string) => {
  try {
    const url = new URL(string);
    
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const token = getAccessTokenSilently;
      
      const connectorData: ConnectorData = {
        connectorName,
        storageType,
        ...(storageType === 'AmazonS3' && {
          bucketName,
          region,
          endpointOverride,
          accessKeyIdRead,
          secretAccessKeyRead,
          accessKeyIdWrite,
          secretAccessKeyWrite,
        }),
        ...(storageType === 'AzureStorage' && {
          azureContainerName,
          blobStoreEndpoint,
          azureAccountNameRead,
          azureAccountKeyRead,
          azureAccountNameWrite,
          azureAccountKeyWrite,
        }),
      };
      await handleCreateConnector(token, connectorData);
      setSubmitSuccess(true);
      
      // Wait a moment to show success message
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error('Error creating connector:', error);
      setError(error instanceof Error ? error.message : 'Failed to create connector');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle storage type change
  const handleStorageTypeChange = (type: string) => {
    setStorageType(type);
  };
  
  // Content for each step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Select Connector Type
            </Typography>
            {}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['AmazonS3'].map((type) => { 
                const iconSrc = getConnectorIcon(type);
                const labels: Record<string, string> = {
                  AmazonS3: 'Amazon S3',
                  AzureStorage: 'Azure Storage',
                  HttpData: 'HTTP Data'
                };
                
                return (
                  <Paper
                    key={type}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: `2px solid ${storageType === type ? theme.palette.primary.main : 'transparent'}`,
                      backgroundColor: storageType === type ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: storageType === type ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                    onClick={() => handleStorageTypeChange(type)}
                  >
                    {iconSrc && (
                      <Box
                        component="img"
                        src={iconSrc}
                        alt={type}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {labels[type] || type}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type === 'AmazonS3' && 'Connect to Amazon S3 compatible storage'}
                        {type === 'AzureStorage' && 'Connect to Microsoft Azure Blob Storage'}
                        {type === 'HttpData' && 'Connect to HTTP data sources'}
                      </Typography>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Basic Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Connector Name"
              variant="outlined"
              fullWidth
              required
              value={connectorName}
              onChange={(e) => {
                // Accept any input during typing
                setConnectorName(e.target.value.toLowerCase());
                
                // Clear validation errors during typing
                if (errors.connectorName || errors.connectorNameFormat) {
                  const { connectorName, connectorNameFormat, ...restErrors } = errors;
                  setErrors(restErrors);
                }
              }}
              onBlur={(e) => {
                // Validate the input when the field loses focus
                const inputValue = e.target.value.toLowerCase();
                const regex = /^$|^[a-z0-9]([-a-z0-9]{0,14}[a-z0-9])?$/;
                
                if (!regex.test(inputValue) && inputValue !== '') {
                  setErrors({
                    ...errors,
                    connectorNameFormat: true
                  });
                }
              }}
              error={errors.connectorName || errors.connectorNameFormat}
              helperText={
                errors.connectorName
                  ? 'Connector Name is required'
                  : errors.connectorNameFormat
                  ? 'Must be lowercase, start/end with alphanumeric, max 16 chars, can include hyphens, no whitespace'
                  : 'Lowercase letters, numbers, and hyphens. Max 16 characters.'
              }
            />
              
              {storageType === 'AmazonS3' && (
                <>
                  <TextField
                    label="Bucket Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={bucketName}
                    onChange={(e) => {
                      setBucketName(e.target.value);
                      if (errors.bucketName) {
                        const { bucketName, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.bucketName}
                    helperText={errors.bucketName ? 'Bucket Name is required' : ''}
                  />
                  
                  <TextField
                    label="Region"
                    variant="outlined"
                    fullWidth
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="e.g. us-east-1"
                  />
                  
                  <TextField
                    label="Endpoint Override (Optional)"
                    variant="outlined"
                    fullWidth
                    value={endpointOverride}
                    onChange={(e) => setEndpointOverride(e.target.value)}
                    placeholder="e.g. https://s3.custom-endpoint.com"
                  />
                </>
              )}
              
              {storageType === 'AzureStorage' && (
                <>
                  <TextField
                    label="Azure Container Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={azureContainerName}
                    onChange={(e) => {
                      setAzureContainerName(e.target.value);
                      if (errors.azureContainerName) {
                        const { azureContainerName, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.azureContainerName}
                    helperText={errors.azureContainerName ? 'Container Name is required' : ''}
                  />
                  
                  <TextField
                    label="Blob Store Endpoint"
                    variant="outlined"
                    fullWidth
                    required
                    value={blobStoreEndpoint}
                    onChange={(e) => {
                      setBlobStoreEndpoint(e.target.value);
                      // Clear errors when user starts typing again
                      if (errors.blobStoreEndpoint) {
                        setErrors(prev => ({ ...prev, blobStoreEndpoint: null }));
                      }
                    }}
                    onBlur={() => {
                      // Validate when field loses focus
                      if (!blobStoreEndpoint.trim()) {
                        setErrors(prev => ({ ...prev, blobStoreEndpoint: 'Blob Store Endpoint is required' }));
                      } else if (!isValidUrl(blobStoreEndpoint)) {
                        setErrors(prev => ({ ...prev, blobStoreEndpoint: 'Please enter a valid URL' }));
                      }
                    }}
                    error={Boolean(errors.blobStoreEndpoint)}
                    helperText={errors.blobStoreEndpoint}
                    placeholder="e.g. https://mystorageaccount.blob.core.windows.net"
                  />
                </>
              )}
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Credentials
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your read and write access credentials
            </Typography>
            
            {storageType === 'AmazonS3' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Read Access
                  </Typography>
                  
                  <TextField
                    label="Access Key ID (Read)"
                    variant="outlined"
                    fullWidth
                    required
                    value={accessKeyIdRead}
                    onChange={(e) => {
                      setAccessKeyIdRead(e.target.value);
                      if (errors.accessKeyIdRead) {
                        const { accessKeyIdRead, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.accessKeyIdRead}
                    helperText={errors.accessKeyIdRead ? 'Access Key ID is required' : ''}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    label="Secret Access Key (Read)"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                    value={secretAccessKeyRead}
                    onChange={(e) => {
                      setSecretAccessKeyRead(e.target.value);
                      if (errors.secretAccessKeyRead) {
                        const { secretAccessKeyRead, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.secretAccessKeyRead}
                    helperText={errors.secretAccessKeyRead ? 'Secret Access Key is required' : ''}
                  />
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Write Access
                  </Typography>
                  
                  <TextField
                    label="Access Key ID (Write)"
                    variant="outlined"
                    fullWidth
                    required
                    value={accessKeyIdWrite}
                    onChange={(e) => {
                      setAccessKeyIdWrite(e.target.value);
                      if (errors.accessKeyIdWrite) {
                        const { accessKeyIdWrite, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.accessKeyIdWrite}
                    helperText={errors.accessKeyIdWrite ? 'Access Key ID is required' : ''}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    label="Secret Access Key (Write)"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                    value={secretAccessKeyWrite}
                    onChange={(e) => {
                      setSecretAccessKeyWrite(e.target.value);
                      if (errors.secretAccessKeyWrite) {
                        const { secretAccessKeyWrite, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.secretAccessKeyWrite}
                    helperText={errors.secretAccessKeyWrite ? 'Secret Access Key is required' : ''}
                  />
                </Box>
              </Box>
            )}
            
            {storageType === 'AzureStorage' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Read Access
                  </Typography>
                  
                  <TextField
                    label="Azure Account Name (Read)"
                    variant="outlined"
                    fullWidth
                    required
                    value={azureAccountNameRead}
                    onChange={(e) => {
                      setAzureAccountNameRead(e.target.value);
                      if (errors.azureAccountNameRead) {
                        const { azureAccountNameRead, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.azureAccountNameRead}
                    helperText={errors.azureAccountNameRead ? 'Account Name is required' : ''}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    label="Azure Account Key (Read)"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                    value={azureAccountKeyRead}
                    onChange={(e) => {
                      setAzureAccountKeyRead(e.target.value);
                      if (errors.azureAccountKeyRead) {
                        const { azureAccountKeyRead, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.azureAccountKeyRead}
                    helperText={errors.azureAccountKeyRead ? 'Account Key is required' : ''}
                  />
                </Box>
                
                <Divider />
                
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Write Access
                  </Typography>
                  
                  <TextField
                    label="Azure Account Name (Write)"
                    variant="outlined"
                    fullWidth
                    required
                    value={azureAccountNameWrite}
                    onChange={(e) => {
                      setAzureAccountNameWrite(e.target.value);
                      if (errors.azureAccountNameWrite) {
                        const { azureAccountNameWrite, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.azureAccountNameWrite}
                    helperText={errors.azureAccountNameWrite ? 'Account Name is required' : ''}
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    label="Azure Account Key (Write)"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                    value={azureAccountKeyWrite}
                    onChange={(e) => {
                      setAzureAccountKeyWrite(e.target.value);
                      if (errors.azureAccountKeyWrite) {
                        const { azureAccountKeyWrite, ...restErrors } = errors;
                        setErrors(restErrors);
                      }
                    }}
                    error={errors.azureAccountKeyWrite}
                    helperText={errors.azureAccountKeyWrite ? 'Account Key is required' : ''}
                  />
                </Box>
              </Box>
            )}
            
            {storageType === 'HttpData' && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>
                  HTTP data connectors don't require additional credentials.
                </Typography>
              </Box>
            )}
          </Box>
        );
      
      case 3:
        return (
          <Box sx={{ p: 3 }}>
            {submitSuccess ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                py: 4
              }}>
                <SuccessIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
                <Typography variant="h6" align="center">
                  Connector created successfully!
                </Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Review and Create
                </Typography>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getConnectorIcon(storageType) && (
                      <Box 
                        component="img" 
                        src={getConnectorIcon(storageType)} 
                        alt={storageType}
                        sx={{ width: 32, height: 32, mr: 2 }}
                      />
                    )}
                    <Typography variant="h6">{connectorName}</Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Type
                      </Typography>
                      <Typography variant="body2">
                        {storageType}
                      </Typography>
                    </Box>
                    
                    {storageType === 'AmazonS3' && (
                      <>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Bucket
                          </Typography>
                          <Typography variant="body2">
                            {bucketName}
                          </Typography>
                        </Box>
                        
                        {region && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Region
                            </Typography>
                            <Typography variant="body2">
                              {region}
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                    
                    {storageType === 'AzureStorage' && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Container
                        </Typography>
                        <Typography variant="body2">
                          {azureContainerName}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Click 'Create' to set up your new connector. This operation may take a few moments to complete.
                </Typography>
              </>
            )}
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Modal
      open={open}
      onClose={isSubmitting ? undefined : handleCloseModal}
      aria-labelledby="create-connector-modal"
      slotProps={{
        backdrop: { sx: { backgroundColor: drawerOpen ? 'transparent' : 'rgba(0, 0, 0, 0.5)' } }
      }}
    >
      <Box sx={modalStyle}>
        {}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography id="create-connector-modal" variant="h6">
              Create New Connector
            </Typography>
            <InfoDrawer
              title={connector_info.title}
              body={connector_info.body}
              onOpen={() => setDrawerOpen(true)}
              onClose={() => setDrawerOpen(false)}
            />
          </Box>
          
          {!isSubmitting && (
            <IconButton aria-label="close" onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        
        {}
        <Box sx={{ width: '100%', px: 3, pt: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{!isMobile && label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        {}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto',
          maxHeight: 'calc(90vh - 140px)'
        }}>
          {renderStepContent()}
        </Box>
        
        {}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<BackIcon />}
            disabled={activeStep === 0 || isSubmitting || submitSuccess}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || submitSuccess}
              >
                {isSubmitting ? 'Creating...' : 'Create Connector'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                endIcon={<ForwardIcon />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateConnectorModal;