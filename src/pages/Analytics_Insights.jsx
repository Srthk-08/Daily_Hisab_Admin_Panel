// File: src/pages/Analytics_Insights.jsx
import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Filter, Save, PlusCircle, Target, TrendingUp, Users, RefreshCw, AlertCircle } from "lucide-react";
import apiService from "../services/api";

// const featureUsageData = [
//   { feature: "Voice Entry", usage: 320 },
//   { feature: "Exports", usage: 210 },
//   { feature: "Reports", usage: 150 },
//   { feature: "Consultings", usage: 95 },
// ];

const dailyVsMonthly = [
  { period: "Day 1", daily: 120, monthly: 450 },
  { period: "Day 2", daily: 90, monthly: 470 },
  { period: "Day 3", daily: 140, monthly: 490 },
  { period: "Day 4", daily: 110, monthly: 460 },
];

const regionData = [
  { region: "Karnatak", users: 400 },
  { region: "Delhi", users: 300 },
  { region: "Odisha", users: 200 },
  { region: "West Bengal", users: 150 },
  { region: "Other", users: 100 },
];

const acquisitionData = [
  { channel: "Google Ads", users: 350 },
  { channel: "Referrals", users: 250 },
  { channel: "Organic", users: 180 },
  { channel: "Social Media", users: 120 },
];

