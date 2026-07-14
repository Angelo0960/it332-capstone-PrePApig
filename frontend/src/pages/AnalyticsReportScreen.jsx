import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, CloudOff, Download, Share, Home, Package, Syringe, DollarSign, FileText, TrendingUp, AlertTriangle, ChevronDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import backgroundImage from "../../src/assets/Gemini_Generated_Image_o4e5bbo4e5bbo4e5.png";

// Growth data
const growthData = [
  { week: 'Week 1', actual: 8, target: 9 },
  { week: 'Week 2', actual: 12, target: 14 },
  { week: 'Week 4', actual: 22, target: 25 },
  { week: 'Week 6', actual: 31, target: 36 },
  { week: 'Week 8', actual: 42, target: 48 },
  { week: 'Week 10', actual: 53, target: 60 },
  { week: 'Week 12', actual: 62, target: 71 },
  { week: 'Week 14', actual: 72, target: 82 },
];

// Feed consumption with forecast
const feedData = [
  { day: 'May 1', actual: 45, forecast: null },
  { day: 'May 3', actual: 48, forecast: null },
  { day: 'May 5', actual: 42, forecast: null },
  { day: 'May 7', actual: 51, forecast: null },
  { day: 'May 9', actual: 47, forecast: null },
  { day: 'May 11', actual: 49, forecast: null },
  { day: 'May 13', actual: 46, forecast: null },
  { day: 'May 15', actual: null, forecast: 48 },
  { day: 'May 17', actual: null, forecast: 50 },
  { day: 'May 19', actual: null, forecast: 47 },
  { day: 'May 21', actual: null, forecast: 49 },
];

// Profit trend
const profitData = [
  { month: 'Dec', profit: 42000 },
  { month: 'Jan', profit: 38000 },
  { month: 'Feb', profit: 51000 },
  { month: 'Mar', profit: 47000 },
  { month: 'Apr', profit: 53000 },
  { month: 'May', profit: 54750 },
];

// Expense breakdown
const expenseData = [
  { name: 'Feeds', value: 25000, color: '#10B981' },
  { name: 'Vaccines', value: 3250, color: '#3B82F6' },
  { name: 'Other', value: 2000, color: '#F59E0B' },
];

