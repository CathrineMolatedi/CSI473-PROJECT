// components/UserManagement.tsx
import { useState, useEffect } from 'react';
import { User, UserStatus, SecurityOfficer, Resident } from '../lib/types';
import { notificationService } from '../lib/notification-service';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'officers' | 'residents'>('pending');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const pending = allUsers.filter((user: User) => user.status === UserStatus.PENDING);
    
    setUsers(allUsers);
    setPendingApprovals(pending);
  };

  const handleApprove = async (user: User) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: User) => 
      u.id === user.id ? { ...u, status: UserStatus.ACTIVE } : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Remove from pending approvals
    const updatedPending = JSON.parse(localStorage.getItem('pendingApprovals') || '[]')
      .filter((u: User) => u.id !== user.id);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedPending));
    
    // Send notification
    await notificationService.sendApprovalNotification(user.email, user.username, true);
    
    loadUsers();
  };

  const handleReject = async (user: User) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.filter((u: User) => u.id !== user.id);
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Remove from pending approvals
    const updatedPending = JSON.parse(localStorage.getItem('pendingApprovals') || '[]')
      .filter((u: User) => u.id !== user.id);
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedPending));
    
    // Send notification
    await notificationService.sendApprovalNotification(user.email, user.username, false);
    
    loadUsers();
  };

  const handleSuspend = async (user: User, reason: string) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: User) => 
      u.id === user.id ? { ...u, status: UserStatus.SUSPENDED } : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Send suspension notification
    await notificationService.sendSuspensionAlert(user.email, user.username, reason);
    
    loadUsers();
  };

  const handleReinstate = async (user: User) => {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = allUsers.map((u: User) => 
      u.id === user.id ? { ...u, status: UserStatus.ACTIVE } : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
  };

  const filteredUsers = users.filter((user) => {
    switch (activeTab) {
      case 'pending':
        return user.status === UserStatus.PENDING;
      case 'officers':
        return (user as any).userType === 'officer';
      case 'residents':
        return (user as any).userType === 'resident';
      default:
        return true;
    }
  });

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <div className="flex space-x-2">
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
            {pendingApprovals.length} Pending Approval
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {[
          { key: 'pending', label: 'Pending Approval', count: pendingApprovals.length },
          { key: 'officers', label: 'Security Officers', count: users.filter(u => (u as any).userType === 'officer').length },
          { key: 'residents', label: 'Residents', count: users.filter(u => (u as any).userType === 'resident').length },
          { key: 'all', label: 'All Users', count: users.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {(user as any).userType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                    user.status === UserStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.status === UserStatus.PENDING && (
                    <>
                      <button
                        onClick={() => handleApprove(user)}
                        className="text-green-600 hover:text-green-900 font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {user.status === UserStatus.ACTIVE && (
                    <button
                      onClick={() => handleSuspend(user, 'Manual suspension by administrator')}
                      className="text-red-600 hover:text-red-900 font-semibold"
                    >
                      Suspend
                    </button>
                  )}
                  {user.status === UserStatus.SUSPENDED && (
                    <button
                      onClick={() => handleReinstate(user)}
                      className="text-green-600 hover:text-green-900 font-semibold"
                    >
                      Reinstate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found for this category.
          </div>
        )}
      </div>
    </div>
  );
}