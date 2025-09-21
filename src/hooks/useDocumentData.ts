import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService, PaginationParams } from '@/services/documentService';
import { DataFile } from '@/types/data';
import toast from 'react-hot-toast';
import { PaginatedResponse } from '@/types/common';

// Query Keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: string) => [...documentKeys.lists(), { filters }] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string | null) => [...documentKeys.details(), id] as const,
} as const;

/**
 * Hook to fetch all documents with filtering
 */
export const useDocuments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: documentKeys.list(JSON.stringify(params || {})),
    queryFn: async (): Promise<PaginatedResponse<DataFile>> => {
      try {
        const result = await documentService.getDocuments(params);
        return result;
      } catch (error) {
        toast.error('Failed to fetch documents');
        return {
          data: [],
          totalData: 0,
          page: params?.page || 1,
          limit: params?.pageSize || 10,
          totalPages: 0,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to delete a document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      documentService.deleteDocument(documentId),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
      queryClient.removeQueries({ queryKey: documentKeys.detail(deletedId) });
    },
  });
};

/**
 * Legacy hook names for backward compatibility
 */
export const useDataFiles = (params?: PaginationParams) => {
  return useDocuments(params);
};

export const useDeleteFile = () => {
  return useDeleteDocument();
};

/**
 * Hook for uploading/creating documents with file
 * Optimized for the upload modal workflow
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uploadData: {
      areaId?: string;
      title: string;
      link?: string;
      file: File;
    }) => {
      return await documentService.createDocument({
        areaId: uploadData.areaId,
        title: uploadData.title,
        link: uploadData.link || '',
        file: uploadData.file,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document');
    },
  });
};

/**
 * Hook to get documents by area/regency for filtering
 */
export const useDocumentsByArea = (areaId: string) => {
  return useDocuments({ area: areaId });
};

/**
 * Hook for batch operations (future enhancement)
 */
export const useBulkDeleteDocuments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentIds: string[]) => {
      const promises = documentIds.map((id) =>
        documentService.deleteDocument(id)
      );
      return await Promise.all(promises);
    },
    onSuccess: (_, documentIds) => {
      // Remove all from cache
      documentIds.forEach((id) => {
        queryClient.removeQueries({ queryKey: documentKeys.detail(id) });
      });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete documents:', error);
      toast.error('Failed to delete documents');
    },
  });
};

/**
 * Hook to download a document file
 */
export const useDownloadFile = () => {
  return useMutation({
    mutationFn: async (file: DataFile) => {
      if (file.file) {
        // For files that are File objects (newly uploaded), create download link
        const url = URL.createObjectURL(file.file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (file.fileUrl) {
        // For files with URLs (from server), use the download service
        await documentService.downloadDocument(file.id, file.fileName);
      } else {
        throw new Error('No downloadable file or URL available');
      }
    },
    onError: (error) => {
      console.error('Failed to download file:', error);
      toast.error('Failed to download file');
    },
  });
};
