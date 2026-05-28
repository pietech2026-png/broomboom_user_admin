import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  Car, 
  IndianRupee,
  Save,
  Navigation,
  Globe,
  Settings,
  ShieldCheck,
  Search,
  CheckCircle2,
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';
import API_BASE_URL from '../config';

const CreateBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPilotInfo, setShowPilotInfo] = useState(false);
  
  const [formData, setFormData] = useState({
    // Section 1: Customer & Basic Details
    customerName: '',
    customerMobile: '',
    customerEmail: '',
    serviceType: 'Outstation oneway',
    state: '',
    pincode: '',

    // Section 2: Route Information
    pickupAddress: '',
    dropAddress: '',
    distance: '',

    // Section 3: GPS Coordinates
    pickupLat: '',
    pickupLng: '',
    dropLat: '',
    dropLng: '',

    // Section 4: Schedule Details
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',

    // Section 5: Vehicle & Pilot Selection
    vehicleCategory: 'Sedan',
    seater: 4,
    acType: 'AC',
    rentalPackage: '',
    allocateOurPilot: false,
    eligiblePilots: [],

    // Section 6: Fare & Charges
    fare: '',
    advance: '',
    dueFare: '',
    extraKm: '',
    extraHour: '',
    waitingCharges: '',
    nightAllowance: '',
    tollTax: 'Excluded',

    // Section 7: Driver Details
    driverName: '',
    driverNumber: '',
    carNo: ''
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
      }
      
      alert('Booking Created Successfully!');
      navigate('/bookings');
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-200 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create New Booking</h1>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
            <p className="text-sm text-blue-700 font-semibold flex items-center gap-2">
              <HelpCircle size={16} />
              For Outstation Roundtrip, please fill in the Return Date & Time fields.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={resetForm}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
          >
            <RotateCcw size={18} />
            Reset Form
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Save size={20} /> Save Booking</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SECTION 1: CUSTOMER & SERVICE */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-primary-500"><User size={22} /></div>
              Customer & Service Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Name</label>
                <input 
                  type="text" required placeholder="Full Name"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={formData.customerName}
                  onChange={(e) => handleChange('customerName', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phn no</label>
                <input 
                  type="tel" required placeholder="Mobile Number"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={formData.customerMobile}
                  onChange={(e) => handleChange('customerMobile', e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email ID (Optional)</label>
                <input 
                  type="email" placeholder="Email Address"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={formData.customerEmail}
                  onChange={(e) => handleChange('customerEmail', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ride Type</label>
                <select 
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all cursor-pointer"
                  value={formData.serviceType}
                  onChange={(e) => handleChange('serviceType', e.target.value)}
                >
                  <option value="Airport">Airport</option>
                  <option value="Station">Station</option>
                  <option value="Outstation oneway">Outstation oneway</option>
                  <option value="Outstation Roundtrip">Outstation Roundtrip</option>
                  <option value="Rental">Rental</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">State</label>
                <input 
                  type="text" required placeholder="e.g. Maharashtra"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pincode</label>
                <input 
                  type="text" required placeholder="Pincode"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: ROUTE & TIMELINE */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><MapPin size={22} /></div>
              Route & Timeline
            </h2>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup location</label>
                <textarea 
                  required placeholder="Enter full pickup address..."
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[70px]"
                  value={formData.pickupAddress}
                  onChange={(e) => handleChange('pickupAddress', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Drop location</label>
                <textarea 
                  required placeholder="Enter destination address..."
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[70px]"
                  value={formData.dropAddress}
                  onChange={(e) => handleChange('dropAddress', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup date</label>
                  <input 
                    type="date" required
                    className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    value={formData.pickupDate}
                    onChange={(e) => handleChange('pickupDate', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup time</label>
                  <input 
                    type="time" required
                    className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    value={formData.pickupTime}
                    onChange={(e) => handleChange('pickupTime', e.target.value)}
                  />
                </div>
              </div>
              
              {(formData.serviceType === 'Outstation Roundtrip') && (
                <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Return date</label>
                    <input 
                      type="date" required
                      className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      value={formData.returnDate}
                      onChange={(e) => handleChange('returnDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Return time</label>
                    <input 
                      type="time" required
                      className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      value={formData.returnTime}
                      onChange={(e) => handleChange('returnTime', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: GPS COORDINATES */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Globe size={22} /></div>
              GPS Coordinates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup Lat</label>
                <input 
                  type="text" placeholder="0.000000"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.pickupLat}
                  onChange={(e) => handleChange('pickupLat', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pickup Lng</label>
                <input 
                  type="text" placeholder="0.000000"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.pickupLng}
                  onChange={(e) => handleChange('pickupLng', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Drop Lat</label>
                <input 
                  type="text" placeholder="0.000000"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.dropLat}
                  onChange={(e) => handleChange('dropLat', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Drop Lng</label>
                <input 
                  type="text" placeholder="0.000000"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.dropLng}
                  onChange={(e) => handleChange('dropLng', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: VEHICLE & PILOT CONFIG */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-500"><Car size={22} /></div>
                Vehicle & Details
              </h2>
              <div className="flex items-center gap-4 bg-gray-50 p-2 px-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="pilotAlloc"
                    className="w-5 h-5 rounded-lg border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    checked={formData.allocateOurPilot}
                    onChange={(e) => handleChange('allocateOurPilot', e.target.checked)}
                  />
                  <label htmlFor="pilotAlloc" className="text-sm font-bold text-gray-700 cursor-pointer">Allocate our pilot</label>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowPilotInfo(!showPilotInfo)}
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                >
                  <HelpCircle size={20} />
                </button>
              </div>
            </div>

            {showPilotInfo && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-700 font-medium animate-in zoom-in-95 duration-200">
                <p>When "Allocate our pilot" is enabled, this booking is reserved for our local pilot fleet and cannot be accepted by general pilots.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Distance (KM)</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="number" placeholder="0"
                    className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all"
                    value={formData.distance}
                    onChange={(e) => handleChange('distance', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Car Category</label>
                <select 
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                  value={formData.vehicleCategory}
                  onChange={(e) => handleChange('vehicleCategory', e.target.value)}
                >
                  <option value="Mini">Mini</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="SUV+">SUV+</option>
                  <option value="Traveller">Traveller</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Seater</label>
                <select 
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                  value={formData.seater}
                  onChange={(e) => handleChange('seater', parseInt(e.target.value))}
                >
                  <option value="4">4 Seater</option>
                  <option value="6">6 Seater</option>
                  <option value="7">7 Seater</option>
                  <option value="13">13 Seater</option>
                  <option value="15">15 Seater</option>
                  <option value="17">17 Seater</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ac non ac</label>
                <select 
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all cursor-pointer"
                  value={formData.acType}
                  onChange={(e) => handleChange('acType', e.target.value)}
                >
                  <option value="AC">AC</option>
                  <option value="Non AC">Non AC</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Rental package</label>
                <input 
                  type="text" placeholder="e.g. 8hr-80km"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  value={formData.rentalPackage}
                  onChange={(e) => handleChange('rentalPackage', e.target.value)}
                />
              </div>
            </div>

            {formData.allocateOurPilot && (
              <div className="pt-6 border-t border-gray-50 animate-in slide-in-from-top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Select Specific Pilots</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" placeholder="Search by name or mobile..."
                      className="bg-gray-50 border border-gray-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary-100 outline-none w-64"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-center text-gray-500 text-sm italic">
                  Select state and city to view available pilots in this region.
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: PRICING & FARE */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><IndianRupee size={22} /></div>
              Pricing & Total Fare
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fare (₹)</label>
                <input 
                  type="number" required placeholder="0.00"
                  className="w-full bg-purple-50/30 border-purple-100 rounded-xl py-3 px-4 text-lg font-bold text-purple-700 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  value={formData.fare}
                  onChange={(e) => handleChange('fare', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Advance</label>
                <input 
                  type="number" placeholder="0.00"
                  className="w-full bg-green-50/30 border-green-100 rounded-xl py-3 px-4 text-lg font-bold text-green-700 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                  value={formData.advance}
                  onChange={(e) => handleChange('advance', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Due fare</label>
                <input 
                  type="number" placeholder="0.00"
                  className="w-full bg-red-50/30 border-red-100 rounded-xl py-3 px-4 text-lg font-bold text-red-700 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  value={formData.dueFare}
                  onChange={(e) => handleChange('dueFare', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Toll tax</label>
                <select 
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all cursor-pointer"
                  value={formData.tollTax}
                  onChange={(e) => handleChange('tollTax', e.target.value)}
                >
                  <option value="Included">Included</option>
                  <option value="Excluded">Excluded</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extra km</label>
                <input 
                  type="number" placeholder="Rate/KM"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  value={formData.extraKm}
                  onChange={(e) => handleChange('extraKm', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extra hour</label>
                <input 
                  type="number" placeholder="Rate/HR"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  value={formData.extraHour}
                  onChange={(e) => handleChange('extraHour', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Waiting charges</label>
                <input 
                  type="number" placeholder="Rate/HR"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  value={formData.waitingCharges}
                  onChange={(e) => handleChange('waitingCharges', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Night Allowance</label>
                <input 
                  type="number" placeholder="Amount"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                  value={formData.nightAllowance}
                  onChange={(e) => handleChange('nightAllowance', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* SECTION 6: DRIVER DETAILS (Admin Only) */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 lg:col-span-2 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500"><User size={22} /></div>
              Driver Details (Admin Only)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Driver Name</label>
                <input 
                  type="text" placeholder="Driver Name"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  value={formData.driverName}
                  onChange={(e) => handleChange('driverName', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Driver Number</label>
                <input 
                  type="text" placeholder="Driver Number"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  value={formData.driverNumber}
                  onChange={(e) => handleChange('driverNumber', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Car No</label>
                <input 
                  type="text" placeholder="Car No"
                  className="w-full bg-gray-50/50 border-gray-200 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-slate-100 outline-none transition-all"
                  value={formData.carNo}
                  onChange={(e) => handleChange('carNo', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-8 flex justify-end gap-4 shadow-2xl z-40">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="px-8 py-3 text-sm font-bold text-gray-600 hover:text-gray-900 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-12 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating...' : <><Save size={20} /> Place Booking</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBooking;


