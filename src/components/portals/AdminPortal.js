import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  Calendar, 
  CreditCard,
  Bell,
  Edit3
} from 'lucide-react';
import PortalLayout from './PortalLayout';
import UserManagement from '../admin/UserManagement';
import DocumentManagement from '../admin/DocumentManagement';
import ContentManager from '../admin/ContentManager';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDocumentFullScreen, setIsDocumentFullScreen] = useState(false);
  const [recentActivities, setRecentActivities] = useState([
    { text: 'New member registration: Sarah Johnson', time: '2 hours ago', type: 'user' },
    { text: 'Payment received: Unit 47 - March dues', time: '6 hours ago', type: 'payment' },
    { text: 'System backup completed successfully', time: '1 day ago', type: 'system' },
    { text: 'Board meeting scheduled: March 15th', time: '2 days ago', type: 'calendar' }
  ]);

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'content', label: 'Content Manager', icon: Edit3 },
    { id: 'calendar', label: 'Events', icon: Calendar },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard recentActivities={recentActivities} />;
      case 'users':
        return <UserManagement />;
      case 'documents':
        return <DocumentManagement 
          isDocumentFullScreen={isDocumentFullScreen}
          setIsDocumentFullScreen={setIsDocumentFullScreen}
          recentActivities={recentActivities}
          setRecentActivities={setRecentActivities}
        />;
      case 'content':
        return <ContentManager />;
      case 'calendar':
        return <EventManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'notifications':
        return <NotificationCenter />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard recentActivities={recentActivities} />;
    }
  };

  return (
    <PortalLayout
      title="Admin Portal"
      subtitle="Full system administration and management"
      tabs={adminTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userRole="admin"
      isFullScreen={activeTab === 'documents' && isDocumentFullScreen}
    >
      {renderTabContent()}
    </PortalLayout>
  );
};

const AdminDashboard = ({ recentActivities = [] }) => {
  const stats = [
    { 
      label: 'Total Members', 
      value: '127', 
      change: '+3 this month', 
      icon: Users, 
      gradient: 'from-blue-500 to-teal-500',
      bgGradient: 'from-blue-500/10 to-teal-500/10'
    },
    { 
      label: 'Pending Payments', 
      value: '$12,450', 
      change: '5 overdue', 
      icon: CreditCard, 
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/10'
    },
    { 
      label: 'Active Documents', 
      value: '45', 
      change: '+2 this week', 
      icon: FileText, 
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-500/10 to-indigo-500/10'
    }
  ];

  const quickActions = [
    { label: 'Add New Member', icon: Users, action: 'users', color: 'blue' },
    { label: 'Upload Document', icon: FileText, action: 'documents', color: 'purple' },
    { label: 'Create Event', icon: Calendar, action: 'calendar', color: 'green' },
    { label: 'Send Notice', icon: Bell, action: 'notifications', color: 'orange' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/95 to-gray-50/90 rounded-2xl p-8 border border-gray-200/50 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Administrator</h1>
            <p className="text-gray-600">Here's what's happening at Crestview Eighty today</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              </div>
            </div>
            <div>
              <h3 className="text-gray-700 font-semibold mb-1">{stat.label}</h3>
              <p className="text-sm text-gray-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className={`group p-4 bg-gradient-to-br from-${action.color}-500/10 to-${action.color}-600/20 hover:from-${action.color}-500/20 hover:to-${action.color}-600/30 rounded-xl border border-${action.color}-200/30 transition-all duration-300 hover:scale-105 hover:shadow-lg`}
            >
              <action.icon className={`w-8 h-8 text-${action.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
              <p className={`text-sm font-medium text-${action.color}-700 group-hover:text-${action.color}-800`}>
                {action.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'document' ? 'bg-purple-500' :
                  activity.type === 'payment' ? 'bg-green-500' :
                  activity.type === 'system' ? 'bg-orange-500' :
                  'bg-teal-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{activity.text}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Upcoming Tasks
          </h3>
          <div className="space-y-4">
            {[
              { task: 'Monthly board meeting preparation', due: 'March 15, 2024', priority: 'high' },
              { task: 'Review pending member applications', due: 'March 18, 2024', priority: 'medium' },
              { task: 'Quarterly financial report due', due: 'March 31, 2024', priority: 'high' },
              { task: 'Pool maintenance contract renewal', due: 'April 1, 2024', priority: 'low' },
              { task: 'Annual insurance policy review', due: 'April 15, 2024', priority: 'medium' }
            ].map((item, index) => (
              <div key={index} className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-700">{item.task}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.priority === 'high' ? 'bg-red-100 text-red-700' :
                    item.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </div>
                <div className="text-gray-500 text-sm">Due: {item.due}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EventManagement = () => (
  <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4">Event Management</h3>
    <p className="text-blue-200">Event calendar management features coming soon...</p>
  </div>
);

const PaymentManagement = () => (
  <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4">Payment Management</h3>
    <p className="text-blue-200">Payment processing and dues management features coming soon...</p>
  </div>
);

const NotificationCenter = () => (
  <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4">Notification Center</h3>
    <p className="text-blue-200">Mass notification and communication features coming soon...</p>
  </div>
);

const SystemSettings = () => (
  <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
    <h3 className="text-lg font-semibold text-white mb-4">System Settings</h3>
    <p className="text-blue-200">System configuration and settings panel coming soon...</p>
  </div>
);

export default AdminPortal;