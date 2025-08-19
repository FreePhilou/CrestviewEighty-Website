import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  CreditCard, 
  MessageSquare,
  Calendar,
  MapPin,
  User,
  Settings
} from 'lucide-react';
import PortalLayout from './PortalLayout';

const MemberPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const memberTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'requests', label: 'Requests', icon: MessageSquare },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'directory', label: 'Directory', icon: MapPin },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MemberDashboard />;
      case 'documents':
        return <MemberDocuments />;
      case 'payments':
        return <PaymentCenter />;
      case 'requests':
        return <RequestCenter />;
      case 'events':
        return <CommunityEvents />;
      case 'directory':
        return <CommunityDirectory />;
      case 'profile':
        return <MemberProfile />;
      case 'settings':
        return <MemberSettings />;
      default:
        return <MemberDashboard />;
    }
  };

  return (
    <PortalLayout
      title="Member Portal"
      subtitle="Your gateway to community information and services"
      tabs={memberTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userRole="member"
    >
      {renderTabContent()}
    </PortalLayout>
  );
};

const MemberDashboard = () => {
  const accountInfo = {
    balance: '$0.00',
    nextDue: 'April 1, 2024',
    lastPayment: 'March 1, 2024 - $125.00',
    status: 'Current'
  };

  const announcements = [
    {
      title: 'Pool Season Opening',
      message: 'The community pool will open for the season on May 1st. Pool passes are now available.',
      date: '2024-03-10'
    },
    {
      title: 'Landscaping Updates',
      message: 'New landscaping will be installed in the common areas next week.',
      date: '2024-03-08'
    },
    {
      title: 'Annual Meeting Reminder',
      message: 'Don\'t forget about the annual HOA meeting on March 15th at 7:00 PM.',
      date: '2024-03-05'
    }
  ];

  const quickStats = [
    { 
      label: 'Account Status', 
      value: accountInfo.status, 
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/10'
    },
    { 
      label: 'Current Balance', 
      value: accountInfo.balance, 
      gradient: 'from-blue-500 to-teal-500',
      bgGradient: 'from-blue-500/10 to-teal-500/10'
    },
    { 
      label: 'Next Due', 
      value: 'April 1', 
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10'
    },
    { 
      label: 'Open Requests', 
      value: '0', 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/95 to-gray-50/90 rounded-2xl p-8 border border-gray-200/50 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Member Dashboard</h1>
        <p className="text-gray-600">Welcome to your community portal</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
            <div className="text-center">
              <div className={`inline-flex p-3 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-lg mb-4`}>
                <div className="w-6 h-6 text-white"></div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Summary */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            Account Summary
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between p-3 bg-gray-50/80 rounded-xl">
              <span className="text-gray-600">Current Balance:</span>
              <span className="text-gray-800 font-semibold">{accountInfo.balance}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50/80 rounded-xl">
              <span className="text-gray-600">Next Payment Due:</span>
              <span className="text-gray-800 font-semibold">{accountInfo.nextDue}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50/80 rounded-xl">
              <span className="text-gray-600">Last Payment:</span>
              <span className="text-gray-800 font-semibold">{accountInfo.lastPayment}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50/80 rounded-xl">
              <span className="text-gray-600">Account Status:</span>
              <span className="text-emerald-600 font-semibold">{accountInfo.status}</span>
            </div>
          </div>
          <button className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            View Payment History
          </button>
        </div>

        {/* Recent Announcements */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Community Announcements
          </h3>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <div key={index} className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-gray-800 text-sm font-semibold">{announcement.title}</h4>
                  <span className="text-gray-500 text-xs">{announcement.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{announcement.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-6 bg-gradient-to-br from-blue-500/10 to-teal-500/10 hover:from-blue-500/20 hover:to-teal-500/20 rounded-xl transition-all duration-300 text-center border border-blue-200/50 hover:border-blue-300/50 hover:-translate-y-1">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg mx-auto mb-3 w-fit">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-700 font-semibold text-sm">View Documents</span>
          </button>
          <button className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 rounded-xl transition-all duration-300 text-center border border-emerald-200/50 hover:border-emerald-300/50 hover:-translate-y-1">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg mx-auto mb-3 w-fit">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-700 font-semibold text-sm">Make Payment</span>
          </button>
          <button className="p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 rounded-xl transition-all duration-300 text-center border border-violet-200/50 hover:border-violet-300/50 hover:-translate-y-1">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg mx-auto mb-3 w-fit">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-700 font-semibold text-sm">Submit Request</span>
          </button>
          <button className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 rounded-xl transition-all duration-300 text-center border border-amber-200/50 hover:border-amber-300/50 hover:-translate-y-1">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg mx-auto mb-3 w-fit">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-700 font-semibold text-sm">View Events</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const MemberDocuments = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
        <FileText className="w-5 h-5 text-white" />
      </div>
      Member Documents
    </h3>
    <p className="text-gray-600">Access to community documents and member resources...</p>
  </div>
);

const PaymentCenter = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
        <CreditCard className="w-5 h-5 text-white" />
      </div>
      Payment Center
    </h3>
    <p className="text-gray-600">View payment history and make online payments...</p>
  </div>
);

const RequestCenter = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
        <MessageSquare className="w-5 h-5 text-white" />
      </div>
      Request Center
    </h3>
    <p className="text-gray-600">Submit maintenance requests and architectural review applications...</p>
  </div>
);

const CommunityEvents = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
        <Calendar className="w-5 h-5 text-white" />
      </div>
      Community Events
    </h3>
    <p className="text-gray-600">View upcoming community events and activities...</p>
  </div>
);

const CommunityDirectory = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
        <MapPin className="w-5 h-5 text-white" />
      </div>
      Community Directory
    </h3>
    <p className="text-gray-600">Find contact information for neighbors and community services...</p>
  </div>
);

const MemberProfile = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
        <User className="w-5 h-5 text-white" />
      </div>
      My Profile
    </h3>
    <p className="text-gray-600">Manage your personal information and contact details...</p>
  </div>
);

const MemberSettings = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg">
        <Settings className="w-5 h-5 text-white" />
      </div>
      Settings
    </h3>
    <p className="text-gray-600">Configure your account preferences and notifications...</p>
  </div>
);

export default MemberPortal;