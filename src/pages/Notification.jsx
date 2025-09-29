import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Clock,
  Send,
  TrendingUp,
  Settings2,
  Users,
  Target,
  Calendar,
  BarChart3,
  RefreshCw,
  Play,
  Pause,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  Image,
  Link,
  MessageSquare,
  Zap,
  Star,
  Gift,
  Heart,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import apiService from "../services/api";

const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#fbbf24", "#a78bfa"];

export default function Notification() {
  // State management
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [performanceStats, setPerformanceStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  // Campaign form data
  const [campaignData, setCampaignData] = useState({
    title: "",
    message: "",
    notification_type: "message",
    target_audience: "all_users",
    template_id: "",
    image_url: "",
    deep_link: "",
    scheduled_time: "",
  });

  // Filters and pagination
  const [filters, setFilters] = useState({
    status: "all",
    notification_type: "all",
    target_audience: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_campaigns: 0,
    limit: 10,
  });

  // Notification types configuration
  const notificationTypes = {
    reminder: { label: "Reminder", icon: Clock, color: "text-blue-600 bg-blue-50" },
    promotion: { label: "Promotion", icon: Gift, color: "text-orange-600 bg-orange-50" },
    festival_greeting: { label: "Festival Greeting", icon: Heart, color: "text-pink-600 bg-pink-50" },
    message: { label: "Message", icon: MessageSquare, color: "text-gray-600 bg-gray-50" },
    template: { label: "Template", icon: Star, color: "text-purple-600 bg-purple-50" },
  };

  // Target audience configuration
  const targetAudiences = {
    all_users: { label: "All Users", icon: Users, color: "text-blue-600" },
    monthly_subscribers: { label: "Monthly Subscribers", icon: Calendar, color: "text-green-600" },
    yearly_subscribers: { label: "Yearly Subscribers", icon: Star, color: "text-yellow-600" },
    free_users: { label: "Free Users", icon: Users, color: "text-gray-600" },
    inactive_users: { label: "Inactive Users", icon: Pause, color: "text-red-600" },
  };

  // Status configuration
  const statusConfig = {
    draft: { label: "Draft", color: "text-gray-600 bg-gray-100" },
    scheduled: { label: "Scheduled", color: "text-yellow-600 bg-yellow-100" },
    sent: { label: "Sent", color: "text-green-600 bg-green-100" },
    cancelled: { label: "Cancelled", color: "text-red-600 bg-red-100" },
  };

  // Fetch campaigns
  const fetchCampaigns = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...filters,
        ...params,
      };

      // Remove 'all' values from query params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all' || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await apiService.getAllNotificationCampaigns(queryParams);
      console.log('Notification Campaigns API Response:', response);

      if (response && response.success) {
        setCampaigns(response.data.campaigns || []);
        setPagination(prev => response.data.pagination || prev);
      } else {
        setError('Failed to fetch notification campaigns');
        setCampaigns([]);
      }
    } catch (err) {
      console.error('Error fetching notification campaigns:', err);
      setError(err.message || 'Failed to fetch notification campaigns');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current_page, pagination.limit]);

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      const response = await apiService.getNotificationTemplates();
      if (response && response.success) {
        setTemplates(response.data.templates || []);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  }, []);

  // Fetch performance stats
  const fetchPerformanceStats = useCallback(async () => {
    try {
      const response = await apiService.getNotificationPerformanceStats({ days: 30 });
      if (response && response.success) {
        setPerformanceStats(response.data || {});
      }
    } catch (err) {
      console.error('Error fetching performance stats:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchCampaigns();
    fetchTemplates();
    fetchPerformanceStats();
  }, [fetchCampaigns, fetchTemplates, fetchPerformanceStats]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filters.search !== '') {
        fetchCampaigns();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search, fetchCampaigns]);

  // Handle campaign creation
  const handleCreateCampaign = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare campaign data with proper type conversion
      const campaignPayload = {
        ...campaignData,
        template_id: campaignData.template_id ? parseInt(campaignData.template_id) : null,
        scheduled_time: campaignData.scheduled_time || null,
        image_url: campaignData.image_url || null,
        deep_link: campaignData.deep_link || null,
      };

      // Remove empty string values
      Object.keys(campaignPayload).forEach(key => {
        if (campaignPayload[key] === '' || campaignPayload[key] === null) {
          delete campaignPayload[key];
        }
      });

      console.log('Sending campaign data:', campaignPayload);
      console.log('Admin user ID from localStorage:', localStorage.getItem('admin_user_id'));

      const response = await apiService.createNotificationCampaign(campaignPayload);

      if (response && response.success) {
        setSuccess('Notification campaign created successfully');
        setShowCreateModal(false);
        setCampaignData({
          title: "",
          message: "",
          notification_type: "message",
          target_audience: "all_users",
          template_id: "",
          image_url: "",
          deep_link: "",
          scheduled_time: "",
        });
        fetchCampaigns();
      } else {
        setError(response?.msg?.[0] || 'Failed to create notification campaign');
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to create notification campaign');
    } finally {
      setLoading(false);
    }
  };

  // Handle campaign sending
  const handleSendCampaign = async (campaignId) => {
    try {
      setLoading(true);
      const response = await apiService.sendNotificationCampaign(campaignId);

      if (response && response.success) {
        setSuccess('Notification campaign sent successfully');
        fetchCampaigns();
      } else {
        setError('Failed to send notification campaign');
      }
    } catch (err) {
      console.error('Error sending campaign:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to send notification campaign');
    } finally {
      setLoading(false);
    }
  };

  // Handle smart triggers
  const handleRunSmartTriggers = async () => {
    try {
      setLoading(true);
      const response = await apiService.runSmartTriggers();

      if (response && response.success) {
        setSuccess('Smart triggers executed successfully');
      } else {
        setError('Failed to run smart triggers');
      }
    } catch (err) {
      console.error('Error running smart triggers:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to run smart triggers');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "all",
      notification_type: "all",
      target_audience: "all",
      search: "",
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setCampaignData(prev => ({
      ...prev,
      title: template.title_template || prev.title,
      message: template.message_template || prev.message,
      notification_type: template.template_type || prev.notification_type,
      template_id: template.template_id ? template.template_id.toString() : "",
    }));
    setShowTemplatesModal(false);
  };

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'N/A';
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  // Render notification type badge
  const renderNotificationTypeBadge = (type) => {
    const config = notificationTypes[type];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const config = statusConfig[status];
    if (!config) return null;
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Render target audience badge
  const renderTargetAudienceBadge = (audience) => {
    const config = targetAudiences[audience];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg bg-red-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <AlertCircle size={14} className="sm:w-4 sm:h-4" />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <CheckCircle size={14} className="sm:w-4 sm:h-4" />
            {success}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          Notification Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => fetchCampaigns()}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw size={14} className={`sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
            <span className="sm:hidden">Ref</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Create Campaign</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {performanceStats.overall_stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{performanceStats.overall_stats.total_sent || 0}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Sent</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{performanceStats.overall_stats.overall_delivery_rate || 0}%</div>
            <div className="text-xs sm:text-sm text-gray-600">Delivery Rate</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{performanceStats.overall_stats.overall_open_rate || 0}%</div>
            <div className="text-xs sm:text-sm text-gray-600">Open Rate</div>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">{performanceStats.overall_stats.overall_click_rate || 0}%</div>
            <div className="text-xs sm:text-sm text-gray-600">Click Rate</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              placeholder="Search campaigns..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Notification Type Filter */}
          <select
            value={filters.notification_type}
            onChange={(e) => handleFilterChange('notification_type', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Types</option>
            <option value="reminder">Reminder</option>
            <option value="promotion">Promotion</option>
            <option value="festival_greeting">Festival Greeting</option>
            <option value="message">Message</option>
            <option value="template">Template</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-3 sm:px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Clear Filters</span>
            <span className="sm:hidden">Clear</span>
          </button>
        </div>

        {/* Target Audience Filter - Separate Row */}
        <div className="mt-3 sm:mt-4">
          <select
            value={filters.target_audience}
            onChange={(e) => handleFilterChange('target_audience', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="all">All Audiences</option>
            <option value="all_users">All Users</option>
            <option value="monthly_subscribers">Monthly Subscribers</option>
            <option value="yearly_subscribers">Yearly Subscribers</option>
            <option value="free_users">Free Users</option>
            <option value="inactive_users">Inactive Users</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-sm sm:text-base text-gray-600">Loading campaigns...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Campaign</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Recipients</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{campaign.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs" title={campaign.message}>
                            {campaign.message}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {renderNotificationTypeBadge(campaign.notification_type)}
                      </td>
                      <td className="px-4 py-3">
                        {renderTargetAudienceBadge(campaign.target_audience)}
                      </td>
                      <td className="px-4 py-3">
                        {renderStatusBadge(campaign.status)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {campaign.total_recipients || 0}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatTimeAgo(campaign.createtime)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => handleSendCampaign(campaign.campaign_id)}
                              className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors"
                            >
                              Send
                            </button>
                          )}
                          <button
                            onClick={() => fetchPerformanceStats()}
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              {campaigns.map((campaign) => (
                <div key={campaign.campaign_id} className="border-b border-gray-200 p-3 sm:p-4 hover:bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{campaign.title}</h3>
                        <p className="text-xs text-gray-500 mt-1" title={campaign.message}>
                          {campaign.message.length > 50 ? `${campaign.message.substring(0, 50)}...` : campaign.message}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        {campaign.status === 'draft' && (
                          <button
                            onClick={() => handleSendCampaign(campaign.campaign_id)}
                            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium"
                          >
                            Send
                          </button>
                        )}
                        <button
                          onClick={() => fetchPerformanceStats()}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          <Eye size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <div>{renderNotificationTypeBadge(campaign.notification_type)}</div>
                      <div>{renderTargetAudienceBadge(campaign.target_audience)}</div>
                      <div className="hidden sm:block">{renderStatusBadge(campaign.status)}</div>
                    </div>

                    <div className="flex flex-wrap justify-between text-xs text-gray-500">
                      <span>Recipients: {campaign.total_recipients || 0}</span>
                      <span>{formatTimeAgo(campaign.createtime)}</span>
                      <span className="block sm:hidden">{renderStatusBadge(campaign.status)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {campaigns.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4">
              <Bell size={40} className="sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-sm text-gray-500">Create your first notification campaign to get started.</p>
          </div>
        )}
      </div>

      {/* Smart Triggers Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4">
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            Smart Triggers & Auto Actions
          </h2>
          <button
            onClick={handleRunSmartTriggers}
            disabled={loading}
            className="px-3 sm:px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
          >
            <Play size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Run Triggers</span>
            <span className="sm:hidden">Run</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="font-medium text-sm sm:text-base">Inactive Users</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Send reminders to users inactive for 3+ days</p>
            <div className="text-xs text-gray-500 mt-1">Daily at 10:00 AM</div>
          </div>

          <div className="p-3 sm:p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="font-medium text-sm sm:text-base">Festival Greetings</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Send greetings on special occasions</p>
            <div className="text-xs text-gray-500 mt-1">Daily at 9:00 AM</div>
          </div>

          <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <span className="font-medium text-sm sm:text-base">Failed Payments</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Retry failed payments and notify users</p>
            <div className="text-xs text-gray-500 mt-1">Hourly checks</div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      {performanceStats.daily_stats && performanceStats.daily_stats.length > 0 && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
            Performance Analytics
          </h2>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceStats.daily_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: '12px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb'
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="total_sent" fill="#3b82f6" name="Sent" />
                <Bar dataKey="total_delivered" fill="#10b981" name="Delivered" />
                <Bar dataKey="total_opened" fill="#f59e0b" name="Opened" />
                <Bar dataKey="total_clicked" fill="#ef4444" name="Clicked" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Create Notification Campaign</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={campaignData.title}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter campaign title"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={campaignData.message}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  rows={3}
                  placeholder="Enter notification message"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Notification Type */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Notification Type *
                  </label>
                  <select
                    value={campaignData.notification_type}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, notification_type: e.target.value }))}
                    className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    required
                  >
                    <option value="message">Message</option>
                    <option value="reminder">Reminder</option>
                    <option value="promotion">Promotion</option>
                    <option value="festival_greeting">Festival Greeting</option>
                    <option value="template">Template</option>
                  </select>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Target Audience *
                  </label>
                  <select
                    value={campaignData.target_audience}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, target_audience: e.target.value }))}
                    className="w-full px-2 sm:px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    required
                  >
                    <option value="all_users">All Users</option>
                    <option value="monthly_subscribers">Monthly Subscribers</option>
                    <option value="yearly_subscribers">Yearly Subscribers</option>
                    <option value="free_users">Free Users</option>
                    <option value="inactive_users">Inactive Users</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={campaignData.image_url}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Deep Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deep Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={campaignData.deep_link}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, deep_link: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://app.dailyhisab.com/feature"
                  />
                </div>
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={campaignData.scheduled_time}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, scheduled_time: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Use Template (Optional)
                </label>
                <button
                  onClick={() => setShowTemplatesModal(true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>
                    {campaignData.template_id
                      ? `Template ID: ${campaignData.template_id}`
                      : "Select from templates"
                    }
                  </span>
                  <Plus size={16} />
                </button>
                {campaignData.template_id && (
                  <button
                    onClick={() => setCampaignData(prev => ({ ...prev, template_id: "" }))}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Clear template selection
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 sm:mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                disabled={loading || !campaignData.title || !campaignData.message}
                className="px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-4xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto mx-2 sm:mx-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Select Template</h3>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {templates.map((template) => (
                <div
                  key={template.template_id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {renderNotificationTypeBadge(template.template_type)}
                    <span className="font-medium text-sm sm:text-base">{template.template_name}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mb-2">
                    <strong>Title:</strong> {template.title_template}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <strong>Message:</strong> {template.message_template}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}