import { Button, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import CreateIcon from '../../assets/button_icons/multiple.svg?react';


const CreateButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Tooltip title="Create" arrow>
      <span>
        <Button
          variant="text"
          onClick={onClick}
        >
          <CreateIcon
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

export default CreateButton;