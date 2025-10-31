
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bell, Users, Shield, Activity, MapPin, AlertCircle, BarChart3, Settings } from 'lucide-react';
import UserManagement from '../components/UserManagement';
import PropertyManager from '../components/PropertyManager';
import { complianceService } from '../lib/compliance-service';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [complianceReport, setComplianceReport] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'reports') {
      loadComplianceReport();
    }
  }, [activeTab]);

  const loadComplianceReport = () => {
    const report = complianceService.getComplianceReport();
    setComplianceReport(report);
  };

  const stats = [
    { label: 'Total Officers', value: '24', color: 'info', icon: Shield },
    { label: 'Active Patrols', value: '12', color: 'success', icon: Activity },
    { label: 'Residents', value: '458', color: 'purple', icon: Users },
    { label: 'Alerts Today', value: '3', color: 'warning', icon: AlertCircle },
    { label: 'Checkpoints', value: '156', color: 'info', icon: MapPin },
    { label: 'Pending Approvals', value: '5', color: 'warning', icon: Users },
  ];

  const runComplianceCheck = async () => {
    await complianceService.performComplianceCheck();
    loadComplianceReport();
    alert('Compliance check completed! Check reports for details.');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'properties':
        return <PropertyManager />;
      case 'reports':
        return (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Compliance Reports</h2>
              <button
                onClick={runComplianceCheck}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
              >
                Run Compliance Check
              </button>
            </div>

            {complianceReport && (
              <div className="space-y-6">
                {/* Officer Compliance */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Officer Compliance</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Officer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Compliance Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {complianceReport.officers.map((officer: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {officer.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {officer.complianceRate}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                officer.status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {officer.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Resident Payment Status */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resident Payment Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {complianceReport.residents.filter((r: any) => r.paymentStatus === 'active').length}
                      </div>
                      <div className="text-sm text-green-600">Active</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {complianceReport.residents.filter((r: any) => r.paymentStatus === 'pending').length}
                      </div>
                      <div className="text-sm text-yellow-600">Pending</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {complianceReport.residents.filter((r: any) => r.paymentStatus === 'overdue').length}
                      </div>
                      <div className="text-sm text-red-600">Overdue</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {complianceReport.residents.filter((r: any) => r.paymentStatus === 'suspended').length}
                      </div>
                      <div className="text-sm text-gray-600">Suspended</div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Report generated: {new Date(complianceReport.generatedAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <>
            {/* Stats Grid */}
            <div className="stats-grid mb-6">
              {stats.map((stat, index) => (
                <div key={index} className={`stat-card ${stat.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon size={24} className="text-gray-400" />
                  </div>
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button 
                onClick={() => setActiveTab('users')}
                className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition text-left"
              >
                <div className="text-blue-600 mb-2">
                  <Users size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
                <p className="text-sm text-gray-600">Approve, suspend, or reinstate users</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('properties')}
                className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition text-left"
              >
                <div className="text-green-600 mb-2">
                  <MapPin size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Properties</h3>
                <p className="text-sm text-gray-600">Add houses and generate QR codes</p>
              </button>
              
              <button 
                onClick={() => setActiveTab('reports')}
                className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition text-left"
              >
                <div className="text-purple-600 mb-2">
                  <BarChart3 size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
                <p className="text-sm text-gray-600">Compliance and activity reports</p>
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-2"></div>
          <h2 className="text-xl font-bold">NeighborGuard</h2>
          <p className="text-sm text-gray-400">Admin Portal</p>
        </div>

        <nav className="sidebar-nav">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`sidebar-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Activity size={20} />
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users size={20} />
            <span>User Management</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('properties')}
            className={`sidebar-item ${activeTab === 'properties' ? 'active' : ''}`}
          >
            <MapPin size={20} />
            <span>Properties</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('reports')}
            className={`sidebar-item ${activeTab === 'reports' ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`sidebar-item ${activeTab === 'alerts' ? 'active' : ''}`}
          >
            <Bell size={20} />
            <span>Alerts</span>
            <span className="sidebar-badge">3</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`sidebar-item ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your neighborhood security operations</p>
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
}