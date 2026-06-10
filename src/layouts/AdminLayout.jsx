import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search, User, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-72">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search bookings, drivers..." 
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100"></div>
            
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 cursor-pointer group focus:outline-none"
              >
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">Admin User</p>
                  <p className="text-xs text-gray-500 font-medium">Super Admin</p>
                </div>
                <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center border border-primary-100 group-hover:border-primary-200 transition-colors">
                  <User className="text-primary-600" size={20} />
                </div>
              </button>

              {showProfileMenu && (
                <>
                  {/* Overlay to close menu on click outside */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setShowProfileMenu(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        localStorage.removeItem('token');
                        localStorage.removeItem('user_name');
                        localStorage.removeItem('user_phone');
                        navigate('/login', { replace: true });
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-2.5 transition-colors font-semibold"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
