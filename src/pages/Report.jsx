import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Users,
  UserCheck,
  UserX,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Calendar,
  Filter,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import apiService from "../services/api";

const COLORS = ["#4ade80", "#60a5fa", "#f87171", "#facc15", "#a78bfa"];

export default function Report() {
  // State for all report data
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userActivityData, setUserActivityData] = useState([]);
  const [subscriptionRevenueData, setSubscriptionRevenueData] = useState([]);
  const [businessHealthData, setBusinessHealthData] = useState([]);
  const [incomeExpenseData, setIncomeExpenseData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  // State for summaries
  const [userGrowthSummary, setUserGrowthSummary] = useState({});
  const [subscriptionRevenueSummary, setSubscriptionRevenueSummary] = useState({});
  const [businessHealthSummary, setBusinessHealthSummary] = useState({});

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // State for filters
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [summaryPeriod, setSummaryPeriod] = useState("monthly");
  const [customDateRange, setCustomDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  // State for credit score (simulated)
  const [creditScore, setCreditScore] = useState(0);

  // Fetch all report data
  const fetchAllReports = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use comprehensive report for better performance
      const comprehensiveData = await apiService.getComprehensiveReport({
        period: selectedPeriod
      });

      if (comprehensiveData.success) {
        const data = comprehensiveData.data;

        // Set user growth data
        setUserGrowthData(data.userGrowth?.userGrowthData || []);
        setUserGrowthSummary(data.userGrowth?.summary || {});

        // Set user activity data
        setUserActivityData(data.userActivity?.userActivityData || []);

        // Set subscription revenue data
        setSubscriptionRevenueData(data.subscriptionRevenue?.subscriptionRevenueData || []);
        setSubscriptionRevenueSummary(data.subscriptionRevenue?.summary || {});

        // Set business health data
        setBusinessHealthData(data.businessHealth?.businessHealthData || []);
        setBusinessHealthSummary(data.businessHealth?.summary || {});

        // Set income expense data
        setIncomeExpenseData(data.incomeExpense?.summaryData || []);

        // Set expense breakdown
        setExpenseData(data.expenseBreakdown?.expenseData || []);

        // Set income breakdown
        setIncomeData(data.incomeBreakdown?.incomeData || []);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual reports (fallback) - currently unused but kept for future use
  // eslint-disable-next-line no-unused-vars
  const fetchIndividualReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = selectedPeriod === 'custom'
        ? {
          period: 'custom',
          start_date: customDateRange.startDate,
          end_date: customDateRange.endDate
        }
        : { period: selectedPeriod };

      const [
        userGrowthResponse,
        userActivityResponse,
        subscriptionRevenueResponse,
        businessHealthResponse,
        incomeExpenseResponse,
        expenseBreakdownResponse,
        incomeBreakdownResponse
      ] = await Promise.all([
        apiService.getUserGrowthReport(params),
        apiService.getUserActivityReport(),
        apiService.getSubscriptionRevenueReport(params),
        apiService.getBusinessHealthReport(),
        apiService.getIncomeExpenseSummary({ period: summaryPeriod }),
        apiService.getExpenseBreakdown(),
        apiService.getIncomeBreakdown({ period: summaryPeriod })
      ]);

      // Set user growth data
      if (userGrowthResponse.success) {
        setUserGrowthData(userGrowthResponse.data.userGrowthData || []);
        setUserGrowthSummary(userGrowthResponse.data.summary || {});
      }

      // Set user activity data
      if (userActivityResponse.success) {
        setUserActivityData(userActivityResponse.data.userActivityData || []);
      }

      // Set subscription revenue data
      if (subscriptionRevenueResponse.success) {
        setSubscriptionRevenueData(subscriptionRevenueResponse.data.subscriptionRevenueData || []);
        setSubscriptionRevenueSummary(subscriptionRevenueResponse.data.summary || {});
      }

      // Set business health data
      if (businessHealthResponse.success) {
        setBusinessHealthData(businessHealthResponse.data.businessHealthData || []);
        setBusinessHealthSummary(businessHealthResponse.data.summary || {});
      }

      // Set income expense data
      if (incomeExpenseResponse.success) {
        setIncomeExpenseData(incomeExpenseResponse.data.summaryData || []);
      }

      // Set expense breakdown
      if (expenseBreakdownResponse.success) {
        setExpenseData(expenseBreakdownResponse.data.expenseData || []);
      }

      // Set income breakdown
      if (incomeBreakdownResponse.success) {
        setIncomeData(incomeBreakdownResponse.data.incomeData || []);
      }

    } catch (err) {
      console.error('Error fetching individual reports:', err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAllReports();
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Export data
  const handleExportData = async (reportType) => {
    try {
      const params = selectedPeriod === 'custom'
        ? {
          reportType,
          period: 'custom',
          start_date: customDateRange.startDate,
          end_date: customDateRange.endDate
        }
        : { reportType, period: selectedPeriod };

      const response = await apiService.exportReportData(params);

      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data. Please try again.');
    }
  };

  // Export all data
  const exportAllData = async () => {
    const reportTypes = [
      'userGrowth',
      'userActivity',
      'subscriptionRevenue',
      'businessHealth',
      'incomeExpense'
    ];

    for (const reportType of reportTypes) {
      await handleExportData(reportType);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Handle custom date range
  const handleCustomDateChange = (field, value) => {
    setCustomDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchAllReports();
  }, [selectedPeriod, summaryPeriod, customDateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  // Simulate credit score calculation
  useEffect(() => {
    if (businessHealthSummary.overallScore) {
      setCreditScore(businessHealthSummary.overallScore);
    } else {
      setCreditScore(Math.floor(Math.random() * 101));
    }
  }, [businessHealthSummary]);

  // Get health icon
  const getHealthIcon = (status) => {
    switch (status) {
      case "Strong": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Average": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "Poor": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  // Loading component
  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading report data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Reports</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Reports</h1>
          <p className="text-gray-600">Comprehensive analytics and insights</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Period Selection */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="6months">Last 6 Months</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {selectedPeriod === 'custom' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="End Date"
              />
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {/* Export Button */}
          <button
            onClick={exportAllData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </div>

      {/* User Growth Report */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> User Growth Report
          </h3>
          <button
            onClick={() => handleExportData('userGrowth')}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">New Users (This Month)</p>
            <p className="text-2xl font-bold text-green-600">
              {userGrowthSummary.newUsersThisMonth?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-green-500">
              {userGrowthSummary.growthRate || '+0%'} from last month
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-blue-600">
              {userGrowthSummary.totalUsers?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-blue-500">
              {userGrowthSummary.growthRate || '+0%'} growth rate
            </p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Churn Rate</p>
            <p className="text-2xl font-bold text-red-600">
              {userGrowthSummary.churnRate || '0'}%
            </p>
            <p className="text-xs text-red-500">
              {userGrowthSummary.churnChange || '0'} from last month
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Net Growth</p>
            <p className="text-2xl font-bold text-purple-600">
              {userGrowthSummary.netGrowth?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-purple-500">Users this month</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="totalUsers" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Total Users" />
            <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#4ade80" fill="#4ade80" name="New Users" />
            <Line type="monotone" dataKey="churn" stroke="#f87171" strokeWidth={2} name="Churn" />
            <Legend className="mt-10" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Active vs Inactive Users */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-600" /> Active vs Inactive Users
          </h3>
          <button
            onClick={() => handleExportData('userActivity')}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userActivityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage, value }) =>
                    `${name}: ${value?.toLocaleString() || 0} (${percentage || 0}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userActivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {userActivityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  {item.name.includes('Active') ?
                    <UserCheck className="w-6 h-6" style={{ color: item.color }} /> :
                    <UserX className="w-6 h-6" style={{ color: item.color }} />
                  }
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: item.color }}>
                    {item.value?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.percentage || 0}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subscription Revenue Report */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" /> Subscription Revenue Report
          </h3>
          <button
            onClick={() => handleExportData('subscriptionRevenue')}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Starter Revenue</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{subscriptionRevenueSummary.starterRevenue?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-blue-500">
              {subscriptionRevenueSummary.starterGrowth || '+0%'} from last month
            </p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Premium Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{subscriptionRevenueSummary.premiumRevenue?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-green-500">
              {subscriptionRevenueSummary.premiumGrowth || '+0%'} from last month
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">
              ₹{subscriptionRevenueSummary.totalRevenue?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-purple-500">This period</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subscriptionRevenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="starter" fill="#3b82f6" name="Starter" />
            <Bar dataKey="premium" fill="#4ade80" name="Premium" />
            <Bar dataKey="lifetime" fill="#a78bfa" name="Lifetime" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Business Health Distribution */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" /> Business Health Distribution
          </h3>
          <button
            onClick={() => handleExportData('businessHealth')}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessHealthData.map((item) => (
            <div key={item.category} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.category}</span>
                {getHealthIcon(item.status)}
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: item.color
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium" style={{ color: item.color }}>
                  {item.status}
                </span>
                <span className="text-gray-600">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Income vs Expense Summary */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Income vs Expense Summary</h3>
          <div className="flex gap-2">
            {["daily", "weekly", "monthly"].map((period) => (
              <button
                key={period}
                onClick={() => setSummaryPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${summaryPeriod === period
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {period}
              </button>
            ))}
            <button
              onClick={() => handleExportData('incomeExpense')}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={incomeExpenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#4ade80" strokeWidth={3} name="Income" />
            <Line type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} name="Expense" />
            <Line type="monotone" dataKey="profit" stroke="#a78bfa" strokeWidth={3} name="Profit" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expenses */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <PieChartIcon /> Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incomes */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <PieChartIcon /> Income Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Credit Score */}
      <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Business Credit Score</h3>
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="#4ade80"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(creditScore / 100) * 377} 377`}
              strokeLinecap="round"
              transform="rotate(-90 64 64)"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
            {creditScore}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Overall Business Health</p>
      </div>
    </div>
  );
}