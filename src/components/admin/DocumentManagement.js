import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Calendar,
  User
} from 'lucide-react';

const DocumentManagement = () => {
  const [documents, setDocuments] = useState([
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
      visibility: 'all'
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
      visibility: 'all'
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
      visibility: 'board'
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
      visibility: 'all'
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
      visibility: 'members'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  const categories = ['Legal', 'Financial', 'Forms', 'Minutes', 'Policies'];
  const visibilityOptions = [
    { value: 'all', label: 'Public', color: 'green' },
    { value: 'members', label: 'Members Only', color: 'blue' },
    { value: 'board', label: 'Board Only', color: 'purple' },
    { value: 'admin', label: 'Admin Only', color: 'red' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getVisibilityConfig = (visibility) => {
    return visibilityOptions.find(opt => opt.value === visibility) || visibilityOptions[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Document Management
          </h2>
          <p className="text-blue-200">Upload, organize, and manage HOA documents</p>
        </div>
        
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Filters */}
      <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => {
          const visibilityConfig = getVisibilityConfig(doc.visibility);
          return (
            <div key={doc.id} className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">{doc.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {doc.category}
                    </span>
                    <span className={`px-2 py-1 bg-${visibilityConfig.color}-500/20 text-${visibilityConfig.color}-300 text-xs rounded`}>
                      {visibilityConfig.label}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <button className="p-1 text-blue-300 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-green-300 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-yellow-300 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-red-300 hover:text-white hover:bg-red-500/20 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-blue-200">
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{doc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span>{doc.type}</span>
                </div>
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span>{doc.downloads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    doc.status === 'published' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-blue-300">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" />
                  {doc.uploadDate}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {doc.uploadedBy}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-white">{documents.length}</div>
          <div className="text-blue-200 text-sm">Total Documents</div>
        </div>
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-white">{documents.filter(d => d.status === 'published').length}</div>
          <div className="text-blue-200 text-sm">Published</div>
        </div>
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-white">{documents.reduce((sum, d) => sum + d.downloads, 0)}</div>
          <div className="text-blue-200 text-sm">Total Downloads</div>
        </div>
        <div className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20 text-center">
          <div className="text-2xl font-bold text-white">{categories.length}</div>
          <div className="text-blue-200 text-sm">Categories</div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 max-w-md w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Document</h3>
            <p className="text-blue-200 mb-4">Document upload functionality coming soon...</p>
            <button
              onClick={() => setShowUpload(false)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;