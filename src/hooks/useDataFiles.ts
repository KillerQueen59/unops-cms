import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataFile } from '@/types/data';
import { DataFormData } from '@/types/dataForm';

// Mock function to simulate file creation
const createMockFile = (
  name: string,
  type: string,
  size: number,
  category: 'regency' | 'other',
  regency?: string,
  url?: string
): DataFile => ({
  id: Math.random().toString(36).substr(2, 9),
  documentName: name
    .split('.')[0]
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  fileName: name,
  fileType: type,
  fileSize: size,
  createdDate: new Date().toISOString().split('T')[0],
  status: 'active',
  fileUrl: url || `/mock-files/${name}`,
  uploadedBy: 'Admin User',
  description: `Document ${name.split('.')[0]}`,
  category,
  regency,
});

// Mock data - simulating file downloads
const mockDataFiles: DataFile[] = [
  createMockFile(
    'training-report-2024.pdf',
    'application/pdf',
    2048000,
    'regency',
    'Kabupaten Ogan Komering Ulu'
  ),
  createMockFile(
    'village-survey-data.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    512000,
    'regency',
    'Kabupaten Ogan Komering Ulu'
  ),
  createMockFile(
    'activity-photos.zip',
    'application/zip',
    15728640,
    'regency',
    'Kota Palembang'
  ),
  createMockFile(
    'monthly-summary.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    256000,
    'regency',
    'Kota Palembang'
  ),
  createMockFile(
    'financial-report.pdf',
    'application/pdf',
    1024000,
    'regency',
    'Kabupaten Lahat'
  ),
  createMockFile(
    'stakeholder-presentation.pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    5242880,
    'regency',
    'Kabupaten Lahat'
  ),
  createMockFile(
    'gps-coordinates.kml',
    'application/vnd.google-earth.kml+xml',
    128000,
    'other'
  ),
  createMockFile('impact-assessment.pdf', 'application/pdf', 3145728, 'other'),
  createMockFile('community-feedback.csv', 'text/csv', 64000, 'other'),
  createMockFile('project-timeline.png', 'image/png', 1572864, 'other'),
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const dataApi = {
  // Get all files
  getFiles: async (): Promise<DataFile[]> => {
    await delay(1000);
    return mockDataFiles;
  },

  // Upload new file
  uploadFile: async (data: DataFormData): Promise<DataFile> => {
    await delay(2000);

    const newFile: DataFile = {
      id: Date.now().toString(),
      documentName: data.documentName,
      fileName: data.file.name,
      fileType: data.file.type,
      fileSize: data.file.size,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'active',
      uploadedBy: 'Current User',
      description: data.description,
      category: data.category,
      regency: data.regency,
      file: data.file,
      fileUrl: URL.createObjectURL(data.file),
    };

    // Add to mock data
    mockDataFiles.unshift(newFile);

    return newFile;
  },

  // Delete file
  deleteFile: async (id: string): Promise<void> => {
    await delay(500);
    const index = mockDataFiles.findIndex((file) => file.id === id);
    if (index !== -1) {
      mockDataFiles.splice(index, 1);
    }
  },

  // Download file
  downloadFile: async (file: DataFile): Promise<void> => {
    await delay(500);

    if (file.file) {
      // Create download for uploaded file
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Simulate download for mock files
      console.log(`Downloading ${file.fileName}...`);
      // In a real app, this would initiate actual file download
    }
  },
};

// React Query hooks
export const useDataFiles = () => {
  return useQuery({
    queryKey: ['dataFiles'],
    queryFn: dataApi.getFiles,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataApi.uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataFiles'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataApi.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dataFiles'] });
    },
  });
};

export const useDownloadFile = () => {
  return useMutation({
    mutationFn: dataApi.downloadFile,
  });
};
