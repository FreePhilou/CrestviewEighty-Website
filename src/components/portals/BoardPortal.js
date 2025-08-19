import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Users, 
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  Vote
} from 'lucide-react';
import PortalLayout from './PortalLayout';

const BoardPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const boardTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'members', label: 'Member Info', icon: Users },
    { id: 'voting', label: 'Voting', icon: Vote },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <BoardDashboard />;
      case 'documents':
        return <BoardDocuments />;
      case 'meetings':
        return <MeetingManagement />;
      case 'financials':
        return <FinancialOverview />;
      case 'members':
        return <MemberInfo />;
      case 'voting':
        return <VotingCenter />;
      case 'communications':
        return <CommunicationCenter />;
      case 'settings':
        return <BoardSettings />;
      default:
        return <BoardDashboard />;
    }
  };

  return (
    <PortalLayout
      title="Board Member Portal"
      subtitle="Enhanced access for board member responsibilities"
      tabs={boardTabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      userRole="board"
    >
      {renderTabContent()}
    </PortalLayout>
  );
};

const BoardDashboard = () => {
  const stats = [
    { 
      label: 'Active Members', 
      value: '127', 
      icon: Users, 
      gradient: 'from-blue-500 to-teal-500',
      bgGradient: 'from-blue-500/10 to-teal-500/10'
    },
    { 
      label: 'Monthly Revenue', 
      value: '$24,300', 
      icon: DollarSign, 
      gradient: 'from-emerald-500 to-green-500',
      bgGradient: 'from-emerald-500/10 to-green-500/10'
    },
    { 
      label: 'Pending Issues', 
      value: '8', 
      icon: MessageSquare, 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/10'
    },
    { 
      label: 'Next Meeting', 
      value: '3 days', 
      icon: Calendar, 
      gradient: 'from-violet-500 to-purple-500',
      bgGradient: 'from-violet-500/10 to-purple-500/10'
    }
  ];

  const recentActivities = [
    { text: 'Financial report for Q1 2024 completed', time: '2 hours ago', type: 'finance' },
    { text: 'New landscape proposal submitted', time: '4 hours ago', type: 'proposal' },
    { text: 'Pool maintenance scheduled for next week', time: '1 day ago', type: 'maintenance' },
    { text: 'Annual meeting agenda finalized', time: '2 days ago', type: 'meeting' },
    { text: 'Security patrol schedule updated', time: '3 days ago', type: 'security' }
  ];

  const upcomingItems = [
    { type: 'Meeting', title: 'Monthly Board Meeting', date: 'March 15, 2024', time: '7:00 PM' },
    { type: 'Deadline', title: 'Budget Review Due', date: 'March 20, 2024', time: '5:00 PM' },
    { type: 'Event', title: 'Community BBQ Planning', date: 'March 25, 2024', time: '6:00 PM' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/95 to-gray-50/90 rounded-2xl p-8 border border-gray-200/50 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Board Member Dashboard</h1>
        <p className="text-gray-600">Enhanced oversight and management for community leadership</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'finance' ? 'bg-emerald-500' :
                  activity.type === 'proposal' ? 'bg-blue-500' :
                  activity.type === 'maintenance' ? 'bg-orange-500' :
                  activity.type === 'meeting' ? 'bg-purple-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm">{activity.text}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Items */}
        <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Upcoming
          </h3>
          <div className="space-y-4">
            {upcomingItems.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-blue-600 text-xs font-medium bg-blue-100 px-2 py-1 rounded-full">{item.type}</span>
                    <p className="text-gray-800 text-sm font-medium mt-2">{item.title}</p>
                    <p className="text-gray-600 text-xs mt-1">{item.date} at {item.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BoardDocuments = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
        <FileText className="w-5 h-5 text-white" />
      </div>
      Board Documents
    </h3>
    <p className="text-gray-600">Access to confidential board documents and materials...</p>
  </div>
);

const MeetingManagement = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
        <Calendar className="w-5 h-5 text-white" />
      </div>
      Meeting Management
    </h3>
    <p className="text-gray-600">Schedule meetings, manage agendas, and record minutes...</p>
  </div>
);

const FinancialOverview = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
        <DollarSign className="w-5 h-5 text-white" />
      </div>
      Financial Overview
    </h3>
    <p className="text-gray-600">Financial reports, budgets, and expense tracking...</p>
  </div>
);

const MemberInfo = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg">
        <Users className="w-5 h-5 text-white" />
      </div>
      Member Information
    </h3>
    <p className="text-gray-600">View member details and community information...</p>
  </div>
);

const VotingCenter = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
        <Vote className="w-5 h-5 text-white" />
      </div>
      Voting Center
    </h3>
    <p className="text-gray-600">Manage board votes and community decisions...</p>
  </div>
);

const CommunicationCenter = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg">
        <MessageSquare className="w-5 h-5 text-white" />
      </div>
      Communication Center
    </h3>
    <p className="text-gray-600">Send announcements and communicate with members...</p>
  </div>
);

const BoardSettings = () => (
  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg">
        <Settings className="w-5 h-5 text-white" />
      </div>
      Board Settings
    </h3>
    <p className="text-gray-600">Configure board-specific settings and preferences...</p>
  </div>
);

export default BoardPortal;