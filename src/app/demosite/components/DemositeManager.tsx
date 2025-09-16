import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  useDemosites,
  useCreateDemosite,
  useUpdateDemosite,
  useDeleteDemosite,
} from '@/hooks/useDemositeData';
import {
  CreateDemositeData,
  UpdateDemositeData,
  DemositeQueryParams,
} from '@/services/demositeService';
import { DemositeData } from '@/types/demosite';

interface DemositeManagerProps {
  filterType?: 'hero' | 'location';
}

export const DemositeManager: React.FC<DemositeManagerProps> = ({
  filterType,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DemositeData | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [queryParams, setQueryParams] = useState<DemositeQueryParams>({
    page: 1,
    pageSize: 10,
    type: filterType,
    sortBy: 'createdAt',
  });

  const [formData, setFormData] = useState<CreateDemositeData>({
    header: '',
    title: '',
    type: 'hero',
    name: '',
    story: '',
    link: '',
  });

  // API hooks
  const {
    data: demosites = [],
    isLoading,
    error,
    refetch,
  } = useDemosites(queryParams);

  const createMutation = useCreateDemosite();
  const updateMutation = useUpdateDemosite();
  const deleteMutation = useDeleteDemosite();

  // Handlers
  const handleCreate = async () => {
    try {
      const demositeData: CreateDemositeData = {
        ...formData,
        photos: selectedFiles,
      };

      await createMutation.mutateAsync(demositeData);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Failed to create demosite:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;

    try {
      const demositeData: UpdateDemositeData = {
        ...formData,
        id: editingItem.id,
        photos: selectedFiles,
      };

      await updateMutation.mutateAsync(demositeData);
      setEditingItem(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update demosite:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this demosite?'))
      return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete demosite:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const resetForm = () => {
    setFormData({
      header: '',
      title: '',
      type: 'hero',
      name: '',
      story: '',
      link: '',
    });
    setSelectedFiles([]);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (item: DemositeData) => {
    setEditingItem(item);
    setFormData({
      header: item.header,
      title: item.title,
      type: item.type === 'Local Heroes' ? 'hero' : 'location',
      name: item.name,
      story: item.story,
      link: item.link,
    });
  };

  const handleSave = () => {
    if (editingItem) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleTypeFilter = (type: 'hero' | 'location' | undefined) => {
    setQueryParams((prev) => ({ ...prev, type, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        Failed to load demosites: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with controls */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">🏞️ Demosites Management</Typography>
        <Box display="flex" gap={2} alignItems="center">
          {/* Type filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={queryParams.type || ''}
              onChange={(e: SelectChangeEvent) =>
                handleTypeFilter(
                  e.target.value as 'hero' | 'location' | undefined
                )
              }
              label="Type"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="hero">Hero</MenuItem>
              <MenuItem value="location">Location</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openAddModal}
            disabled={createMutation.isPending}
          >
            Add Demosite
          </Button>
        </Box>
      </Box>

      {/* Demosites grid */}
      <Grid container spacing={3}>
        {demosites.map((demosite) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={demosite.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="h6" noWrap>
                    {demosite.title}
                  </Typography>
                  <Chip
                    label={
                      demosite.type === 'Local Heroes' ? 'Hero' : 'Location'
                    }
                    color={
                      demosite.type === 'Local Heroes' ? 'primary' : 'secondary'
                    }
                    size="small"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Header:</strong> {demosite.header}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Name:</strong> {demosite.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {demosite.story}
                </Typography>

                {demosite.photos && demosite.photos.length > 0 && (
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <ImageIcon fontSize="small" />
                    <Typography variant="caption" color="text.secondary">
                      {demosite.photos.length} photo(s)
                    </Typography>
                  </Box>
                )}

                {demosite.isTop10 && (
                  <Chip label="Top 10" color="success" size="small" />
                )}
              </CardContent>

              <CardActions>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => openEditModal(demosite)}
                  disabled={updateMutation.isPending}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(demosite.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {demosites.length === 0 && (
        <Alert severity="info">
          No demosites found. Click &quot;Add Demosite&quot; to create your
          first one.
        </Alert>
      )}

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={3} gap={1}>
        <Button
          onClick={() => handlePageChange((queryParams.page || 1) - 1)}
          disabled={(queryParams.page || 1) <= 1}
        >
          Previous
        </Button>
        <Typography variant="body2" alignSelf="center" mx={2}>
          Page {queryParams.page || 1}
        </Typography>
        <Button
          onClick={() => handlePageChange((queryParams.page || 1) + 1)}
          disabled={demosites.length < (queryParams.pageSize || 10)}
        >
          Next
        </Button>
      </Box>

      {/* Add/Edit Modal */}
      <Dialog
        open={showAddModal || !!editingItem}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? 'Edit Demosite' : 'Add New Demosite'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Header"
              value={formData.header}
              onChange={(e) =>
                setFormData({ ...formData, header: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                onChange={(e: SelectChangeEvent) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as 'hero' | 'location',
                  })
                }
                label="Type"
              >
                <MenuItem value="hero">Hero</MenuItem>
                <MenuItem value="location">Location</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Story"
              value={formData.story}
              onChange={(e) =>
                setFormData({ ...formData, story: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              required
            />

            <TextField
              label="Link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              fullWidth
              type="url"
              required
            />

            {/* File upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Photos
              </Typography>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ marginBottom: '8px' }}
              />
              {selectedFiles.length > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {selectedFiles.length} file(s) selected
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowAddModal(false);
              setEditingItem(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {editingItem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
