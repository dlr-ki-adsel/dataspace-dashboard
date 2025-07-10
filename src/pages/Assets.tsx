import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { DefaultEventsMap } from '@socket.io/component-emitter';
import { 
  Box, 
  Typography, 
  Checkbox, 
  Paper,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Fade
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home';
import RefreshIcon from '@mui/icons-material/Refresh';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
import ClearIcon from '@mui/icons-material/Clear';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import FileTypeIcon from '../components/misc/FileTypeIcon';
import CreateContractButton from '../components/buttons/UnifiedButton';
import Loading from '../components/utils/Loading';
import WithKeycloakAuthentication from '../components/auth/WithKeycloakAuthentication';
import NoConnectorsMessage from '../components/connector/NoConnectorsMessage';
import getBackendUrl from '../hooks/useBackendUrl';
import useKeycloakToken from '../hooks/useKeycloakToken';
import useConnectors from '../hooks/useConnectors';
import ViewContractsButton from '../components/buttons/ViewContractsButton';

interface FileItem {
  name: string;
  isFolder: boolean;
  path: string;
}

// FIXED: Remove fixed height and allow natural scrolling
const Container = styled(Box)(({ }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '100vh',
  backgroundColor: '#f9fafc'
}));

// FIXED: Proper sticky positioning
const TopBar = styled(Box)(({ }) => ({
  position: 'sticky',
  top: '10px', // Account for main navigation
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 16px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderBottom: '1px solid #e5e7eb'
}));

// FIXED: PathBar sticks below TopBar
const PathBar = styled(Box)(({ }) => ({
  position: 'sticky',
  top: '63px', // 64px (main nav) + 52px (TopBar)
  zIndex: 999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #e5e7eb',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
}));

// FIXED: Remove height constraints, allow natural flow
const FilesSection = styled(Box)(({ }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1
}));

const UploadArea = styled(Paper)(({ }) => ({
  margin: '16px',
  padding: '24px',
  borderRadius: '8px',
  border: '2px dashed #d1d5db',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f9fafb',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#3b82f6',
    backgroundColor: '#f0f7ff'
  }
}));

const ActiveDropArea = styled(Paper)(({ }) => ({
  margin: '16px',
  padding: '16px', // Reduced from 24px
  borderRadius: '8px',
  border: '2px dashed #3b82f6',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f0f7ff',
  transition: 'all 0.2s ease',
}));

const TableHeader = styled(TableHead)(({ }) => ({
  position: 'sticky',
  top: 0,
  backgroundColor: '#f9fafc',
  zIndex: 3,
  '& th': {
    fontWeight: 600,
    color: '#4b5563',
    borderBottom: '2px solid #e5e7eb',
    padding: '10px 16px',
    backgroundColor: '#f9fafc'
  }
}));

const FileRow = styled(TableRow)<{ isfolder: string }>(({ isfolder }) => ({
  '&:hover': {
    backgroundColor: '#f9fafb'
  },
  cursor: isfolder === 'true' ? 'pointer' : 'default',
  height: '44px',
  '& td': {
    padding: '6px 16px',
    borderBottom: '1px solid #f3f4f6'
  }
}));

const FileGridContainer = styled(Box)(({ }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
  gap: '12px',
  padding: '16px'
}));

const FileCard = styled(Paper)<{ isfolder: string }>(({ isfolder }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px',
  borderRadius: '8px',
  cursor: isfolder === 'true' ? 'pointer' : 'default',
  backgroundColor: '#fff',
  height: '120px',
  border: '1px solid #e5e7eb',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  '& .card-actions': {
    opacity: 0,
    transition: 'opacity 0.2s ease'
  },
  '&:hover .card-actions': {
    opacity: 1
  }
}));

const BreadcrumbItem = styled(Button)(({ }) => ({
  textTransform: 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  fontWeight: 500,
  minWidth: 'auto',
  color: '#4b5563'
}));

const ActionButton = styled(IconButton)(({ }) => ({
  color: '#4b5563',
  padding: '8px',
  '&:hover': {
    backgroundColor: '#f3f4f6'
  },
  margin: '0 2px'
}));

