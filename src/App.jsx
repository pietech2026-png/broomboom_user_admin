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

// Placeholder components for other routes
const PetBookings = () => <div className="p-4 bg-white rounded-2xl border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400 font-medium">Pet Cab Bookings Module Coming Soon</div>;
const Coupons = () => <div className="p-4 bg-white rounded-2xl border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400 font-medium">Coupon Management Module Coming Soon</div>;
const Drivers = () => <div className="p-4 bg-white rounded-2xl border border-gray-100 min-h-[400px] flex items-center justify-center text-gray-400 font-medium">Driver Management Module Coming Soon</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="users" element={<Users />} />
          <Route path="car-categories" element={<CarCategories />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="cities" element={<Cities />} />
          <Route path="create-booking" element={<CreateBooking />} />
          <Route path="pet-bookings" element={<PetBookings />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="drivers" element={<Drivers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
