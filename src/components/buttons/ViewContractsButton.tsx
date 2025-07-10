import React, { useState } from 'react';
import { IconButton, Tooltip, Badge } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContractDetailsPopup from '../misc/ContractsMenu';

// Define types for the component props
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

interface ContractsData {
  [assetPath: string]: Contract[];
}

interface ViewContractsButtonProps {
  assetPath: string;
  contractsData: ContractsData;
  getAccessTokenSilently: () => Promise<string>;
  selectedConnector: string;
  isGridView?: boolean;
}

const ViewContractsButton: React.FC<ViewContractsButtonProps> = ({ 
  assetPath,
  contractsData,
  isGridView = false
}) => {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  
  // Get contracts for this asset
  const contracts = contractsData?.[assetPath] || [];
  const contractCount = contracts.length;

  // Open the popup
  const handleOpenPopup = (e: React.MouseEvent<HTMLButtonElement>): void => {
    // Prevent triggering parent element's onClick
    e.stopPropagation();
    setIsPopupOpen(true);
  };

  // Close the popup
  const handleClosePopup = (): void => {
    setIsPopupOpen(false);
  };

  // We'll adjust the size and spacing based on the view type
  const buttonSx = isGridView ? {
    padding: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': { 
      backgroundColor: 'rgba(255, 255, 255, 1)',
    }
  } : {
    ml: 1,
    '&:hover': { 
      bgcolor: 'rgba(25, 118, 210, 0.04)'
    }
  };

  return (
    <>
      <Tooltip title={
        contractCount > 0 
          ? `View ${contractCount} Associated Contract${contractCount !== 1 ? 's' : ''}`
          : "No Associated Contracts"
      }>
        <Badge 
          badgeContent={contractCount} 
          color="primary"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.6rem',
              height: 16,
              minWidth: 16,
              padding: '0 4px'
            }
          }}
        >
          <IconButton
            onClick={handleOpenPopup}
            color={contractCount > 0 ? "primary" : "default"}
            size="small"
            sx={buttonSx}
          >
            <AssignmentIcon fontSize="small" />
          </IconButton>
        </Badge>
      </Tooltip>
      
      <ContractDetailsPopup
        open={isPopupOpen}
        onClose={handleClosePopup}
        assetPath={assetPath}
        contracts={contracts}
        loading={false}
      />
    </>
  );
};

export default ViewContractsButton;