const PrimaryButton = styled(Button)(({ }) => ({
  backgroundColor: '#2563eb',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: '#1d4ed8'
  },
  height: '36px',
  borderRadius: '6px',
  boxShadow: 'none'
}));

const ActionIconButton = styled(IconButton)(({ }) => ({
  color: '#4b5563',
  '&:hover': {
    backgroundColor: 'transparent'
  }
}));

const SelectionInfo = styled(Box)(({ }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
}));

const ClearButton = styled(Button)(({ }) => ({
  textTransform: 'none',
  color: '#4b5563',
  '&:hover': {
    backgroundColor: '#f3f4f6'
  }
}));

const Assets: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [viewType, setViewType] = useState<'list' | 'grid'>('list');
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [contractsData, setContractsData] = useState({});
  // const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [, setIsCreatingFolder] = useState<boolean>(false);
  const [, setUploadProgress] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAreaRef = useRef<HTMLDivElement>(null);
  // const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState<boolean>(false);
  const [isOverUploadArea, setIsOverUploadArea] = useState<boolean>(false);
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const getAccessTokenSilently = useKeycloakToken();
  const { connectors, selectedConnector, isLoadingConnectors } = useConnectors();

  // Setup WebSocket connection
  useEffect(() => {
    const setupSocket = async () => {
      try {
        const token = await getAccessTokenSilently();
        const backendUrl = getBackendUrl();
        const newSocket = io(backendUrl, {
          path: '/socket.io',
          query: {token: `${token}`}
        });
        
        setSocket(newSocket);
      } catch (error) {
        console.error('Error setting up socket:', error);
      }
    };
    
    setupSocket();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [getAccessTokenSilently]);

  // Listen for asset updates
  useEffect(() => {
    if (socket) {
      socket.on("update_assets", () => {
        setRefreshTrigger(prev => !prev);
      });
    }

    return () => {
      if (socket) {
        socket.off("update_assets");
      }
    };
  }, [socket]);

  // Fetch files when connector changes or refresh is triggered
  useEffect(() => {
    if (isLoadingConnectors) {
      setLoading(true);
      return;
    }
    
    if (selectedConnector) {
      fetchFiles();
    } else if (!isLoadingConnectors && connectors.length === 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [refreshTrigger, selectedConnector, isLoadingConnectors, currentPath]);

  // Handle drag and drop events for the dedicated upload area
  // Replace your useEffect for drag and drop with this fixed version:

// Handle drag and drop events - simple version with two visual states
useEffect(() => {
  const handleGlobalDragEnter = (e: Event) => {
    e.preventDefault();
    const dragEvent = e as DragEvent;
    if (dragEvent.dataTransfer?.types.includes('Files')) {
      setIsDraggingFiles(true);
    }
  };

  const handleGlobalDragOver = (e: Event) => {
    e.preventDefault();
    const dragEvent = e as DragEvent;
    if (dragEvent.dataTransfer) {
      dragEvent.dataTransfer.dropEffect = 'copy';
    }
    
    // Check if we're over the upload area during dragover
    const target = dragEvent.target as Element;
    const uploadArea = target.closest('[data-upload-zone]');
    
    if (uploadArea && isDraggingFiles) {
      setIsOverUploadArea(true);
    } else if (isDraggingFiles) {
      setIsOverUploadArea(false);
    }
  };

  const handleGlobalDragLeave = (e: Event) => {
    e.preventDefault();
    const dragEvent = e as DragEvent;
    if (!dragEvent.relatedTarget) {
      setIsDraggingFiles(false);
      setIsOverUploadArea(false);
    }
  };

  const handleGlobalDrop = (e: Event) => {
    e.preventDefault();
    const dragEvent = e as DragEvent;
    setIsDraggingFiles(false);
    setIsOverUploadArea(false);
    
    const target = dragEvent.target as Element;
    const uploadArea = target.closest('[data-upload-zone]');
    
    if (uploadArea && dragEvent.dataTransfer?.files && dragEvent.dataTransfer.files.length > 0) {
      handleFilesUpload(Array.from(dragEvent.dataTransfer.files));
    }
  };

  document.addEventListener('dragenter', handleGlobalDragEnter);
  document.addEventListener('dragover', handleGlobalDragOver);
  document.addEventListener('dragleave', handleGlobalDragLeave);
  document.addEventListener('drop', handleGlobalDrop);

  return () => {
    document.removeEventListener('dragenter', handleGlobalDragEnter);
    document.removeEventListener('dragover', handleGlobalDragOver);
    document.removeEventListener('dragleave', handleGlobalDragLeave);
    document.removeEventListener('drop', handleGlobalDrop);
  };
}, [isDraggingFiles]);
// Optional: Add global drag and drop prevention to avoid browser navigation
// useEffect(() => {
//   const handleGlobalDragOver = (e: DragEvent) => {
//     e.preventDefault();
//   };
  
//   const handleGlobalDrop = (e: DragEvent) => {
//     e.preventDefault();
//   };
  
//   document.addEventListener('dragover', handleGlobalDragOver);
//   document.addEventListener('drop', handleGlobalDrop);
  
//   return () => {
//     document.removeEventListener('dragover', handleGlobalDragOver);
//     document.removeEventListener('drop', handleGlobalDrop);
//   };
// }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const backendUrl = getBackendUrl();
      const response = await fetch(
        `${backendUrl}/ui/${selectedConnector}/files?path=${encodeURIComponent(currentPath)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setContractsData(data);
      const processedFiles = processFilesAndFolders(data);
      setFiles(processedFiles);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };
  
  const processFilesAndFolders = (filePathsObj: Record<string, any[]>): FileItem[] => {
    const currentItems: FileItem[] = [];
    const prefixToRemove = currentPath ? currentPath + '/' : '';
    
    const filePaths = Object.keys(filePathsObj);
    
    filePaths.forEach((path: string) => {
      const relativePath = path.startsWith(prefixToRemove)
        ? path.substring(prefixToRemove.length)
        : path;
        
      if (currentPath && !path.startsWith(currentPath + '/')) {
        return;
      }
      
      const parts = relativePath.split('/');
      const firstSegment = parts[0];
      if (!firstSegment) return;
      
      const isFolder = parts.length > 1;
      
      if (!currentItems.some(item => item.name === firstSegment)) {
        currentItems.push({
          name: firstSegment,
          isFolder,
          path: currentPath ? `${currentPath}/${firstSegment}` : firstSegment
        });
      }
    });
    
    return currentItems.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
  };

  const handleToggle = (item: FileItem): void => {
    if (item.isFolder) {
      return;
    }
    
    const currentIndex = selectedItems.findIndex(
      selectedItem => selectedItem.path === item.path
    );
    const newSelectedItems = [...selectedItems];
    
    if (currentIndex === -1) {
      newSelectedItems.push(item);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }
    
    setSelectedItems(newSelectedItems);
  };
  
  const handleClearSelections = (): void => {
    setSelectedItems([]);
  };
  
  const handleFolderClick = (folderPath: string): void => {
    setCurrentPath(folderPath);
  };

  const getBreadcrumbs = (): Array<{text: string, path: string}> => {
    if (!currentPath) {
      return [{ text: 'Root', path: '' }];
    }
    
    const parts = currentPath.split('/');
    return [
      { text: 'Root', path: '' },
      ...parts.map((part, index) => ({
        text: part,
        path: parts.slice(0, index + 1).join('/')
      }))
    ];
  };
  
  const handleRefresh = (): void => {
    setRefreshTrigger(prev => !prev);
  };
  
  const handleViewTypeToggle = (): void => {
    setViewType(prev => prev === 'list' ? 'grid' : 'list');
  };

  const handleContractSuccess = (): void => {
    setNotification({
      open: true,
      message: 'Contract created successfully!',
      severity: 'success'
    });
    setSelectedItems([]);
  };

  const handleNotificationClose = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files?.length) {
      try {
        setUploadProgress(true);
        await uploadFiles(Array.from(files));
      } finally {
        setUploadProgress(false);
      }
    }
  };

  const handleFilesUpload = async (files: File[]) => {
    try {
      setUploadProgress(true);
      await uploadFiles(files);
    } finally {
      setUploadProgress(false);
    }
  };

  const uploadFiles = async (files: File[]) => {
    try {
      const token = await getAccessTokenSilently();
      const backendUrl = getBackendUrl();
      
      const formData = new FormData();
      formData.append('folder', currentPath);
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await fetch(
        `${backendUrl}/ui/${selectedConnector}/files/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to upload files: ${response.statusText}`);
      }
      
      setNotification({
        open: true,
        message: `${files.length} file${files.length !== 1 ? 's' : ''} uploaded successfully`,
        severity: 'success'
      });
      
      fetchFiles();
    } catch (err) {
      console.error('Error uploading files:', err);
      setNotification({
        open: true,
        message: `Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleCreateFolder = async () => {
    try {
      setIsCreatingFolder(true);
      const folderName = prompt("Enter folder name:");
      if (!folderName) {
        setIsCreatingFolder(false);
        return;
      }
      
      const token = await getAccessTokenSilently();
      const backendUrl = getBackendUrl();
      
      const formData = new FormData();
      const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      formData.append('path', newPath);
      
      const response = await fetch(
        `${backendUrl}/storage/create-folder`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to create folder: ${response.statusText}`);
      }
      
      setNotification({
        open: true,
        message: 'Folder created successfully',
        severity: 'success'
      });
      
      fetchFiles();
    } catch (err) {
      console.error('Error creating folder:', err);
      setNotification({
        open: true,
        message: `Failed to create folder: ${err instanceof Error ? err.message : 'Unknown error'}`,
        severity: 'error'
      });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderPath: string) => {
    if (!confirm("Are you sure you want to delete this folder and all its contents?")) return;
    
    try {
      const token = await getAccessTokenSilently();
      const backendUrl = getBackendUrl();
      
      const response = await fetch(
        `${backendUrl}/storage/delete-folder?folder=${encodeURIComponent(folderPath)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to delete folder: ${response.statusText}`);
      }
      
      setNotification({
        open: true,
        message: 'Folder deleted successfully',
        severity: 'success'
      });
      
      fetchFiles();
    } catch (err) {
      console.error('Error deleting folder:', err);
      setNotification({
        open: true,
        message: `Failed to delete folder: ${err instanceof Error ? err.message : 'Unknown error'}`,
        severity: 'error'
      });
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
  
    try {
      const token = await getAccessTokenSilently();
      const backendUrl = getBackendUrl();
  
      const response = await fetch(
        `${backendUrl}/ui/${selectedConnector}/files/delete`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filenames: [filePath]
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }
  
      setNotification({
        open: true,
        message: 'File deleted successfully',
        severity: 'success'
      });
  
      fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      setNotification({
        open: true,
        message: `Failed to delete file: ${err instanceof Error ? err.message : 'Unknown error'}`,
        severity: 'error'
      });
    }
  };
  
  const handleDownloadFile = async (filePath: string) => {
    try {
      const token = await getAccessTokenSilently();
      const backendUrl = getBackendUrl();
  
      const response = await fetch(
        `${backendUrl}/ui/${selectedConnector}/files/download`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filenames: [filePath]
          })
        }
      );
  
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }
  
      const blob = await response.blob();
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'files.zip';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      setNotification({
        open: true,
        message: `Failed to download file: ${err instanceof Error ? err.message : 'Unknown error'}`,
        severity: 'error'
      });
    }
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
  
  return (
    <Container>
      <TopBar>
        <Typography variant="h6" fontWeight={600}>Assets</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ActionButton onClick={handleRefresh} size="small">
            <RefreshIcon fontSize="small" />
          </ActionButton>
          
          <ActionButton onClick={handleViewTypeToggle} size="small">
            {viewType === 'list' ? <GridViewIcon fontSize="small" /> : <ViewListIcon fontSize="small" />}
          </ActionButton>
          
          {}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            multiple
          />
          
          <CreateContractButton 
            selectedItems={selectedItems}
            selectedConnector={selectedConnector}
            getAccessTokenSilently={getAccessTokenSilently}
            onSuccess={handleContractSuccess}
          />
        </Box>
      </TopBar>

      <PathBar>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 1, color: '#6b7280' }} />
          {getBreadcrumbs().map((crumb, index) => (
            <React.Fragment key={crumb.path}>
              {index > 0 && (
                <ChevronRightIcon fontSize="small" sx={{ color: '#9ca3af', mx: 0.5 }} />
              )}
              <BreadcrumbItem
                variant="text"
                onClick={() => setCurrentPath(crumb.path)}
                sx={{
                  fontWeight: index === getBreadcrumbs().length - 1 ? 600 : 500,
                  color: index === getBreadcrumbs().length - 1 ? '#1f2937' : '#4b5563'
                }}
              >
                {crumb.text}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </Box>
        
        <SelectionInfo>
          {selectedItems.length > 0 && (
            <ClearButton
              size="small"
              startIcon={<ClearIcon fontSize="small" />}
              onClick={handleClearSelections}
            >
              Clear selection
            </ClearButton>
          )}
          <Typography variant="body2" color="text.secondary">
            {selectedItems.length === 0 
              ? "No items selected" 
              : `${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''} selected`}
          </Typography>
        </SelectionInfo>
      </PathBar>

      <FilesSection>
        {}
        {isDraggingFiles ? (
          isOverUploadArea ? (
            <ActiveDropArea ref={uploadAreaRef} data-upload-zone>
              <CloudUploadIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#3b82f6', fontWeight: 600, mb: 1 }}>
                Drop files to upload
              </Typography>
              <Typography variant="body2" sx={{ color: '#4b5563' }}>
                Files will be uploaded to {currentPath || 'root folder'}
              </Typography>
            </ActiveDropArea>
          ) : (
            <Box ref={uploadAreaRef} data-upload-zone sx={{ 
              margin: '16px',
              padding: '24px',
              borderRadius: '8px',
              border: '2px dashed #94a3b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f8fafc',
              transition: 'all 0.2s ease'
            }}>
              <CloudUploadIcon sx={{ fontSize: 36, color: '#64748b', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600, mb: 1 }}>
                Drag files here to upload
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Files detected - drop here to upload
              </Typography>
            </Box>
          )
        ) : (
          <UploadArea ref={uploadAreaRef} onClick={handleButtonClick} data-upload-zone>
            <CloudUploadIcon sx={{ fontSize: 36, color: '#6b7280', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#4b5563', fontWeight: 600, mb: 1 }}>
              Drag & Drop Files Here
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, textAlign: 'center' }}>
              or click to browse your files
            </Typography>
            <PrimaryButton
              size="small"
              startIcon={<FileUploadIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick();
              }}
              sx={{ mt: 1 }}
            >
              Select Files
            </PrimaryButton>
          </UploadArea>
        )}

        {}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px'
          }}>
            <RefreshIcon sx={{ fontSize: 40, color: '#3b82f6', animation: 'spin 2s linear infinite' }} />
          </Box>
        ) : files.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px',
            color: '#6b7280',
            padding: '48px 16px'
          }}>
            <FolderIcon sx={{ fontSize: 60, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>This folder is empty</Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>Upload files or create a new folder to get started</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined"
                startIcon={<CreateNewFolderIcon />}
                onClick={handleCreateFolder}
                sx={{ 
                  textTransform: 'none',
                  borderColor: '#d1d5db',
                  color: '#4b5563'
                }}
              >
                New Folder
              </Button>
              <PrimaryButton
                startIcon={<FileUploadIcon />}
                onClick={handleButtonClick}
              >
                Upload Files
              </PrimaryButton>
            </Box>
          </Box>
        ) : viewType === 'list' ? (
          <Box sx={{ margin: '16px' }}>
            <TableContainer>
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHeader>
                  <TableRow>
                    <TableCell padding="checkbox" width="40px"></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell width="120px" align="right">Actions</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((item) => (
                    <FileRow 
                      key={item.path}
                      onClick={item.isFolder ? () => handleFolderClick(item.path) : undefined}
                      isfolder={item.isFolder.toString()}
                      hover
                    >
                      <TableCell padding="checkbox">
                        {!item.isFolder && (
                          <Checkbox
                            checked={selectedItems.some(
                              selectedItem => selectedItem.path === item.path
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggle(item);
                            }}
                            size="small"
                            sx={{ color: '#9ca3af', padding: '0' }}
                          />
                        )}
                      </TableCell>
                      <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.isFolder ? (
                            <FolderIcon sx={{ mr: 1.5, color: '#3b82f6', fontSize: '1.2rem' }} />
                          ) : (
                            <FileTypeIcon 
                              fileName={item.name}
                              IconProps={{ sx: { mr: 1.5, fontSize: '1.2rem' } }}
                            />
                          )}
                          <Typography variant="body2" noWrap>
                            {item.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          {!item.isFolder && (
                            <ActionIconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              sx={{ padding: '4px' }}
                            >
                              <ViewContractsButton
                                assetPath={item.path}
                                contractsData={contractsData}
                                getAccessTokenSilently={getAccessTokenSilently}
                                selectedConnector={selectedConnector}
                              />
                            </ActionIconButton>
                          )}
                          
                          {!item.isFolder && (
                            <ActionIconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadFile(item.path);
                              }}
                              sx={{ padding: '4px' }}
                            >
                              <DownloadIcon fontSize="small" />
                            </ActionIconButton>
                          )}
                          
                          {!item.isFolder && (
                            <ActionIconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(item.path);
                              }}
                              sx={{ padding: '4px', color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </ActionIconButton>
                          )}
                        </Box>
                      </TableCell>
                    </FileRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ) : (
          <FileGridContainer>
            {files.map((item) => (
              <FileCard
                key={item.path}
                onClick={item.isFolder ? () => handleFolderClick(item.path) : undefined}
                isfolder={item.isFolder.toString()}
                elevation={0}
              >
                {!item.isFolder && (
                  <Box sx={{ position: 'absolute', top: 4, left: 4 }}>
                    <Checkbox
                      checked={selectedItems.some(
                        selectedItem => selectedItem.path === item.path
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggle(item);
                      }}
                      size="small"
                      sx={{ color: '#9ca3af', padding: 0 }}
                    />
                  </Box>
                )}
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  height: 50,
                  mb: 1
                }}>
                  {item.isFolder ? (
                    <FolderIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                  ) : (
                    <FileTypeIcon 
                      fileName={item.name}
                      IconProps={{ sx: { fontSize: 40 } }}
                    />
                  )}
                </Box>
                
                <Typography
                  variant="body2"
                  align="center"
                  noWrap
                  sx={{
                    width: '100%',
                    fontWeight: 500,
                    px: 1
                  }}
                >
                  {item.name}
                </Typography>
                
                <Box 
                  className="card-actions"
                  sx={{ 
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: '#f9fafb',
                    py: 0.5,
                    borderTop: '1px solid #e5e7eb',
                    borderBottomLeftRadius: '7px',
                    borderBottomRightRadius: '7px',
                    gap: 1
                  }}
                >
                  {!item.isFolder && (
                    <ActionIconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      sx={{ padding: '3px' }}
                    >
                      <ViewContractsButton
                        assetPath={item.path}
                        contractsData={contractsData}
                        getAccessTokenSilently={getAccessTokenSilently}
                        selectedConnector={selectedConnector}
                        isGridView={true}
                      />
                    </ActionIconButton>
                  )}
                  
                  {!item.isFolder && (
                    <ActionIconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadFile(item.path);
                      }}
                      sx={{ padding: '3px' }}
                    >
                      <DownloadIcon fontSize="small" />
                    </ActionIconButton>
                  )}
                  
                  <ActionIconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.isFolder) {
                        handleDeleteFolder(item.path);
                      } else {
                        handleDeleteFile(item.path);
                      }
                    }}
                    sx={{ padding: '3px', color: '#ef4444' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </ActionIconButton>
                </Box>
              </FileCard>
            ))}
          </FileGridContainer>
        )}
      </FilesSection>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={5000} 
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleNotificationClose} 
          severity={notification.severity}
          variant="filled"
          sx={{ 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            fontWeight: 500
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WithKeycloakAuthentication(Assets, {
  onRedirecting: () => <Loading />,
});