import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Scanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [scanComment, setScanComment] = useState('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const scanData = {
        id: Date.now().toString(),
        location: 'Main Entrance',
        timestamp: new Date().toLocaleTimeString(),
        comment: scanComment,
        status: isOnline ? 'synced' : 'pending'
      };
      
      if (!isOnline) {
        // Store scan locally
        const offlineScans = JSON.parse(localStorage.getItem('offlineScans') || '[]');
        offlineScans.push(scanData);
        localStorage.setItem('offlineScans', JSON.stringify(offlineScans));
      }
      
      setLastScan(`Main Entrance - ${new Date().toLocaleTimeString()}`);
      setIsScanning(false);
      setScanComment('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black mobile-safe">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">QR Code Scanner</h1>
              <p className="text-blue-100 text-sm">Point at checkpoint QR code</p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
              isOnline ? 'bg-green-500' : 'bg-yellow-500'
            }`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>
        </div>
      </header>

      {/* Scanner View */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm aspect-square bg-gray-900 rounded-2xl relative overflow-hidden border-2 border-gray-700">
          {/* Scanner Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-2 border-white border-dashed w-64 h-64 rounded-lg"></div>
          </div>
          
          {/* Corner markers */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white"></div>

          {/* Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-2xl mb-2">🔍</div>
                <p>Scanning QR Code...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 bg-gray-900">
        <textarea
          value={scanComment}
          onChange={(e) => setScanComment(e.target.value)}
          placeholder="Add optional comment (e.g., 'Gate open', 'Light broken')"
          className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700 resize-none h-16"
        />
      </div>

      {/* Scan Button */}
      <div className="p-4 bg-gray-900">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className={`w-full py-4 rounded-lg font-semibold text-lg ${
            isScanning 
              ? 'bg-blue-400 text-white' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isScanning ? 'Scanning...' : 'Scan QR Code'}
        </button>
      </div>

      {/* Last Scan Result */}
      {lastScan && (
        <div className="p-4 bg-gray-900">
          <div className="bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
            <div className="flex items-center justify-between">
              <div>
                <strong>Scan Successful!</strong>
                <p>{lastScan}</p>
                {!isOnline && (
                  <p className="text-yellow-300 text-sm mt-1">
                    ⚠️ Stored offline - will sync when connection available
                  </p>
                )}
              </div>
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/dashboard/officer" className="nav-item">
          <div className="nav-icon">🏠</div>
          <span>Home</span>
        </Link>
        <Link to="/scanner" className="nav-item active">
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
