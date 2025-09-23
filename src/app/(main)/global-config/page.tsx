'use client';

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Divider,
  Snackbar,
  InputAdornment,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useGlobalConfigPageImpl } from './useGlobalConfigPageImpl';

const GlobalConfigPage: React.FC = () => {
  const { state, actions } = useGlobalConfigPageImpl();

  const {
    filteredConfigs,
    isLoading,
    searchQuery,
    newItems,
    expandedSections,
    savingConfigs,
    resettingConfigs,
    snackbar,
  } = state;

  const {
    setSearchQuery,
    handleNumberChange,
    handleAddArrayItem,
    handleRemoveArrayItem,
    setNewItem,
    handleSaveConfig,

    toggleSection,
    handleCloseSnackbar,
    handleRefreshAllConfigs,
  } = actions;

  // Enhanced number change handler with validation
  const handleValidatedNumberChange = (key: string, value: string) => {
    let numValue = parseFloat(value) || 0;

    // Apply validation for assessmentTreshold
    if (key === 'assessmentTreshold') {
      if (numValue > 100) {
        numValue = 100;
      } else if (numValue < 0) {
        numValue = 0;
      }
    }

    handleNumberChange(key, numValue.toString());
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
              Loading configurations...
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3, position: 'relative' }}>
        {/* Header */}
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Global Configuration
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage global configuration settings for the application.
          </Typography>
        </Paper>

        {/* Search and Actions Bar */}
        <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              size="medium"
              placeholder="Search configurations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />

            <Tooltip title="Refresh All Configurations">
              <IconButton
                onClick={handleRefreshAllConfigs}
                disabled={isLoading}
                color="primary"
                size="large"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Configuration Cards */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            '& > *': {
              flex: '1 1 calc(50% - 12px)',
              minWidth: '400px',
              '@media (max-width: 899px)': {
                flex: '1 1 100%',
                minWidth: 'unset',
              },
            },
          }}
        >
          {filteredConfigs.map((config) => (
            <Box key={config.key}>
              <Paper elevation={3} sx={{ height: 'fit-content' }}>
                <Accordion
                  expanded={expandedSections[config.key] !== false}
                  onChange={() => toggleSection(config.key)}
                  elevation={0}
                  sx={{
                    '&:before': { display: 'none' },
                    borderRadius: 1,
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      backgroundColor: 'background.paper',
                      '&:hover': { backgroundColor: 'action.hover' },
                      borderRadius: '4px 4px 0 0',
                      minHeight: 64,
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pr: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{ fontWeight: 600 }}
                        >
                          {config.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {config.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                      >
                        {savingConfigs[config.key] && (
                          <Tooltip title="Saving...">
                            <CircularProgress size={20} color="primary" />
                          </Tooltip>
                        )}
                        {resettingConfigs[config.key] && (
                          <Tooltip title="Resetting...">
                            <CircularProgress size={20} color="secondary" />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 3 }}>
                    <Box>
                      {config.type === 'number' ? (
                        <Box>
                          <TextField
                            fullWidth
                            type="number"
                            label="Value"
                            value={config.value}
                            onChange={(e) =>
                              handleValidatedNumberChange(
                                config.key,
                                e.target.value
                              )
                            }
                            disabled={
                              savingConfigs[config.key] ||
                              resettingConfigs[config.key]
                            }
                            margin="normal"
                            inputProps={{
                              step:
                                config.key === 'assessmentTreshold' ? 1 : 'any',
                              min:
                                config.key === 'assessmentTreshold'
                                  ? 0
                                  : undefined,
                              max:
                                config.key === 'assessmentTreshold'
                                  ? 100
                                  : undefined,
                            }}
                            helperText={
                              config.key === 'assessmentTreshold'
                                ? 'Value must be between 0 and 100'
                                : undefined
                            }
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ fontWeight: 600 }}
                          >
                            Items (
                            {Array.isArray(config.value)
                              ? config.value.length
                              : 0}
                            )
                          </Typography>

                          <Paper
                            variant="outlined"
                            sx={{ p: 2, mb: 2, backgroundColor: 'grey.50' }}
                          >
                            <Box display="flex" gap={1}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Add new item"
                                value={newItems[config.key] || ''}
                                onChange={(e) =>
                                  setNewItem(config.key, e.target.value)
                                }
                                disabled={
                                  savingConfigs[config.key] ||
                                  resettingConfigs[config.key]
                                }
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddArrayItem(config.key);
                                  }
                                }}
                              />
                              <IconButton
                                onClick={() => handleAddArrayItem(config.key)}
                                disabled={
                                  savingConfigs[config.key] ||
                                  resettingConfigs[config.key] ||
                                  !newItems[config.key]?.trim()
                                }
                                color="primary"
                                sx={{
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  '&:hover': { bgcolor: 'primary.dark' },
                                  '&:disabled': {
                                    bgcolor: 'action.disabledBackground',
                                  },
                                }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </Paper>

                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              minHeight: 80,
                              backgroundColor: 'background.default',
                              border: '2px dashed',
                              borderColor: 'divider',
                            }}
                          >
                            <Box
                              display="flex"
                              flexWrap="wrap"
                              gap={1}
                              sx={{ minHeight: 40 }}
                            >
                              {Array.isArray(config.value) &&
                              config.value.length > 0 ? (
                                config.value.map((item, index) => (
                                  <Chip
                                    key={`${item}-${index}`}
                                    label={item}
                                    onDelete={() =>
                                      handleRemoveArrayItem(config.key, item)
                                    }
                                    deleteIcon={<DeleteIcon />}
                                    variant="filled"
                                    size="medium"
                                    color="primary"
                                    sx={{
                                      fontWeight: 500,
                                      '& .MuiChip-deleteIcon': {
                                        color: 'inherit',
                                      },
                                    }}
                                  />
                                ))
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    fontStyle: 'italic',
                                    alignSelf: 'center',
                                    width: '100%',
                                    textAlign: 'center',
                                    py: 2,
                                  }}
                                >
                                  No items added yet
                                </Typography>
                              )}
                            </Box>
                          </Paper>
                        </Box>
                      )}

                      <Divider sx={{ my: 3 }} />

                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                      >
                        <Button
                          variant="contained"
                          startIcon={
                            savingConfigs[config.key] ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <SaveIcon />
                            )
                          }
                          onClick={() => handleSaveConfig(config.key)}
                          disabled={
                            savingConfigs[config.key] ||
                            resettingConfigs[config.key]
                          }
                          size="medium"
                          sx={{ minWidth: 120 }}
                        >
                          {savingConfigs[config.key] ? 'Saving...' : 'Save'}
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Paper>
            </Box>
          ))}
        </Box>

        {/* No results message */}
        {filteredConfigs.length === 0 && searchQuery && (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mt: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No configurations found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search query or clear the search to see all
              configurations.
            </Typography>
          </Paper>
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default GlobalConfigPage;
