import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Clock,
  Car,
  Loader2,
  X,
  Eye,
  History,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
  Phone,
  Mail,
  User,
  Navigation,
  CreditCard,
  Zap,
  UserCheck,
  Pencil,
  Save as SaveIcon
} from 'lucide-react';
import API_BASE_URL from '../config';

const Bookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('current');
  const [entriesCount, setEntriesCount] = useState(10);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update status');
      
      setBookings(bookings.map(b => b._id === id ? { ...b, status } : b));
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
      alert(`Booking ${status}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditData(null);
    } else {
      setIsEditing(true);
      setEditData({ ...selectedBooking });
    }
  };

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const saveBookingChanges = async () => {
    setUpdateLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${selectedBooking._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (!response.ok) throw new Error('Failed to update booking');
      const updatedBooking = await response.json();
      
      setBookings(bookings.map(b => b._id === updatedBooking._id ? updatedBooking : b));
      setSelectedBooking(updatedBooking);
      setIsEditing(false);
      setEditData(null);
      alert('Booking updated successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdateLoading(false);
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const filteredBookings = bookings
    .filter(booking => {
      if (activeTab === 'current') {
        return booking.status !== 'Cancelled' && booking.status !== 'Completed';
      } else {
        return booking.status === 'Cancelled' || booking.status === 'Completed';
      }
    })
    .filter(booking => 
      booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.dropAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (error) return (
    <div className="bg-red-50 p-8 rounded-3xl border border-red-100 text-center max-w-2xl mx-auto mt-20">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <XCircle size={32} />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load bookings</h2>
      <p className="text-red-600 mb-6">{error}</p>
      <button 
        onClick={() => fetchBookings()}
        className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage New Bookings</h1>
          <p className="text-gray-500 font-medium">Track and manage driver allocations and trip statuses.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
          <button 
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'current' ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('current')}
          >
            📋 Current Bookings
          </button>
          <button 
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'history' ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('history')}
          >
            📜 Completed History
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
            <span>Show</span>
            <select 
              value={entriesCount}
              onChange={(e) => setEntriesCount(Number(e.target.value))}
              className="bg-gray-50 border-gray-100 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="h-8 w-px bg-gray-100 hidden md:block" />
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-xl transition-all">
            <Download size={18} /> Export CSV
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, Customer or City..." 
              className="w-full bg-gray-50 border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => navigate('/create-booking')}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all whitespace-nowrap"
          >
            <Plus size={20} /> Create Booking
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">OrderID</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Locations (Pickup &rarr; Drop)</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Service Info</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500 font-bold">Fetching latest bookings...</p>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.slice(0, entriesCount).map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <span className="text-sm font-extrabold text-primary-600">{booking.bookingId || 'N/A'}</span>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{booking.customerName}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{booking.customerMobile}</span>
                        </div>
                        {booking.allocateOurPilot && (
                          <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-black uppercase tracking-wider">Our Pilot</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 max-w-[180px]">
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                            <span className="text-xs font-bold text-gray-700 line-clamp-1">{booking.pickupAddress}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                            <span className="text-xs font-bold text-gray-700 line-clamp-1">{booking.dropAddress}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{booking.serviceType}</span>
                        <span className="text-[11px] font-bold text-primary-400">{booking.rentalPackage || 'Standard'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                          <Car size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">{booking.vehicleCategory}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{booking.seater} Seater</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-sm">
                      <div className="flex flex-col font-bold">
                        <span className="text-gray-900">{booking.pickupDate}</span>
                        <span className="text-gray-400 text-xs">{booking.pickupTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="p-2.5 bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          className="p-2.5 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                          title="Trip History"
                        >
                          <History size={18} />
                        </button>
                        {booking.status === 'Pending' && (
                          <button 
                            onClick={() => updateBookingStatus(booking._id, 'Confirmed')}
                            className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-all"
                            title="Accept Booking"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {booking.status !== 'Cancelled' && booking.status !== 'Completed' && (
                          <button 
                            onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                            className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                            title="Cancel Booking"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Search size={32} />
                    </div>
                    <p className="text-gray-500 font-bold">No bookings found matching your request.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Showing <span className="text-gray-900">{Math.min(filteredBookings.length, entriesCount)}</span> of <span className="text-gray-900">{filteredBookings.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30" disabled>
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 text-sm font-black bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-100">1</button>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-900 disabled:opacity-30" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gray-50 w-full max-w-5xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="p-8 bg-white border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                  <Eye size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Booking Details</h2>
                  <p className="text-gray-500 font-bold uppercase text-[11px] tracking-[0.2em] flex items-center gap-2">
                    Order ID: <span className="text-primary-600">{selectedBooking.bookingId || 'N/A'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    Service: <span className="text-orange-600">{selectedBooking.serviceType}</span>
                    {selectedBooking.rentalPackage && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        Package: <span className="text-purple-600">{selectedBooking.rentalPackage}</span>
                      </>
                    )}
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    Status: <span className={selectedBooking.status === 'Cancelled' ? 'text-red-500' : 'text-green-500'}>{selectedBooking.status}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <button 
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 rounded-xl font-bold transition-all shadow-sm"
                  >
                    <Pencil size={18} /> Edit Trip
                  </button>
                ) : (
                  <button 
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-500 hover:bg-gray-200 rounded-xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  onClick={() => {
                    setSelectedBooking(null);
                    setIsEditing(false);
                    setEditData(null);
                  }}
                  className="w-12 h-12 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-full flex items-center justify-center transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Customer & Vehicle */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={16} /> Customer Info
                    </h3>
                    <div className="space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <input 
                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                            value={editData.customerName}
                            onChange={(e) => handleEditChange('customerName', e.target.value)}
                            placeholder="Customer Name"
                          />
                          <input 
                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                            value={editData.customerMobile}
                            onChange={(e) => handleEditChange('customerMobile', e.target.value)}
                            placeholder="Mobile Number"
                          />
                          <input 
                            className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                            value={editData.customerEmail}
                            onChange={(e) => handleEditChange('customerEmail', e.target.value)}
                            placeholder="Email Address"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-lg font-black text-gray-900">{selectedBooking.customerName}</span>
                          <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <Phone size={14} className="text-primary-500" />
                            <span className="text-sm font-bold">{selectedBooking.customerMobile}</span>
                          </div>
                          {selectedBooking.customerEmail && (
                            <div className="flex items-center gap-2 text-gray-500 mt-1">
                              <Mail size={14} className="text-primary-500" />
                              <span className="text-sm font-bold">{selectedBooking.customerEmail}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-4">
                        <div className="flex flex-col flex-1 min-w-[100px]">
                          <span className="text-[10px] font-black text-gray-400 uppercase">State</span>
                          {isEditing ? (
                            <input 
                              className="bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-xs font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                              value={editData.state}
                              onChange={(e) => handleEditChange('state', e.target.value)}
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-700">{selectedBooking.state}</span>
                          )}
                        </div>
                        <div className="flex flex-col flex-1 min-w-[100px]">
                          <span className="text-[10px] font-black text-gray-400 uppercase">Pincode</span>
                          {isEditing ? (
                            <input 
                              className="bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-xs font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                              value={editData.pincode}
                              onChange={(e) => handleEditChange('pincode', e.target.value)}
                            />
                          ) : (
                            <span className="text-xs font-bold text-gray-700">{selectedBooking.pincode}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Car size={16} /> Vehicle Choice
                    </h3>
                    {isEditing ? (
                      <div className="grid grid-cols-1 gap-3">
                        <select 
                          className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                          value={editData.vehicleCategory}
                          onChange={(e) => handleEditChange('vehicleCategory', e.target.value)}
                        >
                          <option value="Mini">Mini</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="SUV+">SUV+</option>
                          <option value="Traveller">Traveller</option>
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="number"
                            className="bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                            value={editData.seater}
                            onChange={(e) => handleEditChange('seater', parseInt(e.target.value))}
                          />
                          <select 
                            className="bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-sm font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                            value={editData.acType}
                            onChange={(e) => handleEditChange('acType', e.target.value)}
                          >
                            <option value="AC">AC</option>
                            <option value="Non AC">Non AC</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                          <Car size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-gray-900">{selectedBooking.vehicleCategory}</p>
                          <p className="text-sm font-bold text-gray-500">{selectedBooking.seater} Seater • {selectedBooking.acType || 'AC'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 2: Route & Schedule */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50/30 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Navigation size={16} /> Trip Route
                      </h3>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                            <input 
                              type="text"
                              className="bg-transparent text-[10px] font-black text-orange-600 w-12 text-right outline-none"
                              value={editData.distance}
                              onChange={(e) => handleEditChange('distance', e.target.value)}
                            />
                            <span className="text-[10px] font-black text-orange-600">KM</span>
                          </div>
                        ) : selectedBooking.distance && (
                          <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black">{selectedBooking.distance} KM</span>
                        )}
                      </div>
                    </div>
                    <div className="space-y-6 relative">
                      <div className="absolute left-[7px] top-[24px] bottom-[24px] w-0.5 bg-dashed border-l-2 border-dashed border-gray-100" />
                      <div className="flex gap-4 relative">
                        <div className="w-4 h-4 rounded-full bg-green-500 ring-4 ring-green-50 shrink-0 z-10" />
                        <div className="space-y-1 flex-1">
                          <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Pickup Location</p>
                          {isEditing ? (
                            <textarea 
                              className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                              value={editData.pickupAddress}
                              onChange={(e) => handleEditChange('pickupAddress', e.target.value)}
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm font-bold text-gray-800 leading-tight">{selectedBooking.pickupAddress}</p>
                          )}
                          
                          {isEditing ? (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <input 
                                className="bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-[9px] font-medium outline-none"
                                placeholder="Lat"
                                value={editData.pickupLat}
                                onChange={(e) => handleEditChange('pickupLat', e.target.value)}
                              />
                              <input 
                                className="bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-[9px] font-medium outline-none"
                                placeholder="Lng"
                                value={editData.pickupLng}
                                onChange={(e) => handleEditChange('pickupLng', e.target.value)}
                              />
                            </div>
                          ) : (selectedBooking.pickupLat || selectedBooking.pickupLng) && (
                            <p className="text-[9px] font-medium text-gray-400">GPS: {selectedBooking.pickupLat}, {selectedBooking.pickupLng}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-4 relative">
                        <div className="w-4 h-4 rounded-full bg-red-500 ring-4 ring-red-50 shrink-0 z-10" />
                        <div className="space-y-1 flex-1">
                          <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter">Drop Location</p>
                          {isEditing ? (
                            <textarea 
                              className="w-full bg-gray-50 border-gray-200 rounded-xl py-2 px-3 text-xs font-bold focus:ring-2 focus:ring-primary-100 outline-none"
                              value={editData.dropAddress}
                              onChange={(e) => handleEditChange('dropAddress', e.target.value)}
                              rows={2}
                            />
                          ) : (
                            <p className="text-sm font-bold text-gray-800 leading-tight">{selectedBooking.dropAddress}</p>
                          )}

                          {isEditing ? (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <input 
                                className="bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-[9px] font-medium outline-none"
                                placeholder="Lat"
                                value={editData.dropLat}
                                onChange={(e) => handleEditChange('dropLat', e.target.value)}
                              />
                              <input 
                                className="bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-[9px] font-medium outline-none"
                                placeholder="Lng"
                                value={editData.dropLng}
                                onChange={(e) => handleEditChange('dropLng', e.target.value)}
                              />
                            </div>
                          ) : (selectedBooking.dropLat || selectedBooking.dropLng) && (
                            <p className="text-[9px] font-medium text-gray-400">GPS: {selectedBooking.dropLat}, {selectedBooking.dropLng}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={16} /> Schedule
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Pickup Date</p>
                        {isEditing ? (
                          <input 
                            type="date"
                            className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                            value={editData.pickupDate}
                            onChange={(e) => handleEditChange('pickupDate', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm font-bold text-gray-900">{selectedBooking.pickupDate}</p>
                        )}
                      </div>
                      <div className="p-3 bg-gray-50 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase">Pickup Time</p>
                        {isEditing ? (
                          <input 
                            type="time"
                            className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                            value={editData.pickupTime}
                            onChange={(e) => handleEditChange('pickupTime', e.target.value)}
                          />
                        ) : (
                          <p className="text-sm font-bold text-gray-900">{selectedBooking.pickupTime}</p>
                        )}
                      </div>
                      {(isEditing ? editData.serviceType === 'Outstation Roundtrip' : selectedBooking.serviceType === 'Outstation Roundtrip') && (
                        <>
                          <div className="p-3 bg-blue-50/50 rounded-2xl">
                            <p className="text-[10px] font-black text-blue-400 uppercase">Return Date</p>
                            {isEditing ? (
                              <input 
                                type="date"
                                className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                                value={editData.returnDate}
                                onChange={(e) => handleEditChange('returnDate', e.target.value)}
                              />
                            ) : (
                              <p className="text-sm font-bold text-gray-900">{selectedBooking.returnDate}</p>
                            )}
                          </div>
                          <div className="p-3 bg-blue-50/50 rounded-2xl">
                            <p className="text-[10px] font-black text-blue-400 uppercase">Return Time</p>
                            {isEditing ? (
                              <input 
                                type="time"
                                className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                                value={editData.returnTime}
                                onChange={(e) => handleEditChange('returnTime', e.target.value)}
                              />
                            ) : (
                              <p className="text-sm font-bold text-gray-900">{selectedBooking.returnTime}</p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Column 3: Fare & Advanced */}
                <div className="space-y-6">
                  <div className="bg-primary-600 p-8 rounded-[32px] text-white shadow-xl shadow-primary-100 space-y-6 relative overflow-hidden">
                    <Zap className="absolute top-4 right-4 text-white/10" size={80} />
                    <h3 className="text-xs font-black text-white/60 uppercase tracking-[0.2em]">Trip Fare</h3>
                    <div className="space-y-4">
                      <div className="flex items-end gap-1">
                        <span className="text-xl font-bold text-white/60 mb-2">₹</span>
                        {isEditing ? (
                          <input 
                            type="number"
                            className="bg-white/10 border-white/20 rounded-xl px-2 py-1 text-3xl font-black text-white w-32 outline-none"
                            value={editData.fare}
                            onChange={(e) => handleEditChange('fare', e.target.value)}
                          />
                        ) : (
                          <span className="text-5xl font-black">{selectedBooking.fare}</span>
                        )}
                      </div>
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-white/60">Advance Paid</span>
                          {isEditing ? (
                            <input 
                              type="number"
                              className="bg-white/10 border-white/20 rounded-lg px-2 py-0.5 text-right w-20 outline-none"
                              value={editData.advance}
                              onChange={(e) => handleEditChange('advance', e.target.value)}
                            />
                          ) : (
                            <span>₹ {selectedBooking.advance || 0}</span>
                          )}
                        </div>
                        <div className="flex justify-between text-sm font-black text-primary-200 bg-white/10 p-2 rounded-xl">
                          <span>Due Amount</span>
                          {isEditing ? (
                            <input 
                              type="number"
                              className="bg-transparent border-none text-right w-20 outline-none font-black text-white"
                              value={editData.dueFare}
                              onChange={(e) => handleEditChange('dueFare', e.target.value)}
                            />
                          ) : (
                            <span>₹ {selectedBooking.dueFare || 0}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <UserCheck size={16} /> Internal Options
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                      <span className="text-sm font-bold text-gray-700">Allocate Our Pilot</span>
                      {isEditing ? (
                        <input 
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          checked={editData.allocateOurPilot}
                          onChange={(e) => handleEditChange('allocateOurPilot', e.target.checked)}
                        />
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedBooking.allocateOurPilot ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                          {selectedBooking.allocateOurPilot ? 'Enabled' : 'Disabled'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extras Grid */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Additional Charges & Terms</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Extra KM Rate</p>
                    {isEditing ? (
                      <input 
                        type="number"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.extraKm}
                        onChange={(e) => handleEditChange('extraKm', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">₹ {selectedBooking.extraKm || '0'}/km</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Extra Hour Rate</p>
                    {isEditing ? (
                      <input 
                        type="number"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.extraHour}
                        onChange={(e) => handleEditChange('extraHour', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">₹ {selectedBooking.extraHour || '0'}/hr</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Waiting Charges</p>
                    {isEditing ? (
                      <input 
                        type="number"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.waitingCharges}
                        onChange={(e) => handleEditChange('waitingCharges', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">₹ {selectedBooking.waitingCharges || '0'}/hr</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Night Allowance</p>
                    {isEditing ? (
                      <input 
                        type="number"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.nightAllowance}
                        onChange={(e) => handleEditChange('nightAllowance', e.target.value)}
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">₹ {selectedBooking.nightAllowance || '0'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Toll Tax</p>
                    {isEditing ? (
                      <select 
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.tollTax}
                        onChange={(e) => handleEditChange('tollTax', e.target.value)}
                      >
                        <option value="Included">Included</option>
                        <option value="Excluded">Excluded</option>
                      </select>
                    ) : (
                      <p className="text-sm font-bold text-gray-900">{selectedBooking.tollTax || 'Excluded'}</p>
                    )}
                  </div>
                </div>
              </div>
              {/* Driver Details Grid */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm mt-8">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <User size={16} /> Driver Details (Admin Only)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Driver Name</p>
                    {isEditing ? (
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.driverName || ''}
                        onChange={(e) => handleEditChange('driverName', e.target.value)}
                        placeholder="Enter driver name"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">{selectedBooking.driverName || 'Not Assigned'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Driver Number</p>
                    {isEditing ? (
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.driverNumber || ''}
                        onChange={(e) => handleEditChange('driverNumber', e.target.value)}
                        placeholder="Enter driver number"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">{selectedBooking.driverNumber || 'Not Assigned'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase">Car No</p>
                    {isEditing ? (
                      <input 
                        type="text"
                        className="w-full bg-gray-50 border-gray-200 rounded-lg py-1 px-2 text-sm font-bold outline-none"
                        value={editData.carNo || ''}
                        onChange={(e) => handleEditChange('carNo', e.target.value)}
                        placeholder="Enter car number"
                      />
                    ) : (
                      <p className="text-sm font-bold text-gray-900">{selectedBooking.carNo || 'Not Assigned'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-white border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-600 animate-pulse" />
                <span className="text-xs font-bold text-gray-500">Last updated: {new Date(selectedBooking.updatedAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <button 
                    onClick={saveBookingChanges}
                    disabled={updateLoading}
                    className="px-12 py-3 bg-primary-600 text-white rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-100 flex items-center gap-2 disabled:opacity-50"
                  >
                    {updateLoading ? <Loader2 className="animate-spin" size={20} /> : <SaveIcon size={20} />}
                    Save Changes
                  </button>
                ) : (
                  <>
                    {selectedBooking.status === 'Pending' && (
                      <button 
                        onClick={() => updateBookingStatus(selectedBooking._id, 'Confirmed')}
                        className="px-8 py-3 bg-green-600 text-white rounded-2xl font-black hover:bg-green-700 transition-all shadow-xl shadow-green-100 flex items-center gap-2"
                      >
                        <CheckCircle2 size={20} /> Accept Trip
                      </button>
                    )}
                    {selectedBooking.status !== 'Cancelled' && selectedBooking.status !== 'Completed' && (
                      <button 
                        onClick={() => updateBookingStatus(selectedBooking._id, 'Cancelled')}
                        className="px-8 py-3 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all flex items-center gap-2"
                      >
                        <XCircle size={20} /> Cancel Booking
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;


