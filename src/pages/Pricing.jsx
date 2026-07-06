import React, { useState, useEffect } from 'react';
import { 
  MapPin, Globe, Zap, Save, Trash2, Plus, Loader2, Edit2, X, Info, Car, 
  Settings, Layers, Compass, CheckCircle2, ChevronRight, DollarSign, Dog
} from 'lucide-react';
import API_BASE_URL from '../config';

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('state');
  
  // Data States
  const [stateRules, setStateRules] = useState([]);
  const [routeRules, setRouteRules] = useState([]);
  const [rentalRules, setRentalRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [globalMultiplier, setGlobalMultiplier] = useState(1.0);
  const [advancePercentage, setAdvancePercentage] = useState([20, 25, 50]);
  const [petCharge, setPetCharge] = useState(1000);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Consolidated Form Data State
  const [formData, setFormData] = useState({
    // State Pricing specific
    state: '',
    rideCategory: 'Oneway',
    carCategory: '',
    acType: 'Any',
    seater: 4,
    ratePerKm: 0,
    hourlyRate: 0,
    minKms: 0,
    driverBata: 0,
    extraKmRate: 0,
    extraHourRate: 0,
    waitingCharge: 2,
    nightAllowance: 0,
    
    // Route Pricing specific
    pickupLocation: '',
    dropLocation: '',
    pickupLat: '',
    pickupLng: '',
    dropLat: '',
    dropLng: '',
    nearbyRadiusKm: 25,
    fixedPrice: 0,
    includeToll: false,
    includeParking: false,
    includeNightAllowance: false,

    // Rental specific
    packageHours: 8,
    includedKms: 80,
    baseFare: 0,

    // General fields
    advanceType: 'Percentage',
    advanceValue: 20,
    status: 'Active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stateRes, routeRes, rentalRes, settingsRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/pricing-rules/state`),
        fetch(`${API_BASE_URL}/pricing-rules/route`),
        fetch(`${API_BASE_URL}/pricing-rules/rental`),
        fetch(`${API_BASE_URL}/global-settings`),
        fetch(`${API_BASE_URL}/car-categories`)
      ]);

      if (!stateRes.ok || !routeRes.ok || !rentalRes.ok || !settingsRes.ok || !catRes.ok) {
        throw new Error('Failed to fetch pricing configurations');
      }

      const statesData = await stateRes.json();
      const routesData = await routeRes.json();
      const rentalsData = await rentalRes.json();
      const settingsData = await settingsRes.json();
      const catData = await catRes.json();

      setStateRules(statesData);
      setRouteRules(routesData);
      setRentalRules(rentalsData);
      setCategories(catData);
      
      const multiplier = settingsData.find(s => s.key === 'globalMultiplier');
      const advance = settingsData.find(s => s.key === 'advancePercentage');
      const pet = settingsData.find(s => s.key === 'petCharge');
      
      if (multiplier) setGlobalMultiplier(multiplier.value);
      if (advance) {
        if (Array.isArray(advance.value)) {
          setAdvancePercentage(advance.value);
        } else if (typeof advance.value === 'string') {
          setAdvancePercentage(advance.value.split(',').map(v => parseInt(v) || 0));
        } else {
          setAdvancePercentage([parseInt(advance.value) || 20, 25, 50]);
        }
      }
      if (pet) setPetCharge(pet.value);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setFormData({
      state: '',
      rideCategory: 'Oneway',
      carCategory: categories[0]?.name || 'Sedan',
      acType: 'Any',
      seater: categories[0]?.seater || 4,
      ratePerKm: 0,
      hourlyRate: 0,
      minKms: 0,
      driverBata: 0,
      extraKmRate: 0,
      extraHourRate: 0,
      waitingCharge: 2,
      nightAllowance: 0,
      pickupLocation: '',
      dropLocation: '',
      pickupLat: '',
      pickupLng: '',
      dropLat: '',
      dropLng: '',
      nearbyRadiusKm: 25,
      fixedPrice: 0,
      includeToll: false,
      includeParking: false,
      includeNightAllowance: false,
      packageHours: 8,
      includedKms: 80,
      baseFare: 0,
      advanceType: 'Percentage',
      advanceValue: [20, 25, 50],
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule) => {
    setEditingRule(rule);
    let advVal = rule.advanceValue;
    if (rule.advanceType === 'Percentage') {
      if (Array.isArray(rule.advanceValue)) {
        advVal = rule.advanceValue;
      } else if (typeof rule.advanceValue === 'string') {
        advVal = rule.advanceValue.split(',').map(Number);
      } else {
        advVal = [parseInt(rule.advanceValue) || 20, 25, 50];
      }
    }
    setFormData({
      ...rule,
      // Ensure empty strings don't display as undefined in coordinate fields
      pickupLat: rule.pickupLat !== undefined ? rule.pickupLat : '',
      pickupLng: rule.pickupLng !== undefined ? rule.pickupLng : '',
      dropLat: rule.dropLat !== undefined ? rule.dropLat : '',
      dropLng: rule.dropLng !== undefined ? rule.dropLng : '',
      advanceValue: advVal
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingRule ? 'PUT' : 'POST';
      let endpoint = '';
      
      if (activeTab === 'state') endpoint = 'state';
      else if (activeTab === 'route') endpoint = 'route';
      else if (activeTab === 'rental') endpoint = 'rental';

      const url = editingRule 
        ? `${API_BASE_URL}/pricing-rules/${endpoint}/${editingRule._id}` 
        : `${API_BASE_URL}/pricing-rules/${endpoint}`;

      // Process coordinates as numbers if present
      const payload = { ...formData };
      if (activeTab === 'route') {
        payload.pickupLat = payload.pickupLat !== '' ? parseFloat(payload.pickupLat) : undefined;
        payload.pickupLng = payload.pickupLng !== '' ? parseFloat(payload.pickupLng) : undefined;
        payload.dropLat = payload.dropLat !== '' ? parseFloat(payload.dropLat) : undefined;
        payload.dropLng = payload.dropLng !== '' ? parseFloat(payload.dropLng) : undefined;
        payload.fixedPrice = parseFloat(payload.fixedPrice);
        payload.nearbyRadiusKm = parseFloat(payload.nearbyRadiusKm);
        payload.seater = payload.seater !== '' ? parseInt(payload.seater) : undefined;
      } else if (activeTab === 'state') {
        payload.ratePerKm = parseFloat(payload.ratePerKm);
        payload.hourlyRate = parseFloat(payload.hourlyRate);
        payload.minKms = parseFloat(payload.minKms);
        payload.driverBata = parseFloat(payload.driverBata);
        payload.extraKmRate = parseFloat(payload.extraKmRate);
        payload.extraHourRate = parseFloat(payload.extraHourRate);
        payload.waitingCharge = parseFloat(payload.waitingCharge);
        payload.nightAllowance = parseFloat(payload.nightAllowance);
        payload.seater = parseInt(payload.seater);
      } else if (activeTab === 'rental') {
        payload.packageHours = parseInt(payload.packageHours);
        payload.includedKms = parseInt(payload.includedKms);
        payload.baseFare = parseFloat(payload.baseFare);
        payload.extraKmRate = parseFloat(payload.extraKmRate);
        payload.extraHourRate = parseFloat(payload.extraHourRate);
        if (payload.seater !== '') payload.seater = parseInt(payload.seater);
      }
      if (payload.advanceType === 'Percentage') {
        payload.advanceValue = (Array.isArray(payload.advanceValue) ? payload.advanceValue : [parseInt(payload.advanceValue) || 20])
          .map(v => parseInt(v) || 0)
          .filter(v => v >= 0);
      } else {
        payload.advanceValue = parseFloat(payload.advanceValue) || 0;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save rules');
      }
      
      setIsModalOpen(false);
      fetchData();
      alert('Pricing configuration saved successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      let endpoint = '';
      if (activeTab === 'state') endpoint = 'state';
      else if (activeTab === 'route') endpoint = 'route';
      else if (activeTab === 'rental') endpoint = 'rental';

      const response = await fetch(`${API_BASE_URL}/pricing-rules/${endpoint}/${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) throw new Error('Failed to delete pricing rule');
      fetchData();
      alert('Pricing rule deleted successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const updateGlobalSetting = async (key, value) => {
    try {
      const response = await fetch(`${API_BASE_URL}/global-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (!response.ok) throw new Error('Failed to update setting');
      alert(`Global ${key} updated successfully!`);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pricing Engine Settings</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Configure State fallback rates, Route-specific fixed rates, and local Rental Packages.</p>
        </div>
        {activeTab !== 'global' && (
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
          >
            <Plus size={18} /> Add Pricing Rule
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('state')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'state' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Globe size={16} /> State-wise General
        </button>
        <button
          onClick={() => setActiveTab('route')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'route' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Compass size={16} /> Route-Specific overrides
        </button>
        <button
          onClick={() => setActiveTab('rental')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'rental' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Layers size={16} /> Rental Packages
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'global' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Settings size={16} /> Global Settings
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* Tab 1: State-wise General Pricing */}
      {activeTab === 'state' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ride / Car Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rates</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Allowances & Extra</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Advance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stateRules.length > 0 ? (
                  stateRules.map((rule) => (
                    <tr key={rule._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{rule.state}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`w-fit px-1.5 py-0.5 rounded text-[8px] font-black uppercase mb-1 ${
                            rule.rideCategory === 'Oneway' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                          }`}>
                            {rule.rideCategory}
                          </span>
                          <span className="text-sm font-semibold text-gray-700">{rule.carCategory} ({rule.seater} Str, {rule.acType})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-medium">
                          <span className="text-sm text-gray-900">₹{rule.ratePerKm}/km</span>
                          {rule.rideCategory === 'Roundtrip' && <span className="text-xs text-gray-500">₹{rule.hourlyRate}/hr</span>}
                          <span className="text-[10px] text-gray-400">Min Kms: {rule.minKms} km</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs space-y-0.5 text-gray-500 font-medium">
                        <div>Driver Allowance: ₹{rule.driverBata}</div>
                        <div>Night allowance: ₹{rule.nightAllowance}</div>
                        <div>Extra: ₹{rule.extraKmRate}/km | ₹{rule.extraHourRate}/hr</div>
                        <div>Waiting: ₹{rule.waitingCharge}/min</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {rule.advanceType === 'Percentage' ? (Array.isArray(rule.advanceValue) ? rule.advanceValue.map(v => `${v}%`).join(', ') : `${rule.advanceValue}%`) : `₹${rule.advanceValue}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(rule)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRule(rule._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">No state-wise pricing rules found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Route-specific Pricing */}
      {activeTab === 'route' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">GPS Coordinates</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ride & Car</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fixed Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Exclusions Config</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Advance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {routeRules.length > 0 ? (
                  routeRules.map((rule) => (
                    <tr key={rule._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-bold text-gray-900">
                          <span>{rule.pickupLocation} → {rule.dropLocation}</span>
                          <span className="text-[10px] text-gray-400 font-medium">Radius: {rule.nearbyRadiusKm} km</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {rule.pickupLat && rule.pickupLng ? (
                          <div className="font-mono space-y-0.5">
                            <div>P: {rule.pickupLat.toFixed(4)}, {rule.pickupLng.toFixed(4)}</div>
                            <div>D: {rule.dropLat.toFixed(4)}, {rule.dropLng.toFixed(4)}</div>
                          </div>
                        ) : <span className="text-gray-400 italic">None set</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="w-fit px-1.5 py-0.5 rounded text-[8px] font-black bg-blue-50 text-blue-600 uppercase mb-1">{rule.rideCategory}</span>
                          <span className="text-sm font-semibold text-gray-700">{rule.carCategory} ({rule.seater ? `${rule.seater} Str` : 'Any Seater'}, {rule.acType})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-lg text-gray-900">₹{rule.fixedPrice}</td>
                      <td className="px-6 py-4 text-xs space-y-0.5 font-semibold text-gray-500">
                        <div className={rule.includeToll ? 'text-green-600' : 'text-gray-400'}>Toll: {rule.includeToll ? 'Included' : 'Excluded'}</div>
                        <div className={rule.includeParking ? 'text-green-600' : 'text-gray-400'}>Parking: {rule.includeParking ? 'Included' : 'Excluded'}</div>
                        <div className={rule.includeNightAllowance ? 'text-green-600' : 'text-gray-400'}>Night Bata: {rule.includeNightAllowance ? 'Included' : 'Excluded'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {rule.advanceType === 'Percentage' ? (Array.isArray(rule.advanceValue) ? rule.advanceValue.map(v => `${v}%`).join(', ') : `${rule.advanceValue}%`) : `₹${rule.advanceValue}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(rule)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRule(rule._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-medium">No route-specific pricing rules found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Rental Packages */}
      {activeTab === 'rental' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">State</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Car Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Base Fare</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Overage Rates</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Advance</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rentalRules.length > 0 ? (
                  rentalRules.map((rule) => (
                    <tr key={rule._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{rule.state}</td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {rule.carCategory} {rule.seater ? `(${rule.seater} Str)` : ''} - {rule.acType}
                      </td>
                      <td className="px-6 py-4 font-bold text-primary-600 text-sm">
                        {rule.packageHours} hrs / {rule.includedKms} km
                      </td>
                      <td className="px-6 py-4 font-extrabold text-base text-gray-900">₹{rule.baseFare}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-500">
                        Extra KM: ₹{rule.extraKmRate}/km | Extra Hr: ₹{rule.extraHourRate}/hr
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                        {rule.advanceType === 'Percentage' ? (Array.isArray(rule.advanceValue) ? rule.advanceValue.map(v => `${v}%`).join(', ') : `${rule.advanceValue}%`) : `₹${rule.advanceValue}`}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rule.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(rule)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteRule(rule._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-medium">No rental packages found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Global Settings */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          {/* Multiplier */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Global Pricing Multiplier</h3>
                <p className="text-xs text-gray-500">Apply multiplier factor (e.g. 1.2 for 20% surge, rain, peak hours)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <input 
                type="number" step="0.05"
                value={globalMultiplier}
                onChange={(e) => setGlobalMultiplier(e.target.value)}
                className="w-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
              <button 
                onClick={() => updateGlobalSetting('globalMultiplier', parseFloat(globalMultiplier))}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
              >
                <Save size={18} /> Update surge multiplier
              </button>
            </div>
          </div>

          {/* Default Advance Percentage */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Global Default Advance %</h3>
                <p className="text-xs text-gray-500">Standard booking deposit percentages required from users (up to 3 values can be set)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input 
                    type="number"
                    value={Array.isArray(advancePercentage) ? (advancePercentage[0] !== undefined ? advancePercentage[0] : '') : advancePercentage}
                    onChange={(e) => {
                      const newVals = Array.isArray(advancePercentage) ? [...advancePercentage] : [parseInt(advancePercentage) || 0, 25, 50];
                      newVals[0] = parseInt(e.target.value) || 0;
                      setAdvancePercentage(newVals);
                    }}
                    className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none pr-6"
                    placeholder="Val 1"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">%</span>
                </div>
                <div className="relative">
                  <input 
                    type="number"
                    value={Array.isArray(advancePercentage) ? (advancePercentage[1] !== undefined ? advancePercentage[1] : '') : ''}
                    onChange={(e) => {
                      const newVals = Array.isArray(advancePercentage) ? [...advancePercentage] : [parseInt(advancePercentage) || 0, 25, 50];
                      newVals[1] = parseInt(e.target.value) || 0;
                      setAdvancePercentage(newVals);
                    }}
                    className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none pr-6"
                    placeholder="Val 2"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">%</span>
                </div>
                <div className="relative">
                  <input 
                    type="number"
                    value={Array.isArray(advancePercentage) ? (advancePercentage[2] !== undefined ? advancePercentage[2] : '') : ''}
                    onChange={(e) => {
                      const newVals = Array.isArray(advancePercentage) ? [...advancePercentage] : [parseInt(advancePercentage) || 0, 25, 50];
                      newVals[2] = parseInt(e.target.value) || 0;
                      setAdvancePercentage(newVals);
                    }}
                    className="w-24 bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-primary-100 outline-none pr-6"
                    placeholder="Val 3"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">%</span>
                </div>
              </div>
              <button 
                onClick={async () => {
                  const vals = (Array.isArray(advancePercentage) ? advancePercentage : [parseInt(advancePercentage) || 0])
                    .map(v => parseInt(v) || 0)
                    .filter(v => v >= 0);
                  await updateGlobalSetting('advancePercentage', vals);
                  const payOptions = Array.from(new Set(vals)).sort((a, b) => a - b);
                  await updateGlobalSetting('pay_advance_options', payOptions);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
              >
                <Save size={18} /> Save default advance
              </button>
            </div>
          </div>

          {/* Pet Charge Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                <Dog size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Pet Charge (Flat Amount)</h3>
                <p className="text-xs text-gray-500">Flat amount automatically added to total ride fare for all pet cab bookings</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input 
                  type="number"
                  value={petCharge}
                  onChange={(e) => setPetCharge(e.target.value)}
                  className="w-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-900 focus:ring-2 focus:ring-orange-100 outline-none pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
              </div>
              <button 
                onClick={() => updateGlobalSetting('petCharge', parseInt(petCharge))}
                className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100"
              >
                <Save size={18} /> Save Pet Charge
              </button>
            </div>
          </div>

          {/* Default Categories Base Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Car size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Car Category Base Constants</h3>
                <p className="text-xs text-gray-500">Quick view of car category seat capacities and default parameters</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="font-bold text-gray-900">{cat.displayName}</div>
                  <div className="text-xs text-gray-500 mt-1">Slug: {cat.name}</div>
                  <div className="text-xs text-gray-700 font-semibold mt-2">Capacity: {cat.seater} Seater</div>
                  <div className="text-xs text-gray-700 font-semibold mt-0.5">Base Fare: ₹{cat.baseFare}</div>
                  <div className="text-xs text-gray-700 font-semibold mt-0.5">Rate/KM: ₹{cat.perKmRate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editingRule ? 'Edit' : 'Add'} {
                  activeTab === 'state' ? 'State General pricing' :
                  activeTab === 'route' ? 'Route specific override' : 'Local Rental Package'
                }</h2>
                <p className="text-xs text-gray-500 font-medium">Configure rules to automatically determine trip charges</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* STATE ROW (Active in State, Rental, optional in Route) */}
              {(activeTab === 'state' || activeTab === 'rental') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">State</label>
                    <input 
                      type="text" required placeholder="e.g. West Bengal"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Car Category</label>
                    <select 
                      value={formData.carCategory}
                      onChange={(e) => {
                        const selectedCat = categories.find(c => c.name === e.target.value);
                        setFormData({
                          ...formData, 
                          carCategory: e.target.value,
                          seater: selectedCat ? selectedCat.seater : formData.seater
                        });
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.displayName}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* ROUTE FIELDS */}
              {activeTab === 'route' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Pickup Location Name</label>
                      <input 
                        type="text" required placeholder="e.g. Kolkata Airport"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Drop Location Name</label>
                      <input 
                        type="text" required placeholder="e.g. Digha"
                        value={formData.dropLocation}
                        onChange={(e) => setFormData({...formData, dropLocation: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-primary-50/20 rounded-2xl border border-primary-50/50 space-y-3">
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-wider">Route Geo Proximity Matching (Optional)</span>
                    <div className="grid grid-cols-4 gap-2">
                      <input 
                        type="number" step="0.0001" placeholder="Pickup Lat"
                        value={formData.pickupLat}
                        onChange={(e) => setFormData({...formData, pickupLat: e.target.value})}
                        className="bg-white px-3 py-2 border border-gray-100 rounded-lg text-xs font-bold"
                      />
                      <input 
                        type="number" step="0.0001" placeholder="Pickup Lng"
                        value={formData.pickupLng}
                        onChange={(e) => setFormData({...formData, pickupLng: e.target.value})}
                        className="bg-white px-3 py-2 border border-gray-100 rounded-lg text-xs font-bold"
                      />
                      <input 
                        type="number" step="0.0001" placeholder="Drop Lat"
                        value={formData.dropLat}
                        onChange={(e) => setFormData({...formData, dropLat: e.target.value})}
                        className="bg-white px-3 py-2 border border-gray-100 rounded-lg text-xs font-bold"
                      />
                      <input 
                        type="number" step="0.0001" placeholder="Drop Lng"
                        value={formData.dropLng}
                        onChange={(e) => setFormData({...formData, dropLng: e.target.value})}
                        className="bg-white px-3 py-2 border border-gray-100 rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Match Radius (KM)</label>
                      <input 
                        type="number" placeholder="25"
                        value={formData.nearbyRadiusKm}
                        onChange={(e) => setFormData({...formData, nearbyRadiusKm: e.target.value})}
                        className="w-20 bg-white px-2 py-1 border border-gray-100 rounded text-xs font-bold text-center"
                      />
                      <span className="text-[9px] text-gray-400 font-medium">(Matches bookings within this radius of configured route)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Ride Category</label>
                      <select 
                        value={formData.rideCategory}
                        onChange={(e) => setFormData({...formData, rideCategory: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      >
                        <option value="Oneway">Oneway</option>
                        <option value="Roundtrip">Roundtrip</option>
                        <option value="Rental">Rental</option>
                        <option value="Airport">Airport Transfer</option>
                        <option value="Station">Station Transfer</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Car Category</label>
                      <select 
                        value={formData.carCategory}
                        onChange={(e) => setFormData({...formData, carCategory: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c.name}>{c.displayName}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Seater (Optional)</label>
                      <input 
                        type="number" placeholder="e.g. 4"
                        value={formData.seater || ''}
                        onChange={(e) => setFormData({...formData, seater: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STATE WISE CATEGORIES OPTIONS */}
              {activeTab === 'state' && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Ride Category</label>
                    <select 
                      value={formData.rideCategory}
                      onChange={(e) => setFormData({...formData, rideCategory: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="Oneway">Oneway</option>
                      <option value="Roundtrip">Roundtrip</option>
                      <option value="Rental">Rental</option>
                      <option value="Airport">Airport Transfer</option>
                      <option value="Station">Station Transfer</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">AC Type</label>
                    <select 
                      value={formData.acType}
                      onChange={(e) => setFormData({...formData, acType: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="Any">Any Type (AC/Non-AC)</option>
                      <option value="AC">AC</option>
                      <option value="Non-AC">Non-AC</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Seater Type</label>
                    <input 
                      type="number" required placeholder="e.g. 4"
                      value={formData.seater}
                      onChange={(e) => setFormData({...formData, seater: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>
              )}

              {/* RENTAL PACKAGE SPECIFIC */}
              {activeTab === 'rental' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">AC Type</label>
                      <select 
                        value={formData.acType}
                        onChange={(e) => setFormData({...formData, acType: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      >
                        <option value="Any">Any Type</option>
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Seater (Optional)</label>
                      <input 
                        type="number" placeholder="4"
                        value={formData.seater || ''}
                        onChange={(e) => setFormData({...formData, seater: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-orange-50/20 rounded-2xl border border-orange-50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-orange-600 uppercase tracking-wider ml-1">Package Hours</label>
                      <input 
                        type="number" required placeholder="e.g. 8"
                        value={formData.packageHours}
                        onChange={(e) => setFormData({...formData, packageHours: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-orange-600 uppercase tracking-wider ml-1">Included KMs</label>
                      <input 
                        type="number" required placeholder="e.g. 80"
                        value={formData.includedKms}
                        onChange={(e) => setFormData({...formData, includedKms: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-orange-600 uppercase tracking-wider ml-1">Base Package Fare (₹)</label>
                      <input 
                        type="number" required placeholder="e.g. 1500"
                        value={formData.baseFare}
                        onChange={(e) => setFormData({...formData, baseFare: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-orange-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CORE PRICING & RATE FIELDS */}
              {activeTab === 'state' && (
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">State General Rates config</span>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Rate per KM (₹)</label>
                      <input 
                        type="number" required value={formData.ratePerKm}
                        onChange={(e) => setFormData({...formData, ratePerKm: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Hourly Rate (₹)</label>
                      <input 
                        type="number" value={formData.hourlyRate}
                        onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Minimum KMs</label>
                      <input 
                        type="number" value={formData.minKms}
                        onChange={(e) => setFormData({...formData, minKms: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-purple-50/20 rounded-2xl border border-purple-50">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-600 uppercase tracking-wider ml-1">Driver Bata/Allowance (₹)</label>
                      <input 
                        type="number" value={formData.driverBata}
                        onChange={(e) => setFormData({...formData, driverBata: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-600 uppercase tracking-wider ml-1">Night Driving Bata (₹)</label>
                      <input 
                        type="number" value={formData.nightAllowance}
                        onChange={(e) => setFormData({...formData, nightAllowance: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-purple-600 uppercase tracking-wider ml-1">Waiting Fee (₹/min)</label>
                      <input 
                        type="number" value={formData.waitingCharge}
                        onChange={(e) => setFormData({...formData, waitingCharge: e.target.value})}
                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* OVERAGE CHARGES AND OTHER DETAILS (FOR STATE AND RENTAL) */}
              {(activeTab === 'state' || activeTab === 'rental') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Extra KM Rate (₹/km)</label>
                    <input 
                      type="number" value={formData.extraKmRate}
                      onChange={(e) => setFormData({...formData, extraKmRate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Extra Hour Rate (₹/hr)</label>
                    <input 
                      type="number" value={formData.extraHourRate}
                      onChange={(e) => setFormData({...formData, extraHourRate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold"
                    />
                  </div>
                </div>
              )}

              {/* ROUTE FIXED PRICE */}
              {activeTab === 'route' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Fixed Route Price (₹)</label>
                    <input 
                      type="number" required placeholder="e.g. 2999"
                      value={formData.fixedPrice}
                      onChange={(e) => setFormData({...formData, fixedPrice: e.target.value})}
                      className="w-full px-4 py-3 bg-purple-50/50 border-none rounded-xl text-lg font-black text-purple-700 outline-none focus:ring-2 focus:ring-purple-200"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between gap-4">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Inclusions in Fixed Price:</span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700">
                        <input 
                          type="checkbox" 
                          checked={formData.includeToll}
                          onChange={(e) => setFormData({...formData, includeToll: e.target.checked})}
                          className="w-4 h-4 rounded text-primary-600 border-gray-300"
                        />
                        Include Tolls
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700">
                        <input 
                          type="checkbox"
                          checked={formData.includeParking}
                          onChange={(e) => setFormData({...formData, includeParking: e.target.checked})}
                          className="w-4 h-4 rounded text-primary-600 border-gray-300"
                        />
                        Include Parking
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-gray-700">
                        <input 
                          type="checkbox"
                          checked={formData.includeNightAllowance}
                          onChange={(e) => setFormData({...formData, includeNightAllowance: e.target.checked})}
                          className="w-4 h-4 rounded text-primary-600 border-gray-300"
                        />
                        Include Night Allowance
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ADVANCE PAYMENT AND STATUS LOGIC */}
              <div className="border-t border-gray-50 pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Advance Type</label>
                    <select 
                      value={formData.advanceType}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setFormData({
                          ...formData,
                          advanceType: newType,
                          advanceValue: newType === 'Percentage' ? [20, 25, 50] : 0
                        });
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Rule Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {formData.advanceType === 'Percentage' ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Advance Percentages (up to 3 values)</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <input 
                          type="number" placeholder="Val 1"
                          value={Array.isArray(formData.advanceValue) ? (formData.advanceValue[0] !== undefined ? formData.advanceValue[0] : '') : formData.advanceValue}
                          onChange={(e) => {
                            const newVals = Array.isArray(formData.advanceValue) ? [...formData.advanceValue] : [parseInt(formData.advanceValue) || 0, 25, 50];
                            newVals[0] = parseInt(e.target.value) || 0;
                            setFormData({...formData, advanceValue: newVals});
                          }}
                          className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 pr-6"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">%</span>
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="number" placeholder="Val 2"
                          value={Array.isArray(formData.advanceValue) ? (formData.advanceValue[1] !== undefined ? formData.advanceValue[1] : '') : ''}
                          onChange={(e) => {
                            const newVals = Array.isArray(formData.advanceValue) ? [...formData.advanceValue] : [parseInt(formData.advanceValue) || 0, 25, 50];
                            newVals[1] = parseInt(e.target.value) || 0;
                            setFormData({...formData, advanceValue: newVals});
                          }}
                          className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 pr-6"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">%</span>
                      </div>
                      <div className="relative flex-1">
                        <input 
                          type="number" placeholder="Val 3"
                          value={Array.isArray(formData.advanceValue) ? (formData.advanceValue[2] !== undefined ? formData.advanceValue[2] : '') : ''}
                          onChange={(e) => {
                            const newVals = Array.isArray(formData.advanceValue) ? [...formData.advanceValue] : [parseInt(formData.advanceValue) || 0, 25, 50];
                            newVals[2] = parseInt(e.target.value) || 0;
                            setFormData({...formData, advanceValue: newVals});
                          }}
                          className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 pr-6"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Advance Value (Fixed Amount ₹)</label>
                    <input 
                      type="number" required
                      value={formData.advanceValue}
                      onChange={(e) => setFormData({...formData, advanceValue: e.target.value})}
                      className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-4 -mx-8 -mb-8 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all"
                >
                  Save pricing rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
