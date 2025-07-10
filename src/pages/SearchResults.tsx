import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Card, CardContent, Button,
  Pagination, CircularProgress, Alert, Chip, Divider, Avatar,
  Rating, Stack, Paper, Tooltip
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import { format } from 'date-fns';
import { useSearchService, SearchParams } from '../services/searchService';
import { DEFAULT_PAGE_SIZE } from '../config';

// Local interface for entity with calculated version
interface DsEntity {
  id: string;
  title: string;
  description?: string;
  entity_type: string;
  version_major: number;
  version_minor: number;
  created_at: string;
  updated_at: string;
  assets: Array<Record<string, any>>;
  compatible_with: string[];
  tags: string[];
  unique_identifier: string;
  visibility: boolean;
  icon?: string | null;
  is_verified: boolean;
  verified_by?: string | null;
  ratings: Record<string, { value: number; timestamp: string }>;
  comments: Array<{
    id: string;
    user_id: string;
    text: string;
    created_at: string;
    updated_at?: string;
    parent_id?: string;
    is_deleted: boolean;
    moderation_status: string;
  }>;
  version?: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DsEntity[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  
  // Use the custom hook for search functionality
  const { search } = useSearchService();

  // Parse query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q') || '';
    const currentPage = parseInt(params.get('page') || '1', 10);
    const size = parseInt(params.get('size') || '6', 10);

    setQuery(searchQuery);
    setPage(currentPage);
    setPageSize(size);

    if (searchQuery) {
      fetchSearchResults(searchQuery, currentPage, size);
    }
  }, [location.search]);

  const fetchSearchResults = async (searchQuery: string, currentPage: number, size: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare search parameters
      const searchParams: SearchParams = {
        q: searchQuery,
        page: currentPage,
        size: size
      };

      // Use our search hook
      const response = await search(searchParams);

      // Process the entities to ensure all have version property
      const processedResults = response.items.map(entity => ({
        ...entity,
        // Add calculated version string for display
        version: `${entity.version_major || 1}.${entity.version_minor || 0}`
      }));

      setResults(processedResults);
      setTotalResults(response.total);

    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setTotalResults(0);
      setError('Failed to retrieve search results.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    const urlParams = new URLSearchParams();
    urlParams.append('q', query);
    urlParams.append('page', value.toString());
    urlParams.append('size', pageSize.toString());
    urlParams.append('_t', Date.now().toString());
    navigate(`/dataspace/search?${urlParams.toString()}`);
  };

  // Helper function to calculate average rating
  const calculateAverageRating = (ratings: Record<string, { value: number; timestamp: string }>) => {
    if (!ratings || Object.keys(ratings).length === 0) return 0;

    const sum = Object.values(ratings).reduce((acc, curr) => acc + curr.value, 0);
    return sum / Object.keys(ratings).length;
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';

    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      console.warn('Date format error:', e);
      return 'Invalid date';
    }
  };

  // Handle safely navigating to an entity
  const handleEntityNavigation = (entity: DsEntity) => {
    try {
      // Base path depends on entity type
      let basePath = '/catalog'; // Default

      if (entity.entity_type) {
        const type = entity.entity_type.toLowerCase();
        if (type === 'service') basePath = '/service';
        else if (type === 'connector') basePath = '/connectors';
        else if (type === 'policy') basePath = '/policies';
        // else keep the default catalog
      }

      navigate(`${basePath}/${entity.id}`);
    } catch (e) {
      console.error('Navigation error:', e);
      // Fallback to just catalog
      navigate('/catalog');
    }
  };

  // Render an entity card
  const renderEntityCard = (entity: DsEntity) => {
    const avgRating = calculateAverageRating(entity.ratings);

    // Generate a color for the entity type
    const getTypeColor = (type: string | undefined) => {
      if (!type) return '#757575';

      switch (type.toLowerCase()) {
        case 'dataset': return '#2196f3';
        case 'service': return '#ff9800';
        case 'connector': return '#4caf50';
        case 'api': return '#9c27b0';
        default: return '#757575';
      }
    };

    // Get entity icon or fallback to first letter
    const getEntityIcon = () => {
      if (entity.icon) {
        return <Avatar src={entity.icon} alt={entity.title} />;
      }
      return <Avatar sx={{ bgcolor: getTypeColor(entity.entity_type) }}>
        {(entity.title || 'U').charAt(0).toUpperCase()}
      </Avatar>;
    };

    return (
      <Card
        key={entity.id}
        elevation={2}
        sx={{
          mb: 3,
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
        onClick={() => handleEntityNavigation(entity)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            {getEntityIcon()}

            <Box sx={{ ml: 2, flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" component="h2">
                  {entity.title || 'Untitled'}
                </Typography>
                {entity.is_verified && (
                  <Tooltip title="Verified">
                    <span>
                      <VerifiedIcon color="primary" sx={{ ml: 1, fontSize: '1.2rem' }} />
                    </span>
                  </Tooltip>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}>
                <Chip
                  label={entity.entity_type || 'Unknown'}
                  size="small"
                  sx={{
                    mr: 1,
                    mb: 0.5,
                    color: 'white',
                    bgcolor: getTypeColor(entity.entity_type)
                  }}
                />
                <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                  v{entity.version || `${entity.version_major || 1}.${entity.version_minor || 0}`}
                </Typography>

                {entity.tags && entity.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {entity.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={`${tag}-${index}`}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', mb: 0.5 }}
                      />
                    ))}
                    {entity.tags.length > 3 && (
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        +{entity.tags.length - 3} more
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {avgRating > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Rating
                  value={avgRating}
                  precision={0.5}
                  size="small"
                  readOnly
                />
                <Typography variant="caption" color="textSecondary">
                  {Object.keys(entity.ratings || {}).length} rating{Object.keys(entity.ratings || {}).length !== 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {entity.description || 'No description available'}
          </Typography>

          <Divider sx={{ my: 1.5 }} />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
              <Typography variant="body2">
                Created: {formatDate(entity.created_at)}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UpdateIcon fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
              <Typography variant="body2">
                Updated: {formatDate(entity.updated_at)}
              </Typography>
            </Box>

            {entity.comments && entity.comments.length > 0 && (
              <Typography variant="body2">
                {entity.comments.filter(c => !c?.is_deleted).length} comment{entity.comments.filter(c => !c?.is_deleted).length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Results {query && <Typography variant="h5" component="span" color="text.secondary">for "{query}"</Typography>}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {results.length > 0 ? (
              <>
                <Box sx={{ mb: 1, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">
                    Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => navigate('/catalog')}
                  >
                    Browse All Catalog
                  </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                  {results.map((entity, index) => (
                    <React.Fragment key={entity.id || `entity-${index}`}>
                      {renderEntityCard(entity)}
                    </React.Fragment>
                  ))}
                </Box>

                {totalResults > pageSize && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={Math.ceil(totalResults / pageSize)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      siblingCount={1}
                      size="large"
                    />
                  </Box>
                )}
              </>
            ) : query ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" gutterBottom>
                  No results found for "{query}"
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Try adjusting your search terms or browse the catalog.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/catalog')}
                >
                  Browse Catalog
                </Button>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" gutterBottom>
                  Enter a search term to find datasets and services
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/catalog')}
                  sx={{ mt: 2 }}
                >
                  Browse Catalog
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SearchResults;