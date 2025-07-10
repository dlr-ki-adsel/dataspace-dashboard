import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  useTheme,
  Stack,
  Button,
  Chip
} from '@mui/material';
import { 
  Folder as FolderIcon,
  ArrowForward as ArrowForwardIcon,
  CloudUpload as CloudUploadIcon,
  CreateNewFolder as CreateNewFolderIcon,
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  History as HistoryIcon,
  AddCircle as AddCircleIcon,
  GppGood as GppGoodIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

import { HandshakeIcon } from 'lucide-react';

const AssetsDoc: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <FolderIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h2" fontWeight="medium" color="primary.main">
          Your Assets
        </Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
        Manage, organize, and share your data assets
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Your Assets page is your personal data management workspace within the DLR Dataspace. 
        Here you can view all assets from your connected storage systems, organize them, 
        create offerings, and monitor how your shared assets are being used across the dataspace.
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
              <StorageIcon sx={{ mr: 1 }} /> Asset Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              Your Assets provides a comprehensive view of your storage resources:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Files and folders" 
                  secondary="Browse your complete storage hierarchy" 
                />
              </ListItem>
              {}
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Sharing status indicators" 
                  secondary="See which assets are currently shared with other participants" 
                />
              </ListItem>
              {}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              height: '100%',
              background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
              border: `1px solid ${theme.palette.grey[200]}`,
              borderRadius: 2
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
              <AddCircleIcon sx={{ mr: 1 }} /> Creating an Offer
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Button 
                variant="contained" 
                color="success" 
                startIcon={<HandshakeIcon />}
                size="small"
                sx={{ fontWeight: 'medium' }}
              >
                Create Offer
              </Button>
            </Box>
            <Typography variant="body1" paragraph>
              Making your assets available to other dataspace participants is easy:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Select assets" 
                  secondary="Choose one or multiple files to share" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Click 'Create Offer'" 
                  secondary="The highlighted green button in the top right" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Choose a policy" 
                  secondary="Select from predefined policies or create a custom one" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Submit the offer" 
                  secondary="Your assets will appear in the Federated Catalog for eligible participants" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'medium' }}>
        File Management Features
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CloudUploadIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">File Upload</Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Upload files directly to your storage:
            </Typography>
            <List dense disablePadding sx={{ pl: 1 }}>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Click 'Upload' button" />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Select files from your device" />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Or drag and drop files directly" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CreateNewFolderIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">Folder Management</Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Organize your assets efficiently:
            </Typography>
            <List dense disablePadding sx={{ pl: 1 }}>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Create new folders" />
              </ListItem>
              {}
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Navigate through your storage hierarchy" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {}
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <FileDownloadIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">Download Assets</Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Access your stored files easily:
            </Typography>
            <List dense disablePadding sx={{ pl: 1 }}>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Download your own assets" />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Access assets obtained from other participants" />
              </ListItem>
              {}
            </List>
          </Paper>
        </Grid>
        
        {}
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <DeleteIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
              <Typography variant="subtitle1" fontWeight="medium">Delete Assets</Typography>
            </Box>
            <Typography variant="body2" paragraph>
              Manage your storage space:
            </Typography>
            <List dense disablePadding sx={{ pl: 1 }}>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Delete unused files" />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Confirmation required for deletion" />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <ArrowForwardIcon color="error" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Warning: Deleting shared assets revokes access for other participants" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} /> Offer History
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          Keep track of all asset sharing activities:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="View past offers" 
                  secondary="See all previously shared assets and their status" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Track agreements" 
                  secondary="Monitor which organizations have access to your assets" 
                />
              </ListItem>
            </List>
          </Grid>
          {}
        </Grid>
      </Paper>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          border: `1px solid ${theme.palette.grey[200]}`,
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
          <GppGoodIcon sx={{ mr: 1 }} /> Policies & Permissions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          Control who can access your assets and under what conditions:
        </Typography>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1} sx={{ mb: 2 }}>
          <Chip 
            label="Group-based access" 
            sx={{ bgcolor: `${theme.palette.primary.main}20`, fontWeight: 'medium' }}
          />
          <Chip 
            label="Time-limited access" 
            sx={{ bgcolor: `${theme.palette.secondary.main}20`, fontWeight: 'medium' }}
          />
          <Chip 
            label="Usage restrictions" 
            sx={{ bgcolor: `${theme.palette.error.main}20`, fontWeight: 'medium' }}
          />
          <Chip 
            label="Custom policies" 
            sx={{ bgcolor: `${theme.palette.warning.main}20`, fontWeight: 'medium' }}
          />
        </Stack>
        
        <Typography variant="body1" paragraph>
          The DLR Dataspace offers flexible policy options when sharing your assets:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Predefined policies" 
                  secondary="Select from ready-made access templates" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Group-based policies" 
                  secondary="Share with specific groups of dataspace participants" 
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Custom policy creation" 
                  secondary="Define advanced rules for asset access and usage" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Time-based restrictions" 
                  secondary="Set expiration dates for asset access" 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ 
        p: 3, 
        bgcolor: 'primary.light', 
        color: 'primary.contrastText',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" gutterBottom fontWeight="medium">
          Pro Tip
        </Typography>
        <Typography variant="body1">
          Think of the Your Assets page as your personal data management hub. When preparing to share assets, 
          consider organizing them into logical folders first, and applying descriptive names before creating offers. 
          This makes your assets more discoverable and easier for other participants to understand their purpose and contents.
          In a future update, you'll be able to add rich metadata to assets, enhancing their discoverability in the marketplace.
        </Typography>
      </Box>
    </Box>
  );
};

export default AssetsDoc;