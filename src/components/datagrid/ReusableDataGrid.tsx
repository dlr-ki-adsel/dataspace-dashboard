import React, { useState } from 'react';
import { 
  DataGrid, 
  GridColDef, 
  GridToolbar, 
  GridRowSelectionModel 
} from '@mui/x-data-grid';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export interface ReusableDataGridProps {
  rows: any[];
  columns: GridColDef[];
  onRowSelectionChange?: (selectedRows: any[]) => void;
  customCardContent?: (row: any) => React.ReactNode;
  customCardActions?: (row: any) => React.ReactNode;
  viewType?: 'table' | 'card';
}

const ReusableDataGrid: React.FC<ReusableDataGridProps> = ({
  rows,
  columns,
  onRowSelectionChange,
  customCardContent,
  customCardActions,
  viewType

}) => {
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([]);
  //const [viewType, setViewType] = useState<'table' | 'card'>('table');
  const [expandedSections, setExpandedSections] = useState<Record<string, Set<string>>>({});

  const handleSelectionChange = (ids: any) => {
    setRowSelectionModel(ids);
    if (onRowSelectionChange) {
      onRowSelectionChange(ids.map((id: any) => rows.find((row) => row.id === id)));
    }
  };

  const toggleSection = (rowId: number, field: string) => {
    setExpandedSections(prev => {
      const currentRow = prev[rowId] || new Set();
      const newRow = new Set(currentRow);
      if (newRow.has(field)) {
        newRow.delete(field);
      } else {
        newRow.add(field);
      }
      return {
        ...prev,
        [rowId]: newRow
      };
    });
  };

  const isSectionExpanded = (rowId: number, field: string) => {
    return expandedSections[rowId]?.has(field) || false;
  };

  const DefaultCardContent: React.FC<{ row: any }> = ({ row }) => {
    const mainField = columns.find(col => 
      col.field !== 'id' && col.field !== 'actions'
    ) || columns[0];

    const detailFields = columns.filter(col => 
      col.field !== mainField.field && 
      col.field !== 'id' && 
      col.field !== 'actions'
    );

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography 
          variant="h6" 
          color="primary" 
          gutterBottom
          sx={{
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            minWidth: '200px'
          }}
        >
          {row[mainField.field]}
        </Typography>

        <Divider />
        
        {detailFields.map((col) => (
          <Paper 
            key={col.field} 
            sx={{ 
              p: 2, 
              bgcolor: 'background.default',
              overflow: 'hidden',
              minWidth: '250px',
              '& .MuiTypography-root': {
                minWidth: '200px'
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 1,
              width: '100%'
            }}>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{
                  flex: 1,
                  minWidth: '120px'
                }}
              >
                {col.headerName}
              </Typography>
              <IconButton
                size="small"
                onClick={() => toggleSection(row.id, col.field)}
              >
                {isSectionExpanded(row.id, col.field) 
                  ? <ExpandLessIcon /> 
                  : <ExpandMoreIcon />
                }
              </IconButton>
            </Box>
            <Typography
              sx={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                display: '-webkit-box',
                WebkitLineClamp: isSectionExpanded(row.id, col.field) ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                bgcolor: 'background.default',
                p: 1,
                borderRadius: 1
              }}
            >
              {typeof row[col.field] === 'object' 
                ? JSON.stringify(row[col.field], null, 2) 
                : String(row[col.field] || 'N/A')
              }
            </Typography>
          </Paper>
        ))}
      </Box>
    );
  };

  const BaseCard: React.FC<{ row: any }> = ({ row }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        },
        overflow: 'visible',
        borderRadius: 2,
        minWidth: { xs: '100%', sm: '300px' }
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {customCardContent ? (
          customCardContent(row)
        ) : (
          <DefaultCardContent row={row} />
        )}
      </CardContent>
      {customCardActions && (
        <>
          <Divider />
          {customCardActions(row)}
        </>
      )}
    </Card>
  );

  return (
    <Box sx={{ width: '100%' }}>


      {viewType === 'table' ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column'  // This replaces autoHeight
        }}>
        <DataGrid
          sx={{ 
            mt: 2,
          }}
          onRowSelectionModelChange={handleSelectionChange}
          rowSelectionModel={rowSelectionModel}
          slots={{ toolbar: GridToolbar }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        </Box>
      ) : (
        <Box 
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            }
          }}
        >
          {rows.map((row) => (
            <BaseCard key={row.id} row={row} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ReusableDataGrid;