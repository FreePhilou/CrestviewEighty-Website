import React, { useState } from 'react';
import { 
  Edit3, 
  Save, 
  Eye, 
  Bell, 
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';

const ContentManager = () => {
  const [activeSection, setActiveSection] = useState('banners');
  
  const [banners, setBanners] = useState([
    {
      id: '1',
      title: 'Annual HOA Meeting',
      message: 'Join us for the annual HOA meeting on March 15th at 7:00 PM in the community center.',
      type: 'info',
      active: true,
      startDate: '2024-03-01',
      endDate: '2024-03-15'
    },
    {
      id: '2',
      title: 'Pool Maintenance Notice',
      message: 'The community pool will be closed for maintenance from March 20-22. Thank you for your patience.',
      type: 'warning',
      active: true,
      startDate: '2024-03-18',
      endDate: '2024-03-23'
    }
  ]);

  const [editingBanner, setEditingBanner] = useState(null);

  const bannerTypes = [
    { value: 'info', label: 'Information', color: 'blue', icon: Info },
    { value: 'warning', label: 'Warning', color: 'yellow', icon: AlertTriangle },
    { value: 'success', label: 'Success', color: 'green', icon: CheckCircle },
    { value: 'emergency', label: 'Emergency', color: 'red', icon: Bell }
  ];

  const contentSections = [
    { id: 'banners', label: 'Information Banners', icon: Bell },
    { id: 'events', label: 'Event Countdown', icon: Calendar },
    { id: 'disclaimers', label: 'Legal Disclaimers', icon: AlertTriangle },
    { id: 'homepage', label: 'Homepage Content', icon: Edit3 }
  ];

  const handleSaveBanner = (banner) => {
    if (editingBanner) {
      setBanners(banners.map(b => b.id === banner.id ? banner : b));
    } else {
      setBanners([...banners, { ...banner, id: Date.now().toString() }]);
    }
    setEditingBanner(null);
  };

  const BannerEditor = ({ banner, onSave, onCancel }) => {
    const [formData, setFormData] = useState(banner || {
      title: '',
      message: '',
      type: 'info',
      active: true,
      startDate: '',
      endDate: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">
          {banner ? 'Edit Banner' : 'Create New Banner'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Banner title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Banner message"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {bannerTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
              className="rounded border-white/20 bg-white/10 text-blue-600 focus:ring-blue-400"
            />
            <label htmlFor="active" className="text-white text-sm">Active</label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Banner
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderBannersList = () => (
    <div className="space-y-4">
      {editingBanner !== false && (
        <BannerEditor
          banner={editingBanner}
          onSave={handleSaveBanner}
          onCancel={() => setEditingBanner(false)}
        />
      )}
      
      {editingBanner === false && (
        <button
          onClick={() => setEditingBanner(null)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          Add New Banner
        </button>
      )}

      <div className="space-y-3">
        {banners.map((banner) => {
          const typeConfig = bannerTypes.find(t => t.value === banner.type);
          const TypeIcon = typeConfig.icon;
          
          return (
            <div key={banner.id} className="backdrop-blur-lg bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 bg-${typeConfig.color}-500/20 rounded`}>
                      <TypeIcon className={`w-4 h-4 text-${typeConfig.color}-300`} />
                    </div>
                    <h4 className="text-white font-medium">{banner.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded ${
                      banner.active 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {banner.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm mb-2">{banner.message}</p>
                  <div className="text-blue-300 text-xs">
                    {banner.startDate} - {banner.endDate}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => setEditingBanner(banner)}
                    className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-300 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Edit3 className="w-6 h-6" />
          Content Manager
        </h2>
        <p className="text-blue-200">Manage dynamic website content and announcements</p>
      </div>

      {/* Section Navigation */}
      <div className="backdrop-blur-lg bg-white/10 rounded-xl p-2 border border-white/20">
        <div className="flex flex-wrap gap-1">
          {contentSections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <SectionIcon className="w-4 h-4" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeSection === 'banners' && renderBannersList()}
        
        {activeSection === 'events' && (
          <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Event Countdown Manager</h3>
            <p className="text-blue-200">Event countdown features coming soon...</p>
          </div>
        )}
        
        {activeSection === 'disclaimers' && (
          <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Legal Disclaimers</h3>
            <p className="text-blue-200">Legal disclaimer management coming soon...</p>
          </div>
        )}
        
        {activeSection === 'homepage' && (
          <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Homepage Content Editor</h3>
            <p className="text-blue-200">Homepage content editing features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManager;