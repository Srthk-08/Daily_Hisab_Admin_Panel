import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  ToggleRight,
  ToggleLeft,
  Edit,
  Eye,
  Calendar,
  Target,
  Star,
  Globe,
  Play,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X,
  Filter,
  Search,
  Image,
  Link,
  Clock,
  Users,
  TrendingUp,
  Settings,
} from "lucide-react";
import apiService from "../services/api";

const Content = () => {
  // State management
  const [banners, setBanners] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());
  const [loadingImages, setLoadingImages] = useState(new Set());

  // Form states
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // Banner form data
  const [bannerData, setBannerData] = useState({
    banner_text: "",
    banner_url: "",
    banner_link: "",
    banner_type: "announcement",
    priority: 1,
    start_date: "",
    end_date: "",
    target_audience: "all_users",
  });

  // Tutorial form data
  const [tutorialData, setTutorialData] = useState({
    tutorial_title: "",
    tutorial_description: "",
    video_url: "",
    thumbnail_url: "",
    language: "hindi",
    category: "getting_started",
    difficulty_level: "beginner",
    duration_minutes: "",
    is_featured: false,
    sort_order: 0,
  });

  // Filters and pagination
  const [bannerFilters, setBannerFilters] = useState({
    banner_type: "all",
    is_active: "all",
    target_audience: "all",
    search: "",
  });
  const [tutorialFilters, setTutorialFilters] = useState({
    language: "all",
    category: "all",
    difficulty_level: "all",
    is_featured: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  });

  // Banner types configuration
  const bannerTypes = {
    promotion: { label: "Promotion", color: "text-orange-600 bg-orange-50" },
    announcement: { label: "Announcement", color: "text-blue-600 bg-blue-50" },
    feature: { label: "Feature", color: "text-green-600 bg-green-50" },
    festival: { label: "Festival", color: "text-purple-600 bg-purple-50" },
  };

  // Target audience configuration
  const targetAudiences = {
    all_users: { label: "All Users", icon: Users, color: "text-blue-600" },
    premium_users: { label: "Premium Users", icon: Star, color: "text-yellow-600" },
    free_users: { label: "Free Users", icon: Users, color: "text-gray-600" },
  };

  // Tutorial categories
  const tutorialCategories = {
    getting_started: { label: "Getting Started", icon: Play, color: "text-green-600" },
    advanced_features: { label: "Advanced Features", icon: Settings, color: "text-blue-600" },
    tips_tricks: { label: "Tips & Tricks", icon: TrendingUp, color: "text-purple-600" },
    troubleshooting: { label: "Troubleshooting", icon: AlertCircle, color: "text-red-600" },
  };

  // Difficulty levels
  const difficultyLevels = {
    beginner: { label: "Beginner", color: "text-green-600 bg-green-50" },
    intermediate: { label: "Intermediate", color: "text-yellow-600 bg-yellow-50" },
    advanced: { label: "Advanced", color: "text-red-600 bg-red-50" },
  };

  // Languages
  const languages = {
    hindi: { label: "Hindi", flag: "🇮🇳" },
    marathi: { label: "Marathi", flag: "🇮🇳" },
    english: { label: "English", flag: "🇺🇸" },
  };

  // Fetch banners
  const fetchBanners = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...bannerFilters,
        ...params,
      };

      // Remove 'all' values from query params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all' || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await apiService.getAllBanners(queryParams);
      console.log('Banners API Response:', response);

      if (response && response.success) {
        setBanners(response.data.banners || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError('Failed to fetch banners');
        setBanners([]);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError(err.message || 'Failed to fetch banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [bannerFilters, pagination.current_page, pagination.limit]);

  // Fetch tutorials
  const fetchTutorials = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: pagination.current_page,
        limit: pagination.limit,
        ...tutorialFilters,
        ...params,
      };

      // Remove 'all' values from query params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all' || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await apiService.getAllTutorials(queryParams);
      console.log('Tutorials API Response:', response);

      if (response && response.success) {
        setTutorials(response.data.tutorials || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError('Failed to fetch tutorials');
        setTutorials([]);
      }
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(err.message || 'Failed to fetch tutorials');
      setTutorials([]);
    } finally {
      setLoading(false);
    }
  }, [tutorialFilters, pagination.current_page, pagination.limit]);

  // Initial data fetch - only run once on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch banners with default filters
        const bannerResponse = await apiService.getAllBanners({ page: 1, limit: 10 });
        if (bannerResponse && bannerResponse.success) {
          setBanners(bannerResponse.data.banners || []);
          if (bannerResponse.data.pagination) {
            setPagination(bannerResponse.data.pagination);
          }
        }

        // Fetch tutorials with default filters
        const tutorialResponse = await apiService.getAllTutorials({ page: 1, limit: 10 });
        if (tutorialResponse && tutorialResponse.success) {
          setTutorials(tutorialResponse.data.tutorials || []);
          if (tutorialResponse.data.pagination) {
            setPagination(tutorialResponse.data.pagination);
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []); // Empty dependency array - only run on mount

  // Auto-dismiss success/error messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Debounced search effect for banners
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBanners();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [bannerFilters.search, bannerFilters.banner_type, bannerFilters.is_active, bannerFilters.target_audience, fetchBanners]);

  // Debounced search effect for tutorials
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTutorials();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tutorialFilters.search, tutorialFilters.language, tutorialFilters.category, tutorialFilters.difficulty_level, tutorialFilters.is_featured, fetchTutorials]);

  // Handle banner creation
  const handleCreateBanner = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.createBanner(bannerData);

      if (response && response.success) {
        setSuccess('Banner created successfully');
        setShowBannerModal(false);
        setBannerData({
          banner_text: "",
          banner_url: "",
          banner_link: "",
          banner_type: "announcement",
          priority: 1,
          start_date: "",
          end_date: "",
          target_audience: "all_users",
        });
        fetchBanners();
      } else {
        setError('Failed to create banner');
      }
    } catch (err) {
      console.error('Error creating banner:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  // Handle tutorial creation
  const handleCreateTutorial = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.createTutorial(tutorialData);

      if (response && response.success) {
        setSuccess('Tutorial created successfully');
        setShowTutorialModal(false);
        setTutorialData({
          tutorial_title: "",
          tutorial_description: "",
          video_url: "",
          thumbnail_url: "",
          language: "hindi",
          category: "getting_started",
          difficulty_level: "beginner",
          duration_minutes: "",
          is_featured: false,
          sort_order: 0,
        });
        fetchTutorials();
      } else {
        setError('Failed to create tutorial');
      }
    } catch (err) {
      console.error('Error creating tutorial:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to create tutorial');
    } finally {
      setLoading(false);
    }
  };

  // Handle banner update
  const handleUpdateBanner = async (bannerId, updateData) => {
    try {
      setLoading(true);
      const response = await apiService.updateBanner(bannerId, updateData);

      if (response && response.success) {
        setSuccess('Banner updated successfully');
        fetchBanners();
      } else {
        setError('Failed to update banner');
      }
    } catch (err) {
      console.error('Error updating banner:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to update banner');
    } finally {
      setLoading(false);
    }
  };


  // Handle banner deletion
  const handleDeleteBanner = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      setLoading(true);
      const response = await apiService.deleteBanner(bannerId);

      if (response && response.success) {
        setSuccess('Banner deleted successfully');
        fetchBanners();
      } else {
        setError('Failed to delete banner');
      }
    } catch (err) {
      console.error('Error deleting banner:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to delete banner');
    } finally {
      setLoading(false);
    }
  };

  // Handle tutorial deletion
  const handleDeleteTutorial = async (tutorialId) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;

    try {
      setLoading(true);
      const response = await apiService.deleteTutorial(tutorialId);

      if (response && response.success) {
        setSuccess('Tutorial deleted successfully');
        fetchTutorials();
      } else {
        setError('Failed to delete tutorial');
      }
    } catch (err) {
      console.error('Error deleting tutorial:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to delete tutorial');
    } finally {
      setLoading(false);
    }
  };

  // Handle banner toggle
  const handleToggleBanner = async (bannerId, isActive) => {
    await handleUpdateBanner(bannerId, { is_active: !isActive });
  };

  // Handle tutorial analytics
  const handleViewAnalytics = async (tutorialId) => {
    try {
      setLoading(true);
      const response = await apiService.getTutorialAnalytics(tutorialId);

      if (response && response.success) {
        setSelectedTutorial(response.data);
        setShowAnalyticsModal(true);
      } else {
        setError('Failed to fetch tutorial analytics');
      }
    } catch (err) {
      console.error('Error fetching tutorial analytics:', err);
      setError(err.response?.data?.msg?.[0] || err.message || 'Failed to fetch tutorial analytics');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleBannerFilterChange = (key, value) => {
    setBannerFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const handleTutorialFilterChange = (key, value) => {
    setTutorialFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  // Clear filters
  const clearBannerFilters = () => {
    setBannerFilters({
      banner_type: "all",
      is_active: "all",
      target_audience: "all",
      search: "",
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const clearTutorialFilters = () => {
    setTutorialFilters({
      language: "all",
      category: "all",
      difficulty_level: "all",
      is_featured: "all",
      search: "",
    });
    setPagination(prev => ({ ...prev, current_page: 1 }));
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

  // Render banner type badge
  const renderBannerTypeBadge = (type) => {
    const config = bannerTypes[type];
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

  // Render tutorial category badge
  const renderTutorialCategoryBadge = (category) => {
    const config = tutorialCategories[category];
    if (!config) return null;
    const IconComponent = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent size={12} />
        {config.label}
      </span>
    );
  };

  // Render difficulty level badge
  const renderDifficultyBadge = (level) => {
    const config = difficultyLevels[level];
    if (!config) return null;
    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Render language badge
  const renderLanguageBadge = (lang) => {
    const config = languages[lang];
    if (!config) return null;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <span>{config.flag}</span>
        {config.label}
      </span>
    );
  };

  // Handle image loading start
  const handleImageLoadStart = (originalSrc) => {
    setLoadingImages(prev => new Set([...prev, originalSrc]));
  };

  // Handle image loading complete
  const handleImageLoad = (originalSrc) => {
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(originalSrc);
      return newSet;
    });
  };

  // Handle image error to prevent infinite loops
  const handleImageError = (e, originalSrc) => {
    const img = e.target;
    const currentSrc = img.src;

    // If this is already a placeholder or we've already tried this image, don't retry
    if (currentSrc.includes('placeholder') || currentSrc.includes('data:image') || failedImages.has(originalSrc)) {
      return;
    }

    // Mark this image as failed and remove from loading
    setFailedImages(prev => new Set([...prev, originalSrc]));
    setLoadingImages(prev => {
      const newSet = new Set(prev);
      newSet.delete(originalSrc);
      return newSet;
    });

    // Create a data URL placeholder to avoid external requests
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Fill with light gray background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 150, 100);

    // Add text
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('No Image', 75, 50);

    // Set the data URL as the new source
    img.src = canvas.toDataURL();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notifications */}
      {error && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg bg-red-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white transition-all duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle size={16} />
            {success}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => fetchBanners()}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Banner Management */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              📢 In-App Banners
            </h3>
            <button
              onClick={() => setShowBannerModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Create Banner
            </button>
          </div>

          {/* Banner Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search banners..."
                value={bannerFilters.search}
                onChange={(e) => handleBannerFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Banner Type Filter */}
            <select
              value={bannerFilters.banner_type}
              onChange={(e) => handleBannerFilterChange('banner_type', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="promotion">Promotion</option>
              <option value="announcement">Announcement</option>
              <option value="feature">Feature</option>
              <option value="festival">Festival</option>
            </select>

            {/* Status Filter */}
            <select
              value={bannerFilters.is_active}
              onChange={(e) => handleBannerFilterChange('is_active', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

            {/* Target Audience Filter */}
            <select
              value={bannerFilters.target_audience}
              onChange={(e) => handleBannerFilterChange('target_audience', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Audiences</option>
              <option value="all_users">All Users</option>
              <option value="premium_users">Premium Users</option>
              <option value="free_users">Free Users</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearBannerFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Banners Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading banners...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Banner</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.banner_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          {loadingImages.has(banner.banner_url) && (
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                          <img
                            src={banner.banner_url}
                            alt="banner"
                            className="w-16 h-12 rounded object-cover"
                            onLoadStart={() => handleImageLoadStart(banner.banner_url)}
                            onLoad={() => handleImageLoad(banner.banner_url)}
                            onError={(e) => handleImageError(e, banner.banner_url)}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{banner.banner_text}</div>
                          {banner.banner_link && (
                            <div className="text-sm text-blue-600">
                              <Link size={12} className="inline mr-1" />
                              {banner.banner_link}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {renderBannerTypeBadge(banner.banner_type)}
                    </td>
                    <td className="px-4 py-3">
                      {renderTargetAudienceBadge(banner.target_audience)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {banner.priority}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleBanner(banner.banner_id, banner.is_active)}
                        className="flex items-center"
                      >
                        {banner.is_active ? (
                          <ToggleRight className="text-green-600" size={20} />
                        ) : (
                          <ToggleLeft className="text-gray-400" size={20} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatTimeAgo(banner.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteBanner(banner.banner_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Banner"
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

        {banners.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
              <Image size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners found</h3>
            <p className="text-gray-500">Create your first banner to get started.</p>
          </div>
        )}
      </div>

      {/* Tutorial Management */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              🎥 Tutorials
            </h3>
            <button
              onClick={() => setShowTutorialModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Create Tutorial
            </button>
          </div>

          {/* Tutorial Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={tutorialFilters.search}
                onChange={(e) => handleTutorialFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Language Filter */}
            <select
              value={tutorialFilters.language}
              onChange={(e) => handleTutorialFilterChange('language', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Languages</option>
              <option value="hindi">Hindi</option>
              <option value="marathi">Marathi</option>
              <option value="english">English</option>
            </select>

            {/* Category Filter */}
            <select
              value={tutorialFilters.category}
              onChange={(e) => handleTutorialFilterChange('category', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="getting_started">Getting Started</option>
              <option value="advanced_features">Advanced Features</option>
              <option value="tips_tricks">Tips & Tricks</option>
              <option value="troubleshooting">Troubleshooting</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={tutorialFilters.difficulty_level}
              onChange={(e) => handleTutorialFilterChange('difficulty_level', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Featured Filter */}
            <select
              value={tutorialFilters.is_featured}
              onChange={(e) => handleTutorialFilterChange('is_featured', e.target.value)}
              className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="true">Featured</option>
              <option value="false">Regular</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearTutorialFilters}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Tutorials Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Loading tutorials...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tutorial</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Language</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Views</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tutorials.map((tutorial) => (
                  <tr key={tutorial.tutorial_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {tutorial.thumbnail_url ? (
                          <div className="relative w-16 h-12 rounded overflow-hidden">
                            {loadingImages.has(tutorial.thumbnail_url) && (
                              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              </div>
                            )}
                            <img
                              src={tutorial.thumbnail_url}
                              alt="tutorial"
                              className="w-16 h-12 rounded object-cover"
                              onLoadStart={() => handleImageLoadStart(tutorial.thumbnail_url)}
                              onLoad={() => handleImageLoad(tutorial.thumbnail_url)}
                              onError={(e) => handleImageError(e, tutorial.thumbnail_url)}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Play size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {tutorial.tutorial_title}
                            {tutorial.is_featured && <Star size={16} className="text-yellow-500" />}
                          </div>
                          {tutorial.tutorial_description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {tutorial.tutorial_description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {renderLanguageBadge(tutorial.language)}
                    </td>
                    <td className="px-4 py-3">
                      {renderTutorialCategoryBadge(tutorial.category)}
                    </td>
                    <td className="px-4 py-3">
                      {renderDifficultyBadge(tutorial.difficulty_level)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {tutorial.duration_minutes ? `${tutorial.duration_minutes}m` : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {tutorial.view_count || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatTimeAgo(tutorial.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewAnalytics(tutorial.tutorial_id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Analytics"
                        >
                          <BarChart3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTutorial(tutorial.tutorial_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Tutorial"
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

        {tutorials.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
              <Play size={48} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
            <p className="text-gray-500">Create your first tutorial to get started.</p>
          </div>
        )}
      </div>

      {/* Create Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Banner</h3>
              <button
                onClick={() => setShowBannerModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Banner Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Text *
                </label>
                <input
                  type="text"
                  value={bannerData.banner_text}
                  onChange={(e) => setBannerData({ ...bannerData, banner_text: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter banner text"
                />
              </div>

              {/* Banner URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  value={bannerData.banner_url}
                  onChange={(e) => setBannerData({ ...bannerData, banner_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/banner-image.jpg"
                />
              </div>

              {/* Banner Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banner Link (Optional)
                </label>
                <input
                  type="url"
                  value={bannerData.banner_link}
                  onChange={(e) => setBannerData({ ...bannerData, banner_link: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/landing-page"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Banner Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Type
                  </label>
                  <select
                    value={bannerData.banner_type}
                    onChange={(e) => setBannerData({ ...bannerData, banner_type: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="promotion">Promotion</option>
                    <option value="feature">Feature</option>
                    <option value="festival">Festival</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bannerData.priority}
                    onChange={(e) => setBannerData({ ...bannerData, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={bannerData.start_date}
                    onChange={(e) => setBannerData({ ...bannerData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={bannerData.end_date}
                    onChange={(e) => setBannerData({ ...bannerData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  value={bannerData.target_audience}
                  onChange={(e) => setBannerData({ ...bannerData, target_audience: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all_users">All Users</option>
                  <option value="premium_users">Premium Users</option>
                  <option value="free_users">Free Users</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowBannerModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBanner}
                disabled={loading || !bannerData.banner_text || !bannerData.banner_url}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tutorial Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Tutorial</h3>
              <button
                onClick={() => setShowTutorialModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Tutorial Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tutorial Title *
                </label>
                <input
                  type="text"
                  value={tutorialData.tutorial_title}
                  onChange={(e) => setTutorialData({ ...tutorialData, tutorial_title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tutorial title"
                />
              </div>

              {/* Tutorial Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={tutorialData.tutorial_description}
                  onChange={(e) => setTutorialData({ ...tutorialData, tutorial_description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Enter tutorial description"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={tutorialData.video_url}
                  onChange={(e) => setTutorialData({ ...tutorialData, video_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=tutorial-id"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={tutorialData.thumbnail_url}
                  onChange={(e) => setTutorialData({ ...tutorialData, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={tutorialData.language}
                    onChange={(e) => setTutorialData({ ...tutorialData, language: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="hindi">Hindi</option>
                    <option value="marathi">Marathi</option>
                    <option value="english">English</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={tutorialData.category}
                    onChange={(e) => setTutorialData({ ...tutorialData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="getting_started">Getting Started</option>
                    <option value="advanced_features">Advanced Features</option>
                    <option value="tips_tricks">Tips & Tricks</option>
                    <option value="troubleshooting">Troubleshooting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={tutorialData.difficulty_level}
                    onChange={(e) => setTutorialData({ ...tutorialData, difficulty_level: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={tutorialData.duration_minutes}
                    onChange={(e) => setTutorialData({ ...tutorialData, duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={tutorialData.sort_order}
                    onChange={(e) => setTutorialData({ ...tutorialData, sort_order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={tutorialData.is_featured}
                    onChange={(e) => setTutorialData({ ...tutorialData, is_featured: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured Tutorial
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTutorialModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTutorial}
                disabled={loading || !tutorialData.tutorial_title || !tutorialData.video_url}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Tutorial'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Analytics Modal */}
      {showAnalyticsModal && selectedTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Tutorial Analytics</h3>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {selectedTutorial.tutorial && (
              <div className="space-y-6">
                {/* Tutorial Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium mb-2">{selectedTutorial.tutorial.tutorial_title}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Language:</span>
                      <div className="font-medium">{renderLanguageBadge(selectedTutorial.tutorial.language)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Category:</span>
                      <div className="font-medium">{renderTutorialCategoryBadge(selectedTutorial.tutorial.category)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Difficulty:</span>
                      <div className="font-medium">{renderDifficultyBadge(selectedTutorial.tutorial.difficulty_level)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <div className="font-medium">{formatTimeAgo(selectedTutorial.tutorial.created_at)}</div>
                    </div>
                  </div>
                </div>

                {/* Analytics Stats */}
                {selectedTutorial.analytics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedTutorial.analytics.total_views}</div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedTutorial.analytics.unique_viewers}</div>
                      <div className="text-sm text-gray-600">Unique Viewers</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedTutorial.analytics.authenticated_views}</div>
                      <div className="text-sm text-gray-600">Authenticated Views</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedTutorial.analytics.anonymous_views}</div>
                      <div className="text-sm text-gray-600">Anonymous Views</div>
                    </div>
                  </div>
                )}

                {/* Device Analytics */}
                {selectedTutorial.analytics && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-gray-800">{selectedTutorial.analytics.mobile_views}</div>
                      <div className="text-sm text-gray-600">Mobile Views</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-gray-800">{selectedTutorial.analytics.desktop_views}</div>
                      <div className="text-sm text-gray-600">Desktop Views</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-gray-800">{selectedTutorial.analytics.tablet_views}</div>
                      <div className="text-sm text-gray-600">Tablet Views</div>
                    </div>
                  </div>
                )}

                {/* Recent Views */}
                {selectedTutorial.recent_views && selectedTutorial.recent_views.length > 0 && (
                  <div>
                    <h4 className="text-lg font-medium mb-3">Recent Views</h4>
                    <div className="space-y-2">
                      {selectedTutorial.recent_views.map((view, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{view.user_name || 'Anonymous User'}</div>
                            <div className="text-sm text-gray-500">{view.device_type}</div>
                          </div>
                          <div className="text-sm text-gray-500">{formatTimeAgo(view.viewed_at)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
