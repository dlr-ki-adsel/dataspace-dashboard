import { Button, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import RefreshIcon from '../../assets/button_icons/refresh.svg?react';


const RefreshButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Tooltip title="Refresh" arrow>
      <span>
        <Button
          variant="text"
          onClick={onClick}
        >
          <RefreshIcon
            width={24}
            height={24}
            style={{
              fill: isDarkMode ? theme.palette.primary.light : theme.palette.primary.dark,
            }}
          />
        </Button>
      </span>
    </Tooltip>
  );
};

export default RefreshButton;
