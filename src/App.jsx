import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Users from './pages/Users';
import CarCategories from './pages/CarCategories';
import Pricing from './pages/Pricing';
import CreateBooking from './pages/CreateBooking';
import Cities from './pages/Cities';
import SearchLeads from './pages/SearchLeads';
import PetBookings from './pages/PetBookings';
import AddOns from './pages/AddOns';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const Coupons = () => <div className="p-4 bg-white rounded-2xl border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400 font-medium">Coupon Management Module Coming Soon</div>;
const Drivers = () => <div className="p-4 bg-white rounded-2xl border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400 font-medium">Driver Management Module Coming Soon</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="users" element={<Users />} />
            <Route path="car-categories" element={<CarCategories />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="cities" element={<Cities />} />
            <Route path="create-booking" element={<CreateBooking />} />
            <Route path="search-leads" element={<SearchLeads />} />
            <Route path="pet-bookings" element={<PetBookings />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="addons" element={<AddOns />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
