import { apiClient } from '@/lib/api';

// Base Document interface matching API response
export interface Document {
  _id: string;
  areaId: string;
  title: string;
  link: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response interfaces
export interface DocumentResponse {
  success: boolean;
  data: Document;
  message?: string;
}

export interface DocumentListResponse {
  success: boolean;
  data: Document[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

// Query parameters for filtering
export interface DocumentFilters {
  page?: number;
  pageSize?: number;
  area?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Form data for creating/updating documents
export interface CreateDocumentData {
  areaId: string;
  title: string;
  link: string;
  file?: File;
}

export type UpdateDocumentData = Partial<CreateDocumentData>;

class DocumentService {
  private readonly baseUrl = '/document';

  /**
   * Get all documents with optional filtering
   */
  async getDocuments(
    filters: DocumentFilters = {}
  ): Promise<DocumentListResponse> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize)
      params.append('pageSize', filters.pageSize.toString());
    if (filters.area) params.append('area', filters.area);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    return await apiClient.get<DocumentListResponse>(
      `${this.baseUrl}/all?${params}`
    );
  }

  /**
   * Get a document by ID
   */
  async getDocument(documentId: string): Promise<DocumentResponse> {
    return await apiClient.get<DocumentResponse>(
      `${this.baseUrl}/${documentId}`
    );
  }

  /**
   * Create a new document
   */
  async createDocument(
    documentData: CreateDocumentData
  ): Promise<DocumentResponse> {
    const formData = new FormData();

    formData.append('areaId', documentData.areaId);
    formData.append('title', documentData.title);
    formData.append('link', documentData.link);

    if (documentData.file) {
      formData.append('file', documentData.file);
    }

    return await apiClient.post<DocumentResponse>(this.baseUrl, formData);
  }

  /**
   * Update a document
   */
  async updateDocument(
    documentId: string,
    documentData: UpdateDocumentData
  ): Promise<DocumentResponse> {
    const formData = new FormData();

    if (documentData.areaId) formData.append('areaId', documentData.areaId);
    if (documentData.title) formData.append('title', documentData.title);
    if (documentData.link) formData.append('link', documentData.link);

    if (documentData.file) {
      formData.append('file', documentData.file);
    }

    return await apiClient.put<DocumentResponse>(
      `${this.baseUrl}/${documentId}`,
      formData
    );
  }

  /**
   * Delete a document
   */
  async deleteDocument(
    documentId: string
  ): Promise<{ success: boolean; message?: string }> {
    return await apiClient.delete<{ success: boolean; message?: string }>(
      `${this.baseUrl}/${documentId}`
    );
  }
}

// Export singleton instance
export const documentService = new DocumentService();

// Helper functions for data transformation
export const mapDocumentToDataFile = (document: Document) => ({
  id: document._id,
  documentName: document.title,
  fileName: document.fileName || 'document',
  fileType: document.fileType || 'application/octet-stream',
  fileSize: document.fileSize || 0,
  createdDate: new Date(document.createdAt).toISOString().split('T')[0],
  status: 'active' as const,
  fileUrl: document.fileUrl || document.link,
  uploadedBy: 'System User',
  description: document.title,
  category: 'other' as const, // Default category, can be determined by areaId logic
  regency: document.areaId, // Using areaId as regency identifier
});

export const mapDataFileToDocument = (dataFile: {
  regency?: string;
  areaId?: string;
  documentName?: string;
  title?: string;
  fileUrl?: string;
  link?: string;
  file?: File;
}): CreateDocumentData => ({
  areaId: dataFile.regency || dataFile.areaId || '16.01',
  title: dataFile.documentName || dataFile.title || '',
  link: dataFile.fileUrl || dataFile.link || '',
  file: dataFile.file,
});
