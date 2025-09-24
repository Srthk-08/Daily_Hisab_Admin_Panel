// services/api.js
import axios from "axios";
import config from "../config/config";

// Create axios instance
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: config.CORS.HEADERS,
  withCredentials: config.CORS.WITH_CREDENTIALS,
});

// Token management utilities
const tokenManager = {
  getToken: () => localStorage.getItem(config.AUTH.TOKEN_KEY),

  setToken: (token) => {
    console.log("Setting token:", token); // Debug log
    localStorage.setItem(config.AUTH.TOKEN_KEY, token);
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  },

  clearToken: () => {
    localStorage.removeItem(config.AUTH.TOKEN_KEY);
    localStorage.removeItem(config.AUTH.ADMIN_FLAG);
    localStorage.removeItem('admin_user_id');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => {
    const token = tokenManager.getToken();
    const adminFlag = localStorage.getItem(config.AUTH.ADMIN_FLAG) === "true";
    console.log("Auth check - Token:", !!token, "AdminFlag:", adminFlag); // Debug log
    return !!(token && adminFlag);
  },

  // Initialize token on app load
  initialize: () => {
    const token = tokenManager.getToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
    }
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      tokenManager.clearToken();
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = config.ERRORS.NETWORK_ERROR;
    }

    return Promise.reject(error);
  }
);

