// Configuration file for API endpoints and environment settings
// Change this single URL to update all API calls across the admin panel

const config = {
  // API Configuration
  API_BASE_URL: 'http://127.0.0.1:3000/daliyhisab/server',
  // API_BASE_URL: 'https://appzetoapp.com/daliyhisab/server',

  // Special Subscription Plan Constants (these are fixed and cannot change)
  SPECIAL_PLANS: {
    FREE_TRIAL: 0,
    REFERRAL_REWARD: 1
  },

  // Account Type Constants
  ACCOUNT_TYPES: {
    PERSONAL: 1,
    BUSINESS: 2
  },

  // Account Type Labels
  ACCOUNT_TYPE_LABELS: {
    1: 'Personal',
    2: 'Business'
  },

  // Account Type Colors for UI
  ACCOUNT_TYPE_COLORS: {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800'
  },

  // API endpoints
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    LOGIN: '/admin_login',          // Updated to match backend endpoint
    VERIFY_TOKEN: '/admin_dashboard',  // Added
    DASHBOARD: '/admin/dashboard',  // Dashboard data endpoint
    LOGOUT: '/api/auth/logout',        // Added
    USER: '/api/user',
    GET_ALL_USERS_WITH_ACCOUNTS: '/admin/get_all_users_with_accounts',
    BUSINESS: '/api/business',
    REPORT: '/api/report',
    INCOME: '/api/income',
    EXPENSE: '/api/expense',
    UDHARI: '/api/udhari',
    CONTENT: '/api/content',
    NOTIFICATION: '/api/notification',
    SUBSCRIPTION: '/api/subscription',
    STOCK: '/api/stock',
    DATA: '/api/data',
    DATA_PAGE: '/api/data-page',
    // Subscription Plan Management
    CREATE_SUBSCRIPTION_PLAN: '/admin/create_subscription_plan',
    UPDATE_SUBSCRIPTION_PLAN: '/admin/update_subscription_plan',
    DELETE_SUBSCRIPTION_PLAN: '/admin/delete_subscription_plan',
    GET_SUBSCRIPTION_PLANS: '/admin/get_all_subscription_plans?include_deleted=false',
    // Payment History Management
    GET_ALL_PAYMENT_HISTORY: '/admin/get_all_payment_history',
    // User Subscription History Management
    GET_ALL_USERS_SUBSCRIPTION_HISTORY: '/admin/get_all_users_subscription_history',
    // Admin Category Management
    CREATE_ADMIN_CATEGORY: '/admin/create_category',
    UPDATE_ADMIN_CATEGORY: '/admin/update_category',
    DELETE_ADMIN_CATEGORY: '/admin/delete_category',
    GET_ALL_ADMIN_CATEGORIES: '/admin/get_all_categories',

    // Feedback Management
    CREATE_FEEDBACK: '/create_feedback',
    GET_USER_FEEDBACK: '/get_user_feedback',
    GET_ALL_FEEDBACK: '/admin/get_all_feedback',
    UPDATE_FEEDBACK_RESPONSE: '/admin/update_feedback_response',
    DELETE_FEEDBACK: '/admin/delete_feedback',
    GET_FEEDBACK_STATS: '/admin/get_feedback_stats',

    // Support Ticket Management
    GET_ALL_SUPPORT_TICKETS: '/admin/get_all_support_tickets',
    UPDATE_SUPPORT_TICKET_STATUS: '/admin/update_support_ticket_status',
    DELETE_SUPPORT_TICKET: '/admin/delete_support_ticket',
    GET_SUPPORT_TICKET_DETAILS: '/admin/get_support_ticket_details',
    GET_SUPPORT_TICKET_STATS: '/admin/get_support_ticket_stats',

    // Notification Management
    CREATE_NOTIFICATION_CAMPAIGN: '/admin/create_notification_campaign',
    SEND_NOTIFICATION_CAMPAIGN: '/admin/send_notification_campaign',
    GET_ALL_NOTIFICATION_CAMPAIGNS: '/admin/get_all_notification_campaigns',
    GET_NOTIFICATION_TEMPLATES: '/admin/get_notification_templates',
    GET_NOTIFICATION_PERFORMANCE_STATS: '/admin/get_notification_performance_stats',
    RUN_SMART_TRIGGERS: '/admin/run_smart_triggers',
    GET_SMART_TRIGGER_STATS: '/admin/get_smart_trigger_stats',
    UPDATE_DEVICE_TOKEN: '/update_device_token',

    // Content Management
    CREATE_BANNER: '/admin/create_banner',
    GET_ALL_BANNERS: '/admin/get_all_banners',
    UPDATE_BANNER: '/admin/update_banner',
    DELETE_BANNER: '/admin/delete_banner',
    CREATE_TUTORIAL: '/admin/create_tutorial',
    GET_ALL_TUTORIALS: '/admin/get_all_tutorials',
    UPDATE_TUTORIAL: '/admin/update_tutorial',
    DELETE_TUTORIAL: '/admin/delete_tutorial',
    GET_TUTORIAL_ANALYTICS: '/admin/get_tutorial_analytics',
    TRACK_TUTORIAL_VIEW: '/track_tutorial_view',

    // Terms & Conditions Management
    GET_ALL_POLICY_CATEGORIES: '/admin/get_all_policy_categories',
    GET_POLICY_POINTS: '/admin/get_policy_points',
    CREATE_POLICY_POINT: '/admin/create_policy_point',
    UPDATE_POLICY_POINT: '/admin/update_policy_point',
    DELETE_POLICY_POINT: '/admin/delete_policy_point',
    REORDER_POLICY_POINTS: '/admin/reorder_policy_points',
    CREATE_POLICY_VERSION: '/admin/create_policy_version',
    GET_POLICY_VERSION_HISTORY: '/admin/get_policy_version_history',
    GET_POLICY_CONTENT: '/get_policy_content',
    ACCEPT_POLICY_VERSION: '/accept_policy_version',
    GET_USER_POLICY_ACCEPTANCE: '/get_user_policy_acceptance',

    // Refer & Earn System
    GET_REFERRAL_CODE: '/get_referral_code',
    GET_REFERRAL_STATS: '/get_referral_stats',
    CHECK_FREE_TRIAL_ELIGIBILITY: '/check_free_trial_eligibility',
    ACTIVATE_FREE_TRIAL: '/activate_free_trial',
    APPLY_REFERRAL_CODE: '/apply_referral_code',
    GET_REFERRAL_ANALYTICS: '/admin/get_referral_analytics',
    ACTIVATE_PENDING_REWARDS: '/admin/activate_pending_rewards',

    // Comprehensive Admin Statistics
    GET_COMPREHENSIVE_STATS: '/admin/comprehensive_stats',

    // Manual Upgrade System
    GET_AVAILABLE_PLANS: '/admin/get_available_plans',
    MANUAL_UPGRADE_USER: '/admin/manual_upgrade_user',
    GET_MANUAL_UPGRADE_HISTORY: '/admin/get_manual_upgrade_history',
    GET_MANUAL_UPGRADE_STATS: '/admin/get_manual_upgrade_stats',

    // Admin Report System
    GET_USER_GROWTH_REPORT: '/admin/get_user_growth_report',
    GET_USER_ACTIVITY_REPORT: '/admin/get_user_activity_report',
    GET_SUBSCRIPTION_REVENUE_REPORT: '/admin/get_subscription_revenue_report',
    GET_BUSINESS_HEALTH_REPORT: '/admin/get_business_health_report',
    GET_INCOME_EXPENSE_SUMMARY: '/admin/get_income_expense_summary',
    GET_EXPENSE_BREAKDOWN: '/admin/get_expense_breakdown',
    GET_INCOME_BREAKDOWN: '/admin/get_income_breakdown',
    GET_COMPREHENSIVE_REPORT: '/admin/get_comprehensive_report',
    EXPORT_REPORT_DATA: '/admin/export_report_data',
  },

  // Full API URLs (constructed from base URL and endpoints)
  get API_URLS() {
    return {
      AUTH: `${this.API_BASE_URL}${this.API_ENDPOINTS.AUTH}`,
      LOGIN: `${this.API_BASE_URL}${this.API_ENDPOINTS.LOGIN}`,
      VERIFY_TOKEN: `${this.API_BASE_URL}${this.API_ENDPOINTS.VERIFY_TOKEN}`,
      DASHBOARD: `${this.API_BASE_URL}${this.API_ENDPOINTS.DASHBOARD}`,
      LOGOUT: `${this.API_BASE_URL}${this.API_ENDPOINTS.LOGOUT}`,
      USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.USER}`,
      GET_ALL_USERS_WITH_ACCOUNTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_USERS_WITH_ACCOUNTS}`,
      BUSINESS: `${this.API_BASE_URL}${this.API_ENDPOINTS.BUSINESS}`,
      REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.REPORT}`,
      INCOME: `${this.API_BASE_URL}${this.API_ENDPOINTS.INCOME}`,
      EXPENSE: `${this.API_BASE_URL}${this.API_ENDPOINTS.EXPENSE}`,
      UDHARI: `${this.API_BASE_URL}${this.API_ENDPOINTS.UDHARI}`,
      CONTENT: `${this.API_BASE_URL}${this.API_ENDPOINTS.CONTENT}`,
      NOTIFICATION: `${this.API_BASE_URL}${this.API_ENDPOINTS.NOTIFICATION}`,
      SUBSCRIPTION: `${this.API_BASE_URL}${this.API_ENDPOINTS.SUBSCRIPTION}`,
      STOCK: `${this.API_BASE_URL}${this.API_ENDPOINTS.STOCK}`,
      DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA}`,
      DATA_PAGE: `${this.API_BASE_URL}${this.API_ENDPOINTS.DATA_PAGE}`,
      // Subscription Plan Management URLs
      CREATE_SUBSCRIPTION_PLAN: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_SUBSCRIPTION_PLAN}`,
      UPDATE_SUBSCRIPTION_PLAN: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_SUBSCRIPTION_PLAN}`,
      DELETE_SUBSCRIPTION_PLAN: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_SUBSCRIPTION_PLAN}`,
      GET_SUBSCRIPTION_PLANS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUBSCRIPTION_PLANS}`,
      // Payment History Management URLs
      GET_ALL_PAYMENT_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_PAYMENT_HISTORY}`,
      // User Subscription History Management URLs
      GET_ALL_USERS_SUBSCRIPTION_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_USERS_SUBSCRIPTION_HISTORY}`,
      // Admin Category Management URLs
      CREATE_ADMIN_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_ADMIN_CATEGORY}`,
      UPDATE_ADMIN_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_ADMIN_CATEGORY}`,
      DELETE_ADMIN_CATEGORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_ADMIN_CATEGORY}`,
      GET_ALL_ADMIN_CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_ADMIN_CATEGORIES}`,

      // Support Ticket Management URLs
      GET_ALL_SUPPORT_TICKETS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_SUPPORT_TICKETS}`,
      UPDATE_SUPPORT_TICKET_STATUS: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_SUPPORT_TICKET_STATUS}`,
      DELETE_SUPPORT_TICKET: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_SUPPORT_TICKET}`,
      GET_SUPPORT_TICKET_DETAILS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUPPORT_TICKET_DETAILS}`,
      GET_SUPPORT_TICKET_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUPPORT_TICKET_STATS}`,

      // Notification Management URLs
      CREATE_NOTIFICATION_CAMPAIGN: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_NOTIFICATION_CAMPAIGN}`,
      SEND_NOTIFICATION_CAMPAIGN: `${this.API_BASE_URL}${this.API_ENDPOINTS.SEND_NOTIFICATION_CAMPAIGN}`,
      GET_ALL_NOTIFICATION_CAMPAIGNS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_NOTIFICATION_CAMPAIGNS}`,
      GET_NOTIFICATION_TEMPLATES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_NOTIFICATION_TEMPLATES}`,
      GET_NOTIFICATION_PERFORMANCE_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_NOTIFICATION_PERFORMANCE_STATS}`,
      RUN_SMART_TRIGGERS: `${this.API_BASE_URL}${this.API_ENDPOINTS.RUN_SMART_TRIGGERS}`,
      GET_SMART_TRIGGER_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SMART_TRIGGER_STATS}`,
      UPDATE_DEVICE_TOKEN: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_DEVICE_TOKEN}`,

      // Content Management URLs
      CREATE_BANNER: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_BANNER}`,
      GET_ALL_BANNERS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_BANNERS}`,
      UPDATE_BANNER: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_BANNER}`,
      DELETE_BANNER: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_BANNER}`,
      CREATE_TUTORIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_TUTORIAL}`,
      GET_ALL_TUTORIALS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_TUTORIALS}`,
      UPDATE_TUTORIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_TUTORIAL}`,
      DELETE_TUTORIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_TUTORIAL}`,
      GET_TUTORIAL_ANALYTICS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_TUTORIAL_ANALYTICS}`,
      TRACK_TUTORIAL_VIEW: `${this.API_BASE_URL}${this.API_ENDPOINTS.TRACK_TUTORIAL_VIEW}`,

      // Terms & Conditions Management URLs
      GET_ALL_POLICY_CATEGORIES: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_ALL_POLICY_CATEGORIES}`,
      GET_POLICY_POINTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_POLICY_POINTS}`,
      CREATE_POLICY_POINT: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_POLICY_POINT}`,
      UPDATE_POLICY_POINT: `${this.API_BASE_URL}${this.API_ENDPOINTS.UPDATE_POLICY_POINT}`,
      DELETE_POLICY_POINT: `${this.API_BASE_URL}${this.API_ENDPOINTS.DELETE_POLICY_POINT}`,
      REORDER_POLICY_POINTS: `${this.API_BASE_URL}${this.API_ENDPOINTS.REORDER_POLICY_POINTS}`,
      CREATE_POLICY_VERSION: `${this.API_BASE_URL}${this.API_ENDPOINTS.CREATE_POLICY_VERSION}`,
      GET_POLICY_VERSION_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_POLICY_VERSION_HISTORY}`,
      GET_POLICY_CONTENT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_POLICY_CONTENT}`,
      ACCEPT_POLICY_VERSION: `${this.API_BASE_URL}${this.API_ENDPOINTS.ACCEPT_POLICY_VERSION}`,
      GET_USER_POLICY_ACCEPTANCE: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_POLICY_ACCEPTANCE}`,

      // Refer & Earn System URLs
      GET_REFERRAL_CODE: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_REFERRAL_CODE}`,
      GET_REFERRAL_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_REFERRAL_STATS}`,
      CHECK_FREE_TRIAL_ELIGIBILITY: `${this.API_BASE_URL}${this.API_ENDPOINTS.CHECK_FREE_TRIAL_ELIGIBILITY}`,
      ACTIVATE_FREE_TRIAL: `${this.API_BASE_URL}${this.API_ENDPOINTS.ACTIVATE_FREE_TRIAL}`,
      APPLY_REFERRAL_CODE: `${this.API_BASE_URL}${this.API_ENDPOINTS.APPLY_REFERRAL_CODE}`,
      GET_REFERRAL_ANALYTICS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_REFERRAL_ANALYTICS}`,
      ACTIVATE_PENDING_REWARDS: `${this.API_BASE_URL}${this.API_ENDPOINTS.ACTIVATE_PENDING_REWARDS}`,

      // Manual Upgrade System URLs
      GET_AVAILABLE_PLANS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_AVAILABLE_PLANS}`,
      MANUAL_UPGRADE_USER: `${this.API_BASE_URL}${this.API_ENDPOINTS.MANUAL_UPGRADE_USER}`,
      GET_MANUAL_UPGRADE_HISTORY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_MANUAL_UPGRADE_HISTORY}`,
      GET_MANUAL_UPGRADE_STATS: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_MANUAL_UPGRADE_STATS}`,

      // Admin Report System URLs
      GET_USER_GROWTH_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_GROWTH_REPORT}`,
      GET_USER_ACTIVITY_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_USER_ACTIVITY_REPORT}`,
      GET_SUBSCRIPTION_REVENUE_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_SUBSCRIPTION_REVENUE_REPORT}`,
      GET_BUSINESS_HEALTH_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_BUSINESS_HEALTH_REPORT}`,
      GET_INCOME_EXPENSE_SUMMARY: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_INCOME_EXPENSE_SUMMARY}`,
      GET_EXPENSE_BREAKDOWN: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_EXPENSE_BREAKDOWN}`,
      GET_INCOME_BREAKDOWN: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_INCOME_BREAKDOWN}`,
      GET_COMPREHENSIVE_REPORT: `${this.API_BASE_URL}${this.API_ENDPOINTS.GET_COMPREHENSIVE_REPORT}`,
      EXPORT_REPORT_DATA: `${this.API_BASE_URL}${this.API_ENDPOINTS.EXPORT_REPORT_DATA}`,
    };
  },

  // Utility function to fix image URLs
  fixImageUrl: (imagePath) => {
    if (!imagePath) return '';

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/^\/+/, '');

    if (cleanPath.includes('abc.com') || !cleanPath.includes('/')) {
      const basePath = cleanPath.startsWith('pawnbackend/data/') ? '' : 'pawnbackend/data/';
      return `${config.API_BASE_URL}/${basePath}${cleanPath}`;
    }

    return `/${cleanPath}`;
  },

  // Helper functions for account types
  getAccountTypeLabel: (accountType) => {
    return config.ACCOUNT_TYPE_LABELS[accountType] || 'Unknown';
  },

  getAccountTypeColor: (accountType) => {
    return config.ACCOUNT_TYPE_COLORS[accountType] || 'bg-gray-100 text-gray-800';
  },

  getAccountTypeOptions: () => {
    return Object.entries(config.ACCOUNT_TYPE_LABELS).map(([value, label]) => ({
      value: parseInt(value),
      label: label
    }));
  },

  // Environment settings
  ENVIRONMENT: {
    IS_PRODUCTION: import.meta.env.MODE === 'production',
    IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  },

  // CORS settings
  CORS: {
    WITH_CREDENTIALS: true,
    HEADERS: {
      'Content-Type': 'application/json',
    },
  },

  // Authentication Configuration
  AUTH: {
    TOKEN_KEY: 'auth_token',
    ADMIN_FLAG: 'admin_logged_in',        // Added
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_EXPIRY: '1d',
    STORAGE_TYPE: 'localStorage',         // Added
  },

  // File Upload Configuration
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_IMAGES_PER_PRODUCT: 4,
  },

  // Validation Configuration
  VALIDATION: {
    MIN_PRICE: 0,
    MAX_DESCRIPTION_LENGTH: 1000,
    MIN_NAME_LENGTH: 3,
    MAX_NAME_LENGTH: 100,
  },

  // Error Messages
  ERRORS: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_TOKEN: 'Invalid or expired token',
    INVALID_CREDENTIALS: 'Invalid email or password',
    SERVER_ERROR: 'An error occurred on the server',
    VALIDATION_ERROR: 'Please check your input and try again',
    FILE_TOO_LARGE: 'File size is too large',
    INVALID_FILE_TYPE: 'Invalid file type',
    REQUIRED_FIELDS: 'Please fill in all required fields',
    NETWORK_ERROR: 'Network connection error. Please try again.',
  },
};

export default config;