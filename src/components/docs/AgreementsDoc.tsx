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
  Stepper,
  Step,
  StepLabel,
  Chip,
  Button
} from '@mui/material';
import { 
  Handshake as HandshakeIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  HourglassTop as HourglassTopIcon,
  Search as SearchIcon,
  Repeat as RepeatIcon,
  Send as SendIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

const AgreementsDoc: React.FC = () => {
  const theme = useTheme();
  
  // Agreement status chips
  const statusChips = [
    { label: 'Transferred', color: theme.palette.success.main, icon: <CheckCircleIcon fontSize="small" /> },
    { label: 'Pending Transfer', color: theme.palette.warning.main, icon: <HourglassTopIcon fontSize="small" /> }
  ];
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <HandshakeIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h2" fontWeight="medium" color="primary.main">
          Agreements
        </Typography>
      </Box>
      
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
        Manage active agreements and initiate data transfers
      </Typography>
      
      <Typography variant="body1" paragraph>
        The Agreement Dashboard displays all finalized agreements within the DLR Dataspace and allows you to 
        manage data transfers. This is where you can view your active agreements, track transfer status, 
        and initiate new transfers or re-transfers for existing agreements.
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
          <InfoIcon sx={{ mr: 1 }} /> Dashboard Overview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          The Agreement Dashboard provides a comprehensive view of your agreements:
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Card-based layout" 
              secondary="Each agreement displayed as an individual card with key information" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Status indicators" 
              secondary="Visual status headers showing transfer state with color coding" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Transfer actions" 
              secondary="Direct buttons to initiate transfers or re-transfers" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Detailed information" 
              secondary="Access comprehensive agreement details through dialog windows" 
            />
          </ListItem>
        </List>
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
          <FilterListIcon sx={{ mr: 1 }} /> Filtering and Search
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          The dashboard includes multiple filtering options to help you find specific agreements:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SearchIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Search functionality" 
                  secondary="Search by asset ID, provider, consumer, or agreement ID" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <HistoryIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Time period filter" 
                  secondary="View agreements from last 24 hours, week, month, or all time" 
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <NotificationsIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Status filter" 
                  secondary="Filter by transfer status: all, transferred, or pending" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Statistics overview" 
                  secondary="View total agreements, transferred count, and pending count" 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
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
              <NotificationsIcon sx={{ mr: 1 }} /> Transfer Status
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              Agreements can have different transfer statuses:
            </Typography>
            
            <Stack spacing={1.5}>
              {statusChips.map((status, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    icon={status.icon}
                    label={status.label} 
                    sx={{ 
                      bgcolor: `${status.color}20`,
                      color: status.color,
                      fontWeight: 'medium',
                      minWidth: 120
                    }}
                  />
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    {index === 0 && "Data transfer has been completed successfully"}
                    {index === 1 && "Agreement exists but no transfer has been initiated"}
                  </Typography>
                </Box>
              ))}
            </Stack>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                startIcon={<SendIcon />}
                sx={{ fontWeight: 'medium' }}
              >
                Transfer
              </Button>
              <Button 
                variant="contained" 
                color="warning" 
                size="small"
                startIcon={<RepeatIcon />}
                sx={{ fontWeight: 'medium' }}
              >
                Re-transfer
              </Button>
            </Box>
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
              <DescriptionIcon sx={{ mr: 1 }} /> Transfer Process
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              The transfer workflow follows these steps:
            </Typography>
            
            <Stepper orientation="vertical" sx={{ mb: 2 }}>
              <Step active completed>
                <StepLabel>Select agreement from dashboard</StepLabel>
              </Step>
              <Step active completed>
                <StepLabel>Click Transfer or Re-transfer button</StepLabel>
              </Step>
              <Step active completed>
                <StepLabel>Confirm transfer in dialog</StepLabel>
              </Step>
              <Step active completed>
                <StepLabel>Transfer process initiates</StepLabel>
              </Step>
              <Step active>
                <StepLabel>Agreement status updates to show transfer completion</StepLabel>
              </Step>
            </Stepper>
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
          <SecurityIcon sx={{ mr: 1 }} /> Agreement Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          Click on any agreement card or the Details button to view comprehensive information:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <List sx={{ pl: 2 }}>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Provider and Consumer" 
                  secondary="Organizations involved in the agreement" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Asset ID" 
                  secondary="Unique identifier for the shared asset" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Agreement ID" 
                  secondary="Unique identifier for the agreement contract" 
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
                  primary="Signing Date" 
                  secondary="When the agreement was established" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Counterparty Address" 
                  secondary="Network address of the other party (if available)" 
                />
              </ListItem>
              <ListItem sx={{ pl: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary="Transfer Status" 
                  secondary="Current transfer state and transfer ID (if completed)" 
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
          <RepeatIcon sx={{ mr: 1 }} /> Re-transfer Functionality
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" paragraph>
          For agreements that have already been transferred, the dashboard provides re-transfer capabilities:
        </Typography>
        <List sx={{ pl: 2 }}>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Visual indicators" 
              secondary="Transferred agreements show a repeat icon and orange re-transfer button" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Confirmation dialog" 
              secondary="System asks for confirmation before initiating re-transfer" 
            />
          </ListItem>
          <ListItem sx={{ pl: 0, py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <ArrowForwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Transfer history" 
              secondary="Previous transfer information remains visible in agreement details" 
            />
          </ListItem>
        </List>
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
          Use the time period filter to focus on recent agreements and the search functionality to quickly 
          locate specific agreements. The dashboard refreshes automatically after successful transfers, 
          so you can monitor the progress of your data exchanges in real-time. Re-transfers can be useful 
          for updating data or re-sending information when needed.
        </Typography>
      </Box>
    </Box>
  );
};

export default AgreementsDoc;