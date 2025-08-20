import { openDB } from 'idb';
import localforage from 'localforage';

// IndexedDB for file blobs
const DB_NAME = 'CrestviewDocuments';
const DB_VERSION = 1;
const STORE_NAME = 'files';

// Initialize IndexedDB
let dbPromise;

const initDB = async () => {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
};

// Configure localforage for metadata
localforage.config({
  name: 'CrestviewHOA',
  storeName: 'documents_metadata',
  description: 'Document metadata storage for Crestview HOA'
});

// Document Storage Service
class DocumentStorageService {
  constructor() {
    this.init();
  }

  async init() {
    try {
      await initDB();
      console.log('Document storage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize document storage:', error);
    }
  }

  // Save document with file blob
  async saveDocument(documentData, fileBlob) {
    try {
      const db = await initDB();
      
      // Generate unique ID if not provided
      const documentId = documentData.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Prepare document metadata
      const metadata = {
        id: documentId,
        name: documentData.name,
        type: documentData.type,
        size: documentData.size,
        uploadDate: documentData.uploadDate || new Date().toISOString(),
        uploadedBy: documentData.uploadedBy || 'Current User',
        category: documentData.category || 'General',
        visibility: documentData.visibility || 'members',
        status: documentData.status || 'published',
        downloads: documentData.downloads || 0,
        lastModified: new Date().toISOString()
      };

      // Save file blob to IndexedDB
      await db.put(STORE_NAME, {
        id: documentId,
        blob: fileBlob,
        metadata: metadata
      });

      // Save metadata to localStorage for quick access
      const allDocuments = await this.getAllDocumentsMetadata();
      allDocuments[documentId] = metadata;
      await localforage.setItem('documents', allDocuments);

      console.log('Document saved successfully:', documentId);
      return { ...metadata, id: documentId };
    } catch (error) {
      console.error('Failed to save document:', error);
      throw new Error('Failed to save document: ' + error.message);
    }
  }

  // Get all documents metadata
  async getAllDocumentsMetadata() {
    try {
      const documents = await localforage.getItem('documents');
      return documents || {};
    } catch (error) {
      console.error('Failed to get documents metadata:', error);
      return {};
    }
  }

  // Get all documents as array
  async getAllDocuments() {
    try {
      const documentsObj = await this.getAllDocumentsMetadata();
      return Object.values(documentsObj);
    } catch (error) {
      console.error('Failed to get documents:', error);
      return [];
    }
  }

  // Get document file blob
  async getDocumentFile(documentId) {
    try {
      const db = await initDB();
      const result = await db.get(STORE_NAME, documentId);
      
      if (result && result.blob) {
        // Create object URL for the blob
        const url = URL.createObjectURL(result.blob);
        return url;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get document file:', error);
      return null;
    }
  }

  // Get document with file URL
  async getDocumentWithFile(documentId) {
    try {
      const documents = await this.getAllDocumentsMetadata();
      const metadata = documents[documentId];
      
      if (!metadata) {
        return null;
      }

      const fileUrl = await this.getDocumentFile(documentId);
      
      return {
        ...metadata,
        content: fileUrl
      };
    } catch (error) {
      console.error('Failed to get document with file:', error);
      return null;
    }
  }

  // Get all documents with file URLs
  async getAllDocumentsWithFiles() {
    try {
      const documents = await this.getAllDocuments();
      const documentsWithFiles = await Promise.all(
        documents.map(async (doc) => {
          const fileUrl = await this.getDocumentFile(doc.id);
          return {
            ...doc,
            content: fileUrl
          };
        })
      );
      
      return documentsWithFiles;
    } catch (error) {
      console.error('Failed to get documents with files:', error);
      return [];
    }
  }

  // Delete document
  async deleteDocument(documentId) {
    try {
      const db = await initDB();
      
      // Remove from IndexedDB
      await db.delete(STORE_NAME, documentId);
      
      // Remove from localStorage
      const documents = await this.getAllDocumentsMetadata();
      delete documents[documentId];
      await localforage.setItem('documents', documents);
      
      console.log('Document deleted successfully:', documentId);
      return true;
    } catch (error) {
      console.error('Failed to delete document:', error);
      return false;
    }
  }

  // Update document metadata
  async updateDocumentMetadata(documentId, updates) {
    try {
      const documents = await this.getAllDocumentsMetadata();
      
      if (!documents[documentId]) {
        throw new Error('Document not found');
      }
      
      documents[documentId] = {
        ...documents[documentId],
        ...updates,
        lastModified: new Date().toISOString()
      };
      
      await localforage.setItem('documents', documents);
      
      console.log('Document metadata updated:', documentId);
      return documents[documentId];
    } catch (error) {
      console.error('Failed to update document metadata:', error);
      throw error;
    }
  }

  // Get storage stats
  async getStorageStats() {
    try {
      const documents = await this.getAllDocuments();
      const totalDocuments = documents.length;
      
      // Calculate total size (approximate)
      let totalSize = 0;
      for (const doc of documents) {
        const sizeStr = doc.size || '0 B';
        const sizeMatch = sizeStr.match(/^([\d.]+)\s*(B|KB|MB|GB)$/i);
        if (sizeMatch) {
          const [, num, unit] = sizeMatch;
          const multipliers = { B: 1, KB: 1024, MB: 1024*1024, GB: 1024*1024*1024 };
          totalSize += parseFloat(num) * (multipliers[unit.toUpperCase()] || 1);
        }
      }
      
      // Format total size
      const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      return {
        totalDocuments,
        totalSize: formatSize(totalSize),
        totalSizeBytes: totalSize
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { totalDocuments: 0, totalSize: '0 B', totalSizeBytes: 0 };
    }
  }

  // Clear all documents (for development/testing)
  async clearAllDocuments() {
    try {
      const db = await initDB();
      await db.clear(STORE_NAME);
      await localforage.removeItem('documents');
      console.log('All documents cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear documents:', error);
      return false;
    }
  }

  // Export documents metadata (for backup)
  async exportDocumentsMetadata() {
    try {
      const documents = await this.getAllDocumentsMetadata();
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        documents: documents
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      
      return blob;
    } catch (error) {
      console.error('Failed to export documents metadata:', error);
      return null;
    }
  }
}

// Create and export singleton instance
const documentStorage = new DocumentStorageService();
export default documentStorage;

// Export class for testing
export { DocumentStorageService };