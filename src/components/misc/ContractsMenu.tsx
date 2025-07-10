import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Collapse,
  Chip,
  CircularProgress,
  alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FileTypeIcon from '../misc/FileTypeIcon';

interface Contract {
  '@id': string;
  '@type': string;
  accessPolicyId?: string;
  contractPolicyId?: string;
  assetsSelector?: {
    '@type': string;
    operandLeft: string;
    operator: string;
    operandRight: string[];
  };
}

interface ContractDetailsPopupProps {
  open: boolean;
  onClose: () => void;
  assetPath: string;
  contracts: Contract[];
  loading: boolean;
}

const ContractDetailsPopup: React.FC<ContractDetailsPopupProps> = ({ 
  open, 
  onClose, 
  assetPath, 
  contracts, 
  loading,
}) => {
  const [expandedContract, setExpandedContract] = useState<string | null>(null);
  const [assetsInContract, setAssetsInContract] = useState<Record<string, string[]>>({});
  const [loadingAssets, setLoadingAssets] = useState<Record<string, boolean>>({});

  // Toggle expanded contract
  const handleToggleExpand = (contractId: string): void => {
    if (expandedContract === contractId) {
      setExpandedContract(null);
    } else {
      setExpandedContract(contractId);
      if (!assetsInContract[contractId]) {
        fetchAssetsForContract(contractId);
      }
    }
  };

  // Fetch assets for a specific contract
  const fetchAssetsForContract = async (contractId: string): Promise<void> => {
    // Find the contract
    const contract = contracts.find(c => c['@id'] === contractId);
    if (!contract || !contract.assetsSelector || !contract.assetsSelector.operandRight) {
      return;
    }

    setLoadingAssets(prev => ({ ...prev, [contractId]: true }));
    
    try {
      // Extract assets directly from the contract definition
      const assets = contract.assetsSelector.operandRight;
      
      setAssetsInContract(prev => ({
        ...prev,
        [contractId]: assets
      }));
    } catch (error) {
      console.error('Error fetching assets for contract:', error);
    } finally {
      setLoadingAssets(prev => ({ ...prev, [contractId]: false }));
    }
  };

  // Get policy IDs to display
  const getAccessPolicyId = (contract: Contract): string => {
    return contract.accessPolicyId || 'No access policy ID';
  };
  
  const getContractPolicyId = (contract: Contract): string => {
    return contract.contractPolicyId || 'No contract policy ID';
  };

  // Get short ID for display
  const getShortId = (id: string): string => {
    if (!id) return 'N/A';
    return id.substring(0, 8) + '...';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 2,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Contracts for Asset
          </Typography>
          <Chip 
            label={assetPath} 
            size="small" 
            sx={{ ml: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : contracts.length === 0 ? (
          <Box sx={{ 
            py: 8, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2,
            color: 'text.secondary'
          }}>
            <Box sx={{
              p: 3,
              borderRadius: '50%',
              bgcolor: alpha('#1976d2', 0.1),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <InfoOutlinedIcon fontSize="large" color="primary" />
            </Box>
            <Typography variant="h6">
              No Contracts Found
            </Typography>
            <Typography variant="body2" align="center" sx={{ maxWidth: 400 }}>
              This asset is not currently associated with any contracts. 
              You can create a new contract by selecting this asset and using the "Create Contract" button.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {contracts.map((contract, index) => (
              <React.Fragment key={contract['@id']}>
                <ListItem 
                  sx={{ 
                    px: 3, 
                    py: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                  }}
                  onClick={() => handleToggleExpand(contract['@id'])}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={500}>
                            Contract {getShortId(contract['@id'])}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Access Policy: {getShortId(getAccessPolicyId(contract))}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Contract Policy: {getShortId(getContractPolicyId(contract))}
                          </Typography>
                        </Box>
                        <Box>
                          {expandedContract === contract['@id'] ? 
                            <ExpandLessIcon color="action" /> : 
                            <ExpandMoreIcon color="action" />
                          }
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                
                <Collapse in={expandedContract === contract['@id']} timeout="auto" unmountOnExit>
                  <Box sx={{ px: 3, py: 2, bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Details
                    </Typography>
                    
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Contract ID
                          </Typography>
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {contract['@id']}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Access Policy ID
                          </Typography>
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {getAccessPolicyId(contract)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Contract Policy ID
                          </Typography>
                          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                            {getContractPolicyId(contract)}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Assets in this Contract
                    </Typography>
                    
                    {loadingAssets[contract['@id']] ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                      </Box>
                    ) : assetsInContract[contract['@id']] ? (
                      <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                        <List dense disablePadding>
                          {assetsInContract[contract['@id']].map((asset, idx) => (
                            <ListItem key={idx} divider={idx < assetsInContract[contract['@id']].length - 1}>
                              <Box sx={{ mr: 1.5 }}>
                                <FileTypeIcon fileName={asset} IconProps={{ fontSize: "small", color: "action" }} />
                              </Box>
                              <ListItemText 
                                primary={asset} 
                                primaryTypographyProps={{ variant: 'body2' }}
                              />
                              {asset === assetPath && (
                                <Chip 
                                  label="Current" 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined"
                                />
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No assets information available
                      </Typography>
                    )}
                  </Box>
                </Collapse>
                
                {index < contracts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ContractDetailsPopup;