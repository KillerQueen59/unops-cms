'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import {
  useVillagers,
  useCreateVillager,
  useUpdateVillager,
  useDeleteVillager,
} from '@/hooks/useVillagerData';
import { Villager } from '@/services/villagerService';
import { AddVillagerModal } from './AddVillagerModal';
import { ConfirmationModal } from '@/components';

interface VillagerDataModalProps {
  open: boolean;
  onClose: () => void;
  villageId: string;
}

interface EditVillagerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; nik: string }) => void;
  villager: Villager | null;
  villageId: string;
  isSubmitting?: boolean;
}

const EditVillagerModal = ({
  open,
  onClose,
  onSave,
  villager,
  villageId,
  isSubmitting = false,
}: EditVillagerModalProps) => {
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && villager) {
      setName(villager.name);
      setNik(villager.nik);
      setError('');
    }
  }, [open, villager]);

  const handleSave = () => {
    if (!name.trim() || !nik.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (nik.length < 6) {
      setError('NIK must be at least 6 characters');
      return;
    }

    onSave({
      name: name.trim(),
      nik: nik.trim(),
    });
  };

  const handleClose = () => {
    setName('');
    setNik('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '8px',
          zIndex: 1400,
        },
      }}
    >
      <DialogTitle sx={{ padding: '24px 24px 0px 24px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: '#374151' }}
          >
            Edit Villager
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#9CA3AF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TextField
            fullWidth
            label="Villager Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter villager name..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="NIK (Identity Number)"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            placeholder="Enter NIK..."
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              },
            }}
          />

          <TextField
            fullWidth
            label="Village ID"
            value={villageId}
            disabled
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: '#F9FAFB',
              },
            }}
          />
        </Box>

        <Box
          sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!name.trim() || !nik.trim() || isSubmitting}
            sx={{
              borderRadius: '12px',
              minWidth: 120,
              height: 48,
              backgroundColor: '#3B82F6',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Villager'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export const VillagerDataModal = ({
  open,
  onClose,
  villageId,
}: VillagerDataModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVillager, setSelectedVillager] = useState<Villager | null>(
    null
  );
  const [villagerToDelete, setVillagerToDelete] = useState<Villager | null>(
    null
  );

  const pageSize = 10;

  // API queries and mutations
  const {
    data: villagersResponse,
    isLoading,
    error,
  } = useVillagers({
    villageId,
    page,
    pageSize,
    search: searchTerm,
    sortBy: 'createdAt',
  });

  const createMutation = useCreateVillager();
  const updateMutation = useUpdateVillager();
  const deleteMutation = useDeleteVillager();

  const villagers = villagersResponse?.data || [];
  const totalPages = villagersResponse?.totalPages || 0;
  const totalData = villagersResponse?.totalData || 0;

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleAddVillager = () => {
    setShowAddModal(true);
  };

  const handleEditVillager = (villager: Villager) => {
    setSelectedVillager(villager);
    setShowEditModal(true);
  };

  const handleDeleteVillager = (villager: Villager) => {
    setVillagerToDelete(villager);
    setShowDeleteModal(true);
  };

  const handleSaveNewVillager = (data: { name: string; nik: string }) => {
    createMutation.mutate(
      {
        villageId,
        name: data.name,
        nik: data.nik,
      },
      {
        onSuccess: () => {
          setShowAddModal(false);
        },
      }
    );
  };

  const handleSaveEditVillager = (data: { name: string; nik: string }) => {
    if (!selectedVillager) return;

    updateMutation.mutate(
      {
        id: selectedVillager._id,
        villagerData: {
          name: data.name,
          nik: data.nik,
          villageId,
        },
      },
      {
        onSuccess: () => {
          setShowEditModal(false);
          setSelectedVillager(null);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!villagerToDelete) return;

    deleteMutation.mutate(villagerToDelete._id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setVillagerToDelete(null);
      },
    });
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVillagerToDelete(null);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleClose = () => {
    setSearchTerm('');
    setPage(1);
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedVillager(null);
    setVillagerToDelete(null);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '8px',
            minHeight: '600px',
          },
        }}
      >
        <DialogTitle sx={{ padding: '24px 24px 0px 24px' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 'bold', color: '#374151' }}
            >
              Villager Data - {villageId}
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: '#9CA3AF' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ padding: '24px' }}>
          {/* Header Actions */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <TextField
              placeholder="Search villagers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                width: 350,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddVillager}
              disabled={createMutation.isPending}
              sx={{
                backgroundColor: '#0EA5E9',
                '&:hover': {
                  backgroundColor: '#0284C7',
                },
                minWidth: 150,
                height: 48,
                borderRadius: '12px',
              }}
            >
              Add Villager
            </Button>
          </Box>

          {/* Show mutation errors */}
          {(createMutation.error ||
            updateMutation.error ||
            deleteMutation.error) && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="error">
                {createMutation.error?.message ||
                  updateMutation.error?.message ||
                  deleteMutation.error?.message ||
                  'An error occurred'}
              </Alert>
            </Box>
          )}

          {/* Table */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: '8px' }}>
              Failed to load villager data
            </Alert>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ borderRadius: '12px', mb: 3 }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                        NIK
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {villagers.map((villager) => (
                      <TableRow key={villager._id}>
                        <TableCell>{villager.name}</TableCell>
                        <TableCell>{villager.nik}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              onClick={() => handleEditVillager(villager)}
                              disabled={
                                updateMutation.isPending ||
                                deleteMutation.isPending
                              }
                              sx={{
                                border: '1.5px solid #E5E7EB',
                                borderRadius: '8px',
                                background: '#F7F8FA',
                                width: 32,
                                height: 32,
                                color: '#6B7280',
                                transition: 'background 0.2s',
                                '&:hover': {
                                  background: '#E5E7EB',
                                  color: '#0092D1',
                                  borderColor: '#0092D1',
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              onClick={() => handleDeleteVillager(villager)}
                              disabled={
                                updateMutation.isPending ||
                                deleteMutation.isPending
                              }
                              sx={{
                                border: '1.5px solid #FECACA',
                                borderRadius: '8px',
                                background: '#FFF1F2',
                                width: 32,
                                height: 32,
                                color: '#DC2626',
                                transition: 'background 0.2s',
                                '&:hover': {
                                  background: '#FECACA',
                                  color: '#B91C1C',
                                  borderColor: '#B91C1C',
                                },
                              }}
                            >
                              {deleteMutation.isPending &&
                              deleteMutation.variables === villager._id ? (
                                <CircularProgress size={16} />
                              ) : (
                                <DeleteIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {villagers.length === 0 && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    color: '#6B7280',
                  }}
                >
                  <Typography variant="body1">
                    {searchTerm
                      ? 'No villagers found matching your search.'
                      : 'No villagers available yet.'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {!searchTerm && 'Click "Add Villager" to get started.'}
                  </Typography>
                </Box>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}

              {/* Summary */}
              <Typography
                variant="body2"
                sx={{ color: '#6B7280', textAlign: 'center', mt: 2 }}
              >
                Showing {villagers.length} of {totalData} villagers
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Villager Modal */}
      <AddVillagerModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveNewVillager}
        villageId={villageId}
        isSubmitting={createMutation.isPending}
      />

      {/* Edit Villager Modal */}
      <EditVillagerModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedVillager(null);
        }}
        onSave={handleSaveEditVillager}
        villager={selectedVillager}
        villageId={villageId}
        isSubmitting={updateMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onSecondaryButtonClick={handleDeleteCancel}
        onPrimaryButtonClick={handleDeleteConfirm}
        title="Delete Villager?"
        message={`Are you sure you want to delete "${villagerToDelete?.name}"? This action cannot be undone.`}
        primaryButtonText={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        secondaryButtonText="Cancel"
      />
    </>
  );
};
