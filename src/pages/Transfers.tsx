import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { GridColDef } from '@mui/x-data-grid';

import { handleGetTransfers } from '../services/getTransfers';
import useKeycloakToken from '../hooks/useKeycloakToken';
import useConnectors from '../hooks/useConnectors';
import Loading from '../components/utils/Loading';
import ReusableDataGrid from '../components/datagrid/ReusableDataGrid';
import NoConnectorsMessage from '../components/connector/NoConnectorsMessage';
import WithKeycloakAuthentication from '../components/auth/WithKeycloakAuthentication';
import RefreshButton from '../components/buttons/RefreshButton';
import ViewTypeButton from '../components/buttons/ViewTypeButton';
import ConnectorSelector from '../components/connector/ConnectorSelector';
import PageHeader from '../components/utils/PageHeader';

import transfer_info from '../assets/info_data/transfer_info.json';



const Transfers: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transfers, setTransferData] = useState<any[]>([]);
  const getAccessTokenSilently = useKeycloakToken();
  const [viewType, setViewType] = useState<'table' | 'card'>('table');
  const { connectors, selectedConnector, setSelectedConnector, isLoadingConnectors } =
    useConnectors();

  useEffect(() => {
    if (isLoadingConnectors) {
      setLoading(true);
      return;
    }
    if (selectedConnector) {
      fetchData();
    } else if (!isLoadingConnectors && connectors.length === 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [getAccessTokenSilently, selectedConnector, isLoadingConnectors]);

  const fetchData = async () => {
    try {
      const data = await handleGetTransfers(getAccessTokenSilently, selectedConnector, 'all'
      );
      const rowsTransfers = data.map((transfer: any, index: number) => ({
        id: index + 1,
        transferId: transfer['@id'].slice(0, 8),
        transferAssetId: transfer['assetId'].slice(0, 8),
        transferState: transfer['state'],
        transferType: transfer['type'],
        timestamp: new Date(transfer.stateTimestamp).toLocaleString(),
      }));
      setTransferData(rowsTransfers);
    } catch (err) {
      console.error('Error fetching transfers:', err);
      setError('Failed to fetch transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading || isLoadingConnectors) {
    return <Loading />;
  }
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }
  if (!isLoadingConnectors && connectors.length === 0) {
    return <NoConnectorsMessage />;
  }

  const columns: GridColDef[] = [
    { field: 'transferId', headerName: 'Transfer Id', width: 100 },
    { field: 'transferAssetId', headerName: 'Asset Id', width: 100 },
    { field: 'transferState', headerName: 'State', width: 150 },
    { field: 'transferType', headerName: 'Type', width: 120 },
    { field: 'timestamp', headerName: 'Transferred At', width: 160 },
  ];

  return (
    <Box>
      <PageHeader title='Transfers' info_json={transfer_info} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 2,
          width: '100%',
        }}
      >
        {}
        <Box sx={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          <ConnectorSelector
            connectors={connectors}
            selectedConnector={selectedConnector}
            setSelectedConnector={setSelectedConnector}
            setLoading={setLoading}
          />
          <RefreshButton onClick={handleRefresh} />
          <ViewTypeButton viewType={viewType} setViewType={setViewType} />
        </Box>
      </Box>
      <ReusableDataGrid rows={transfers} columns={columns} viewType={viewType} />
    </Box>
  );
};

export default WithKeycloakAuthentication(Transfers, {
  onRedirecting: () => <Loading />,
});
