import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import localforage from 'localforage';
import { useToast } from '../../contexts/ToastContext';
import { 
  Building2, 
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Globe,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload,
  FileText,
  Download,
  X,
  Eye,
  Paperclip,
  Minus
} from 'lucide-react';

const ServiceProviderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProvider, setEditingProvider] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [tempDocuments, setTempDocuments] = useState([]);
  const [isDocumentFullScreen, setIsDocumentFullScreen] = useState(false);
  const [selectedDocumentForPreview, setSelectedDocumentForPreview] = useState(null);
  
  const toast = useToast();

  const previewRef = useRef(null);

  const serviceCategories = [
    { value: 'landscaping', label: 'Landscaping & Lawn Care', color: 'green' },
    { value: 'snow-removal', label: 'Snow Removal', color: 'blue' },
    { value: 'tree-service', label: 'Tree Trimming & Arboriculture', color: 'emerald' },
    { value: 'asphalt-road', label: 'Asphalt & Road Maintenance', color: 'gray' },
    { value: 'weed-control', label: 'Weed Control', color: 'yellow' },
    { value: 'plumbing', label: 'Plumbing', color: 'cyan' },
    { value: 'electrical', label: 'Electrical', color: 'amber' },
    { value: 'general-maintenance', label: 'General Maintenance', color: 'indigo' },
    { value: 'legal', label: 'Legal Services', color: 'purple' },
    { value: 'insurance', label: 'Insurance', color: 'red' },
    { value: 'other', label: 'Other/Miscellaneous', color: 'slate' }
  ];

  const contractStatuses = [
    { 
      value: 'active', 
      label: 'Active', 
      color: 'green', 
      textColor: 'text-green-700', 
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      icon: CheckCircle 
    },
    { 
      value: 'inactive', 
      label: 'Inactive', 
      color: 'gray', 
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200', 
      iconColor: 'text-gray-500',
      icon: Clock 
    }
  ];

  const documentCategories = [
    { value: 'contract', label: 'Contract', color: 'blue' },
    { value: 'license', label: 'License', color: 'green' },
    { value: 'insurance', label: 'Insurance', color: 'purple' },
    { value: 'certification', label: 'Certification', color: 'orange' },
    { value: 'other', label: 'Other', color: 'gray' }
  ];

  // Global ESC key handler
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        if (isDocumentFullScreen) {
          setIsDocumentFullScreen(false);
          setSelectedDocumentForPreview(null);
        } else {
          setSearchTerm('');
          setFilterCategory('all');
          setFilterStatus('all');
          setEditingProvider(null);
          setDocumentPreview(null);
          setTempDocuments([]);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isDocumentFullScreen]);

  // Handle click outside document preview
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setDocumentPreview(null);
      }
    };

    if (documentPreview) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [documentPreview]);

  // Load providers from storage on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      console.log('Loading providers from storage...');
      const storedProviders = await localforage.getItem('serviceProviders');
      if (storedProviders && storedProviders.length > 0) {
        console.log('Loaded', storedProviders.length, 'providers from storage');
        setProviders(storedProviders);
      } else {
        console.log('No stored providers found, initializing with sample data');
        // Initialize with sample data
        const sampleData = [
          {
            id: '1',
            companyName: 'Bigfork Lawn & Landscape',
            contactPerson: 'Mike Johnson',
            phone: '(406) 555-0123',
            email: 'mike@bigforklawn.com',
            address: '123 Main St, Bigfork, MT 59911',
            website: 'www.bigforklawn.com',
            category: 'landscaping',
            servicesProvided: 'Weekly mowing, spring cleanup, fertilization, irrigation maintenance',
            contractStatus: 'active',
            notes: 'Reliable service, occasionally late on spring startup',
            documents: []
          },
          {
            id: '2',
            companyName: 'Mountain Snow Removal',
            contactPerson: 'Dave Wilson',
            phone: '(406) 555-0456',
            email: 'dave@mountainsnow.com',
            address: '456 Alpine Dr, Kalispell, MT 59901',
            website: '',
            category: 'snow-removal',
            servicesProvided: '24/7 snow plowing, de-icing, sidewalk clearing',
            contractStatus: 'active',
            notes: 'Excellent response time, very reliable during storms',
            documents: []
          },
          {
            id: '3',
            companyName: 'Flathead Tree Service',
            contactPerson: 'Tom Anderson',
            phone: '(406) 555-0789',
            email: 'tom@flatheadtree.com',
            address: '789 Forest Ave, Whitefish, MT 59937',
            website: 'www.flatheadtree.com',
            category: 'tree-service',
            servicesProvided: 'Tree trimming, removal, stump grinding, emergency storm cleanup',
            contractStatus: 'inactive',
            notes: 'Good work quality, pricing slightly high. Considering alternatives.',
            documents: []
          }
        ];
        setProviders(sampleData);
        await localforage.setItem('serviceProviders', sampleData);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProviders = async (newProviders) => {
    try {
      console.log('=== SAVE TO STORAGE START ===');
      console.log('Providers to save:', newProviders.length);
      console.log('Provider names:', newProviders.map(p => p.companyName));
      
      // Validate the data before saving
      if (!Array.isArray(newProviders)) {
        throw new Error('Invalid data: providers must be an array');
      }
      
      // Save to localforage
      await localforage.setItem('serviceProviders', newProviders);
      console.log('Saved to localforage successfully');
      
      // Update state immediately
      setProviders(newProviders);
      console.log('Component state updated - new length:', newProviders.length);
      
      // Verify the save by reading it back
      const verification = await localforage.getItem('serviceProviders');
      if (verification && verification.length === newProviders.length) {
        console.log('Data persistence verified - saved', verification.length, 'providers');
        console.log('Verified provider names:', verification.map(p => p.companyName));
      } else {
        console.warn('Data persistence verification failed');
        console.warn('Expected:', newProviders.length, 'Got:', verification?.length || 0);
      }
      
      console.log('=== SAVE TO STORAGE END ===');
    } catch (error) {
      console.error('Error saving providers to storage:', error);
      throw error; // Re-throw to allow calling function to handle
    }
  };

  // Sort providers: Active first, then alphabetically by company name
  const sortedProviders = [...providers].sort((a, b) => {
    if (a.contractStatus === 'active' && b.contractStatus !== 'active') return -1;
    if (a.contractStatus !== 'active' && b.contractStatus === 'active') return 1;
    return a.companyName.localeCompare(b.companyName);
  });

  const filteredProviders = sortedProviders.filter(provider => {
    const matchesSearch = provider.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.servicesProvided.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || provider.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || provider.contractStatus === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Separate active and other providers for visual grouping
  const shouldShowSeparateSections = filterStatus === 'all';
  const activeProviders = filteredProviders.filter(p => p.contractStatus === 'active');
  const otherProviders = filteredProviders.filter(p => p.contractStatus !== 'active');

  const handleSaveProvider = async (provider) => {
    try {
      console.log('=== SAVE PROVIDER DEBUG START ===');
      console.log('Form data received:', provider);
      console.log('Current editingProvider:', editingProvider);
      console.log('Current providers array length:', providers.length);
      console.log('Temp documents:', tempDocuments);
      
      // Form validation is now handled in the form component
      
      const isNewProvider = !editingProvider || !editingProvider.id;
      console.log('Is new provider:', isNewProvider);
      
      let updatedProviders;
      
      if (isNewProvider) {
        // Adding new provider
        const newProvider = { 
          ...provider, 
          id: Date.now().toString(), 
          documents: [...(tempDocuments || [])]
        };
        updatedProviders = [...providers, newProvider];
        console.log('Created new provider object:', newProvider);
        console.log('New providers array length:', updatedProviders.length);
      } else {
        // Editing existing provider
        const updatedProvider = {
          ...provider,
          id: editingProvider.id,
          documents: provider.documents || editingProvider.documents || []
        };
        updatedProviders = providers.map(p => p.id === editingProvider.id ? updatedProvider : p);
        console.log('Updated existing provider');
      }
      
      console.log('About to save providers array:', updatedProviders);
      
      // Save to storage first
      await saveProviders(updatedProviders);
      
      console.log('Save completed successfully');
      console.log('Current component providers state after save:', providers.length);
      
      // Show success message first
      toast.success(
        `Provider ${isNewProvider ? 'added' : 'updated'} successfully!`,
        'Success'
      );
      
      // Small delay to let user see the result before clearing form
      setTimeout(() => {
        setEditingProvider(null);
        setTempDocuments([]);
        console.log('Form cleared');
      }, 500);
      
      console.log('=== SAVE PROVIDER DEBUG END ===');
      
    } catch (error) {
      console.error('Error saving provider:', error);
      toast.error(
        'Failed to save provider. Please check your data and try again.',
        'Save Failed'
      );
      // Don't clear form on error - keep user's data
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (window.confirm('Are you sure you want to delete this service provider?')) {
      try {
        const providerToDelete = providers.find(p => p.id === providerId);
        const updatedProviders = providers.filter(p => p.id !== providerId);
        await saveProviders(updatedProviders);
        
        toast.success(
          `${providerToDelete?.companyName || 'Provider'} has been removed from your directory.`,
          'Provider Deleted'
        );
      } catch (error) {
        console.error('Error deleting provider:', error);
        toast.error(
          'Failed to delete provider. Please try again.',
          'Delete Failed'
        );
      }
    }
  };

  const handleFileUpload = async (providerId, files, category) => {
    const newDocuments = await Promise.all(
      files.map(async (file) => {
        const fileData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });

        return {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          category: category,
          data: fileData,
          uploadDate: new Date().toISOString()
        };
      })
    );

    if (providerId === 'temp') {
      // For new provider form
      setTempDocuments(prev => [...prev, ...newDocuments]);
    } else {
      // For existing provider
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      const updatedProvider = {
        ...provider,
        documents: [...(provider.documents || []), ...newDocuments]
      };

      const updatedProviders = providers.map(p => 
        p.id === providerId ? updatedProvider : p
      );

      await saveProviders(updatedProviders);
    }
  };

  const handleDeleteDocument = async (providerId, documentId) => {
    if (providerId === 'temp') {
      // For new provider form
      setTempDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } else {
      // For existing provider
      const provider = providers.find(p => p.id === providerId);
      if (!provider) return;

      const updatedProvider = {
        ...provider,
        documents: provider.documents.filter(doc => doc.id !== documentId)
      };

      const updatedProviders = providers.map(p => 
        p.id === providerId ? updatedProvider : p
      );

      await saveProviders(updatedProviders);
    }
  };

  const downloadDocument = (document) => {
    const link = document.createElement('a');
    link.href = document.data;
    link.download = document.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAttachmentClick = (provider, event) => {
    event.stopPropagation();
    
    // If there's only one document, open it directly in full screen
    if (provider.documents && provider.documents.length === 1) {
      setSelectedDocumentForPreview(provider.documents[0]);
      setIsDocumentFullScreen(true);
      return;
    }
    
    // For multiple documents, show the popup with document list
    const rect = event.currentTarget.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const popupWidth = 400; // max-w-sm is approximately 400px
    
    // Position popup to avoid going off-screen
    const xPosition = rect.right + popupWidth > windowWidth 
      ? rect.left - popupWidth - 10 // Position to the left of button
      : rect.right + 5; // Position to the right of button
      
    setPreviewPosition({
      x: Math.max(10, xPosition), // Ensure minimum 10px from left edge
      y: rect.bottom + 5
    });
    setDocumentPreview(provider);
  };

  const getCategoryConfig = (categoryValue) => {
    return serviceCategories.find(cat => cat.value === categoryValue) || serviceCategories[serviceCategories.length - 1];
  };

  // Explicit color mappings to prevent Tailwind CSS purging
  const categoryColorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    red: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' }
  };

  const getCategoryColorClasses = (colorName) => {
    return categoryColorClasses[colorName] || categoryColorClasses.gray;
  };

  const getStatusConfig = (statusValue) => {
    return contractStatuses.find(status => status.value === statusValue) || contractStatuses[1];
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const FileUploadZone = ({ providerId, onFileUpload, documents }) => {
    const [selectedCategory, setSelectedCategory] = useState('contract');
    
    const onDrop = useCallback((acceptedFiles) => {
      onFileUpload(providerId, acceptedFiles, selectedCategory);
    }, [providerId, selectedCategory, onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/png': ['.png']
      },
      maxSize: 10 * 1024 * 1024 // 10MB
    });

    return (
      <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <label className="text-sm font-medium text-gray-700">Document Type:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {documentCategories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
        </div>

        {documents && documents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents:</h4>
            <DocumentList provider={{ documents }} showActions={true} providerId={providerId} />
          </div>
        )}
      </div>
    );
  };

  const DocumentList = ({ provider, showActions = false, providerId = null, onDocumentClick = null }) => {
    const documents = provider.documents || [];
    
    if (documents.length === 0) {
      return (
        <div className="text-center py-4">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-500">No documents uploaded</p>
        </div>
      );
    }

    return (
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {documents.map((doc, index) => {
          const categoryConfig = documentCategories.find(cat => cat.value === doc.category);
          const categoryColor = categoryConfig?.color || 'gray';
          
          return (
            <div 
              key={doc.id || index} 
              className={`flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group border border-gray-200 ${
                onDocumentClick ? 'cursor-pointer' : ''
              }`}
              onClick={onDocumentClick ? () => onDocumentClick(doc) : undefined}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`p-1.5 rounded flex-shrink-0 ${
                  getCategoryColorClasses(categoryColor).bg
                } ${
                  getCategoryColorClasses(categoryColor).text
                }`}>
                  <FileText className="w-3 h-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-800 truncate mb-0.5">{doc.name}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-medium ${
                      getCategoryColorClasses(categoryColor).text
                    }`}>
                      {categoryConfig?.label || doc.category}
                    </p>
                    {doc.size && doc.uploadDate && (
                      <p className="text-xs text-gray-500">
                        {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => {
                    setSelectedDocumentForPreview(doc);
                    setIsDocumentFullScreen(true);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all opacity-0 group-hover:opacity-100 transform scale-95 hover:scale-100"
                  title="Preview document"
                >
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => downloadDocument(doc)}
                  className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all opacity-0 group-hover:opacity-100 transform scale-95 hover:scale-100"
                  title="Download document"
                >
                  <Download className="w-3 h-3" />
                </button>
                
                {showActions && (
                  <button
                    onClick={() => handleDeleteDocument(providerId, doc.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100 transform scale-95 hover:scale-100"
                    title="Delete document"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const FullScreenDocumentViewer = ({ document, onClose }) => {
    if (!document) return null;

    const downloadDocument = (doc) => {
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const isPDF = document.type && document.type.toLowerCase().includes('pdf');
    const isImage = document.type && document.type.toLowerCase().includes('image');

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex"
      >
        {/* Full Screen Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-white font-semibold text-lg">{document.name}</h3>
                <p className="text-white/60 text-sm">
                  {document.category ? `${document.category} • ` : ''}
                  {document.size ? `${(document.size / 1024).toFixed(1)} KB` : ''}
                  {document.uploadDate ? ` • ${new Date(document.uploadDate).toLocaleDateString()}` : ''}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadDocument(document)}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white hover:bg-white/30 rounded-lg transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full Screen Content */}
        <div className="flex-1 flex pt-16">
          <div className="flex-1">
            {isPDF ? (
              <iframe
                src={document.data}
                className="w-full h-full border-none bg-white"
                title={document.name}
              />
            ) : isImage ? (
              <div className="flex items-center justify-center h-full bg-black">
                <img
                  src={document.data}
                  alt={document.name}
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
                    onClick={() => downloadDocument(document)}
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
      </motion.div>
    );
  };

  const DocumentPreviewPopup = ({ provider, position }) => {
    if (!provider) return null;

    return (
      <div 
        ref={previewRef}
        className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm animate-fade-in backdrop-blur-lg"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-800 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-purple-600" />
            Documents ({provider.documents?.length || 0})
          </h4>
          <button
            onClick={() => setDocumentPreview(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded transform hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <DocumentList provider={provider} onDocumentClick={(doc) => {
          setSelectedDocumentForPreview(doc);
          setIsDocumentFullScreen(true);
          setDocumentPreview(null);
        }} />
      </div>
    );
  };

  const AttachmentButton = ({ provider }) => {
    const documentCount = provider.documents?.length || 0;
    if (documentCount === 0) return null;

    return (
      <button
        onClick={(e) => handleAttachmentClick(provider, e)}
        className="group/btn p-2 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg relative"
        title={`View ${documentCount} document${documentCount !== 1 ? 's' : ''}`}
      >
        <Paperclip className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
        {documentCount > 1 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center animate-pulse-soft text-[10px] font-bold">
            {documentCount}
          </span>
        )}
      </button>
    );
  };

  const ProviderEditor = ({ provider, onSave, onCancel }) => {
    const [formData, setFormData] = useState(provider || {
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      website: '',
      category: 'landscaping',
      servicesProvided: '',
      contractStatus: 'active',
      notes: ''
    });
    
    const [fieldErrors, setFieldErrors] = useState({});

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validate required fields and set errors
      const errors = {};
      if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
      if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
      if (!formData.phone.trim()) errors.phone = 'Phone number is required';
      if (!formData.servicesProvided.trim()) errors.servicesProvided = 'Services description is required';
      
      setFieldErrors(errors);
      
      // If there are errors, don't submit
      if (Object.keys(errors).length > 0) {
        console.log('Form validation failed:', errors);
        return;
      }
      
      console.log('Form submission - formData:', formData);
      onSave(formData);
    };

    const handleInputChange = (field, value) => {
      if (field === 'phone') {
        value = formatPhoneNumber(value);
      }
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Clear error for this field when user starts typing
      if (fieldErrors[field]) {
        setFieldErrors(prev => ({ ...prev, [field]: '' }));
      }
    };

    // Get documents for display (existing provider or temp docs for new provider)
    const currentDocuments = provider && provider.id ? provider.documents : tempDocuments;
    const providerId = provider && provider.id ? provider.id : 'temp';

    return (
      <div className="backdrop-blur-lg bg-white/95 rounded-xl p-6 border border-gray-200/50 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6">
          {provider ? 'Edit Service Provider' : 'Add New Service Provider'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Company Name *</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.companyName 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500 focus:shadow-lg'
                }`}
                placeholder="Company name"
                required
              />
              {fieldErrors.companyName && (
                <p className="text-red-600 text-sm mt-1 animate-slide-in">{fieldErrors.companyName}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Contact Person *</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.contactPerson 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500 focus:shadow-lg'
                }`}
                placeholder="Primary contact name"
                required
              />
              {fieldErrors.contactPerson && (
                <p className="text-red-600 text-sm mt-1 animate-slide-in">{fieldErrors.contactPerson}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  fieldErrors.phone 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500 focus:shadow-lg'
                }`}
                placeholder="(406) 555-0123"
                required
              />
              {fieldErrors.phone && (
                <p className="text-red-600 text-sm mt-1 animate-slide-in">{fieldErrors.phone}</p>
              )}
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="contact@company.com"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Physical Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="123 Main St, Bigfork, MT 59911"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Website</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="www.company.com"
            />
          </div>

          {/* Service Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                {serviceCategories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contract Status</label>
              <select
                value={formData.contractStatus}
                onChange={(e) => handleInputChange('contractStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {contractStatuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Services Provided *</label>
            <textarea
              value={formData.servicesProvided}
              onChange={(e) => handleInputChange('servicesProvided', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 resize-none hover:border-gray-400 hover:shadow-md ${
                fieldErrors.servicesProvided 
                  ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500 focus:shadow-lg'
              }`}
              placeholder="Detailed description of services provided"
              required
            />
            {fieldErrors.servicesProvided && (
              <p className="text-red-600 text-sm mt-1 animate-slide-in">{fieldErrors.servicesProvided}</p>
            )}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">Notes & Comments</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Additional notes, special considerations..."
            />
          </div>

          {/* Document Management - Always visible for streamlined UX */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">Documents</label>
            <FileUploadZone 
              providerId={providerId} 
              onFileUpload={handleFileUpload}
              documents={currentDocuments}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              <CheckCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
              Save Provider
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 font-medium transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const ProviderCard = ({ provider }) => {
    const categoryConfig = getCategoryConfig(provider.category);
    const statusConfig = getStatusConfig(provider.contractStatus);
    const StatusIcon = statusConfig.icon;
    const documentCount = provider.documents?.length || 0;

    return (
      <div className="relative backdrop-blur-lg bg-white/95 rounded-xl p-4 border border-gray-200/50 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:border-blue-300/50 hover:-translate-y-1 transition-all duration-300 group animate-fade-in">
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-6">
            <div className="mb-2">
              <h3 className="text-base font-bold text-gray-800 truncate group-hover:text-blue-700 transition-colors">
                {provider.companyName}
              </h3>
            </div>
            <p className="text-gray-600 font-medium text-sm truncate">{provider.contactPerson}</p>
            <div className="flex items-center justify-between mt-1">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor} flex-shrink-0`} />
                <span className={`text-xs font-semibold ${statusConfig.textColor}`}>
                  {statusConfig.label}
                </span>
                {provider.contractStatus === 'active' && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium flex-shrink-0 border ${
                getCategoryColorClasses(categoryConfig.color).bg
              } ${
                getCategoryColorClasses(categoryConfig.color).text
              } ${
                getCategoryColorClasses(categoryConfig.color).border
              }`}>
                {categoryConfig.label.split(' ')[0]}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <AttachmentButton provider={provider} />
            <button
              onClick={() => setEditingProvider(provider)}
              className="group/btn p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 hover:scale-110 hover:shadow-lg"
              title="Edit Provider"
            >
              <Edit3 className="w-4 h-4 transition-transform group-hover/btn:rotate-12" />
            </button>
            <button
              onClick={() => handleDeleteProvider(provider.id)}
              className="group/btn p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 hover:scale-110 hover:shadow-lg"
              title="Delete Provider"
            >
              <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{provider.phone}</span>
          </div>
          
          {provider.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{provider.email}</span>
            </div>
          )}
          
          {provider.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{provider.address}</span>
            </div>
          )}
          
          {provider.website && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-3 h-3 flex-shrink-0" />
              <a href={`https://${provider.website}`} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline truncate">
                {provider.website}
              </a>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-2 mt-3">
            <p className="text-xs text-gray-700 line-clamp-2">
              <span className="font-medium">Services:</span> {provider.servicesProvided}
            </p>
          </div>

          {provider.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
              <p className="text-xs text-gray-700 line-clamp-2">
                <span className="font-medium">Notes:</span> {provider.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Skeleton loading component for provider cards
  const SkeletonCard = () => (
    <div className="backdrop-blur-lg bg-white/95 rounded-xl p-4 border border-gray-200/50 shadow-lg animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-6">
          <div className="mb-2">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-3"></div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-5 bg-gray-300 rounded-full w-20"></div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-40"></div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-2 mt-3">
          <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-300 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-80 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-300 rounded-lg w-32 animate-pulse"></div>
        </div>

        {/* Filter tiles skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index} className="backdrop-blur-lg rounded-xl p-4 border bg-gray-100/90 border-gray-200/50 animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-12 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          ))}
        </div>

        {/* Search bar skeleton */}
        <div className="backdrop-blur-lg bg-white/95 rounded-xl p-4 border border-gray-200/50 shadow-lg">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded-lg w-40 animate-pulse"></div>
          </div>
        </div>

        {/* Provider cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Building2 className="w-7 h-7" />
            Service Provider Directory
          </h2>
          <p className="text-gray-600">Manage your HOA service providers and contractors</p>
        </div>
        
        <button
          onClick={() => setEditingProvider({})}
          className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" />
          Add Provider
        </button>
      </div>

      {/* Status Filter Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            label: 'All Providers', 
            value: providers.length, 
            color: 'blue', 
            status: 'all',
            icon: Building2,
            description: 'Total providers'
          },
          { 
            label: 'Active', 
            value: providers.filter(p => p.contractStatus === 'active').length, 
            color: 'green', 
            status: 'active',
            icon: CheckCircle,
            description: 'Currently contracted'
          },
          { 
            label: 'Inactive', 
            value: providers.filter(p => p.contractStatus === 'inactive').length, 
            color: 'gray', 
            status: 'inactive',
            icon: Clock,
            description: 'Not currently active'
          }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index} 
              onClick={() => setFilterStatus(stat.status)}
              className={`backdrop-blur-lg rounded-xl p-4 border transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group active:scale-95 ${
                filterStatus === stat.status 
                  ? `bg-${stat.color}-100/90 border-${stat.color}-400/70 shadow-lg scale-105 ring-2 ring-${stat.color}-300/50`
                  : `bg-${stat.color}-50/80 border-${stat.color}-200/50 hover:scale-105 hover:shadow-xl hover:border-${stat.color}-300/70 hover:bg-${stat.color}-100/80`
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg bg-${stat.color}-100 border border-${stat.color}-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-md`}>
                  <IconComponent className={`w-4 h-4 text-${stat.color}-600 group-hover:text-${stat.color}-700`} />
                </div>
                {filterStatus === stat.status && (
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 bg-${stat.color}-500 rounded-full animate-pulse-soft`}></div>
                    <span className={`text-xs font-medium text-${stat.color}-600`}>Active</span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                {stat.label}
              </div>
              <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-600 transition-colors duration-200">
                {stat.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="backdrop-blur-lg bg-white/95 rounded-xl p-4 border border-gray-200/50 shadow-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-200 group-focus-within:text-blue-500 group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:shadow-lg transition-all duration-200 hover:border-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 p-1 hover:bg-gray-100 rounded-full hover:scale-110 active:scale-90"
                >
                  <X className="w-4 h-4 transition-transform hover:rotate-90" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 group">
            <Filter className="w-4 h-4 text-gray-500 transition-all duration-200 group-focus-within:text-blue-500 group-focus-within:scale-110" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {serviceCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Provider Editor */}
      {editingProvider && (
        <ProviderEditor
          provider={editingProvider.id ? editingProvider : null}
          onSave={handleSaveProvider}
          onCancel={() => {
            setEditingProvider(null);
            setTempDocuments([]);
            // Reset any form state if needed
          }}
        />
      )}

      {/* Provider Display Logic */}
      {shouldShowSeparateSections ? (
        // Show separate Active/Other sections when no specific status filter is applied
        <>
          {/* Active Providers Section */}
          {activeProviders.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">Active Providers</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            </div>
          )}

          {/* Visual Separator */}
          {activeProviders.length > 0 && otherProviders.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="bg-white px-4 py-2 text-lg font-semibold text-gray-800 rounded-full border border-gray-300 flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  <span>Other Providers</span>
                  <Minus className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Other Providers Section */}
          {otherProviders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          )}
        </>
      ) : (
        // Show single filtered list when specific status filter is applied
        filteredProviders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )
      )}

      {filteredProviders.length === 0 && !editingProvider && (
        <div className="backdrop-blur-lg bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-2xl p-12 border border-blue-200/50 text-center animate-fade-in">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-100 rounded-full blur-lg opacity-30 w-24 h-24 mx-auto"></div>
            <Building2 className="w-24 h-24 text-blue-500 mx-auto mb-2 relative animate-pulse-soft" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {providers.length === 0 
              ? "Welcome to Your Service Provider Directory!"
              : "No providers match your current filters"
            }
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
            {providers.length === 0 
              ? "Start building your institutional knowledge by adding trusted contractors and service providers to your HOA directory."
              : `We found ${providers.length} total provider${providers.length !== 1 ? 's' : ''} but none match your current search or filter criteria.`
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              onClick={() => setEditingProvider({})}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg font-medium hover:-translate-y-0.5 active:scale-95"
            >
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110" />
              {providers.length === 0 ? "Add Your First Provider" : "Add New Provider"}
            </button>
            
            {providers.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStatus('all');
                }}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium hover:-translate-y-0.5 active:scale-95"
              >
                <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                Clear All Filters
              </button>
            )}
          </div>
          
          {providers.length === 0 && (
            <div className="mt-8 p-4 bg-white/60 rounded-lg border border-blue-200/30">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">💡 Pro Tip:</span> Start with essential services like:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Landscaping', 'Snow Removal', 'Tree Service', 'Maintenance'].map((service) => (
                  <span key={service} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Document Preview Popup */}
      <DocumentPreviewPopup 
        provider={documentPreview} 
        position={previewPosition}
      />

      {/* Full Screen Document Viewer */}
      <AnimatePresence>
        {isDocumentFullScreen && selectedDocumentForPreview && (
          <FullScreenDocumentViewer
            document={selectedDocumentForPreview}
            onClose={() => {
              setIsDocumentFullScreen(false);
              setSelectedDocumentForPreview(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceProviderManagement;