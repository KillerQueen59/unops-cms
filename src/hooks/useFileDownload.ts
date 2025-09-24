import { DataFile } from '@/types/data';
import { useState } from 'react';

export const useFileDownload = () => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getFileName = (file: DataFile): string => {
    // First priority: documentName if available
    if (file.documentName) {
      const cleanDocumentName = file.documentName.trim();
      // Check if documentName already has an extension
      if (cleanDocumentName.includes('.')) {
        return cleanDocumentName;
      }
      // If no extension, add one based on mimetype
      const extension = getFileExtension(file.mimetype);
      return `${cleanDocumentName}.${extension}`;
    }

    // Second priority: fileName if available
    if (file.fileName) return file.fileName;

    // Third priority: extract from URL
    const urlParts = file.fileUrl.split('/');
    const urlFilename = urlParts[urlParts.length - 1];

    if (urlFilename && urlFilename.includes('.')) {
      return decodeURIComponent(urlFilename);
    }

    // Last resort: use title
    const extension = getFileExtension(file.mimetype);
    const cleanTitle = file.title
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    return `${cleanTitle}.${extension}`;
  };

  const getFileExtension = (mimetype: string): string => {
    const extensionMap: { [key: string]: string } = {
      'application/pdf': 'pdf',
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
      'application/msword': 'doc',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.ms-powerpoint': 'ppt',
      'text/csv': 'csv',
      'application/zip': 'zip',
      'text/plain': 'txt',
      'application/json': 'json',
      'text/html': 'html',
    };

    return extensionMap[mimetype] || mimetype.split('/')[1] || 'file';
  };

  const downloadFile = async (file: DataFile) => {
    setDownloading(file._id);
    setError(null);

    try {
      const fullUrl = file.fileUrl.startsWith('http')
        ? file.fileUrl
        : `${file.fileUrl}`;

      // Try direct download first
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          Accept: '*/*',
        },
        mode: 'cors',
      });

      console.log('response', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // Get filename
      let filename = getFileName(file);

      // Try to get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      return true;
    } catch (error) {
      console.error('Download failed:', error);
      setError('Download failed. Please try again.');

      // Fallback: open in new tab
      try {
        const fullUrl = file.fileUrl.startsWith('http')
          ? file.fileUrl
          : `https://${file.fileUrl}`;

        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = getFileName(file);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Fallback failed:', fallbackError);
      }

      return false;
    } finally {
      setDownloading(null);
    }
  };

  const clearError = () => setError(null);

  return {
    downloadFile,
    downloading,
    error,
    clearError,
    isDownloading: (fileId: string) => downloading === fileId,
  };
};
