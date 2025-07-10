import { Button, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import InfoIcon from '../../assets/button_icons/comment-info.svg?react';


const InfoDrawerButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Tooltip title="Info" arrow>
      <span>
        <Button
          variant="text"
          onClick={onClick}
          sx={{
            width: '20px',
            height: '20px',
            padding: 0,
            minWidth: 0,
            textAlign: 'center',
          }}
        >
          <InfoIcon
            width={20}
            height={20}
            style={{
              fill: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          />
        </Button>
      </span>
    </Tooltip>
  );
};

export default InfoDrawerButton;