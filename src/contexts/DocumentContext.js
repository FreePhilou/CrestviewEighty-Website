import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DocumentContext = createContext(null);

// Mock document data with role-based visibility
const MOCK_DOCUMENTS = [
  {
    id: '1',
    name: 'CC&Rs - Covenants, Conditions & Restrictions',
    category: 'Legal',
    size: '2.4 MB',
    type: 'PDF',
    uploadDate: '2024-01-15',
    uploadedBy: 'Admin',
    status: 'published',
    downloads: 45,
    visibility: 'all',
    description: 'Complete covenants, conditions, and restrictions for Crestview Eighty HOA',
    tags: ['legal', 'rules', 'restrictions']
  },
  {
    id: '2',
    name: 'HOA Bylaws - 2024 Edition',
    category: 'Legal',
    size: '1.8 MB',
    type: 'PDF',
    uploadDate: '2024-01-20',
    uploadedBy: 'Board Chair',
    status: 'published',
    downloads: 38,
    visibility: 'all',
    description: 'Updated HOA bylaws governing community operations',
    tags: ['legal', 'bylaws', 'governance']
  },
  {
    id: '3',
    name: 'Budget Proposal - Q2 2024',
    category: 'Financial',
    size: '956 KB',
    type: 'PDF',
    uploadDate: '2024-03-01',
    uploadedBy: 'Treasurer',
    status: 'draft',
    downloads: 12,
    visibility: 'board',
    description: 'Quarterly budget proposal for board review',
    tags: ['financial', 'budget', 'quarterly']
  },
  {
    id: '4',
    name: 'Architectural Review Guidelines',
    category: 'Forms',
    size: '1.2 MB',
    type: 'PDF',
    uploadDate: '2024-02-10',
    uploadedBy: 'Admin',
    status: 'published',
    downloads: 23,
    visibility: 'all',
    description: 'Guidelines for architectural modifications and improvements',
    tags: ['forms', 'architecture', 'guidelines']
  },
  {
    id: '5',
    name: 'Board Meeting Minutes - February 2024',
    category: 'Minutes',
    size: '687 KB',
    type: 'PDF',
    uploadDate: '2024-02-28',
    uploadedBy: 'Secretary',
    status: 'published',
    downloads: 31,
    visibility: 'members',
    description: 'Minutes from February board meeting',
    tags: ['minutes', 'meetings', 'board']
  },
  {
    id: '6',
    name: 'Emergency Contact Procedures',
    category: 'Safety',
    size: '423 KB',
    type: 'PDF',
    uploadDate: '2024-03-05',
    uploadedBy: 'Admin',
    status: 'published',
    downloads: 67,
    visibility: 'all',
    description: 'Emergency procedures and contact information',
    tags: ['safety', 'emergency', 'contacts']
  },
  {
    id: '7',
    name: 'Pool Rules and Regulations',
    category: 'Recreation',
    size: '512 KB',
    type: 'PDF',
    uploadDate: '2024-02-15',
    uploadedBy: 'Admin',
    status: 'published',
    downloads: 89,
    visibility: 'all',
    description: 'Community pool usage rules and safety guidelines',
    tags: ['recreation', 'pool', 'rules']
  },
  {
    id: '8',
    name: 'Financial Audit Report 2023',
    category: 'Financial',
    size: '3.2 MB',
    type: 'PDF',
    uploadDate: '2024-01-30',
    uploadedBy: 'Accountant',
    status: 'published',
    downloads: 15,
    visibility: 'members',
    description: 'Annual financial audit report',
    tags: ['financial', 'audit', 'annual']
  }
];

const DOCUMENT_CATEGORIES = [
  'Legal',
  'Financial', 
  'Forms',
  'Minutes',
  'Safety',
  'Recreation',
  'Policies',
  'Maintenance'
];

const VISIBILITY_OPTIONS = [
  { value: 'all', label: 'Public', color: 'emerald', description: 'Visible to everyone' },
  { value: 'members', label: 'Members Only', color: 'blue', description: 'Visible to HOA members only' },
  { value: 'board', label: 'Board Only', color: 'violet', description: 'Visible to board members only' },
  { value: 'admin', label: 'Admin Only', color: 'red', description: 'Visible to administrators only' }
];

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, hasRole } = useAuth();

  // Filter documents based on user role and visibility
  const getVisibleDocuments = () => {
    if (!user) return [];
    
    return documents.filter(doc => {
      switch (doc.visibility) {
        case 'all':
          return true;
        case 'members':
          return hasRole('member');
        case 'board':
          return hasRole('board');
        case 'admin':
          return hasRole('admin');
        default:
          return false;
      }
    });
  };

  const addDocument = async (documentData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDocument = {
        id: Date.now().toString(),
        ...documentData,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: user?.name || 'Unknown',
        downloads: 0,
        tags: documentData.tags || []
      };
      
      setDocuments(prev => [...prev, newDocument]);
      return newDocument;
    } catch (err) {
      setError('Failed to upload document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocument = async (documentId, updates) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, ...updates }
            : doc
        )
      );
    } catch (err) {
      setError('Failed to update document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (documentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      setError('Failed to delete document');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const incrementDownload = async (documentId) => {
    try {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, downloads: doc.downloads + 1 }
            : doc
        )
      );
    } catch (err) {
      console.error('Failed to increment download count:', err);
    }
  };

  const searchDocuments = (query, category = 'all') => {
    const visibleDocs = getVisibleDocuments();
    
    return visibleDocs.filter(doc => {
      const matchesSearch = !query || 
        doc.name.toLowerCase().includes(query.toLowerCase()) ||
        doc.description?.toLowerCase().includes(query.toLowerCase()) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
      const matchesCategory = category === 'all' || doc.category === category;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getDocumentsByCategory = () => {
    const visibleDocs = getVisibleDocuments();
    return DOCUMENT_CATEGORIES.reduce((acc, category) => {
      acc[category] = visibleDocs.filter(doc => doc.category === category);
      return acc;
    }, {});
  };

  const getDocumentStats = () => {
    const visibleDocs = getVisibleDocuments();
    return {
      total: visibleDocs.length,
      published: visibleDocs.filter(doc => doc.status === 'published').length,
      draft: visibleDocs.filter(doc => doc.status === 'draft').length,
      totalDownloads: visibleDocs.reduce((sum, doc) => sum + doc.downloads, 0),
      categories: [...new Set(visibleDocs.map(doc => doc.category))].length
    };
  };

  const value = {
    documents: getVisibleDocuments(),
    allDocuments: documents,
    categories: DOCUMENT_CATEGORIES,
    visibilityOptions: VISIBILITY_OPTIONS,
    isLoading,
    error,
    
    // Actions
    addDocument,
    updateDocument,
    deleteDocument,
    incrementDownload,
    searchDocuments,
    getDocumentsByCategory,
    getDocumentStats,
    
    // Utilities
    clearError: () => setError(null)
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export default DocumentContext;