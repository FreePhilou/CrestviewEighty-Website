import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Download, Eye, MoreVertical, Search, Filter, Grid3X3, List, Folder,
  ArrowLeft, Menu, MessageCircle, Settings, File, Calendar, Database, Shield, UserCheck,
  Globe, Lock, Users as UsersIcon, ChevronDown, Plus, X, AlertCircle, Sidebar, Maximize2, Edit3, FileImage
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import documentStorage from '../../services/documentStorage';

// Enhanced Image Component with TIFF support
const TiffImage = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const isTiffFile = src && (
    alt.toLowerCase().includes('.tif') || 
    alt.toLowerCase().includes('.tiff') ||
    src.toLowerCase().includes('.tif') ||
    src.toLowerCase().includes('.tiff')
  );

  // For TIFF files, show special handling immediately
  if (isTiffFile) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileImage className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white text-xl font-bold mb-2">TIFF Image File</h3>
          <p className="text-slate-300 text-sm mb-1 font-medium">{alt}</p>
          <p className="text-slate-400 text-xs mb-6 max-w-xs">
            TIFF files require specialized software to view. This is a high-quality image format commonly used for maps and professional documents.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = src;
                link.download = alt;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Download TIFF File
            </button>
            <p className="text-slate-500 text-xs">
              You can view this file with image editors like Photoshop, GIMP, or Windows Photo Viewer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg">
          <div className="text-white/60 text-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs">Loading image...</p>
          </div>
        </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-contain ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
};

