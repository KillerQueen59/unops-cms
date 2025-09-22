export interface DataFile extends Record<string, unknown> {
  _id: string;
  areaId: string;
  title: string;
  fileUrl: string;
  mimetype: string;
  updatedAt: string;
  createdAt: string;
  file?: File;
  documentName?: string;
  fileName?: string;
  fileSize?: number;
  description?: string;
  uploadedBy?: string;
}

export type DataTable = DataFile;
