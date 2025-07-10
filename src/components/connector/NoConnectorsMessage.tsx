import React from 'react';
import { Box } from '@mui/material';
interface NoConnectorsMessageProps {
  title?: string;
  message?: string;
}
const NoConnectorsMessage: React.FC<NoConnectorsMessageProps> = ({
  title = 'Assets',
  message = 'No active connectors found. Please click on the Connectors tab to set up a connector.',
}) => {
  return (
    <Box>
      <h1>{title}</h1>
      <p style={{ color: 'orange' }}>{message}</p>
    </Box>
  );
};
export default NoConnectorsMessage;