const DocumentManagement = ({ isDocumentFullScreen, setIsDocumentFullScreen, recentActivities, setRecentActivities }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const viewMode = 'list';
  const [folderStructure, setFolderStructure] = useState(() => {
    // Load folder structure from localStorage
    const saved = localStorage.getItem('folderStructure');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Restore icon references
        Object.keys(parsed).forEach(key => {
          if (parsed[key]) {
            switch (parsed[key].color) {
              case 'blue': parsed[key].icon = key === 'All' ? FileText : Folder; break;
              case 'red': parsed[key].icon = Shield; break;
              case 'green': parsed[key].icon = Database; break;
              case 'purple': parsed[key].icon = Calendar; break;
              default: parsed[key].icon = Folder; break;
            }
          }
        });
        return parsed;
      } catch (error) {
        console.error('Failed to load folder structure from localStorage:', error);
      }
    }
    // Default folder structure
    return {
      'All': { name: 'All Documents', icon: FileText, color: 'blue', children: [] },
      'Governing': { name: 'Governing Documents', icon: Shield, color: 'red', children: [] },
      'Financial': { name: 'Financial Reports', icon: Database, color: 'green', children: [] },
      'Meeting Minutes': { name: 'Meeting Minutes', icon: Calendar, color: 'purple', children: [] }
    };
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPanel, setCurrentPanel] = useState('folders');
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isPageFullScreen, setIsPageFullScreen] = useState(false);
  const [showDocumentMenu, setShowDocumentMenu] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  // Save folder structure to localStorage whenever it changes
  useEffect(() => {
    try {
      // Create a version without icon functions for JSON serialization
      const serializableStructure = {};
      Object.keys(folderStructure).forEach(key => {
        if (folderStructure[key]) {
          serializableStructure[key] = {
            name: folderStructure[key].name,
            color: folderStructure[key].color,
            children: folderStructure[key].children || []
          };
        }
      });
      localStorage.setItem('folderStructure', JSON.stringify(serializableStructure));
    } catch (error) {
      console.error('Failed to save folder structure to localStorage:', error);
    }
  }, [folderStructure]);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, selectedCategory]);

  // Close document menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDocumentMenu && !event.target.closest('.document-menu')) {
        setShowDocumentMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDocumentMenu]);

  // Handle ESC key functionality
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        if (isPageFullScreen) {
          setIsPageFullScreen(false);
          setShowChatbot(false);
        } else if (showChatbot) {
          setShowChatbot(false);
        } else if (currentPanel === 'documents' || currentFolder) {
          navigateBack();
        } else if (showDocumentMenu) {
          setShowDocumentMenu(null);
        } else if (editingDocument) {
          setEditingDocument(null);
        } else if (editingFolder) {
          setEditingFolder(null);
        } else if (showUpload) {
          setShowUpload(false);
        } else if (showCreateFolder) {
          setShowCreateFolder(false);
          setNewFolderName('');
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPageFullScreen, showChatbot, currentPanel, currentFolder, showDocumentMenu, editingDocument, editingFolder, showUpload, showCreateFolder]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const loadedDocuments = await documentStorage.getAllDocumentsWithFiles();
      setDocuments(loadedDocuments);
      
      const updatedFolderStructure = { ...folderStructure };
      // Add all documents to 'All' folder
      updatedFolderStructure['All'].children = loadedDocuments.map(doc => doc.id);
      
      loadedDocuments.forEach(doc => {
        const category = doc.category || 'All';
        if (updatedFolderStructure[category] && category !== 'All') {
          updatedFolderStructure[category].children.push(doc.id);
        }
      });
      setFolderStructure(updatedFolderStructure);
      
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterDocuments = () => {
    let filtered = documents;
    
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }
    
    setFilteredDocuments(filtered);
  };

  const resetNavigation = () => {
    setCurrentPanel('folders');
    setCurrentFolder(null);
    setNavigationStack([]);
    setSidebarCollapsed(false);
    setIsDocumentFullScreen(false);
  };


  const navigateToFolder = (folder) => {
    setNavigationStack(prev => [...prev, { panel: currentPanel, folder: currentFolder }]);
    setCurrentFolder(folder);
    setCurrentPanel('documents');
    setSidebarCollapsed(true);
  };

  const navigateBack = () => {
    if (navigationStack.length > 0) {
      const lastState = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setCurrentPanel(lastState.panel);
      setCurrentFolder(lastState.folder);
      if (lastState.panel === 'folders') {
        setSidebarCollapsed(false);
      }
    }
  };

  // Handle mouse back/forward buttons
  useEffect(() => {
    const handleMouseButton = (event) => {
      if (event.button === 3) { // Back button
        event.preventDefault();
        if (navigationStack.length > 0) {
          navigateBack();
        }
      } else if (event.button === 4) { // Forward button  
        event.preventDefault();
        // For forward functionality, we could implement a forward stack if needed
        // For now, just prevent default browser behavior
      }
    };

    document.addEventListener('mousedown', handleMouseButton);
    return () => {
      document.removeEventListener('mousedown', handleMouseButton);
    };
  }, [navigationStack, navigateBack]);

  const getVisibilityConfig = (visibility) => {
    const configs = {
      admin: { color: 'red', icon: Shield, label: 'Admin Only' },
      board: { color: 'amber', icon: UserCheck, label: 'Board Members' },
      members: { color: 'green', icon: UsersIcon, label: 'All Members' },
      public: { color: 'blue', icon: Globe, label: 'Public' }
    };
    return configs[visibility] || configs.members;
  };

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type.includes('pdf') ? 'PDF' : 
            (file.type.includes('image') || file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) ? 'TIFF' : 
            'Document',
      category: currentFolder?.id || 'All',
      visibility: 'members',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User'
    }));
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, [currentFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileUpload = async () => {
    setIsLoading(true);
    try {
      const uploadPromises = uploadFiles.map(async (fileData) => {
        const docData = {
          name: fileData.name,
          category: fileData.category,
          size: fileData.size,
          type: fileData.type,
          uploadDate: fileData.uploadDate,
          uploadedBy: fileData.uploadedBy,
          status: 'published',
          downloads: 0,
          visibility: fileData.visibility
        };
        
        const savedDocument = await documentStorage.saveDocument(docData, fileData.file);
        return await documentStorage.getDocumentWithFile(savedDocument.id);
      });
      
      const uploadedDocs = await Promise.all(uploadPromises);
      setDocuments(prev => [...prev, ...uploadedDocs]);
      
      const updatedFolderStructure = { ...folderStructure };
      uploadedDocs.forEach(doc => {
        const category = doc.category || 'All';
        // Always add to 'All' folder
        if (!updatedFolderStructure['All'].children.includes(doc.id)) {
          updatedFolderStructure['All'].children.push(doc.id);
        }
        // Add to specific category if it's not 'All'
        if (category !== 'All' && updatedFolderStructure[category]) {
          updatedFolderStructure[category].children.push(doc.id);
        }
      });
      setFolderStructure(updatedFolderStructure);
      
      // Add to recent activities
      if (setRecentActivities && uploadedDocs.length > 0) {
        const newActivities = uploadedDocs.map(doc => ({
          text: `Document uploaded: ${doc.name}`,
          time: 'Just now',
          type: 'document'
        }));
        setRecentActivities(prev => [...newActivities, ...prev].slice(0, 10)); // Keep only last 10 activities
      }
      
      setUploadFiles([]);
      setShowUpload(false);
    } catch (error) {
      console.error('Failed to upload files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', ...Object.keys(folderStructure).filter(key => key !== 'All')];

  const getFolderDocuments = (folderId) => {
    if (!folderId) return [];
    
    let docs = [];
    if (folderId === 'All') {
      docs = documents;
    } else {
      docs = documents.filter(doc => doc.category === folderId);
    }
    
    // Apply search filter
    if (searchTerm) {
      docs = docs.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return docs;
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      name: newFolderName,
      icon: Folder,
      color: 'blue',
      children: []
    };
    
    setFolderStructure(prev => ({
      ...prev,
      [newFolderName]: newFolder
    }));
    
    // Set the newly created folder as the current folder
    setCurrentFolder({ id: newFolderName, ...newFolder });
    
    // Update any existing files in the upload queue to use the new folder
    setUploadFiles(prev => prev.map(file => ({
      ...file,
      category: newFolderName
    })));
    
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  // Delete document
  const handleDeleteDocument = async (docId) => {
    try {
      await documentStorage.deleteDocument(docId);
      setDocuments(prev => prev.filter(doc => doc.id !== docId));
      
      // Update folder structure
      const updatedFolderStructure = { ...folderStructure };
      Object.keys(updatedFolderStructure).forEach(key => {
        updatedFolderStructure[key].children = updatedFolderStructure[key].children.filter(id => id !== docId);
      });
      setFolderStructure(updatedFolderStructure);
      setShowDocumentMenu(null);
      setEditingDocument(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  // Update document
  const handleUpdateDocument = async (docId, updates) => {
    try {
      await documentStorage.updateDocumentMetadata(docId, updates);
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, ...updates } : doc
      ));
      
      // If category changed, update folder structure
      if (updates.category) {
        const updatedFolderStructure = { ...folderStructure };
        // Remove from old category
        Object.keys(updatedFolderStructure).forEach(key => {
          updatedFolderStructure[key].children = updatedFolderStructure[key].children.filter(id => id !== docId);
        });
        // Add to new category
        if (updatedFolderStructure[updates.category]) {
          updatedFolderStructure[updates.category].children.push(docId);
        }
        // Always keep in 'All'
        if (!updatedFolderStructure['All'].children.includes(docId)) {
          updatedFolderStructure['All'].children.push(docId);
        }
        setFolderStructure(updatedFolderStructure);
      }
      
      setEditingDocument(null);
      setShowDocumentMenu(null);
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  // Update folder name
  const handleUpdateFolder = async (folderId, newName) => {
    if (!newName.trim() || folderId === 'All') return;
    
    try {
      // Update folder structure
      const updatedFolderStructure = { ...folderStructure };
      if (updatedFolderStructure[folderId]) {
        updatedFolderStructure[newName] = {
          ...updatedFolderStructure[folderId],
          name: newName
        };
        delete updatedFolderStructure[folderId];
      }
      setFolderStructure(updatedFolderStructure);
      
      // Update all documents with the old folder category to use the new name
      const updatedDocuments = documents.map(doc => 
        doc.category === folderId ? { ...doc, category: newName } : doc
      );
      setDocuments(updatedDocuments);
      
      // Update documents in storage
      for (const doc of updatedDocuments) {
        if (doc.category === newName && documents.find(d => d.id === doc.id)?.category === folderId) {
          await documentStorage.updateDocumentMetadata(doc.id, { category: newName });
        }
      }
      
      // Update current folder if it's the one being edited
      if (currentFolder?.id === folderId) {
        setCurrentFolder({ id: newName, ...updatedFolderStructure[newName] });
      }
      
      setEditingFolder(null);
    } catch (error) {
      console.error('Failed to update folder:', error);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId) => {
    if (folderId === 'All') return;
    
    try {
      // Move all documents from this folder to 'All'
      const docsInFolder = documents.filter(doc => doc.category === folderId);
      for (const doc of docsInFolder) {
        await documentStorage.updateDocumentMetadata(doc.id, { category: 'All' });
      }
      
      // Update local documents
      const updatedDocuments = documents.map(doc => 
        doc.category === folderId ? { ...doc, category: 'All' } : doc
      );
      setDocuments(updatedDocuments);
      
      // Remove folder from structure
      const updatedFolderStructure = { ...folderStructure };
      delete updatedFolderStructure[folderId];
      setFolderStructure(updatedFolderStructure);
      
      // Navigate back if we're currently viewing the deleted folder
      if (currentFolder?.id === folderId) {
        navigateBack();
      }
      
      setEditingFolder(null);
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  // Toggle full page mode
  const toggleFullPageMode = () => {
    setIsPageFullScreen(!isPageFullScreen);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex overflow-hidden">
      {/* Animated Sidebar Navigation */}
      <motion.div 
        className="flex h-full"
        animate={{
          x: isDocumentFullScreen ? -500 : 0,
          opacity: isDocumentFullScreen ? 0 : 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
      >
        
        {/* Collapsed Navigation Column (Always Visible) */}
        <motion.div 
          className="bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col"
          animate={{ width: sidebarCollapsed ? 60 : 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
        >
          {sidebarCollapsed && (
            <div className="p-4 space-y-4">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-full p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <Menu className="w-5 h-5 mx-auto" />
              </button>
              <div className="space-y-2">
                <button
                  onClick={resetNavigation}
                  className={`w-full p-2 rounded-lg transition-all duration-200 ${ currentPanel === 'folders' 
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Folder className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Sidebar Panel Container */}
        <div className="relative">
          {/* Main Folders Panel */}
          <motion.div
            animate={{
              x: currentPanel === 'documents' ? -320 : 0,
              opacity: 1
            }}
            transition={{ type: "spring", damping: 30, stiffness: 400, duration: 0.3 }}
            className="w-96 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-white">Document Library</h1>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateFolder(true)}
                    className="flex items-center gap-2 px-3 py-2 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Create Folder</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowUpload(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 shadow-lg cursor-pointer select-none"
                    style={{ pointerEvents: 'all' }}
                  >
                    <Upload className="w-4 h-4 pointer-events-none" />
                    <span className="text-sm font-medium pointer-events-none">Upload</span>
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(e.target.value.length > 0);
                  }}
                  onFocus={() => searchTerm.length > 0 && setShowSearchResults(true)}
                  onBlur={(e) => {
                    // Delay hiding to allow clicks on results
                    setTimeout(() => setShowSearchResults(false), 150);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
                    {documents.filter(doc => 
                      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      doc.category.toLowerCase().includes(searchTerm.toLowerCase())
                    ).length > 0 ? (
                      documents.filter(doc => 
                        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((doc, index) => (
                        <div
                          key={doc.id}
                          className="p-3 hover:bg-white/10 border-b border-white/10 last:border-b-0 cursor-pointer transition-colors"
                          onClick={() => {
                            // Navigate to document's folder and select document
                            const folder = Object.entries(folderStructure).find(([key]) => key === doc.category);
                            if (folder) {
                              navigateToFolder({ id: folder[0], ...folder[1] });
                              setTimeout(() => setSelectedDocument(doc), 100);
                            }
                            setShowSearchResults(false);
                            setSearchTerm('');
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{doc.name}</p>
                              <p className="text-white/60 text-xs">{doc.category} • {doc.size}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-white/60">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No documents found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Folders List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {Object.entries(folderStructure).map(([key, category]) => {
                  const folderDocs = getFolderDocuments(key);
                  return (
                    <motion.button
                      key={key}
                      onClick={() => navigateToFolder({ id: key, ...category })}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-gradient-to-br from-${category.color}-400 to-${category.color}-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200`}>
                          <category.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-left mb-1 truncate group-hover:text-blue-200 transition-colors">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 bg-${category.color}-500/30 text-${category.color}-300 rounded-full flex items-center justify-center text-xs font-bold`}>
                              {folderDocs.length}
                            </div>
                            <span className="text-white/60 text-xs">
                              {folderDocs.length === 1 ? 'document' : 'documents'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Documents Panel - Slides in from behind */}
          <motion.div
            initial={{ x: 320 }}
            animate={{
              x: currentPanel === 'documents' && currentFolder ? 0 : 320,
              opacity: currentPanel === 'documents' && currentFolder ? 1 : 0
            }}
            transition={{ type: "spring", damping: 30, stiffness: 400, duration: 0.3 }}
            className="absolute top-0 left-0 w-96 h-full bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col z-20"
          >
            {currentFolder && (
              <>
                {/* Documents Panel Header */}
                <div className="p-6 border-b border-white/10">
                  <div 
                    className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-all duration-200"
                    onClick={navigateBack}
                  >
                    <div className="p-2 text-white/70">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                    <div className={`w-10 h-10 bg-gradient-to-br from-${currentFolder.color}-400 to-${currentFolder.color}-600 rounded-xl flex items-center justify-center`}>
                      <currentFolder.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-white">{currentFolder.name}</h2>
                      <p className="text-xs text-blue-300">{getFolderDocuments(currentFolder.id).length} documents</p>
                    </div>
                    {currentFolder.id !== 'All' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolder(currentFolder);
                        }}
                        className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                        title="Edit Folder"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Documents List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                      <p className="text-white/70 text-sm">Loading documents...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getFolderDocuments(currentFolder.id).map((doc) => {
                        const visibilityConfig = getVisibilityConfig(doc.visibility);
                        const IconComponent = visibilityConfig.icon;
                        
                        return (
                          <motion.button
                            key={doc.id}
                            onClick={() => setSelectedDocument(doc)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full p-3 flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-150 group text-left"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-sm font-medium truncate mb-1">{doc.name}</h4>
                              <div className="flex items-center gap-2 text-xs text-white/60">
                                <span>{doc.type}</span>
                                <span>•</span>
                                <span>{doc.size}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`flex items-center gap-1 px-2 py-1 bg-${visibilityConfig.color}-500/20 rounded-md`}>
                                <IconComponent className={`w-3 h-3 text-${visibilityConfig.color}-300`} />
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingDocument(doc);
                                }}
                                className="p-1 text-white/40 hover:text-white/70 hover:bg-white/10 rounded transition-colors"
                                title="Edit Document"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {!isLoading && getFolderDocuments(currentFolder.id).length === 0 && (
                    <div className="text-center py-12">
                      <Folder className="w-16 h-16 text-white/30 mx-auto mb-4" />
                      <h3 className="text-white text-lg font-medium mb-2">No documents yet</h3>
                      <p className="text-white/60 text-sm mb-4">Upload your first document to get started.</p>
                      <button
                        onClick={() => setShowUpload(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                      >
                        Upload Document
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {selectedDocument ? (
          /* Document Viewer */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-black/10 backdrop-blur-sm flex"
          >
            {/* Document Viewer Header */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-6 bg-black/20 backdrop-blur-sm border-b border-white/10">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-2 -m-2 transition-all duration-200 flex-1"
                  onClick={() => setSelectedDocument(null)}
                >
                  <div className="p-2 text-white/70">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{selectedDocument.name}</h3>
                    <p className="text-blue-200 text-sm">{selectedDocument.category} • {selectedDocument.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullPageMode();
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-200 shadow-lg"
                    title="Full Page View"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Full Page</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowChatbot(!showChatbot);
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${ showChatbot 
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/10 text-blue-300 hover:bg-white/20'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document Content */}
              <div className="flex-1 bg-white">
                {selectedDocument.type === 'PDF' ? (
                  <iframe
                    src={selectedDocument.content}
                    className="w-full h-full border-none"
                    title={selectedDocument.name}
                  />
                ) : selectedDocument.type === 'Image' || selectedDocument.type === 'TIFF' ? (
                  <div className="flex items-center justify-center h-full p-8">
                    <TiffImage
                      src={selectedDocument.content}
                      alt={selectedDocument.name}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Document Preview</h3>
                      <p className="text-gray-500">Preview not available for this file type</p>
                      <button
                        onClick={() => window.open(selectedDocument.content, '_blank')}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Chatbot Sidebar */}
            <AnimatePresence>
              {showChatbot && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  className="bg-black/30 backdrop-blur-xl border-l border-white/10 flex flex-col"
                >
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold">AI Document Assistant</h3>
                      <button
                        onClick={() => setShowChatbot(false)}
                        className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-white/60 text-sm mt-1">Ask questions about this document</p>
                  </div>
                  
                  <div className="flex-1 p-4">
                    <div className="bg-white/10 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">
                            Hello! I can help you understand and analyze this document. What would you like to know?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ask about this document..."
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        Send
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-black/10 backdrop-blur-sm">
            <div className="text-center max-w-md mx-auto px-6">
              <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-white/50" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Select a Document</h2>
              <p className="text-white/60 mb-8">
                Choose a document from the sidebar to view its contents and interact with our AI assistant.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setShowUpload(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200"
                >
                  <Upload className="w-5 h-5" />
                  Upload New Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">Upload Documents</h2>
                  <button
                    onClick={() => {
                      setShowUpload(false);
                      setUploadFiles([]);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Upload Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${ isDragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {isDragActive ? 'Drop files here' : 'Upload Documents'}
                  </h3>
                  <p className="text-gray-500">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Supports PDF, images, and other document formats
                  </p>
                </div>

                {/* Folder Selection */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Destination Folder</h3>
                  <div className="flex gap-3 mb-4">
                    <select 
                      value={currentFolder?.id || 'All'} 
                      onChange={(e) => {
                        const folderId = e.target.value;
                        const folder = Object.entries(folderStructure).find(([key]) => key === folderId);
                        setCurrentFolder(folder ? { id: folderId, ...folder[1] } : null);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(folderStructure).map(([key, folder]) => (
                        <option key={key} value={key}>{folder.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowCreateFolder(true)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      New Folder
                    </button>
                  </div>
                  
                  {/* Create Folder Modal */}
                  {showCreateFolder && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Create New Folder</h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="Enter folder name..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                        />
                        <button
                          onClick={handleCreateFolder}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateFolder(false);
                            setNewFolderName('');
                          }}
                          className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* File List */}
                {uploadFiles.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Files to Upload</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {uploadFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 truncate">{file.name}</h4>
                            <p className="text-sm text-gray-500">{file.size} • {file.type}</p>
                          </div>
                          <button
                            onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== index))}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={handleFileUpload}
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        Upload {uploadFiles.length} File{uploadFiles.length !== 1 ? 's' : ''}
                      </button>
                      <button
                        onClick={() => setUploadFiles([])}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Folder Modal */}
      <AnimatePresence>
        {showCreateFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCreateFolder(false);
              setNewFolderName('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Folder</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Enter folder name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 mt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateFolder(false);
                    setNewFolderName('');
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create Folder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Page Document Viewer */}
      <AnimatePresence>
        {isPageFullScreen && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex"
          >
            {/* Full Page Header */}
            <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 border-b border-white/10">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleFullPageMode}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{selectedDocument.name}</h3>
                    <p className="text-white/60 text-sm">{selectedDocument.category} • {selectedDocument.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChatbot(!showChatbot)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${ showChatbot 
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Full Page Content */}
            <div className="flex-1 flex pt-16">
              <div className={`flex-1 transition-all duration-300 ${showChatbot ? 'mr-96' : ''}`}>
                {selectedDocument.type === 'PDF' ? (
                  <iframe
                    src={selectedDocument.content}
                    className="w-full h-full border-none bg-white"
                    title={selectedDocument.name}
                  />
                ) : selectedDocument.type === 'Image' || selectedDocument.type === 'TIFF' ? (
                  <div className="flex items-center justify-center h-full bg-black">
                    <TiffImage
                      src={selectedDocument.content}
                      alt={selectedDocument.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full bg-white">
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">Document Preview</h3>
                      <p className="text-gray-500">Preview not available for this file type</p>
                      <button
                        onClick={() => window.open(selectedDocument.content, '_blank')}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download File
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Full Page AI Chatbot Sidebar */}
              <AnimatePresence>
                {showChatbot && (
                  <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    className="w-96 bg-black/90 backdrop-blur-xl border-l border-white/10 flex flex-col"
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">AI Document Assistant</h3>
                        <button
                          onClick={() => setShowChatbot(false)}
                          className="p-1 text-white/70 hover:text-white hover:bg-white/10 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-white/60 text-sm mt-1">Ask questions about this document</p>
                    </div>
                    
                    <div className="flex-1 p-4">
                      <div className="bg-white/10 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">
                              Hello! I can help you understand and analyze this document. What would you like to know?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t border-white/10">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ask about this document..."
                          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                          Send
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Document Modal */}
      <AnimatePresence>
        {editingDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditingDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Document</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Name</label>
                  <input
                    type="text"
                    value={editingDocument.name}
                    onChange={(e) => setEditingDocument({ ...editingDocument, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Folder</label>
                  <select
                    value={editingDocument.category || 'All'}
                    onChange={(e) => setEditingDocument({ ...editingDocument, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(folderStructure).map(([key, folder]) => (
                      <option key={key} value={key}>{folder.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aiEnabled"
                    checked={editingDocument.aiEnabled || false}
                    onChange={(e) => setEditingDocument({ ...editingDocument, aiEnabled: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="aiEnabled" className="text-sm text-gray-700">Enable AI Assistant for this document</label>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleUpdateDocument(editingDocument.id, {
                    name: editingDocument.name,
                    category: editingDocument.category,
                    aiEnabled: editingDocument.aiEnabled
                  })}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this document?')) {
                      handleDeleteDocument(editingDocument.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingDocument(null)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Folder Modal */}
      <AnimatePresence>
        {editingFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditingFolder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Folder</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
                  <input
                    type="text"
                    value={editingFolder.name}
                    onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateFolder(editingFolder.id, editingFolder.name);
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleUpdateFolder(editingFolder.id, editingFolder.name)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this folder? All documents will be moved to "All Documents".')) {
                      handleDeleteFolder(editingFolder.id);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditingFolder(null)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentManagement;
