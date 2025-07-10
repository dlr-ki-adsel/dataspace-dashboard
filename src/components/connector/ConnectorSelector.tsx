// Update your ConnectorSelector component 
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, styled } from "@mui/material";

// Create a more compact version of the selector
const CompactFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 160, // Reduce the minimum width
  marginRight: theme.spacing(8), // Add margin directly to the component
}));

interface ConnectorSelectorProps {
  connectors: string[];
  selectedConnector: string;
  setSelectedConnector: (connector: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConnectorSelector: React.FC<ConnectorSelectorProps> = ({ 
  connectors, 
  selectedConnector, 
  setSelectedConnector, 
  setLoading 
}) => {
  const handleConnectorChange = (event: SelectChangeEvent) => {
    setSelectedConnector(event.target.value as string);
    setLoading(true);
  };

  return (
    <CompactFormControl size="small">
      <InputLabel id="connector-select-label">Active Connector</InputLabel>
      <Select
        labelId="connector-select-label"
        value={selectedConnector}
        onChange={handleConnectorChange}
        label="Active Connector"
        size="small"
      >
        {connectors.map((connectorName: any) => (
          <MenuItem key={connectorName} value={connectorName}>
            {connectorName}
          </MenuItem>
        ))}
      </Select>
    </CompactFormControl>
  );
}

export default ConnectorSelector;