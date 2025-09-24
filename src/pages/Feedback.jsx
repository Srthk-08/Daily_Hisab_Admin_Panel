import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Reply,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  MessageSquare
} from 'lucide-react';
import apiService from '../services/api';

const Feedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [stats, setStats] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    feedback_type: 'all',
    search: '',
    page: 1,
    limit: 10
  });

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: filters.page,
        limit: filters.limit
      };

      if (filters.feedback_type !== 'all') {
        params.feedback_type = filters.feedback_type;
      }

      const response = await apiService.getAllFeedback(params);
      console.log('Feedback API Response:', response);

      if (response && response.success) {
        let filteredFeedback = response.data.feedback || [];

        // Client-side search filter
        if (filters.search) {
          filteredFeedback = filteredFeedback.filter(item =>
            item.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.message.toLowerCase().includes(filters.search.toLowerCase()) ||
            item.user_name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        setFeedback(filteredFeedback);
      } else {
        setError('Failed to fetch feedback');
        setFeedback([]);
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err.message || 'Failed to fetch feedback');
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch feedback statistics
  const fetchStats = useCallback(async () => {
    try {
      const response = await apiService.getFeedbackStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching feedback stats:', err);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFeedback();
    fetchStats();
  }, [fetchFeedback, fetchStats]);

  // Handle response submission
  const handleSubmitResponse = async () => {
    if (!selectedFeedback || !responseText.trim()) return;

    try {
      setLoading(true);
      await apiService.updateFeedbackResponse(selectedFeedback.feedback_id, responseText);
      setSuccess('Response submitted successfully');
      setShowResponseModal(false);
      setResponseText('');
      setSelectedFeedback(null);
      fetchFeedback(); // Refresh the list
    } catch (err) {
      console.error('Error submitting response:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Error submitting response');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete feedback
  const handleDeleteFeedback = async (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        setLoading(true);
        await apiService.deleteFeedback(feedbackId);
        setSuccess('Feedback deleted successfully');
        fetchFeedback(); // Refresh the list
      } catch (err) {
        console.error('Error deleting feedback:', err);
        setError(err.response?.data?.msg?.[0] || err.message || 'Error deleting feedback');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle view feedback
  const handleViewFeedback = (item) => {
    setSelectedFeedback(item);
    setResponseText(item.admin_response || '');
  };

  // Get feedback type color
  const getFeedbackTypeColor = (type) => {
    const colors = {
      bug_report: 'bg-red-100 text-red-800',
      feature_request: 'bg-blue-100 text-blue-800',
      general_feedback: 'bg-green-100 text-green-800',
      complaint: 'bg-orange-100 text-orange-800',
      suggestion: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Get feedback type label
  const getFeedbackTypeLabel = (type) => {
    const labels = {
      bug_report: 'Bug Report',
      feature_request: 'Feature Request',
      general_feedback: 'General Feedback',
      complaint: 'Complaint',
      suggestion: 'Suggestion'
    };
    return labels[type] || type;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-gray-600 mt-1">Manage user feedback, bug reports, and feature requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total_feedback}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responded_feedback}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending_response}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bug Reports</p>
                <p className="text-2xl font-bold text-gray-900">{stats.type_breakdown?.bug_reports || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{success}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
            <select
              value={filters.feedback_type}
              onChange={(e) => setFilters(prev => ({ ...prev, feedback_type: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="bug_report">Bug Report</option>
              <option value="feature_request">Feature Request</option>
              <option value="general_feedback">General Feedback</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading && feedback.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading feedback...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(feedback) && feedback.map((item) => (
                  <tr key={item.feedback_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{item.feedback_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.user_name}</div>
                          <div className="text-sm text-gray-500">{item.user_mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeedbackTypeColor(item.feedback_type)}`}>
                        {getFeedbackTypeLabel(item.feedback_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={item.subject}>
                        {item.subject}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={item.message}>
                        {item.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${item.admin_response
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                        }`}>
                        {item.admin_response ? 'Responded' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.submitted_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewFeedback(item)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFeedback(item);
                            setShowResponseModal(true);
                          }}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Respond"
                        >
                          <Reply size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFeedback(item.feedback_id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {feedback.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
              <MessageCircle size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Respond to Feedback</h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedFeedback(null);
                    setResponseText('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {selectedFeedback && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Original Feedback</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Subject:</strong> {selectedFeedback.subject}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Type:</strong> {getFeedbackTypeLabel(selectedFeedback.feedback_type)}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Message:</strong> {selectedFeedback.message}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Response
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your response to the user..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowResponseModal(false);
                        setSelectedFeedback(null);
                        setResponseText('');
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitResponse}
                      disabled={loading || !responseText.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Reply size={16} />
                          Submit Response
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
