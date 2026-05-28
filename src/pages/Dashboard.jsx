import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Car, 
  TrendingUp, 
  Clock,
  Loader2
} from 'lucide-react';
import API_BASE_URL from '../config';

const StatCard = ({ icon: Icon, label, value, trend, color, link }) => {
  const CardContent = (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
    </div>
  );

  return link ? <Link to={link}>{CardContent}</Link> : CardContent;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, usersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/bookings`),
          fetch(`${API_BASE_URL}/users`)
        ]);

        if (!bookingsRes.ok || !usersRes.ok) throw new Error('Failed to fetch dashboard data');

        const bookingsData = await bookingsRes.ok ? await bookingsRes.json() : [];
        const usersData = await usersRes.ok ? await usersRes.json() : [];

        setBookings(bookingsData);
        setUserCount(usersData.length);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.totalFare || 0), 0);

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;

  const stats = [
    { icon: Car, label: 'Total Bookings', value: bookings.length.toLocaleString(), color: 'bg-primary-500', link: '/bookings' },
    { icon: Users, label: 'Total Users', value: userCount.toLocaleString(), color: 'bg-orange-500', link: '/users' },
    { icon: TrendingUp, label: 'Revenue (Completed)', value: `₹ ${totalRevenue.toLocaleString()}`, color: 'bg-green-500' },
    { icon: Clock, label: 'Pending Requests', value: pendingCount.toLocaleString(), color: 'bg-yellow-500', link: '/bookings' },
  ];

  const recentBookings = bookings.slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-50 text-blue-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Completed': return 'bg-green-50 text-green-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
      <p className="text-red-600 font-bold">Error loading dashboard: {error}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Monitor Broom Boom Cabs' performance and operations.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Download Report
          </button>
          <button 
            onClick={() => navigate('/create-booking')}
            className="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all"
          >
            + New Booking
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent New Bookings</h2>
          <Link to="/bookings" className="text-sm font-bold text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Fare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <tr 
                    key={booking._id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/bookings')}
                  >
                    <td className="px-6 py-4 text-sm font-bold text-primary-600">{booking.bookingId}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{booking.customerName}</p>
                      <p className="text-xs text-gray-500">{booking.pickupDate}, {booking.pickupTime}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 truncate max-w-[200px]">
                      {booking.pickupAddress} → {booking.dropAddress}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">₹ {booking.totalFare}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No recent bookings found.
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

export default Dashboard;
