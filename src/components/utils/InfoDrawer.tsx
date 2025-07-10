import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import ReactMarkdown from 'react-markdown';

import InfoDrawerButton from '../buttons/InfoDrawerButton';




interface InfoDrawerProps {
  title: string;
  body: string;
  onOpen?: () => void;
  onClose?: () => void;
}


const InfoDrawer: React.FC<InfoDrawerProps> = ({ title, body, onOpen, onClose }) => {

  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
    if (open) {
      onOpen?.(); // Call onOpen only if provided
    } else {
      onClose?.(); // Call onClose only if provided
    }
  };


  return (
    <div>
      <InfoDrawerButton onClick={toggleDrawer(true)} />
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            mt: '64px',
            height: 'calc(100% - 64px)'
          }
        }}
      >
        <Box
          sx={{ width: 300, p: 2 }}
          role="presentation"
        >
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" component="div">
            <ReactMarkdown>{body}</ReactMarkdown>
          </Typography>
        </Box>
      </Drawer>
    </div>
  );
};

export default InfoDrawer;