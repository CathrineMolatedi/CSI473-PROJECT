// pages/EnhancedResidentDashboard.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PaymentComponent from '../components/PaymentComponent';
import { useAuth } from '../lib/auth-context';
import { Resident, PaymentStatus } from '../lib/types';

export default function ResidentDashboard() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'forum'>('overview');
  const { user } = useAuth();
  
  const resident = user as Resident;
  const [subscriptionStatus, setSubscriptionStatus] = useState<PaymentStatus>(PaymentStatus.ACTIVE);
  const [daysUntilRenewal, setDaysUntilRenewal] = useState(15);

  useEffect(() => {
    if (resident) {
      setSubscriptionStatus(resident.paymentStatus);
      
      // Calculate days until renewal
      const today = new Date();
      const renewalDate = new Date(resident.subscriptionEndDate);
      const diffTime = renewalDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilRenewal(diffDays > 0 ? diffDays : 0);
    }
  }, [resident]);

  const handleEmergencyAlert = () => {
    setShowEmergencyModal(true);
  };

  const confirmEmergencyAlert = () => {
    alert('🚨 EMERGENCY ALERT SENT TO ALL SECURITY OFFICERS AND RESIDENTS!');
    setShowEmergencyModal(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'payments':
        return <PaymentComponent />;
      case 'forum':
        return (
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Community Forum</h2>
            <div className="text-center py-8 text-gray-500">
              Forum functionality will be implemented here
            </div>
          </div>
        );
      default:
        return (
          <>
            {/* Emergency Alert Button */}
            <div className="card text-center mb-6">
              <button 
                onClick={handleEmergencyAlert}
                className="btn-emergency"
              >
                🚨 EMERGENCY ALERT
              </button>
              <p className="text-sm text-gray-600 mt-2">
                Press in case of emergency - Alerts all guards and residents immediately
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="stat-card text-center">
                <div className={`text-2xl font-bold ${
                  subscriptionStatus === PaymentStatus.ACTIVE ? 'text-green-600' : 
                  subscriptionStatus === PaymentStatus.OVERDUE ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {subscriptionStatus}
                </div>
                <div className="stat-label">Subscription</div>
              </div>
              
              <div className="stat-card text-center">
                <div className="text-2xl font-bold text-blue-600">{daysUntilRenewal}</div>
                <div className="stat-label">Days to Renewal</div>
              </div>
              
              <div className="stat-card text-center">
                <div className="text-2xl font-bold text-purple-600">7</div>
                <div className="stat-label">Patrols This Week</div>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Status</h2>
              <div className="subscription-status">
                <div className={`subscription-badge ${
                  subscriptionStatus === PaymentStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                  subscriptionStatus === PaymentStatus.OVERDUE ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {subscriptionStatus}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="stat-value">{daysUntilRenewal} days</div>
                    <div className="stat-description">Days Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="stat-value">
                      {resident ? new Date(resident.subscriptionEndDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="stat-description">Renewal Date</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setActiveTab('payments')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold"
                  >
                    Make Payment
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50">
                    View History
                  </button>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mobile-safe">
      {/* Emergency Alert Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Emergency Alert Confirmation</h3>
              <p className="text-gray-600 mb-6">
                This will send an immediate emergency alert to all security officers and neighborhood residents. 
                Only use this for genuine emergencies.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEmergencyAlert}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                >
                  Confirm Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="header bg-green-600">
        <div className="container">
          <h1>Neighborhood Watch</h1>
          <p>Community Security Portal</p>
        </div>
      </header>

      <div className="container py-6">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'payments'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`pb-3 px-1 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'forum'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Community Forum
          </button>
        </div>

        {renderTabContent()}

        {/* Emergency Contacts */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contacts</h2>
          <div className="space-y-3">
            <div className="emergency-contact">
              <div>
                <div className="contact-name">Security HQ</div>
                <div className="text-sm text-gray-500">24/7 Security Operations</div>
              </div>
              <div className="text-right">
                <div className="contact-number">555-123-4567</div>
                <button className="text-blue-600 text-sm font-semibold mt-1">Call</button>
              </div>
            </div>
            <div className="emergency-contact">
              <div>
                <div className="contact-name">Botswana Police</div>
                <div className="text-sm text-gray-500">Emergency Services</div>
              </div>
              <div className="text-right">
                <div className="contact-number">999</div>
                <button className="text-red-600 text-sm font-semibold mt-1">Call</button>
              </div>
            </div>
            <div className="emergency-contact">
              <div>
                <div className="contact-name">Ambulance Services</div>
                <div className="text-sm text-gray-500">Medical Emergencies</div>
              </div>
              <div className="text-right">
                <div className="contact-number">997</div>
                <button className="text-green-600 text-sm font-semibold mt-1">Call</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          <div className="nav-icon">🏠</div>
          <span>Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('forum')}
          className={`nav-item ${activeTab === 'forum' ? 'active' : ''}`}
        >
          <div className="nav-icon">💬</div>
          <span>Forum</span>
        </button>
        <button 
          onClick={() => setActiveTab('payments')}
          className={`nav-item ${activeTab === 'payments' ? 'active' : ''}`}
        >
          <div className="nav-icon">💰</div>
          <span>Payments</span>
        </button>
        <Link to="/profile" className="nav-item">
          <div className="nav-icon">👤</div>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}