import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input,
  FormHelperText,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  useDocuments,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from '@/hooks/useDocumentData';
import {
  CreateDocumentData,
  UpdateDocumentData,
} from '@/services/documentService';
import { DataFile } from '@/types/data';

interface DocumentFormData {
  areaId: string;
  title: string;
  link: string;
  file?: File;
}

const DocumentManager: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DataFile | null>(null);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    area: '',
    sortBy: 'createdAt' as const,
  });

  const [formData, setFormData] = useState<DocumentFormData>({
    areaId: '16.01',
    title: '',
    link: '',
    file: undefined,
  });

  // API Hooks
  const { data: documentsResponse, isLoading, error } = useDocuments(filters);
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();

  // Form Handlers
  const handleInputChange =
    (field: keyof DocumentFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleCreateSubmit = async () => {
    try {
      const createData: CreateDocumentData = {
        areaId: formData.areaId,
        title: formData.title,
        link: formData.link,
        file: formData.file,
      };

      await createMutation.mutateAsync(createData);
      setIsCreateModalOpen(false);
      setFormData({ areaId: '16.01', title: '', link: '', file: undefined });
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingDocument) return;

    try {
      const updateData: UpdateDocumentData = {
        areaId: formData.areaId,
        title: formData.title,
        link: formData.link,
        file: formData.file,
      };

      await updateMutation.mutateAsync({
        documentId: editingDocument.id,
        documentData: updateData,
      });

      setIsEditModalOpen(false);
      setEditingDocument(null);
      setFormData({ areaId: '16.01', title: '', link: '', file: undefined });
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteMutation.mutateAsync(documentId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleEdit = (document: DataFile) => {
    setEditingDocument(document);
    setFormData({
      areaId: document.regency || '16.01',
      title: document.documentName || '',
      link: document.fileUrl || '',
      file: undefined,
    });
    setIsEditModalOpen(true);
  };

  const handleDownload = (document: DataFile) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleFilterChange =
    (field: string) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { value: string } }
    ) => {
      setFilters((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  // Form validation
  const isFormValid =
    formData.title.trim() !== '' && formData.areaId.trim() !== '';

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load documents: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Document Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add Document
          </Button>
        </Box>

        {/* Filters */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <TextField
            label="Filter by Area"
            value={filters.area}
            onChange={handleFilterChange('area')}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(event) => handleFilterChange('sortBy')(event)}
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="updatedAt">Updated Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="Page Size"
            value={filters.pageSize}
            onChange={handleFilterChange('pageSize')}
            size="small"
            inputProps={{ min: 5, max: 50 }}
            sx={{ maxWidth: 120 }}
          />
        </Stack>

        {/* Loading State */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Documents Grid */}
        {documentsResponse?.data && (
          <>
            <Typography variant="h6" gutterBottom>
              Documents ({documentsResponse.data.length})
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 2,
              }}
            >
              {documentsResponse.data.map((document) => (
                <Card key={document.id}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom noWrap>
                      {document.documentName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Area ID: {document.regency}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Type: {document.fileType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Size: {Math.round(document.fileSize / 1024)} KB
                    </Typography>
                    <Chip
                      label={document.category}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      onClick={() => handleDownload(document)}
                      title="Download"
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(document)}
                      title="Edit"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(document.id)}
                      title="Delete"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </>
        )}

        {/* Create Document Modal */}
        <Dialog
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Document</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Document Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
              />
              <TextField
                fullWidth
                label="Area ID"
                value={formData.areaId}
                onChange={handleInputChange('areaId')}
                required
              />
              <TextField
                fullWidth
                label="Document Link (Optional)"
                value={formData.link}
                onChange={handleInputChange('link')}
              />
              <FormControl fullWidth>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{
                    accept: '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
                  }}
                />
                <FormHelperText>
                  Upload a file (PDF, DOC, XLS, or Image)
                </FormHelperText>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateSubmit}
              disabled={!isFormValid || createMutation.isPending}
              startIcon={
                createMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : (
                  <UploadIcon />
                )
              }
            >
              {createMutation.isPending ? 'Creating...' : 'Create Document'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Document Modal */}
        <Dialog
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit Document</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                fullWidth
                label="Document Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                required
              />
              <TextField
                fullWidth
                label="Area ID"
                value={formData.areaId}
                onChange={handleInputChange('areaId')}
                required
              />
              <TextField
                fullWidth
                label="Document Link"
                value={formData.link}
                onChange={handleInputChange('link')}
              />
              <FormControl fullWidth>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  inputProps={{
                    accept: '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
                  }}
                />
                <FormHelperText>
                  Upload a new file to replace the current one
                </FormHelperText>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleEditSubmit}
              disabled={!isFormValid || updateMutation.isPending}
              startIcon={
                updateMutation.isPending ? (
                  <CircularProgress size={20} />
                ) : (
                  <UploadIcon />
                )
              }
            >
              {updateMutation.isPending ? 'Updating...' : 'Update Document'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default DocumentManager;
