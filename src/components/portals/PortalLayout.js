import React from 'react';
import { LogOut, User, Shield, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const PortalLayout = ({
  title,
  subtitle,
  tabs,
  activeTab,
  onTabChange,
  children,
  userRole
}) => {
  const { user, logout } = useAuth();

  const roleConfig = {
    admin: { color: 'amber', icon: Shield, label: 'Administrator' },
    board: { color: 'blue', icon: UsersIcon, label: 'Board Member' },
    member: { color: 'emerald', icon: User, label: 'Member' }
  };

  const config = roleConfig[userRole] || roleConfig.member;
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-teal-600/5 to-emerald-600/5"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/90 border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">{title}</h1>
              <span className="text-gray-600 text-sm">{subtitle}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100/80 rounded-full border border-gray-200/50">
                <RoleIcon className={`w-4 h-4 text-${config.color}-600`} />
                <span className="text-gray-800 text-sm font-medium">{user?.name}</span>
                <span className={`text-${config.color}-700 text-xs font-medium`}>{config.label}</span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100/80 rounded-lg transition-colors border border-transparent hover:border-gray-200/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="relative z-10 backdrop-blur-xl bg-white/70 border-b border-gray-200/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide py-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-md border border-blue-400/30'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 border border-transparent hover:border-gray-200/50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto py-8">
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;