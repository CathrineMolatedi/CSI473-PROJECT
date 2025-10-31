// components/PropertyManager.tsx
import { useState, useEffect } from 'react';
import { House } from '../lib/types';

export default function PropertyManager() {
  const [houses, setHouses] = useState<House[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHouse, setNewHouse] = useState({
    address: '',
    coordinates: { lat: 0, lng: 0 },
    assignedOfficer: ''
  });

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = () => {
    const storedHouses = JSON.parse(localStorage.getItem('houses') || '[]');
    setHouses(storedHouses);
  };

  const generateQRCode = (address: string): string => {
    return `NHW-${address.replace(/\s+/g, '-').toUpperCase()}-${Date.now().toString(36)}`;
  };

  const handleAddHouse = () => {
    const qrCode = generateQRCode(newHouse.address);
    const house: House = {
      id: Date.now().toString(),
      address: newHouse.address,
      qrCode,
      isActive: true,
      coordinates: newHouse.coordinates,
      assignedOfficer: newHouse.assignedOfficer
    };

    const updatedHouses = [...houses, house];
    localStorage.setItem('houses', JSON.stringify(updatedHouses));
    
    setHouses(updatedHouses);
    setShowAddForm(false);
    setNewHouse({ address: '', coordinates: { lat: 0, lng: 0 }, assignedOfficer: '' });
  };

  const handleToggleActive = (houseId: string) => {
    const updatedHouses = houses.map(house =>
      house.id === houseId ? { ...house, isActive: !house.isActive } : house
    );
    
    localStorage.setItem('houses', JSON.stringify(updatedHouses));
    setHouses(updatedHouses);
  };

  const handleDeleteHouse = (houseId: string) => {
    const updatedHouses = houses.filter(house => house.id !== houseId);
    localStorage.setItem('houses', JSON.stringify(updatedHouses));
    setHouses(updatedHouses);
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Property Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Add New Property
        </button>
      </div>

      {/* Add Property Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Property</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={newHouse.address}
                onChange={(e) => setNewHouse({ ...newHouse, address: e.target.value })}
                placeholder="123 Main Street, Gaborone"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Officer (Optional)
              </label>
              <input
                type="text"
                value={newHouse.assignedOfficer}
                onChange={(e) => setNewHouse({ ...newHouse, assignedOfficer: e.target.value })}
                placeholder="Officer badge number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coordinates (Latitude, Longitude)
              </label>
              <div className="flex space-x-4">
                <input
                  type="number"
                  step="any"
                  value={newHouse.coordinates.lat}
                  onChange={(e) => setNewHouse({
                    ...newHouse,
                    coordinates: { ...newHouse.coordinates, lat: parseFloat(e.target.value) }
                  })}
                  placeholder="Latitude"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  step="any"
                  value={newHouse.coordinates.lng}
                  onChange={(e) => setNewHouse({
                    ...newHouse,
                    coordinates: { ...newHouse.coordinates, lng: parseFloat(e.target.value) }
                  })}
                  placeholder="Longitude"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAddHouse}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Add Property
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Properties List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                QR Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Officer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {houses.map((house) => (
              <tr key={house.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{house.address}</div>
                  <div className="text-sm text-gray-500">
                    {house.coordinates.lat}, {house.coordinates.lng}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                    {house.qrCode}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {house.assignedOfficer || 'Not assigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    house.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {house.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleToggleActive(house.id)}
                    className={`${
                      house.isActive 
                        ? 'text-yellow-600 hover:text-yellow-900' 
                        : 'text-green-600 hover:text-green-900'
                    } font-semibold`}
                  >
                    {house.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDeleteHouse(house.id)}
                    className="text-red-600 hover:text-red-900 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {houses.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No properties added yet. Click "Add New Property" to get started.
          </div>
        )}
      </div>
    </div>
  );
}