import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectorState {
  connectors: string[];
  selectedConnector: string;
  isLoadingConnectors: boolean;
  connectorStatusCounts: Record<string, number>;
}

// Load the saved connector from localStorage
const savedConnector = localStorage.getItem('selectedConnector');

const initialState: ConnectorState = {
  connectors: [],
  // Use saved connector from localStorage if available, otherwise empty string
  selectedConnector: savedConnector || '',
  isLoadingConnectors: true,
  connectorStatusCounts: {},
};

const connectorSlice = createSlice({
  name: 'connector',
  initialState,
  reducers: {
    setConnectors: (state, action: PayloadAction<string[]>) => {
      state.connectors = action.payload;
      // Only set default if no connector is selected (including from localStorage)
      if (action.payload.length > 0) {
        if (!state.selectedConnector || !action.payload.includes(state.selectedConnector)) {
          state.selectedConnector = action.payload[0];
          // Save to localStorage
          localStorage.setItem('selectedConnector', action.payload[0]);
        }
      }
    },
    setSelectedConnector: (state, action: PayloadAction<string>) => {
      state.selectedConnector = action.payload;
      // Save to localStorage whenever it changes
      localStorage.setItem('selectedConnector', action.payload);
    },
    setLoadingConnectors: (state, action: PayloadAction<boolean>) => {
      state.isLoadingConnectors = action.payload;
    },
    setConnectorStatusCounts: (state, action: PayloadAction<Record<string, number>>) => {
      state.connectorStatusCounts = action.payload;
    },
  },
});

export const {
  setConnectors,
  setSelectedConnector,
  setLoadingConnectors,
  setConnectorStatusCounts,
} = connectorSlice.actions;

export default connectorSlice.reducer;