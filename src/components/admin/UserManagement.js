import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  User,
  Crown,
  X,
  Mail,
  Phone,
  Home,
  Calendar,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'HOA Administrator',
      email: 'admin@crestvieweighty.com',
      role: 'admin',
      address: '123 Crestview Dr',
      phone: '(406) 555-0101',
      status: 'active',
      joinDate: '2023-01-15'
    },
    {
      id: '2',
      name: 'John Smith',
      email: 'board@crestvieweighty.com',
      role: 'board',
      address: '456 Mountain View Ln',
      phone: '(406) 555-0102',
      status: 'active',
      joinDate: '2023-02-20'
    },
    {
      id: '3',
      name: 'Jane Doe',
      email: 'member@crestvieweighty.com',
      role: 'member',
      address: '789 Lake Vista Ct',
      phone: '(406) 555-0103',
      status: 'active',
      joinDate: '2023-03-10'
    },
    {
      id: '4',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      role: 'member',
      address: '321 Pine Ridge Ave',
      phone: '(406) 555-0104',
      status: 'inactive',
      joinDate: '2023-04-05'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    address: '',
    phone: '',
    unitNumber: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const roleConfig = {
    admin: { 
      icon: Shield, 
      label: 'Administrator', 
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-500/10 to-pink-500/10',
      description: 'Full system access and management capabilities'
    },
    board: { 
      icon: Crown, 
      label: 'Board Member', 
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      description: 'Enhanced access with board-level permissions'
    },
    member: { 
      icon: User, 
      label: 'Member', 
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      description: 'Standard member access to community resources'
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUserId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
    const userToAdd = {
      ...newUser,
      id: newUserId,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, userToAdd]);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'member',
      address: '',
      phone: '',
      unitNumber: '',
      emergencyContact: '',
      emergencyPhone: ''
    });
    setShowAddUser(false);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-white/95 to-gray-50/90 rounded-2xl p-8 border border-gray-200/50 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl">
                <Users className="w-7 h-7 text-white" />
              </div>
              User Management
            </h2>
            <p className="text-gray-600 mt-2">Manage community members and access permissions</p>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-gray-500">Total Users: <span className="font-semibold text-gray-700">{users.length}</span></span>
              <span className="text-gray-500">Active: <span className="font-semibold text-green-600">{users.filter(u => u.status === 'active').length}</span></span>
            </div>
          </div>
          
          <motion.button
            onClick={() => setShowAddUser(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus className="w-5 h-5" />
            Add New User
          </motion.button>
        </div>
      </div>

      {/* Role Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(roleConfig).map(([role, config]) => (
          <div key={role} className={`backdrop-blur-xl bg-gradient-to-br ${config.bgGradient} rounded-2xl p-6 border border-white/20 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${config.gradient} rounded-xl shadow-lg`}>
                <config.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{users.filter(u => u.role === role).length}</div>
              </div>
            </div>
            <h3 className="text-gray-700 font-semibold mb-2">{config.label}</h3>
            <p className="text-sm text-gray-500">{config.description}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-12 pr-8 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="board">Board Members</option>
              <option value="member">Members</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="backdrop-blur-xl bg-white/95 rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="text-left px-6 py-4 text-gray-800 font-semibold">User Details</th>
                <th className="text-left px-6 py-4 text-gray-800 font-semibold">Role & Access</th>
                <th className="text-left px-6 py-4 text-gray-800 font-semibold">Contact Info</th>
                <th className="text-left px-6 py-4 text-gray-800 font-semibold">Status</th>
                <th className="text-left px-6 py-4 text-gray-800 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <AnimatePresence>
                {filteredUsers.map((user, index) => {
                  const RoleIcon = roleConfig[user.role].icon;
                  return (
                    <motion.tr 
                      key={user.id} 
                      className="hover:bg-gray-50/80 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${roleConfig[user.role].gradient} rounded-full flex items-center justify-center`}>
                            <RoleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-gray-900 font-semibold">{user.name}</div>
                            <div className="text-gray-600 text-sm">{user.email}</div>
                            <div className="text-gray-500 text-sm">{user.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-3 py-2 bg-gradient-to-r ${roleConfig[user.role].bgGradient} rounded-xl w-fit border border-gray-200/30`}>
                          <RoleIcon className={`w-4 h-4 text-${roleConfig[user.role].color}-600`} />
                          <span className={`text-${roleConfig[user.role].color}-700 text-sm font-medium`}>
                            {roleConfig[user.role].label}
                          </span>
                        </div>
                        <div className="text-gray-500 text-xs mt-1">Since {user.joinDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <Home className="w-4 h-4" />
                            {user.address}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                          {user.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button 
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-500 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUser && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddUser(false)}
          >
            <motion.div 
              className="backdrop-blur-xl bg-white/95 rounded-2xl p-8 border border-gray-200/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    Add New User
                  </h3>
                  <p className="text-gray-600 mt-1">Create a new community member account</p>
                </div>
                <motion.button
                  onClick={() => setShowAddUser(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* User Creation Form */}
              <form onSubmit={handleAddUser} className="space-y-8">
                {/* Personal Information Section */}
                <div className="bg-gray-50/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={newUser.phone}
                          onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                          placeholder="(406) 555-0000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                          placeholder="Create password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="bg-gray-50/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Address Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        value={newUser.address}
                        onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="123 Crestview Drive, Bigfork, MT"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unit/Lot Number</label>
                      <input
                        type="text"
                        value={newUser.unitNumber}
                        onChange={(e) => setNewUser({...newUser, unitNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="Unit 47"
                      />
                    </div>
                  </div>
                </div>

                {/* Access Level Section */}
                <div className="bg-gray-50/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Access Level & Permissions
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">User Role *</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {Object.entries(roleConfig).map(([role, config]) => (
                          <label key={role} className="relative cursor-pointer">
                            <input
                              type="radio"
                              name="role"
                              value={role}
                              checked={newUser.role === role}
                              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                              className="sr-only"
                            />
                            <div className={`p-4 rounded-xl border-2 transition-all ${
                              newUser.role === role
                                ? `border-${config.color}-400 bg-gradient-to-br ${config.bgGradient} shadow-lg`
                                : 'border-gray-200 bg-white hover:border-gray-300'
                            }`}>
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 bg-gradient-to-r ${config.gradient} rounded-lg ${newUser.role === role ? 'shadow-lg' : ''}`}>
                                  <config.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="font-semibold text-gray-800">{config.label}</span>
                              </div>
                              <p className="text-sm text-gray-600">{config.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact Section */}
                <div className="bg-gray-50/50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Emergency Contact (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                      <input
                        type="text"
                        value={newUser.emergencyContact}
                        onChange={(e) => setNewUser({...newUser, emergencyContact: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        value={newUser.emergencyPhone}
                        onChange={(e) => setNewUser({...newUser, emergencyPhone: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                        placeholder="(406) 555-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddUser(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create User
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;