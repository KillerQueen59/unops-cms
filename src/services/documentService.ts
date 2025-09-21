import { apiClient } from '@/lib/api';
import { PaginatedResponse } from '@/types/common';
import { DataFile } from '@/types/data';

// Base Document interface matching API response
export interface Document {
  _id: string;
  areaId?: string;
  title: string;
  link: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data for creating/updating documents
export interface CreateDocumentData {
  areaId?: string;
  title: string;
  link?: string;
  file?: File;
}

export type UpdateDocumentData = Partial<CreateDocumentData>;

// Query parameters for filtering
export interface DocumentFilters {
  page?: number;
  pageSize?: number;
  area?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Pagination interfaces
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  search?: string;
  area?: string;
  sortBy?: string;
  sortOrder?: string;
}

// API Response interfaces
interface DocumentApiResponse {
  status: boolean;
  message: string;
  data: {
    documents: Document[];
    totalData: number;
  };
}

interface SingleDocumentApiResponse {
  status: boolean;
  message: string;
  data: Document;
}

// Transform API response to our internal format
const transformDocumentFromAPI = (apiDocument: Document): DataFile => {
  return {
    id: apiDocument._id,
    documentName: apiDocument.title,
    fileName: apiDocument.fileName || 'document',
    fileType: apiDocument.fileType || 'application/octet-stream',
    fileSize: apiDocument.fileSize || 0,
    createdDate: new Date(apiDocument.createdAt).toISOString().split('T')[0],
    status: 'active' as const,
    fileUrl: apiDocument.fileUrl || apiDocument.link,
    uploadedBy: 'System User',
    description: apiDocument.title,
    category: 'other' as const,
    regency: apiDocument.areaId,
  };
};

// Document API Service
export const documentService = {
  async getDocuments(
    params?: PaginationParams
  ): Promise<PaginatedResponse<DataFile>> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize)
        queryParams.append('pageSize', params.pageSize.toString());
      if (params?.search) queryParams.append('search', params.search);
      if (params?.area) queryParams.append('area', params.area);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `/document/all${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<DocumentApiResponse>(url);

      if (response.status && response.data?.documents) {
        const documents = response.data.documents.map(transformDocumentFromAPI);
        const totalData = response.data.totalData || documents.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;

        return {
          data: documents,
          totalData,
          page,
          limit: pageSize,
          totalPages: Math.ceil(totalData / pageSize),
        };
      }

      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      return {
        data: [],
        totalData: 0,
        page: params?.page || 1,
        limit: params?.pageSize || 10,
        totalPages: 0,
      };
    }
  },

  async getDocument(documentId: string): Promise<DataFile> {
    try {
      const response = await apiClient.get<SingleDocumentApiResponse>(
        `/document/${documentId}`
      );

      if (response.status && response.data) {
        return transformDocumentFromAPI(response.data);
      }
      throw new Error('Document not found');
    } catch (error) {
      console.error('Failed to fetch document by ID:', error);
      throw error;
    }
  },

  async createDocument(documentData: CreateDocumentData): Promise<{
    status: boolean;
    message: string;
  }> {
    const formData = new FormData();

    if (documentData.areaId) {
      formData.append('areaId', documentData.areaId);
    }

    formData.append('title', documentData.title);

    if (documentData.link) {
      formData.append('link', documentData.link);
    }

    if (documentData.file) {
      formData.append('file', documentData.file);
    }

    const response = await apiClient.post<SingleDocumentApiResponse>(
      '/document',
      formData
    );
    return {
      status: response.status,
      message: response.message,
    };
  },

  async updateDocument(
    documentId: string,
    documentData: UpdateDocumentData
  ): Promise<{
    status: boolean;
    message: string;
  }> {
    const formData = new FormData();

    if (documentData.areaId) formData.append('areaId', documentData.areaId);
    if (documentData.title) formData.append('title', documentData.title);
    if (documentData.link) formData.append('link', documentData.link);

    if (documentData.file) {
      formData.append('file', documentData.file);
    }

    const response = await apiClient.put<SingleDocumentApiResponse>(
      `/document/${documentId}`,
      formData
    );
    return {
      status: response.status,
      message: response.message,
    };
  },

  async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete(`/document/${documentId}`);
  },

  /**
   * Download a document file
   */
  async downloadDocument(documentId: string, fileName: string): Promise<void> {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      throw error;
    }
  },
};
