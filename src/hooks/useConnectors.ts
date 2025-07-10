import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetConnectorList } from '../services/getConnectorList';
import useKeycloakToken from './useKeycloakToken';
import { 
  setConnectors, 
  setLoadingConnectors, 
  setConnectorStatusCounts,
  setSelectedConnector 
} from '../store/connectorSlice';
import type { RootState } from '../store/store';

const useConnectors = () => {
  const dispatch = useDispatch();
  const getAccessTokenSilently = useKeycloakToken();
  
  const connectors = useSelector((state: RootState) => state.connector.connectors);
  const selectedConnector = useSelector((state: RootState) => state.connector.selectedConnector);
  const isLoadingConnectors = useSelector((state: RootState) => state.connector.isLoadingConnectors);
  const connectorStatusCounts = useSelector((state: RootState) => state.connector.connectorStatusCounts);

  useEffect(() => {
    const fetchConnectors = async () => {
      dispatch(setLoadingConnectors(true));
      try {
        const connectorData = await handleGetConnectorList(getAccessTokenSilently);

        const statusCounts: Record<string, number> = {};
        Object.values(connectorData).forEach((connector: any) => {
          const status = connector.status;
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        dispatch(setConnectorStatusCounts(statusCounts));
        const runningConnectors = Object.fromEntries(
          Object.entries(connectorData).filter(
            ([, value]: [string, any]) => value.status === 'RUNNING',
          ),
        );
        const connectorNames = Object.keys(runningConnectors);

        dispatch(setConnectors(connectorNames));
      } catch (error) {
        console.error('Error loading connectors:', error);
      } finally {
        dispatch(setLoadingConnectors(false));
      }
    };

    fetchConnectors();
  }, [dispatch, getAccessTokenSilently]);

  return {
    connectors,
    selectedConnector,
    setSelectedConnector: (connector: string) => dispatch(setSelectedConnector(connector)),
    isLoadingConnectors,
    connectorStatusCounts,
  };
};

export default useConnectors;