export default function AnalyticsReportsScreen() {
  const navigate = useNavigate();
  const [isOnline] = useState(true);
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [selectedBatch, setSelectedBatch] = useState('Batch A');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showBatchDropdown, setShowBatchDropdown] = useState(false);

  return (
    <div className="h-full flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="Farm Background" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Status Bar */}
        <div className="px-4 md:px-8 lg:px-12 pt-3 pb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">10:09</div>
        </div>

        {/* Header */}
        <div className="px-4 md:px-8 lg:px-12 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-gray-700" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">Analytics & Reports</h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all">
                <Download className="w-4 h-4 text-gray-700" />
              </button>
              <div className="relative">
                {isOnline ? (
                  <Cloud className="w-5 h-5 text-green-600" />
                ) : (
                  <CloudOff className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 md:px-8 lg:px-12 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <button
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="w-full px-4 py-2 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl text-sm font-semibold text-gray-900 flex items-center justify-between shadow-lg"
              >
                {dateRange}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showDateDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl overflow-hidden z-20">
                  {['This month', 'Last 30 days', 'Last 90 days', 'Custom range'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setDateRange(option);
                        setShowDateDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-green-100/50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex-1">
              <button
                onClick={() => setShowBatchDropdown(!showBatchDropdown)}
                className="w-full px-4 py-2 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl text-sm font-semibold text-gray-900 flex items-center justify-between shadow-lg"
              >
                {selectedBatch}
                <ChevronDown className="w-4 h-4" />
              </button>
              {showBatchDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white/90 backdrop-blur-xl border border-white/40 rounded-xl shadow-2xl overflow-hidden z-20">
                  {['All Batches', 'Batch A', 'Batch B', 'Batch C'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedBatch(option);
                        setShowBatchDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-green-100/50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 pb-24">
          {/* Alerts Panel */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg mb-4">
            <div className="p-4 border-b border-white/20">
              <h3 className="font-semibold text-gray-900 text-sm">Active Alerts</h3>
            </div>
            <div className="divide-y divide-white/20">
              <div className="p-3 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Batch B: Growth slower than expected</div>
                  <div className="text-xs text-gray-600 mt-0.5">Check feeding schedule</div>
                </div>
              </div>
              <div className="p-3 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Feed stock for Grower Pellet below 50 kg</div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Performance */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Pig Growth Trend (Weight vs. Age)</h3>
            <div className="bg-white/40 rounded-xl p-3 mb-3">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} name="Actual" />
                  <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-orange-100/60 backdrop-blur-lg border border-orange-300/50 rounded-xl p-3 mb-3">
              <div className="text-xs text-orange-800 font-medium">Growth rate is 15% below target. Consider reviewing feed quality or health.</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              <div className="bg-white/40 rounded-lg p-2">
                <div className="text-xs text-gray-600">ADG</div>
                <div className="text-lg font-bold text-gray-900">0.65 kg</div>
              </div>
              <div className="bg-white/40 rounded-lg p-2">
                <div className="text-xs text-gray-600">Current</div>
                <div className="text-lg font-bold text-gray-900">72 kg</div>
              </div>
              <div className="bg-white/40 rounded-lg p-2">
                <div className="text-xs text-gray-600">Remaining</div>
                <div className="text-lg font-bold text-gray-900">4 wks</div>
              </div>
            </div>
          </div>

          {/* Feed Consumption & Forecast */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Feed Consumption & Forecast</h3>
            <div className="bg-white/40 rounded-xl p-3 mb-3">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={feedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 3 }} name="Actual" />
                  <Line type="monotone" dataKey="forecast" stroke="#06B6D4" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#06B6D4', r: 3 }} name="Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-blue-100/60 backdrop-blur-lg border border-blue-300/50 rounded-xl p-3 mb-3">
              <div className="text-xs text-blue-800 font-medium">Feed consumption increasing as expected. Forecast: 320 kg needed next week.</div>
            </div>
            <div className="bg-orange-100/60 backdrop-blur-lg border border-orange-300/50 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-orange-800 font-medium">Feed stock may run out in 5 days. Reorder soon.</div>
              </div>
            </div>
          </div>

          {/* Feed Efficiency */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Feed Efficiency</h3>
            <div className="bg-white/40 rounded-xl p-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Feed Conversion Ratio</div>
              <div className="text-4xl font-bold text-green-600">2.8</div>
              <div className="text-xs text-gray-600 mt-1">Good (Target: &lt; 3.0)</div>
            </div>
          </div>

          {/* Profit Analysis */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Profit Summary (This Period)</h3>

            {/* Revenue & Expenses */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Revenue from Sales</span>
                <span className="font-bold text-green-600">₱85,000</span>
              </div>
              <div className="border-t border-white/30 pt-2">
                <div className="text-xs text-gray-600 mb-2">Expenses:</div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 ml-2">Feeds</span>
                  <span className="text-gray-900">₱25,000</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 ml-2">Vaccines</span>
                  <span className="text-gray-900">₱3,250</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 ml-2">Other</span>
                  <span className="text-gray-900">₱2,000</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold border-t border-white/30 pt-2 mt-2">
                  <span className="text-gray-900">Total Expenses</span>
                  <span className="text-red-600">₱30,250</span>
                </div>
              </div>
              <div className="flex items-center justify-between bg-green-100/60 rounded-lg p-3 mt-3">
                <span className="font-bold text-gray-900">Net Profit</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">₱54,750</div>
                  <span className="px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-semibold">64% margin</span>
                </div>
              </div>
            </div>

            {/* Expense Breakdown Chart */}
            <div className="bg-white/40 rounded-xl p-3 mb-3">
              <div className="text-sm font-semibold text-gray-900 mb-2">Expense Breakdown</div>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="40%" height={120}>
                  <PieChart>
                    <Pie data={expenseData} dataKey="value" cx="50%" cy="50%" innerRadius={25} outerRadius={45}>
                      {expenseData.map((entry) => (
                        <Cell key={`pie-${entry.name}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {expenseData.map((item) => (
                    <div key={`legend-${item.name}`} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <div className="text-xs text-gray-700 flex-1">{item.name}</div>
                      <div className="text-xs font-semibold text-gray-900">
                        {Math.round((item.value / 30250) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profit Trend */}
            <div className="bg-white/40 rounded-xl p-3">
              <div className="text-sm font-semibold text-gray-900 mb-2">6-Month Profit Trend</div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#10B981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Generate Reports */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg mb-4">
            <div className="p-4 border-b border-white/20">
              <h3 className="font-semibold text-gray-900">Generate Reports</h3>
            </div>
            <div className="divide-y divide-white/20">
              {[
                { name: 'Growth Performance Report', desc: 'Weight progression, ADG, trends' },
                { name: 'Feed Consumption Report', desc: 'Daily intake, forecast, usage' },
                { name: 'Vaccination Report', desc: 'Vaccines by batch, dates, costs' },
                { name: 'Profit & Loss Statement', desc: 'Income vs expenses, margins' },
              ].map((report) => (
                <div key={report.name} className="p-4 flex items-center justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{report.name}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{report.desc}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-semibold shadow-lg active:scale-95 transition-transform">
                      View
                    </button>
                    <button className="w-8 h-8 bg-white/30 backdrop-blur-lg rounded-lg flex items-center justify-center active:scale-95 transition-transform">
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg mb-4">
            <div className="p-4 border-b border-white/20">
              <h3 className="font-semibold text-gray-900">Recent Reports</h3>
            </div>
            <div className="divide-y divide-white/20">
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Growth_Report_BatchA_May2026.pdf</div>
                  <div className="text-xs text-gray-600 mt-0.5">May 10, 2026</div>
                </div>
                <button className="w-8 h-8 bg-white/30 backdrop-blur-lg rounded-lg flex items-center justify-center active:scale-95 transition-transform">
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Feed_Consumption_Q2_2026.csv</div>
                  <div className="text-xs text-gray-600 mt-0.5">May 1, 2026</div>
                </div>
                <button className="w-8 h-8 bg-white/30 backdrop-blur-lg rounded-lg flex items-center justify-center active:scale-95 transition-transform">
                  <Download className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Fixed */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30 px-4 md:px-8 lg:px-12 py-3 shadow-2xl">
          <div className="flex items-center justify-around md:justify-center md:gap-8 lg:gap-16">
            <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <Home className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-xs text-gray-600">Home</span>
            </button>

            <button onClick={() => navigate('/feeds')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs text-gray-600">Feeds</span>
            </button>

            <button onClick={() => navigate('/vaccination')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <Syringe className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-xs text-gray-600">Vaccination</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(34,197,94,0.3),-6px_-6px_12px_rgba(134,239,172,0.5)] active:shadow-[inset_3px_3px_6px_rgba(21,128,61,0.4),inset_-3px_-3px_6px_rgba(187,247,208,0.4)] transition-all">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-600">Reports</span>
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/30 rounded-full"></div>
      </div>
    </div>
  );
}

