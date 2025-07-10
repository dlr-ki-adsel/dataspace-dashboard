import { Button, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import StartIcon from '../../assets/button_icons/play.svg?react';


const StartButton: React.FC<{ onClick: () => void; selectedRows: any[] }> = ({ onClick, selectedRows }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isDisabled = selectedRows.length !== 1;

  return (
    <Tooltip title="Start" arrow>
      <span>
        <Button
          variant="text"
          onClick={onClick}
          disabled={isDisabled}
        >
          <StartIcon
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

export default StartButton;