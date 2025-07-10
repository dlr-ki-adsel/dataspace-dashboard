import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
  Select, MenuItem, FormControl, InputLabel, Box, Chip, Paper,
  CircularProgress, TextField, IconButton, Tooltip, Grid, Divider,
  Alert, Collapse, Checkbox, FormControlLabel, Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { HandshakeIcon } from 'lucide-react';
import SecurityIcon from '@mui/icons-material/Security';
import PolicyIcon from '@mui/icons-material/Policy';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PanToolIcon from '@mui/icons-material/PanTool';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DescriptionIcon from '@mui/icons-material/Description';
import DomainIcon from '@mui/icons-material/Domain';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import SearchIcon from '@mui/icons-material/Search';
import FileTypeIcon from '../misc/FileTypeIcon';
import { v4 as uuidv4 } from 'uuid';

import { handleCreateContract as createContractService } from '../../services/createContract';
import { handleCreatePolicies } from '../../services/createPolicy';
import { handleGetPolicies } from '../../services/getPolicies';

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-icon': { marginLeft: theme.spacing(0.5) }
}));

const ContractPreviewBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(1),
  backgroundColor: '#f8f9fa',
  maxHeight: '400px',
  overflow: 'auto'
}));

const DescriptionTextField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(1),
  '& .MuiInputBase-root': {
    minHeight: '180px',
  },
  '& .MuiOutlinedInput-root': {
    height: '100%',
  },
  '& .MuiOutlinedInput-inputMultiline': {
    height: '100%',
  }
}));

const DropdownFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    }
  },
  '& .MuiInputLabel-outlined.Mui-focused': {
    color: theme.palette.primary.main,
  }
}));

const predefinedPolicies = [
  {
    name: 'Standard Access Policy',
    description: 'Basic read access to resources',
    icon: <PanToolIcon />,
    policy: {
      policy: {
        '@type': 'odrl:Set',
        'odrl:permission': [{ 'odrl:action': 'USE' }]
      }
    }
  },
  {
    name: 'Extended Access Policy',
    description: 'Read and modify access to resources',
    icon: <EditIcon />,
    policy: {
      policy: {
        '@type': 'odrl:Set',
        'odrl:permission': [{ 'odrl:action': 'USE' }, { 'odrl:action': 'MODIFY' }]
      }
    }
  },
  {
    name: 'Full Access Policy',
    description: 'Complete access with distribution rights',
    icon: <ShareIcon />,
    policy: {
      policy: {
        '@type': 'odrl:Set',
        'odrl:permission': [
          { 'odrl:action': 'USE' },
          { 'odrl:action': 'MODIFY' },
          { 'odrl:action': 'DISTRIBUTE' }
        ]
      }
    }
  }
];

const sampleDomains = [
  'Healthcare',
  'Finance',
  'Manufacturing',
  'Automotive',
  'Logistics',
  'Energy',
  'Education',
  'Retail',
  'Agriculture',
  'Transportation'
];

const sampleTags = [
  'Confidential',
  'Public',
  'Research',
  'Development',
  'Testing',
  'Production',
  'Personal',
  'Sensitive',
  'Archive',
  'Draft',
  'Machine Learning',
  'Analytics',
  'API',
  'Database',
  'Streaming',
  'Raw Data',
  'Processed',
  'Metadata',
  'Configuration',
  'Documentation'
];

const resourceTypeOptions = [
  { value: 'data', label: 'Data' },
  { value: 'service', label: 'Service' }
];

interface CreateContractButtonProps {
  selectedItems: Array<{ name: string; path: string }>;
  selectedConnector: string;
  getAccessTokenSilently: () => Promise<string>;
  onSuccess?: () => void;
}

interface PolicyDisplay {
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  permissionsMapped?: string[];
  icon?: React.ReactNode;
}

interface ContractMetadata {
  title: string;
  description: string;
  domain: string;
  tags: string[];
  resourceType: string;
}