// API Services
const apiService = {
  // Authentication
  login: async (email, password) => {
    try {
      // Send email and password in request body
      const response = await api.post(
        config.API_ENDPOINTS.LOGIN,
        {
          email: email,
          password: password
        }
      );

      console.log("API Response:", response.data); // Debug log

      if (response.data && response.data.success && response.data.data && response.data.data.token) {
        // Set token and admin flag
        tokenManager.setToken(response.data.data.token);
        localStorage.setItem(config.AUTH.ADMIN_FLAG, "true");

        // Store admin user ID if available
        if (response.data.data.user_id) {
          localStorage.setItem('admin_user_id', response.data.data.user_id);
        }

        return {
          success: true,
          data: response.data.data,
          message: response.data.msg && response.data.msg[0] ? response.data.msg[0] : "Login successful"
        };
      }

      throw new Error(config.ERRORS.INVALID_CREDENTIALS);
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error(config.ERRORS.INVALID_CREDENTIALS);
      } else if (error.response?.status === 400) {
        // Handle validation errors
        const errorData = error.response.data;
        if (errorData && errorData.errors && errorData.errors.length > 0) {
          throw new Error(errorData.errors[0]); // Return first validation error
        } else if (errorData && errorData.msg && errorData.msg.length > 0) {
          throw new Error(errorData.msg[0]); // Return first message
        }
        throw new Error(config.ERRORS.VALIDATION_ERROR);
      } else if (error.response?.status >= 500) {
        throw new Error(config.ERRORS.SERVER_ERROR);
      }
      throw new Error(error.message || config.ERRORS.SERVER_ERROR);
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.VERIFY_TOKEN);
      return response.data;
    } catch (error) {
      tokenManager.clearToken();
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      // Optional: Call backend logout endpoint
      await api.post(config.API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Continue with logout even if backend call fails
      console.error('Logout API call failed:', error);
    } finally {
      tokenManager.clearToken();
    }
  },

  // Check authentication status
  isAuthenticated: tokenManager.isAuthenticated,

  // Initialize API service
  initialize: tokenManager.initialize,

  // Generic API methods
  get: (url, params = {}) => api.get(url, { params }),
  post: (url, data = {}) => api.post(url, data),
  put: (url, data = {}) => api.put(url, data),
  delete: (url) => api.delete(url),

  // User services
  getUser: async () => {
    const response = await api.get(config.API_ENDPOINTS.USER);
    return response.data;
  },

  // Get all users with their accounts
  getAllUsersWithAccounts: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_USERS_WITH_ACCOUNTS);
    return response.data;
  },

  // Get dashboard data
  getDashboardData: async () => {
    const response = await api.get(config.API_ENDPOINTS.DASHBOARD);
    return response.data;
  },

  // Subscription Plan Management
  getSubscriptionPlans: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUBSCRIPTION_PLANS);
    return response.data;
  },

  createSubscriptionPlan: async (planData) => {
    const response = await api.post(config.API_ENDPOINTS.CREATE_SUBSCRIPTION_PLAN, planData);
    return response.data;
  },

  updateSubscriptionPlan: async (planData) => {
    const response = await api.put(config.API_ENDPOINTS.UPDATE_SUBSCRIPTION_PLAN, planData);
    return response.data;
  },

  deleteSubscriptionPlan: async (subscriptionId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_SUBSCRIPTION_PLAN, {
      data: { subscription_id: subscriptionId }
    });
    return response.data;
  },

  // Payment History Management
  getPaymentHistory: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_PAYMENT_HISTORY, { params });
    return response.data;
  },

  // User Subscription History Management
  getUsersSubscriptionHistory: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_USERS_SUBSCRIPTION_HISTORY, { params });
    return response.data;
  },

  // Admin Category Management
  getAllAdminCategories: async (params = {}) => {
    try {
      console.log('Fetching admin categories with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_ADMIN_CATEGORIES, { params });
      console.log('Admin categories API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin categories:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  createAdminCategory: async (categoryData, iconFile = null) => {
    try {
      const formData = new FormData();
      formData.append('category_name', categoryData.category_name);
      formData.append('category_type', categoryData.category_type.toString());
      formData.append('account_type', (categoryData.account_type || 1).toString());
      formData.append('deletable', (categoryData.deletable || 0).toString());

      // Add icon file - either uploaded file or converted emoji
      if (iconFile) {
        formData.append('icon', iconFile);
      }

      console.log('Creating admin category with data:', {
        category_name: categoryData.category_name,
        category_type: categoryData.category_type,
        account_type: categoryData.account_type,
        deletable: categoryData.deletable,
        hasIcon: !!iconFile
      });

      const response = await api.post(config.API_ENDPOINTS.CREATE_ADMIN_CATEGORY, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating admin category:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  },

  updateAdminCategory: async (categoryData, iconFile = null) => {
    const formData = new FormData();
    formData.append('category_id', categoryData.category_id.toString());
    formData.append('category_name', categoryData.category_name);
    formData.append('category_type', categoryData.category_type.toString());
    formData.append('account_type', (categoryData.account_type || 1).toString());
    formData.append('deletable', (categoryData.deletable || 0).toString());

    // Add icon file - either uploaded file or converted emoji
    if (iconFile) {
      formData.append('icon', iconFile);
    }

    const response = await api.put(config.API_ENDPOINTS.UPDATE_ADMIN_CATEGORY, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAdminCategory: async (categoryId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_ADMIN_CATEGORY, {
      data: { category_id: categoryId }
    });
    return response.data;
  },

  // Support Ticket Management
  getAllSupportTickets: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS, { params });
    return response.data;
  },

  updateSupportTicketStatus: async (ticketData) => {
    const response = await api.put(config.API_ENDPOINTS.UPDATE_SUPPORT_TICKET_STATUS, ticketData);
    return response.data;
  },

  deleteSupportTicket: async (ticketId) => {
    const response = await api.delete(config.API_ENDPOINTS.DELETE_SUPPORT_TICKET, {
      data: { support_ticket_id: ticketId }
    });
    return response.data;
  },

  getSupportTicketDetails: async (ticketId) => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUPPORT_TICKET_DETAILS, {
      params: { support_ticket_id: ticketId }
    });
    return response.data;
  },

  getSupportTicketStats: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUPPORT_TICKET_STATS, { params });
    return response.data;
  },

  // Notification Management
  createNotificationCampaign: async (campaignData) => {
    // Get admin user ID from localStorage
    const adminUserId = localStorage.getItem('admin_user_id');
    if (adminUserId) {
      campaignData.created_by = parseInt(adminUserId);
    }

    console.log('Creating notification campaign with data:', campaignData);

    const response = await api.post(config.API_ENDPOINTS.CREATE_NOTIFICATION_CAMPAIGN, campaignData);
    return response.data;
  },

  sendNotificationCampaign: async (campaignId) => {
    const response = await api.post(config.API_ENDPOINTS.SEND_NOTIFICATION_CAMPAIGN, { campaign_id: campaignId });
    return response.data;
  },

  getAllNotificationCampaigns: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_NOTIFICATION_CAMPAIGNS, { params });
    return response.data;
  },

  getNotificationTemplates: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_NOTIFICATION_TEMPLATES, { params });
    return response.data;
  },

  getNotificationPerformanceStats: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_NOTIFICATION_PERFORMANCE_STATS, { params });
    return response.data;
  },

  runSmartTriggers: async () => {
    const response = await api.post(config.API_ENDPOINTS.RUN_SMART_TRIGGERS);
    return response.data;
  },

  getSmartTriggerStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_SMART_TRIGGER_STATS);
    return response.data;
  },

  updateDeviceToken: async (tokenData) => {
    const response = await api.post(config.API_ENDPOINTS.UPDATE_DEVICE_TOKEN, tokenData);
    return response.data;
  },

  // Content Management
  createBanner: async (bannerData) => {
    // Get admin user ID from localStorage
    const adminUserId = localStorage.getItem('admin_user_id');
    if (adminUserId) {
      bannerData.created_by = parseInt(adminUserId);
    }

    console.log('Creating banner with data:', bannerData);

    const response = await api.post(config.API_ENDPOINTS.CREATE_BANNER, bannerData);
    return response.data;
  },

  getAllBanners: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_BANNERS, { params });
    return response.data;
  },

  updateBanner: async (bannerId, bannerData) => {
    const response = await api.put(`${config.API_ENDPOINTS.UPDATE_BANNER}/${bannerId}`, bannerData);
    return response.data;
  },

  deleteBanner: async (bannerId) => {
    const response = await api.delete(`${config.API_ENDPOINTS.DELETE_BANNER}/${bannerId}`);
    return response.data;
  },

  createTutorial: async (tutorialData) => {
    // Get admin user ID from localStorage
    const adminUserId = localStorage.getItem('admin_user_id');
    if (adminUserId) {
      tutorialData.created_by = parseInt(adminUserId);
    }

    console.log('Creating tutorial with data:', tutorialData);

    const response = await api.post(config.API_ENDPOINTS.CREATE_TUTORIAL, tutorialData);
    return response.data;
  },

  getAllTutorials: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_TUTORIALS, { params });
    return response.data;
  },

  updateTutorial: async (tutorialId, tutorialData) => {
    const response = await api.put(`${config.API_ENDPOINTS.UPDATE_TUTORIAL}/${tutorialId}`, tutorialData);
    return response.data;
  },

  deleteTutorial: async (tutorialId) => {
    const response = await api.delete(`${config.API_ENDPOINTS.DELETE_TUTORIAL}/${tutorialId}`);
    return response.data;
  },

  getTutorialAnalytics: async (tutorialId) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_TUTORIAL_ANALYTICS}/${tutorialId}`);
    return response.data;
  },

  trackTutorialView: async (tutorialId, deviceType) => {
    const response = await api.post(`${config.API_ENDPOINTS.TRACK_TUTORIAL_VIEW}/${tutorialId}`, {
      device_type: deviceType
    });
    return response.data;
  },

  // Terms & Conditions Management
  getAllPolicyCategories: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_ALL_POLICY_CATEGORIES);
    return response.data;
  },
  getPolicyPoints: async (categoryId, params = {}) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_POLICY_POINTS}/${categoryId}`, { params });
    return response.data;
  },
  createPolicyPoint: async (policyPointData) => {
    const response = await api.post(config.API_ENDPOINTS.CREATE_POLICY_POINT, policyPointData);
    return response.data;
  },
  updatePolicyPoint: async (pointId, policyPointData) => {
    const response = await api.put(`${config.API_ENDPOINTS.UPDATE_POLICY_POINT}/${pointId}`, policyPointData);
    return response.data;
  },
  deletePolicyPoint: async (pointId) => {
    const response = await api.delete(`${config.API_ENDPOINTS.DELETE_POLICY_POINT}/${pointId}`);
    return response.data;
  },
  reorderPolicyPoints: async (categoryId, pointsData) => {
    const response = await api.put(`${config.API_ENDPOINTS.REORDER_POLICY_POINTS}/${categoryId}`, pointsData);
    return response.data;
  },
  createPolicyVersion: async (versionData) => {
    const response = await api.post(config.API_ENDPOINTS.CREATE_POLICY_VERSION, versionData);
    return response.data;
  },
  getPolicyVersionHistory: async (categoryId) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_POLICY_VERSION_HISTORY}/${categoryId}`);
    return response.data;
  },
  getPolicyContent: async (categoryName) => {
    const response = await api.get(`${config.API_ENDPOINTS.GET_POLICY_CONTENT}/${categoryName}`);
    return response.data;
  },
  acceptPolicyVersion: async (versionId, categoryId) => {
    const response = await api.post(`${config.API_ENDPOINTS.ACCEPT_POLICY_VERSION}/${versionId}`, {
      category_id: categoryId
    });
    return response.data;
  },
  getUserPolicyAcceptance: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_USER_POLICY_ACCEPTANCE);
    return response.data;
  },

  // Comprehensive Admin Statistics
  getComprehensiveStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_COMPREHENSIVE_STATS);
    return response.data;
  },

  // Refer & Earn System
  getReferralCode: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_REFERRAL_CODE);
    return response.data;
  },
  getReferralStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_REFERRAL_STATS);
    return response.data;
  },
  checkFreeTrialEligibility: async (deviceId) => {
    const response = await api.post(config.API_ENDPOINTS.CHECK_FREE_TRIAL_ELIGIBILITY, {
      device_id: deviceId
    });
    return response.data;
  },
  activateFreeTrial: async (deviceId) => {
    const response = await api.post(config.API_ENDPOINTS.ACTIVATE_FREE_TRIAL, {
      device_id: deviceId
    });
    return response.data;
  },
  applyReferralCode: async (referralCode, deviceId) => {
    const response = await api.post(config.API_ENDPOINTS.APPLY_REFERRAL_CODE, {
      referral_code: referralCode,
      device_id: deviceId
    });
    return response.data;
  },
  getReferralAnalytics: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_REFERRAL_ANALYTICS, { params });
    return response.data;
  },
  activatePendingRewards: async () => {
    const response = await api.post(config.API_ENDPOINTS.ACTIVATE_PENDING_REWARDS, {
      subscription_id: config.SPECIAL_PLANS.REFERRAL_REWARD // Referral Reward Plan (ID: 1) from subscription_master
    });
    return response.data;
  },

  // Business services
  getBusiness: async () => {
    const response = await api.get(config.API_ENDPOINTS.BUSINESS);
    return response.data;
  },

  // Subscription services
  getSubscriptions: async () => {
    const response = await api.get(config.API_ENDPOINTS.SUBSCRIPTION);
    return response.data;
  },

  updateSubscription: async (id, data) => {
    const response = await api.put(`${config.API_ENDPOINTS.SUBSCRIPTION}${id}/`, data);
    return response.data;
  },

  // Income services
  getIncomes: async () => {
    const response = await api.get(config.API_ENDPOINTS.INCOME);
    return response.data;
  },

  // Expense services
  getExpenses: async () => {
    const response = await api.get(config.API_ENDPOINTS.EXPENSE);
    return response.data;
  },

  // Reports
  getReports: async () => {
    const response = await api.get(config.API_ENDPOINTS.REPORT);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await api.get(config.API_ENDPOINTS.NOTIFICATION);
    return response.data;
  },

  // Manual Upgrade System
  getAvailablePlans: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_AVAILABLE_PLANS);
    return response.data;
  },

  manualUpgradeUser: async (upgradeData) => {
    const response = await api.post(config.API_ENDPOINTS.MANUAL_UPGRADE_USER, upgradeData);
    return response.data;
  },

  getManualUpgradeHistory: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_MANUAL_UPGRADE_HISTORY, { params });
    return response.data;
  },

  getManualUpgradeStats: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_MANUAL_UPGRADE_STATS);
    return response.data;
  },

  // Admin Report System
  getUserGrowthReport: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_USER_GROWTH_REPORT, { params });
    return response.data;
  },

  getUserActivityReport: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_USER_ACTIVITY_REPORT);
    return response.data;
  },

  getSubscriptionRevenueReport: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_SUBSCRIPTION_REVENUE_REPORT, { params });
    return response.data;
  },

  getBusinessHealthReport: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_BUSINESS_HEALTH_REPORT);
    return response.data;
  },

  getIncomeExpenseSummary: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_INCOME_EXPENSE_SUMMARY, { params });
    return response.data;
  },

  getExpenseBreakdown: async () => {
    const response = await api.get(config.API_ENDPOINTS.GET_EXPENSE_BREAKDOWN);
    return response.data;
  },

  getIncomeBreakdown: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_INCOME_BREAKDOWN, { params });
    return response.data;
  },

  getComprehensiveReport: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.GET_COMPREHENSIVE_REPORT, { params });
    return response.data;
  },

  exportReportData: async (params = {}) => {
    const response = await api.get(config.API_ENDPOINTS.EXPORT_REPORT_DATA, {
      params,
      responseType: 'blob' // Important for file downloads
    });
    return response;
  },

  // Feedback Management
  createFeedback: async (feedbackData) => {
    try {
      console.log('Creating feedback with data:', feedbackData);
      const response = await api.post(config.API_ENDPOINTS.CREATE_FEEDBACK, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getUserFeedback: async (userId, params = {}) => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_USER_FEEDBACK, {
        params: { user_id: userId, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error;
    }
  },

  getAllFeedback: async (params = {}) => {
    try {
      console.log('Fetching all feedback with params:', params);
      const response = await api.get(config.API_ENDPOINTS.GET_ALL_FEEDBACK, { params });
      console.log('All feedback API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all feedback:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  updateFeedbackResponse: async (feedbackId, adminResponse) => {
    try {
      console.log('Updating feedback response:', { feedbackId, adminResponse });
      const response = await api.put(config.API_ENDPOINTS.UPDATE_FEEDBACK_RESPONSE, {
        feedback_id: feedbackId,
        admin_response: adminResponse
      });
      return response.data;
    } catch (error) {
      console.error('Error updating feedback response:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  deleteFeedback: async (feedbackId) => {
    try {
      console.log('Deleting feedback:', feedbackId);
      const response = await api.delete(config.API_ENDPOINTS.DELETE_FEEDBACK, {
        data: { feedback_id: feedbackId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  getFeedbackStats: async () => {
    try {
      const response = await api.get(config.API_ENDPOINTS.GET_FEEDBACK_STATS);
      return response.data;
    } catch (error) {
      console.error('Error fetching feedback stats:', error);
      throw error;
    }
  },
};

// Initialize token management when module loads
tokenManager.initialize();

export default apiService;