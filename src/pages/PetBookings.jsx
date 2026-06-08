import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, MapPin, User, Phone, Loader2, ArrowRight, Dog, DollarSign, Activity } from 'lucide-react';
import API_BASE_URL from '../config';

const PetBookings = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bookings') {
        const response = await fetch(`${API_BASE_URL}/bookings?isPetCab=true`);
        if (!response.ok) throw new Error('Failed to fetch pet bookings');
        const data = await response.json();
        setBookings(data);
      } else {
        const response = await fetch(`${API_BASE_URL}/search-leads?isPetCab=true`);
        if (!response.ok) throw new Error('Failed to fetch pet search leads');
        const data = await response.json();
        setLeads(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.customerMobile.includes(searchTerm) ||
    b.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.dropAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.bookingId && b.bookingId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    l.customerMobile.includes(searchTerm) ||
    l.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.dropLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.userName && l.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Dog className="text-orange-500" size={32} /> Pet Cab Module
          </h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage all pet-friendly booking requests, pricing, and customer inquiries.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => { setActiveTab('bookings'); setSearchTerm(''); setError(null); }}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'bookings' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity size={16} /> Confirmed Pet Bookings
        </button>
        <button
          onClick={() => { setActiveTab('leads'); setSearchTerm(''); setError(null); }}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'leads' 
              ? 'border-primary-600 text-primary-600' 
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Search size={16} /> Pet Cab Search Leads
        </button>
      </div>

      {/* Search and Refresh */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone, route..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-100 transition-all outline-none"
          />
        </div>
        <button 
          onClick={fetchData}
          className="px-5 py-2.5 text-sm font-bold text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Confirmed Pet Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Route Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Schedule Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fares (₹)</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-primary-600">{booking.bookingId || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-bold text-gray-900">{booking.customerName}</span>
                          <span className="text-xs font-medium text-gray-500">{booking.customerMobile}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-medium text-gray-800">
                          <MapPin size={14} className="text-orange-500" />
                          <span className="text-sm">{booking.pickupAddress}</span>
                          <ArrowRight size={14} className="text-gray-400" />
                          <span className="text-sm">{booking.dropAddress}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                            <Calendar size={14} className="text-primary-600" />
                            <span>{booking.pickupDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={14} className="text-gray-400" />
                            <span>{booking.pickupTime}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col font-medium">
                          <span className="text-sm font-bold text-gray-900">Total: ₹{booking.fare}</span>
                          <span className="text-xs text-green-600 font-bold">Paid: ₹{booking.advance}</span>
                          <span className="text-xs text-gray-500 font-bold">Due: ₹{booking.dueFare}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                          booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                          booking.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">No confirmed pet bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pet Cab Search Leads Tab */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Route Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Journey Schedule</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pet Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Search Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-900">{lead.userName || 'Guest User'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-xs font-medium text-gray-500">{lead.customerMobile}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 font-medium text-gray-800">
                          <MapPin size={14} className="text-orange-500" />
                          <span className="text-sm">{lead.pickupLocation}</span>
                          <ArrowRight size={14} className="text-gray-400" />
                          <span className="text-sm">{lead.dropLocation}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                            <Calendar size={14} className="text-primary-600" />
                            <span>{lead.journeyDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock size={14} className="text-gray-400" />
                            <span>{lead.journeyTime}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-orange-50 text-orange-700 font-bold rounded-lg text-xs uppercase">
                          {lead.petType || 'Dog'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {formatDate(lead.searchDateTime || lead.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-medium">No pet cab search leads found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetBookings;
