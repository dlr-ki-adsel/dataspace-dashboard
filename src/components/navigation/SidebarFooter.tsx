import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import { type SidebarFooterProps } from '@toolpad/core/DashboardLayout';

import ThemedIcon from '../ThemedIcon';

import logoWhite from '../../assets/DLR_KI_Logo_EN_weiss.svg';
import logoBlack from '../../assets/DLR_KI_Logo_EN_schwarz.svg';




const SidebarFooter: React.FC<SidebarFooterProps> = ({ mini }: SidebarFooterProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        m: 1,
      }}
    >
      <Divider sx={{ width: '100%', mb: 1 }} />
      {mini ? (
        <Typography variant="caption" sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          © DLR
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            Powered by
          </Typography>
          <ThemedIcon
            iconForLight={logoBlack}
            iconForDark={logoWhite}
            style={{ width: '150px', height: 'auto' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default SidebarFooter;
