import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  documentService,
  DocumentFilters,
  CreateDocumentData,
  UpdateDocumentData,
  mapDocumentToDataFile,
} from '@/services/documentService';
import { DataFile } from '@/types/data';

// Query Keys
export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (filters: DocumentFilters) =>
    [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
} as const;

/**
 * Hook to fetch all documents with filtering
 */
export const useDocuments = (filters: DocumentFilters = {}) => {
  return useQuery({
    queryKey: documentKeys.list(filters),
    queryFn: async () => {
      const response = await documentService.getDocuments(filters);
      // Transform documents to DataFile format for UI compatibility
      const dataFiles: DataFile[] = response.data.map(mapDocumentToDataFile);
      return {
        ...response,
        data: dataFiles,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch a single document by ID
 */
export const useDocument = (documentId: string) => {
  return useQuery({
    queryKey: documentKeys.detail(documentId),
    queryFn: async () => {
      const response = await documentService.getDocument(documentId);
      return {
        ...response,
        data: mapDocumentToDataFile(response.data),
      };
    },
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a new document
 */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentData: CreateDocumentData) => {
      return await documentService.createDocument(documentData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });

      // Add the new document to cache
      const newDataFile = mapDocumentToDataFile(data.data);
      queryClient.setQueryData(documentKeys.detail(data.data._id), {
        success: true,
        data: newDataFile,
      });
    },
    onError: (error) => {
      console.error('Failed to create document:', error);
    },
  });
};

/**
 * Hook to update an existing document
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      documentId,
      documentData,
    }: {
      documentId: string;
      documentData: UpdateDocumentData;
    }) => {
      return await documentService.updateDocument(documentId, documentData);
    },
    onSuccess: (data, variables) => {
      // Update the specific document in cache
      const updatedDataFile = mapDocumentToDataFile(data.data);
      queryClient.setQueryData(documentKeys.detail(variables.documentId), {
        success: true,
        data: updatedDataFile,
      });

      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update document:', error);
    },
  });
};

/**
 * Hook to delete a document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentId: string) => {
      return await documentService.deleteDocument(documentId);
    },
    onSuccess: (_, documentId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: documentKeys.detail(documentId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete document:', error);
    },
  });
};

/**
 * Legacy hook name for backward compatibility
 */
export const useDataFiles = (filters: DocumentFilters = {}) => {
  return useDocuments(filters);
};

/**
 * Legacy hook name for backward compatibility
 */
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
      areaId: string;
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
    onSuccess: (data) => {
      // Invalidate and refetch documents list
      queryClient.invalidateQueries({ queryKey: documentKeys.lists() });

      // Add the new document to cache
      const newDataFile = mapDocumentToDataFile(data.data);
      queryClient.setQueryData(documentKeys.detail(data.data._id), {
        success: true,
        data: newDataFile,
      });
    },
    onError: (error) => {
      console.error('Failed to upload document:', error);
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
    },
  });
};
