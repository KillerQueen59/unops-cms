export interface DataFile extends Record<string, unknown> {
  id: string;
  documentName: string;
  createdDate: string;
  fileSize: number;
  fileType: string;
  fileName: string;
  description?: string;
  uploadedBy?: string;
  status: 'active' | 'archived';
  file?: File;
  fileUrl?: string;
}

export type DataTable = DataFile;
