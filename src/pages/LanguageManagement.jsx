import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader, Globe, CheckCircle, XCircle } from 'lucide-react';
import apiService from '../services/api';
import { toast } from 'react-hot-toast';

export default function LanguageManagement() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    native_name: '',
    sort_order: 0
  });

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLanguages();
      if (response.success) {
        setLanguages(response.data);
      } else {
        toast.error('Failed to fetch languages');
      }
    } catch (error) {
      toast.error('Error fetching languages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.addLanguage(formData);
      if (response.success) {
        toast.success('Language added successfully');
        setShowAddModal(false);
        setFormData({ code: '', name: '', native_name: '', sort_order: 0 });
        fetchLanguages();
      } else {
        toast.error(response.msg || 'Failed to add language');
      }
    } catch (error) {
      toast.error('Error adding language');
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await apiService.toggleLanguageStatus(id);
      if (response.success) {
        toast.success('Status updated');
        fetchLanguages();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Language Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Manage app languages and translations</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Language
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Native Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {languages.map((lang) => (
                  <tr key={lang.language_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Globe size={20} className="text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lang.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lang.native_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lang.sort_order}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lang.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {lang.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleStatus(lang.language_id)}
                        className={`text-${lang.is_active ? 'red' : 'green'}-600 hover:text-${lang.is_active ? 'red' : 'green'}-900`}
                      >
                        {lang.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Language</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Language Code (e.g., en, hi)</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name (English)</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Native Name</label>
                  <input
                    type="text"
                    name="native_name"
                    value={formData.native_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Language
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
