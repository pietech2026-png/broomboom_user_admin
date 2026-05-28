import React, { useState, useEffect } from 'react';
import { Car, Edit2, Plus, Users as UsersIcon, Loader2, X, Save } from 'lucide-react';
import API_BASE_URL from '../config';

const CarCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    seater: '',
    baseFare: '',
    perKmRate: '',
    status: 'Active'
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/car-categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setIsEditing(true);
      setSelectedId(cat._id);
      setFormData({
        name: cat.name,
        displayName: cat.displayName,
        seater: cat.seater,
        baseFare: cat.baseFare,
        perKmRate: cat.perKmRate,
        status: cat.status
      });
    } else {
      setIsEditing(false);
      setSelectedId(null);
      setFormData({
        name: '',
        displayName: '',
        seater: '',
        baseFare: '',
        perKmRate: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const url = isEditing 
        ? `${API_BASE_URL}/car-categories/${selectedId}`
        : `${API_BASE_URL}/car-categories`;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      await fetchCategories();
      handleCloseModal();
      alert(`Category ${isEditing ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
      <p className="text-red-600 font-bold">Error loading categories: {error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Car Categories</h1>
          <p className="text-sm text-gray-500 font-medium">Manage car types and their seat capacity.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <Car size={24} />
                </div>
                <button 
                  onClick={() => handleOpenModal(cat)}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.displayName}</h3>
              <p className="text-sm text-gray-500 mb-4">{cat.name}</p>
              
              <div className="flex items-center gap-4 py-3 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacity</span>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                    <UsersIcon size={14} className="text-primary-500" />
                    {cat.seater} Seater
                  </div>
                </div>
                <div className="w-[1px] h-8 bg-gray-100"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Base Rate</span>
                  <span className="text-sm font-bold text-gray-900">₹{cat.baseFare}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  cat.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                }`}>
                  {cat.status}
                </span>
                <span className="text-xs font-bold text-primary-600">₹{cat.perKmRate}/km</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
            No car categories found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-600 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Internal Name (Slug)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. sedan, suv_prime"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="e.g. Sedan, SUV Prime"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Seater Capacity</label>
                  <input
                    type="number"
                    name="seater"
                    value={formData.seater}
                    onChange={handleChange}
                    placeholder="4"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Base Fare (₹)</label>
                  <input
                    type="number"
                    name="baseFare"
                    value={formData.baseFare}
                    onChange={handleChange}
                    placeholder="500"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Rate per KM (₹)</label>
                  <input
                    type="number"
                    name="perKmRate"
                    value={formData.perKmRate}
                    onChange={handleChange}
                    placeholder="12"
                    className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
                >
                  {submitLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {isEditing ? 'Save Changes' : 'Add Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarCategories;
