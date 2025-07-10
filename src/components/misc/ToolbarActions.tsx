import React, { useState } from 'react';
import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate } from 'react-router-dom';
import useKeycloakToken from '../../hooks/useKeycloakToken';
import ConnectorSelector from '../connector/ConnectorSelector';
import useConnectors from '../../hooks/useConnectors';
import { handleDownloadCertificate } from '../../services/downloadCertificate';

const ToolbarActions: React.FC = () => {
  const navigate = useNavigate();
  // const searchInputRef = useRef<HTMLInputElement>(null);
  const getAccessTokenSilently = useKeycloakToken(); // Get the authentication function
  const {
    connectors,
    selectedConnector,
    setSelectedConnector
  } = useConnectors();
  const [, setLoading] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);
  
  // const handleSearch = (query: string) => {
  //   const trimmedQuery = query.trim();
  //   if (trimmedQuery) {
  //     const urlParams = new URLSearchParams();
  //     urlParams.append('q', trimmedQuery);
  //     urlParams.append('sort_by', 'relevance');
  //     urlParams.append('page', '1');
  //     urlParams.append('size', '6');
  //     urlParams.append('_t', Date.now().toString());
  //     navigate(`/dataspace/search?${urlParams.toString()}`);
  //   }
  // };
  
  const downloadCertificate = async () => {
    setDownloadingCert(true);
    try {
      await handleDownloadCertificate(getAccessTokenSilently);
    } finally {
      setDownloadingCert(false);
    }
  };
  
  return (
    <>
      {}
      <Tooltip title="Search dataspace" enterDelay={1000}>
        <span>
          <IconButton
            type="button"
            aria-label="search dataspace"
            onClick={() => navigate('/dataspace/search')}
            sx={{
              display: { xs: 'flex', md: 'none' },
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <SearchIcon />
          </IconButton>
        </span>
      </Tooltip>
      
      {}
      {}
      
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ml: 3
      }}>
        <Box sx={{ 
          '& .MuiFormControl-root': { marginRight: '0px !important' },
          '& .MuiSelect-root': { marginRight: '0px !important' },
          '& .MuiOutlinedInput-root': { marginRight: '0px !important' }
        }}>
          <ConnectorSelector
            connectors={connectors}
            selectedConnector={selectedConnector || ''}
            setSelectedConnector={setSelectedConnector}
            setLoading={setLoading}
          />
        </Box>
        <Box className="certificate-download-container">
          <Tooltip title="Download Security Certificate">
            <Button
              variant="outlined"
              color="primary"
              size="small"
              startIcon={downloadingCert ? <CircularProgress size={16} /> : <VerifiedUserIcon />}
              endIcon={<DownloadIcon />}
              onClick={downloadCertificate}
              disabled={downloadingCert}
              sx={{
                height: '36px',
                whiteSpace: 'nowrap',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Certificate
            </Button>
          </Tooltip>
          
          {}
          <Tooltip title="Download Security Certificate">
            <IconButton
              color="primary"
              onClick={downloadCertificate}
              disabled={downloadingCert}
              sx={{
                display: { xs: 'flex', sm: 'none' }
              }}
            >
              {downloadingCert ? 
                <CircularProgress size={24} /> : 
                <VerifiedUserIcon />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

export default ToolbarActions;