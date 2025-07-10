import React from 'react';
import { Button, Tooltip, useTheme } from '@mui/material';

import GridIcon from '../../assets/button_icons/apps.svg?react';
import ListIcon from '../../assets/button_icons/table-list.svg?react';

interface ViewTypeButtonProps {
  viewType: 'table' | 'card';
  setViewType: React.Dispatch<React.SetStateAction<'table' | 'card'>>;
}

const ViewTypeButton: React.FC<ViewTypeButtonProps> = ({ viewType, setViewType }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const Icon = viewType === 'table' ? GridIcon : ListIcon;

  const toggleViewType = () => {
    setViewType((prev) => (prev === 'table' ? 'card' : 'table'));
  };

  return (
    <Tooltip title={viewType === 'table' ? 'Change to grid view' : 'Change to list view'} arrow>
      <span>
        <Button variant="text" onClick={toggleViewType}>
          <Icon
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

export default ViewTypeButton;