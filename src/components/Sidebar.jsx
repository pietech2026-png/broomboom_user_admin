import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Ticket, 
  Users, 
  Settings,
  LogOut,
  Dog,
  Globe,
  Search
} from 'lucide-react';
import logo from '../assets/logo.jpeg';

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Car, label: 'New Bookings', path: '/bookings' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Search, label: 'Search Leads', path: '/search-leads' },
    { icon: Car, label: 'Car Categories', path: '/car-categories' },
    { icon: MapPin, label: 'Pricing Management', path: '/pricing' },
    { icon: Globe, label: 'City Management', path: '/cities' },
    { icon: Dog, label: 'Pet Cab Bookings', path: '/pet-bookings' },
    { icon: Ticket, label: 'Coupon Management', path: '/coupons' },
    { icon: Users, label: 'Driver Management', path: '/drivers' },
  ];

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0">
      <div className="p-8 flex items-center gap-3">
        <img src={logo} className="w-10 h-10 object-cover rounded-xl shadow-md border border-gray-100" alt="Broom Boom Logo" />
        <span className="text-2xl font-bold tracking-tight text-gray-900">
          Broom Boom<span className="text-primary-600">Admin</span>
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button className="sidebar-link sidebar-link-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
