import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface Scan {
  id: string;
  location: string;
  time: string;
  address: string;
  ago: string;
  status: 'verified' | 'pending';
  comment?: string;
}

export default function OfficerDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineScans, setOfflineScans] = useState<Scan[]>([]);
  const [scans, setScans] = useState(15);
  const [targetScans] = useState(20);

  useEffect(() => {
    // Simulate offline functionality
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if there are pending offline scans
    const pendingScans = localStorage.getItem('offlineScans');
    if (pendingScans) {
      setOfflineScans(JSON.parse(pendingScans));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const recentScans: Scan[] = [
    {
      id: '1',
      location: 'Main Entrance',
      time: '10:45 AM',
      address: '123 Main St, Building A',
      ago: '10m ago',
      status: 'verified'
    },
    {
      id: '2',
      location: 'Back Gate',
      time: '10:10 AM',
      address: '123 Main St, Rear Access',
      ago: '45m ago',
      status: 'verified'
    },
    {
      id: '3',
      location: 'Parking Lot',
      time: '9:55 AM',
      address: '456 Oak Ave, Parking Area',
      ago: '1h ago',
      status: 'verified'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 mobile-safe">
      {/* Header with Connection Status */}
      <header className="header">
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <h1>Security Dashboard</h1>
              <p>Patrol Tracking System</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isOnline ? '🟢 Online' : '🟡 Offline Mode'}
            </div>
          </div>
        </div>
      </header>

      {!isOnline && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container py-2">
            <p className="text-yellow-800 text-sm text-center">
              ⚠️ You are currently offline. Scans will be stored locally and synced when connection is restored.
            </p>
          </div>
        </div>
      )}

      {offlineScans.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container py-2">
            <p className="text-blue-800 text-sm text-center">
              📱 You have {offlineScans.length} scans waiting to sync. They will be uploaded automatically when online.
            </p>
          </div>
        </div>
      )}

      <div className="container py-6">
        {/* Scanner Section */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scan QR Code</h2>
          
          {/* Scanner Placeholder */}
          <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center mb-4 relative">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-lg font-semibold">Scanner Ready</p>
              <p className="text-gray-300 text-sm">Point camera at QR code</p>
            </div>
            {!isOnline && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                OFFLINE
              </div>
            )}
          </div>

          <Link 
            to="/scanner" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center block"
          >
            Open QR Scanner
          </Link>

          {/* Checkboxes */}
          <div className="space-y-2 mt-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-700">Patrol Status</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-gray-700">Emergency</span>
            </label>
          </div>
        </div>

        {/* Stats and Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Today's Scans */}
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{scans}/{targetScans}</div>
            <div className="text-gray-600 uppercase text-sm tracking-wide">Today Scans</div>
            {offlineScans.length > 0 && (
              <div className="mt-2 text-blue-600 text-sm">
                +{offlineScans.length} offline
              </div>
            )}
          </div>

          {/* Patrol Status */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Patrol Status</h3>
            <div className="text-lg text-green-600 font-semibold mb-3">Day Shift (8AM - 4PM)</div>
            <div className="text-sm text-gray-700">
              <div className="font-medium mb-1">Assigned Houses:</div>
              <ul className="text-gray-600 space-y-1">
                <li>• 123 Main St, Gaborone</li>
                <li>• 456 Kgale View, Gaborone</li>
                <li>• 789 Tlokweng, Gaborone</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="card mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            <div className="emergency-contact">
              <span className="contact-name">Security HQ</span>
              <span className="contact-number">555-123-4567</span>
            </div>
            <div className="emergency-contact">
              <span className="contact-name">Botswana Police</span>
              <span className="contact-number">999</span>
            </div>
            <div className="emergency-contact">
              <span className="contact-name">Ambulance</span>
              <span className="contact-number">997</span>
            </div>
          </div>
        </div>

        {/* Recent Scans with Comment Functionality */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Scans</h3>
            <Link to="/history" className="text-blue-600 text-sm font-semibold">
              View All History
            </Link>
          </div>
          <div className="space-y-4">
            {recentScans.map((scan) => (
              <div key={scan.id} className="scan-item">
                <div className="scan-info">
                  <div className="scan-location">{scan.location}</div>
                  <div className="scan-details">
                    <span>{scan.time}</span>
                    <span>{scan.address}</span>
                  </div>
                  {scan.comment && (
                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Note:</strong> {scan.comment}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="scan-time">{scan.ago}</div>
                  <div className={`status-badge ${
                    scan.status === 'verified' ? 'status-verified' : 'status-pending'
                  }`}>
                    {scan.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Section */}
        <div className="card mt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add Scan Comment</h3>
          <div className="space-y-3">
            <select className="form-input">
              <option>Select a recent scan to comment on...</option>
              {recentScans.map(scan => (
                <option key={scan.id} value={scan.id}>
                  {scan.location} - {scan.time}
                </option>
              ))}
            </select>
            <textarea 
              placeholder="Add your comment (e.g., 'Gate was left open', 'Light broken', etc.)"
              className="form-input h-20 resize-none"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold w-full">
              Add Comment
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/dashboard/officer" className="nav-item active">
          <div className="nav-icon">🏠</div>
          <span>Home</span>
        </Link>
        <Link to="/scanner" className="nav-item">
          <div className="nav-icon">📱</div>
          <span>Scanner</span>
        </Link>
        <Link to="/history" className="nav-item">
          <div className="nav-icon">📋</div>
          <span>History</span>
        </Link>
        <Link to="/profile" className="nav-item">
          <div className="nav-icon">👤</div>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
}
