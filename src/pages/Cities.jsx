import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader2, Globe, Shield, ShieldOff } from 'lucide-react';
import API_BASE_URL from '../config';

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cities`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const response = await fetch(`${API_BASE_URL}/cities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      setCities(cities.map(city => 
        city._id === id ? { ...city, status: newStatus } : city
      ));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">City Management</h1>
          <p className="text-sm text-gray-500 font-medium">View and manage cities selected by users via Nominatim.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 bg-white border border-gray-200 rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-100 transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Globe size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Total Cities</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">{cities.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <Shield size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Active</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {cities.filter(c => c.status === 'Active').length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Unique States</h3>
          </div>
          <p className="text-3xl font-black text-gray-900">
            {new Set(cities.map(c => c.state)).size}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">City Name</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Coordinates</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <tr key={city._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{city.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]">
                          {city.displayName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-700">{city.state}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-[10px] text-gray-500 font-mono">
                        <span>Lat: {parseFloat(city.lat).toFixed(4)}</span>
                        <span>Lon: {parseFloat(city.lon).toFixed(4)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        city.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {city.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleStatus(city._id, city.status)}
                        className={`p-2 rounded-lg transition-all ${
                          city.status === 'Active' 
                          ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' 
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={city.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {city.status === 'Active' ? <ShieldOff size={18} /> : <Shield size={18} />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No cities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Cities;