const CreateContractButton: React.FC<CreateContractButtonProps> = ({
  selectedItems,
  selectedConnector,
  getAccessTokenSilently,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [policySuccess, setPolicySuccess] = useState(false);
  const [contractSuccess, setContractSuccess] = useState(false);
  
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [selectedAccessPolicy, setSelectedAccessPolicy] = useState('');
  const [selectedContractPolicy, setSelectedContractPolicy] = useState('');
  
  const [useSeparatePolicies, setUseSeparatePolicies] = useState(false);
  
  const [existingPolicies, setExistingPolicies] = useState<any[]>([]);
  const [policyDisplayInfo, setPolicyDisplayInfo] = useState<Record<string, PolicyDisplay>>({});
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyJson, setNewPolicyJson] = useState('');
  const [newPolicyJsonError, setNewPolicyJsonError] = useState<string | null>(null);
  const [selectedPredefinedPolicy, setSelectedPredefinedPolicy] = useState('');
  
  const [contractMetadata, setContractMetadata] = useState<ContractMetadata>({
    title: '',
    description: '',
    domain: '',
    tags: [],
    resourceType: 'data',
  });
  
  const [contractDefinition, setContractDefinition] = useState('');
  const [internalAssets, setInternalAssets] = useState(selectedItems);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // New state for enabling/disabling metadata
  const [includeMetadata, setIncludeMetadata] = useState(true);

  useEffect(() => {
    if (open && selectedConnector) {
      fetchPolicies();
    }
  }, [open, selectedConnector]);

  useEffect(() => {
    setInternalAssets(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    setContractDefinition(JSON.stringify({}, null, 2));
  }, []);

  useEffect(() => {
    updateContractPreview();
  }, [
    selectedPolicy,
    selectedAccessPolicy, 
    selectedContractPolicy, 
    internalAssets, 
    contractMetadata, 
    useSeparatePolicies,
    includeMetadata
  ]);

  useEffect(() => {
    if (selectedPredefinedPolicy) {
      const policyTemplate = predefinedPolicies.find(p => p.name === selectedPredefinedPolicy);
      if (policyTemplate) {
        const policyData = {
          ...policyTemplate.policy,
          '@id': uuidv4(),
          '@type': 'Policy',
          'name': newPolicyName || 'New Policy'
        };
        setNewPolicyJson(JSON.stringify(policyData, null, 2));
      }
    }
  }, [selectedPredefinedPolicy, newPolicyName]);

  useEffect(() => {
    if (contractSuccess) {
      const timer = setTimeout(() => {
        setContractSuccess(false);
        if (onSuccess) {
          onSuccess();
          setTimeout(() => setOpen(false), 500);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
    
    if (policySuccess) {
      const timer = setTimeout(() => setPolicySuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [contractSuccess, policySuccess, onSuccess]);

  useEffect(() => {
    if (useSeparatePolicies) {
      if (selectedPolicy) {
        setSelectedAccessPolicy('all');
        setSelectedContractPolicy(selectedPolicy);
      }
    } else {
      if (selectedAccessPolicy && selectedContractPolicy && selectedAccessPolicy === selectedContractPolicy) {
        setSelectedPolicy(selectedAccessPolicy);
      } else if (selectedContractPolicy) {
        setSelectedPolicy(selectedContractPolicy);
      }
    }
  }, [useSeparatePolicies]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const policies = await handleGetPolicies(getAccessTokenSilently, selectedConnector);
      
      const policyInfo: Record<string, PolicyDisplay> = {};
      
      policies.forEach((policy: any) => {
        const id = policy['@id'];
        const name = policy['name'] || `Policy ${id.substring(0, 18)}`;
        
        let description = '';
        let icon = <PolicyIcon />;
        let permissions: string[] = [];
        
        try {
          if (policy.policy && policy.policy['odrl:permission']) {
            const permissionData = policy.policy['odrl:permission'];
            
            if (Array.isArray(permissionData)) {
              permissionData.forEach(perm => {
                if (perm && perm['odrl:action']) {
                  if (typeof perm['odrl:action'] === 'string') {
                    permissions.push(perm['odrl:action']);
                  } else if (perm['odrl:action']['@id']) {
                    permissions.push(perm['odrl:action']['@id']);
                  }
                }
              });
            } else if (typeof permissionData === 'object' && permissionData !== null) {
              if (permissionData['odrl:action']) {
                if (typeof permissionData['odrl:action'] === 'string') {
                  permissions.push(permissionData['odrl:action']);
                } else if (permissionData['odrl:action']['@id']) {
                  permissions.push(permissionData['odrl:action']['@id']);
                }
              }
            }
            
            if (permissions.length > 0) {
              description = `Allows: ${permissions.join(', ')}`;
              
              const hasPermission = (perm: string) => {
                return permissions.some(p => 
                  typeof p === 'string' && p.toUpperCase() === perm.toUpperCase()
                );
              };
                
              if (hasPermission('DISTRIBUTE')) {
                icon = <ShareIcon />;
              } else if (hasPermission('MODIFY')) {
                icon = <EditIcon />;
              } else if (hasPermission('USE')) {
                icon = <PanToolIcon />;
              }
            } else {
              description = 'No specific permissions found';
            }
          } else {
            description = 'No permission data available';
          }
        } catch (err) {
          console.error("Error parsing policy details:", err);
          description = "Policy details unavailable";
        }
        
        policyInfo[id] = { id, name, description, permissions, icon };
      });
      
      setExistingPolicies(policies);
      setPolicyDisplayInfo(policyInfo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching policies:', error);
      setError('Failed to load policies. Please try again.');
      setLoading(false);
    }
  };
  
  const updateContractPreview = () => {
    try {
      const assetIds = internalAssets.map(item => item.path);
      
      const contractTemplate: any = {};
      
      if (useSeparatePolicies) {
        if (selectedAccessPolicy) {
          contractTemplate.accessPolicyId = selectedAccessPolicy;
        }
        
        if (selectedContractPolicy) {
          contractTemplate.contractPolicyId = selectedContractPolicy;
        }
      } else {
        if (selectedPolicy) {
          contractTemplate.accessPolicyId = "all";
          contractTemplate.contractPolicyId = selectedPolicy;
        }
      }
      
      if (assetIds.length > 0) {
        contractTemplate.assetsSelector = {
          operandLeft: 'https://w3id.org/edc/v0.0.1/ns/id',
          operator: assetIds.length > 1 ? 'in' : '=',
          operandRight: assetIds.length > 1 ? assetIds : assetIds[0],
        };
      }
      
      // Only add metadata fields if includeMetadata is true
      if (includeMetadata) {
        if (contractMetadata.title.trim()) {
          contractTemplate.title = contractMetadata.title.trim();
        }
        
        if (contractMetadata.description.trim()) {
          contractTemplate.description = contractMetadata.description.trim().replace(/\n/g, ' ');
        }
        
        if (contractMetadata.domain) {
          contractTemplate.domain = contractMetadata.domain;
        }
        
        if (contractMetadata.tags.length > 0) {
          contractTemplate.tags = contractMetadata.tags;
        }
        
        if (contractMetadata.resourceType) {
          contractTemplate.sharing = contractMetadata.resourceType;
        }
      }
      
      setContractDefinition(JSON.stringify(contractTemplate, null, 2));
    } catch (err) {
      console.error("Error updating offer preview:", err);
    }
  };

  const handleOpen = () => {
    if (selectedItems.length === 0) return;
    
    setOpen(true);
    setSelectedPolicy('');
    setSelectedAccessPolicy('');
    setSelectedContractPolicy('');
    setUseSeparatePolicies(false);
    setContractMetadata({
      title: '',
      description: '',
      domain: '',
      tags: [],
      resourceType: 'data'
    });
    setError(null);
    setSuccess(false);
    setNewPolicyName('');
    setSelectedPredefinedPolicy('');
    setNewPolicyJson('');
    setNewPolicyJsonError(null);
    setInternalAssets([...selectedItems]);
    setShowAdvancedOptions(false);
    setIncludeMetadata(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validatePolicyJson = (json: string): boolean => {
    try {
      JSON.parse(json);
      setNewPolicyJsonError(null);
      return true;
    } catch (err) {
      setNewPolicyJsonError('Invalid JSON format. Please check your syntax.');
      return false;
    }
  };

  const handleMetadataChange = (field: keyof ContractMetadata, value: any) => {
    setContractMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreatePolicy = async () => {
    if (!newPolicyName) {
      setError('Please enter a name for the policy');
      return;
    }
    
    if (!newPolicyJson) {
      setError('Please provide JSON for your policy');
      return;
    }
    
    if (!validatePolicyJson(newPolicyJson)) {
      return;
    }

    try {
      setLoading(true);
      
      const parsedPolicy = JSON.parse(newPolicyJson);
      
      const policyToCreate = {
        ...parsedPolicy,
        '@id': parsedPolicy['@id'] || uuidv4(),
        '@type': 'Policy',
        'name': newPolicyName
      };
      
      await handleCreatePolicies(getAccessTokenSilently, selectedConnector, policyToCreate);
      
      await fetchPolicies();
      
      setNewPolicyName('');
      setSelectedPredefinedPolicy('');
      setNewPolicyJson('');
      setError(null);
      
      setPolicySuccess(true);
    } catch (error) {
      console.error('Error creating policy:', error);
      setError('Failed to create policy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitContract = async () => {
    // Only validate title and description if includeMetadata is true
    if (includeMetadata && !contractMetadata.title.trim()) {
      setError('Title is required when including metadata');
      return;
    }

    if (!useSeparatePolicies && !selectedPolicy) {
      setError('Please select a policy');
      return;
    }
    
    if (useSeparatePolicies && (!selectedAccessPolicy || !selectedContractPolicy)) {
      setError('Please select both access and offer policies');
      return;
    }
    
    if (internalAssets.length === 0) {
      setError('No assets selected');
      return;
    }

    if (includeMetadata && !contractMetadata.description.trim()) {
      setError('Description is required when including metadata');
      return;
    }

    try {
      setLoading(true);
      const contractPayload = JSON.parse(contractDefinition);
      
      const result = await createContractService(
        getAccessTokenSilently,
        selectedConnector,
        contractPayload
      );
      
      if (result !== undefined) {
        setContractSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Failed to create offer');
      }
    } catch (error) {
      setError(`Failed to create offer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAssetRemove = (assetToRemove: string) => {
    setInternalAssets(prev => prev.filter(asset => asset.path !== assetToRemove));
  };

  const isButtonDisabled = selectedItems.length === 0;

  const isCreateContractDisabled = () => {
    if (loading || success || internalAssets.length === 0) {
      return true;
    }
    
    // Only check metadata fields if includeMetadata is true
    if (includeMetadata && (!contractMetadata.title.trim() || !contractMetadata.description.trim())) {
      return true;
    }
    
    if (useSeparatePolicies) {
      return !selectedAccessPolicy || !selectedContractPolicy;
    } else {
      return !selectedPolicy;
    }
  };

  return (
    <>
      <Tooltip title={selectedItems.length === 0 ? "Select assets first" : "Create offer for selected assets"}>
        <span>
          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={handleOpen}
            disabled={isButtonDisabled}
            sx={{
              backgroundColor: '#4CAF50',
              '&:hover': { backgroundColor: '#388E3C' },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
              }
            }}
          >
            CREATE OFFER
          </Button>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <HandshakeIcon/>
              <Typography variant="h6">Create Offer</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, pb: 2, maxHeight: '80vh', overflow: 'auto' }}>
          {}
          <Box mt={2} mb={3} display="flex" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  <SearchIcon sx={{ mr: 1, color: 'action.active' }} />
                  <Typography variant="body1" fontWeight={500}>
                    Include search engine metadata (title, tags, description)
                  </Typography>
                </Box>
              }
            />
          </Box>
          
          <Grid container spacing={3}>
            {}
            <Grid item xs={12} md={5}>
              {}
              <Box mb={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Assets ({internalAssets.length})
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ p: 1, maxHeight: 120, overflow: 'auto', borderRadius: 1 }}
                >
                  {internalAssets.length > 0 ? (
                    <Box display="flex" flexWrap="wrap">
                      {internalAssets.map((item) => (
                        <StyledChip
                          key={item.path}
                          icon={<FileTypeIcon fileName={item.name} IconProps={{ fontSize: "small" }} />}
                          label={item.name}
                          size="small"
                          variant="outlined"
                          onDelete={() => handleAssetRemove(item.path)}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                      No assets selected
                    </Typography>
                  )}
                </Paper>
              </Box>

              {}
              {includeMetadata && (
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                    Offer Metadata
                  </Typography>
                  
                  <TextField
                    label="Title"
                    value={contractMetadata.title}
                    onChange={(e) => handleMetadataChange('title', e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                    size="small"
                    InputProps={{
                      startAdornment: <DriveFileRenameOutlineIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                  />
                  
                  <DropdownFormControl fullWidth margin="normal" size="small">
                    <Autocomplete
                      value={contractMetadata.domain}
                      onChange={(_, newValue) => handleMetadataChange('domain', newValue)}
                      options={sampleDomains}
                      freeSolo
                      popupIcon={<ArrowDropDownIcon />}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Domain" 
                          placeholder="Select or type a domain"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <DomainIcon sx={{ mr: 1, color: 'action.active' }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </DropdownFormControl>
                  
                  <DropdownFormControl fullWidth margin="normal" size="small">
                    <Autocomplete
                      multiple
                      value={contractMetadata.tags}
                      onChange={(_, newValue) => handleMetadataChange('tags', newValue)}
                      options={sampleTags}
                      freeSolo
                      popupIcon={<ArrowDropDownIcon />}
                      renderTags={(value: readonly string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                          <StyledChip
                            label={option}
                            size="small"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Tags" 
                          placeholder="Type and press Enter to add custom tags"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <LocalOfferIcon sx={{ mr: 1, color: 'action.active' }} />
                                {params.InputProps.startAdornment}
                              </>
                            ),
                            endAdornment: (
                              <>
                                {params.InputProps.endAdornment}
                                <Tooltip title="Type and press Enter to add custom tags">
                                  <KeyboardReturnIcon color="action" sx={{ ml: 1, fontSize: '1rem' }} />
                                </Tooltip>
                              </>
                            )
                          }}
                        />
                      )}
                    />
                  </DropdownFormControl>
                  
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Are you sharing data or a service?</InputLabel>
                    <Select
                      value={contractMetadata.resourceType}
                      onChange={(e) => handleMetadataChange('resourceType', e.target.value)}
                      label="Are you sharing data or a service?"
                      startAdornment={<CategoryIcon sx={{ mr: 1, color: 'action.active' }} />}
                      IconComponent={ArrowDropDownIcon}
                    >
                      {resourceTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {}
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon fontSize="small" sx={{ mr: 1 }} />
                  Policy Selection
                </Typography>
                
                {}
                {!useSeparatePolicies && (
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Policy</InputLabel>
                    <Select
                      value={selectedPolicy}
                      onChange={(e) => setSelectedPolicy(e.target.value)}
                      label="Policy"
                      disabled={loading}
                      IconComponent={ArrowDropDownIcon}
                    >
                      {loading ? (
                        <MenuItem value="" disabled>
                          <CircularProgress size={20} sx={{ mr: 1 }} /> Loading policies...
                        </MenuItem>
                      ) : (
                        existingPolicies.map((policy) => {
                          const policyId = policy['@id'];
                          const displayInfo = policyDisplayInfo[policyId] || { 
                            name: policyId, 
                            id: policyId,
                            icon: <PolicyIcon />
                          };
                          
                          return (
                            <MenuItem key={policyId} value={policyId}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ mr: 1, color: 'action.active' }}>
                                  {displayInfo.icon}
                                </Box>
                                <Box>
                                  <Typography variant="body2">{displayInfo.name}</Typography>
                                  {displayInfo.description && (
                                    <Typography variant="caption" color="text.secondary">
                                      {displayInfo.description}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </MenuItem>
                          );
                        })
                      )}
                    </Select>
                  </FormControl>
                )}
                
                {}
                {useSeparatePolicies && (
                  <Grid container spacing={2}>
                    {}
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel>Access Policy</InputLabel>
                        <Select
                          value={selectedAccessPolicy}
                          onChange={(e) => setSelectedAccessPolicy(e.target.value)}
                          label="Access Policy"
                          disabled={loading}
                          IconComponent={ArrowDropDownIcon}
                          renderValue={(selected) => {
                            const policy = existingPolicies.find(p => p['@id'] === selected);
                            const displayInfo = policy ? policyDisplayInfo[policy['@id']] : null;
                            
                            if (!displayInfo) return <Typography>Select a policy</Typography>;
                            
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ mr: 1, color: 'action.active' }}>
                                    {displayInfo.icon}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="body2">{displayInfo.name}</Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Allows: {displayInfo.permissions?.join(', ') || 'USE'}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }}
                        >
                          {loading ? (
                            <MenuItem value="" disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                            </MenuItem>
                          ) : (
                            existingPolicies.map((policy) => {
                              const policyId = policy['@id'];
                              const displayInfo = policyDisplayInfo[policyId] || { 
                                name: policyId, 
                                id: policyId,
                                icon: <PolicyIcon />
                              };
                              
                              return (
                                <MenuItem key={policyId} value={policyId}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                      {displayInfo.icon}
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                      <Typography variant="body2">{displayInfo.name}</Typography>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Allows: {displayInfo.permissions?.join(', ') || 'USE'}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    {}
                    <Grid item xs={6}>
                      <FormControl fullWidth margin="normal" size="small">
                        <InputLabel>Contract Policy</InputLabel>
                        <Select
                          value={selectedContractPolicy}
                          onChange={(e) => setSelectedContractPolicy(e.target.value)}
                          label="Contract Policy"
                          disabled={loading}
                          IconComponent={ArrowDropDownIcon}
                          renderValue={(selected) => {
                            const policy = existingPolicies.find(p => p['@id'] === selected);
                            const displayInfo = policy ? policyDisplayInfo[policy['@id']] : null;
                            
                            if (!displayInfo) return <Typography>Select a policy</Typography>;
                            
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ mr: 1, color: 'action.active' }}>
                                    {displayInfo.icon}
                                  </Box>
                                </Box>
                                <Box>
                                  <Typography variant="body2">{displayInfo.name}</Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    Allows: {displayInfo.permissions?.join(', ') || 'USE'}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }}
                        >
                          {loading ? (
                            <MenuItem value="" disabled>
                              <CircularProgress size={20} sx={{ mr: 1 }} /> Loading...
                            </MenuItem>
                          ) : (
                            existingPolicies.map((policy) => {
                              const policyId = policy['@id'];
                              const displayInfo = policyDisplayInfo[policyId] || { 
                                name: policyId, 
                                id: policyId,
                                icon: <PolicyIcon />
                              };
                              
                              return (
                                <MenuItem key={policyId} value={policyId}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Box sx={{ mr: 1, color: 'action.active' }}>
                                      {displayInfo.icon}
                                    </Box>
                                    <Box sx={{ width: '100%' }}>
                                      <Typography variant="body2">{displayInfo.name}</Typography>
                                      <Typography variant="caption" color="text.secondary" display="block">
                                        Allows: {displayInfo.permissions?.join(', ') || 'USE'}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                )}
              </Box>

              {}
              <Box mt={2}>
                <Button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  startIcon={showAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  color="primary"
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </Button>
              </Box>

              <Collapse in={showAdvancedOptions}>
                <Box mt={2} p={2} bgcolor="#f8f8f8" borderRadius={1}>
                  {}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useSeparatePolicies}
                        onChange={(e) => setUseSeparatePolicies(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        Choose Access Policy and Contract Policy separately
                      </Typography>
                    }
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Create New Policy
                  </Typography>
                  
                  <TextField
                    label="Policy Name"
                    value={newPolicyName}
                    onChange={(e) => setNewPolicyName(e.target.value)}
                    fullWidth
                    margin="normal"
                    size="small"
                  />
                  
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Policy Template (Optional)</InputLabel>
                    <Select
                      value={selectedPredefinedPolicy}
                      onChange={(e) => setSelectedPredefinedPolicy(e.target.value)}
                      label="Policy Template (Optional)"
                      IconComponent={ArrowDropDownIcon}
                    >
                      <MenuItem value="">
                        <Typography variant="body2">Custom Policy (JSON)</Typography>
                      </MenuItem>
                      {predefinedPolicies.map((policy) => (
                        <MenuItem key={policy.name} value={policy.name}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 1, color: 'action.active' }}>
                              {policy.icon}
                            </Box>
                            <Box>
                              <Typography variant="body2">{policy.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {policy.description}
                              </Typography>
                            </Box>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    label="Policy JSON"
                    value={newPolicyJson}
                    onChange={(e) => {
                      setNewPolicyJson(e.target.value);
                      if (e.target.value) {
                        validatePolicyJson(e.target.value);
                      } else {
                        setNewPolicyJsonError(null);
                      }
                    }}
                    multiline
                    fullWidth
                    rows={8}
                    margin="normal"
                    size="small"
                    error={!!newPolicyJsonError}
                    helperText={newPolicyJsonError}
                  />
                  
                  <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button 
                      variant="contained"
                      onClick={handleCreatePolicy}
                      disabled={loading || !newPolicyJson || !newPolicyName}
                      size="small"
                      startIcon={<AddCircleIcon />}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Create Policy'}
                    </Button>
                  </Box>
                </Box>
              </Collapse>
            </Grid>

            {}
            <Grid item xs={12} md={7}>
              <Grid container spacing={2}>
                {}
                <Grid item xs={12}>
                  <ContractPreviewBox>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        Offer Preview
                      </Typography>
                      <Tooltip title="This is the exact offer definition that will be created">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ 
                      bgcolor: '#272c34', 
                      color: '#e3e3e3', 
                      p: 2, 
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                      overflow: 'auto',
                      whiteSpace: 'pre',
                      maxHeight: '250px'
                    }}>
                      {contractDefinition || 'Offer preview will appear here...'}
                    </Box>
                  </ContractPreviewBox>
                </Grid>
                
                {}
                {includeMetadata && (
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                        Description*
                      </Typography>
                      <DescriptionTextField
                        value={contractMetadata.description}
                        onChange={(e) => handleMetadataChange('description', e.target.value)}
                        fullWidth
                        multiline
                        minRows={8}
                        variant="outlined"
                        placeholder="Provide a detailed description of this offer..."
                        InputProps={{
                          startAdornment: (
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'flex-start', 
                                position: 'absolute', 
                                left: 10, 
                                top: 12 
                              }}
                            >
                              <DescriptionIcon sx={{ color: 'action.active', mr: 1 }} />
                            </Box>
                          ),
                          sx: { pl: 5 }
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
              
              {}
              {(policySuccess || contractSuccess) && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mt: 2, 
                    width: '100%',
                    maxWidth: '600px',
                    margin: '0 auto',
                    zIndex: 1000
                  }}
                  action={
                    <IconButton size="small" onClick={() => setSuccess(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  {policySuccess 
                    ? 'Policy created successfully! You can now select it from the dropdown.' 
                    : 'Offer created successfully!'}
                </Alert>
              )}

              {}
              {error && (
                <Alert 
                  severity="error"
                  sx={{ 
                    mt: 2, 
                    width: '100%',
                    zIndex: 10
                  }}
                  action={
                    <IconButton size="small" onClick={() => setError(null)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  {error}
                </Alert>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            size="large"
            sx={{ minWidth: 100 }}
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleSubmitContract} 
            variant="contained"
            disabled={isCreateContractDisabled()}
            size="large"
            sx={{ 
              minWidth: 150,
              backgroundColor: '#4CAF50',
              '&:hover': {
                backgroundColor: '#388E3C',
              }
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          >
            {loading ? 'CREATING...' : 'CREATE OFFER'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateContractButton;