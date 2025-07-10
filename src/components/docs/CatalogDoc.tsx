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
  Chip,
  TextField,
  InputAdornment,
  Stack
} from '@mui/material';
import { 
  MenuBook as MenuBookIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  NetworkCheck as NetworkCheckIcon,
  DataObject as DataObjectIcon,
  ArrowForward as ArrowForwardIcon,
  FileDownload as FileDownloadIcon,
  Visibility as VisibilityIcon,
  BookmarkAdd as BookmarkAddIcon,
  Category as CategoryIcon,
  CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';

const CatalogDoc: React.FC = () => {
  const theme = useTheme();
  
  // Mock search field for demonstration
  const searchField = (
    <TextField
      fullWidth
      placeholder="Search the catalog..."
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <FilterListIcon />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );

  // Sample asset types with colors
  const assetTypes = [
    { name: 'CSV Dataset', color: '#4CAF50' },
    { name: 'JSON Data', color: '#FF9800' },
    { name: 'Images', color: '#2196F3' },
    { name: 'Documents', color: '#9C27B0' },
    // { name: 'Time Series', color: '#F44336' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <MenuBookIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h2" fontWeight="medium" color="primary.main">
          Federated Catalog
        </Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
        Discover and access data assets across the entire dataspace
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Federated Catalog serves as a marketplace for all available data assets within the DLR Dataspace. 
        As a federated system, it allows you to browse and search for assets not only from your organization 
        but from all participating organizations that have shared assets with the dataspace.
      </Typography>
      
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
          <NetworkCheckIcon sx={{ mr: 1 }} /> Understanding the Federated Catalog
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          The Federated Catalog is a core component of the DLR Dataspace that aggregates asset information from all participating connectors:
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Comprehensive view" 
              secondary="See all available assets from every participant who has made offers" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Real-time updates" 
              secondary="The catalog continuously updates as new offers are created or existing ones are modified" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Policy-aware browsing" 
              secondary="Only see assets that your organization has permission to access based on policies" 
            />
          </ListItem>
        </List>
      </Paper>
      
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
              <SearchIcon sx={{ mr: 1 }} /> Search Functionality
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {searchField}
            
            <Typography variant="body1" paragraph>
              The powerful search functionality helps you find exactly what you need:
            </Typography>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Keyword search" 
                  secondary="Search asset names, descriptions, and metadata" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Provider filtering" 
                  secondary="Find assets from specific organizations or connectors" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Type filtering" 
                  secondary="Filter by file types, formats, or categories" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Advanced filters" 
                  secondary="Filter by date added, size, and other attributes" 
                />
              </ListItem>
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
              <DataObjectIcon sx={{ mr: 1 }} /> Asset Browsing
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              The catalog presents assets in an easy-to-browse format with rich metadata:
            </Typography>
            <List sx={{ pl: 2 }}>
              {}
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Preview options" 
                  secondary="Quick preview of compatible file types" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Detailed view" 
                  secondary="Click on any asset to see complete metadata and usage terms" 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, fontWeight: 'medium' }}>
        Available Asset Types
      </Typography>
      
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap gap={1}>
          {assetTypes.map((type, index) => (
            <Chip 
              key={index}
              label={type.name}
              sx={{ 
                bgcolor: `${type.color}20`, 
                color: type.color,
                border: `1px solid ${type.color}`,
                fontWeight: 'medium'
              }}
            />
          ))}
          <Chip 
            label="More..." 
            variant="outlined" 
            sx={{ fontWeight: 'medium' }}
          />
        </Stack>
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
          <CategoryIcon sx={{ mr: 1 }} /> Asset Information
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          Each asset in the catalog displays essential information to help you evaluate its relevance:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Asset name and description" 
                  secondary="Clear identification of what the asset contains" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Provider information" 
                  secondary="Organization that owns and offers the asset" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="File type and size" 
                  secondary="Format and storage requirements" 
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
                  primary="Created/updated dates" 
                  secondary="Timeline information for version tracking" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Associated policy" 
                  secondary="Usage restrictions and access conditions" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Additional metadata" 
                  secondary="Custom tags and categorization" 
                />
              </ListItem>
            </List>
          </Grid>
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
          <CompareArrowsIcon sx={{ mr: 1 }} /> Asset Actions
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          From the catalog, you can take several actions with available assets:
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VisibilityIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">View Details</Typography>
              </Box>
              <Typography variant="body2">
                Examine complete metadata, preview contents when available, and read full descriptions before deciding to request access.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BookmarkAddIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">Request Access</Typography>
              </Box>
              <Typography variant="body2">
                Initiate the agreement process to gain access to assets by accepting the associated policy terms and conditions.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper', height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FileDownloadIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">Download/Access</Typography>
              </Box>
              <Typography variant="body2">
                Once agreements are in place, download or directly access approved assets through your connector.
              </Typography>
            </Paper>
          </Grid>
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
          <FilterListIcon sx={{ mr: 1 }} /> Advanced Filtering (Coming soon)
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          The catalog offers sophisticated filtering capabilities to help you find relevant assets:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Organization filters" 
                  secondary="Find assets from specific data providers" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Date filters" 
                  secondary="Filter by creation or last updated date" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Size filters" 
                  secondary="Find assets within specific size ranges" 
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
                  primary="Type filters" 
                  secondary="Filter by file format or data type" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Policy filters" 
                  secondary="Find assets with specific usage conditions" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Custom metadata filters" 
                  secondary="Search by custom tags and categories" 
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
          The Federated Catalog is constantly evolving as new assets are added. Check back regularly or set up 
          notifications to stay informed about new data that might be relevant to your projects. In the future, 
          semantic search capabilities will be added to help you find assets based on content similarity and 
          usage patterns, making discovery even more powerful.
        </Typography>
      </Box>
    </Box>
  );
};

export default CatalogDoc;