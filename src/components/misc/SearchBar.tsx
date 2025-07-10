import React, { useState, useRef } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    try {
      const searchQuery = query.trim();
      const urlParams = new URLSearchParams();
      if (searchQuery) {
        urlParams.append('q', searchQuery);
      }
      urlParams.append('page', '1');
      urlParams.append('size', '6');
      urlParams.append('_t', Date.now().toString());
      navigate(`/dataspace/search?${urlParams.toString()}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setError(error instanceof Error ? error.message : 'Navigation failed');
    }
  };

  const handleClear = () => {
    setQuery('');
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <Stack direction="row" spacing={1} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        size="small"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setError(null);
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search dataspace..."
        variant="outlined"
        InputProps={{
          startAdornment: (
            <IconButton 
              size="small" 
              onClick={handleSearch}
              sx={{ ml: -1 }}
            >
              <SearchIcon />
            </IconButton>
          ),
          endAdornment: query && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{ mr: -1 }}
            >
              {isLoading ? <CircularProgress size={20} /> : <ClearIcon />}
            </IconButton>
          ),
        }}
      />
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            right: 0, 
            mt: 1 
          }}
        >
          {error}
        </Alert>
      )}
    </Stack>
  );
};

export default SearchBar;