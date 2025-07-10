import { Button, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import StopIcon from '../../assets/button_icons/stop.svg?react';


const StopButton: React.FC<{ onClick: () => void; selectedRows: any[] }> = ({ onClick, selectedRows }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isDisabled = selectedRows.length !== 1;

  return (
    <Tooltip title="Stop" arrow>
      <span>
        <Button
          variant="text"
          onClick={onClick}
          disabled={isDisabled}
        >
          <StopIcon
            width={24}
            height={24}
            style={{
              fill: isDisabled ? theme.palette.grey[500] : (isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark),
            }}
          />
        </Button>
      </span>

    </Tooltip>
  );
};

export default StopButton;