const funnelData = [
  { stage: "Installs", count: 1000 },
  { stage: "Active", count: 600 },
  { stage: "Paid", count: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9A60B4"];

export default function AnalyticsInsights() {
  const [customReports, setCustomReports] = useState([]);
  const [newReport, setNewReport] = useState("");

  // Performance tracking state
  const [performanceData, setPerformanceData] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [performanceError, setPerformanceError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format

  // Fetch performance bar graph data
  const fetchPerformanceData = async () => {
    try {
      setPerformanceLoading(true);
      setPerformanceError(null);
      const response = await apiService.getPerformanceBarGraphData({
        month_year: selectedMonth,
        limit: 50
      });
      if (response.success) {
        setPerformanceData(response.data);
      } else {
        setPerformanceError('Failed to fetch performance data');
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      setPerformanceError('Error loading performance data');
    } finally {
      setPerformanceLoading(false);
    }
  };

  // Load performance data on component mount and when month changes
  useEffect(() => {
    fetchPerformanceData();
  }, [selectedMonth]); // eslint-disable-line react-hooks/exhaustive-deps

  // eslint-disable-next-line no-unused-vars
  const handleSaveReport = () => {
    if (newReport.trim()) {
      setCustomReports([...customReports, newReport]);
      setNewReport("");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics & Insights</h1>

      {/* Performance Tracking - 8 Key Parameters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
              <Target className="w-6 h-6 text-indigo-600" />
              Performance Tracking 
            </h2>
            <p className="text-gray-600">User performance analysis across key financial health metrics</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={fetchPerformanceData}
              disabled={performanceLoading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${performanceLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {performanceLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-lg text-gray-600">Loading performance data...</span>
            </div>
          </div>
        ) : performanceError ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Performance Data</h3>
              <p className="text-gray-600 mb-4">{performanceError}</p>
              <button
                onClick={fetchPerformanceData}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : performanceData ? (
          <>
            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {performanceData.total_users?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-indigo-500">Analyzed users</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {performanceData.average_total_score?.toFixed(1) || '0'}/100
                </p>
                <p className="text-xs text-green-500">Overall performance</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Excellent Users</p>
                <p className="text-2xl font-bold text-blue-600">
                  {performanceData.performance_distribution?.excellent || '0'}
                </p>
                <p className="text-xs text-blue-500">80-100 points</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">Good Users</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {performanceData.performance_distribution?.good || '0'}
                </p>
                <p className="text-xs text-yellow-500">60-79 points</p>
              </div>
            </div>

            {/* Chart Title and Month Info */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {performanceData.chart_title || 'Performance Analysis'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>📅 Month: {performanceData.month_year || selectedMonth}</span>
              </div>
            </div>

            {/* 8 Key Parameters Bar Chart */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Graph</h3>
              <ResponsiveContainer width="100%" height={450}>
                <BarChart data={performanceData.parameter_performance || []} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="parameter"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                    fontSize={12}
                  />
                  <YAxis
                    label={{ value: 'Performance %', angle: -90, position: 'insideLeft' }}
                    domain={[0, 100]}
                    fontSize={12}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-800 mb-2">{label}</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Performance:</span> {data.performance_percentage}%</p>
                              <p><span className="font-medium">Average Score:</span> {data.average_score}/{data.max_score}</p>
                              <p><span className="font-medium">Weight:</span> {data.weight}</p>
                              <p><span className="font-medium">Description:</span> {data.description}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="performance_percentage"
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                    name="Performance %"
                  >
                    {performanceData.parameter_performance?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#4F46E5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Distribution */}
            {performanceData.performance_distribution && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Performance Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {performanceData.performance_distribution.excellent || 0}
                    </div>
                    <div className="text-sm text-green-700 font-medium">Excellent</div>
                    <div className="text-xs text-green-600">80-100 points</div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((performanceData.performance_distribution.excellent || 0) / (performanceData.total_users || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {performanceData.performance_distribution.good || 0}
                    </div>
                    <div className="text-sm text-yellow-700 font-medium">Good</div>
                    <div className="text-xs text-yellow-600">60-79 points</div>
                    <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((performanceData.performance_distribution.good || 0) / (performanceData.total_users || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {performanceData.performance_distribution.fair || 0}
                    </div>
                    <div className="text-sm text-orange-700 font-medium">Fair</div>
                    <div className="text-xs text-orange-600">40-59 points</div>
                    <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((performanceData.performance_distribution.fair || 0) / (performanceData.total_users || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {performanceData.performance_distribution.poor || 0}
                    </div>
                    <div className="text-sm text-red-700 font-medium">Poor</div>
                    <div className="text-xs text-red-600">0-39 points</div>
                    <div className="w-full bg-red-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${((performanceData.performance_distribution.poor || 0) / (performanceData.total_users || 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers */}
            {performanceData.top_performers && performanceData.top_performers.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Top Performers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {performanceData.top_performers.slice(0, 6).map((performer, index) => (
                    <div key={performer.user_id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                          </div>
                          <span className="font-medium text-gray-900">
                            {performer.user_name || `User ${performer.user_id}`}
                          </span>
                        </div>
                        <span className="text-lg font-bold text-indigo-600">
                          {performer.total_score?.toFixed(1) || '0'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {performer.performance_grade || 'N/A'} Performance
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Insights */}
            {performanceData.insights && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {performanceData.insights.best_performing_parameter && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Best Performing Parameter</span>
                      </div>
                      <p className="text-green-700 font-semibold capitalize">
                        {performanceData.insights.best_performing_parameter.parameter?.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-green-600">
                        Average Score: {performanceData.insights.best_performing_parameter.average_score}
                      </p>
                    </div>
                  )}

                  {performanceData.insights.worst_performing_parameter && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">Needs Improvement</span>
                      </div>
                      <p className="text-red-700 font-semibold capitalize">
                        {performanceData.insights.worst_performing_parameter.parameter?.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-red-600">
                        Average Score: {performanceData.insights.worst_performing_parameter.average_score}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Performance Data</h3>
              <p className="text-gray-600">No performance data available for the selected month.</p>
            </div>
          </div>
        )}
      </div>

      {/* Feature Usage */}
      {/* <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Feature Usage Statistics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={featureUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      {/* Daily vs Monthly Usage */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Daily vs Monthly Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyVsMonthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="daily" stroke="#00C49F" />
            <Line type="monotone" dataKey="monthly" stroke="#FF8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Region / Language Activity */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Most Active Regions</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={regionData}
              dataKey="users"
              nameKey="region"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {regionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Acquisition Channels */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Top Acquisition Channels</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={acquisitionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="channel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#9A60B4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Conversion Funnel</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={funnelData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="stage" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Reports */}
      {/* <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">📌 Custom Reports</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter report name"
            value={newReport}
            onChange={(e) => setNewReport(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleSaveReport}
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-600"
          >
            <Save size={16} /> Save
          </button>
        </div>
        {customReports.length > 0 && (
          <ul className="list-disc list-inside text-gray-700">
            {customReports.map((report, idx) => (
              <li key={idx}>{report}</li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}
