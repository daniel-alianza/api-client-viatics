import { api } from './api';

export interface DocumentResponse {
  data: Blob;
  fileName?: string;
  contentType: string;
}

export const documentService = {
  /**
   * Obtiene un documento por su ID
   * @param documentId - ID del documento
   * @returns Promise con el blob del documento
   */
  async getDocument(documentId: number): Promise<DocumentResponse> {
    try {
      const response = await api.get(
        `/comprobaciones/documents/${documentId}`,
        {
          responseType: 'blob',
        },
      );

      return {
        data: response.data,
        fileName: response.headers['content-disposition']
          ? this.extractFileName(response.headers['content-disposition'])
          : undefined,
        contentType:
          response.headers['content-type'] || 'application/octet-stream',
      };
    } catch (error) {
      console.error('Error al obtener el documento:', error);
      throw new Error('Error al cargar el documento');
    }
  },

  /**
   * Extrae el nombre del archivo del header Content-Disposition
   * @param contentDisposition - Header Content-Disposition
   * @returns Nombre del archivo o undefined
   */
  extractFileName(contentDisposition: string): string | undefined {
    const filenameMatch = contentDisposition.match(
      /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
    );
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, '');
    }
    return undefined;
  },

  /**
   * Crea una URL de objeto para el blob del documento
   * @param blob - Blob del documento
   * @returns URL del objeto
   */
  createObjectURL(blob: Blob): string {
    return window.URL.createObjectURL(blob);
  },

  /**
   * Revoca una URL de objeto para liberar memoria
   * @param url - URL del objeto a revocar
   */
  revokeObjectURL(url: string): void {
    window.URL.revokeObjectURL(url);
  },
};
