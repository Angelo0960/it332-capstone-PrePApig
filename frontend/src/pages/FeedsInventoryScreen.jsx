import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, CloudOff, Check, Package, Syringe, DollarSign, TrendingUp, Plus, Home, X, AlertTriangle, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import backgroundImage from "../../src/assets/Gemini_Generated_Image_o4e5bbo4e5bbo4e5.png";

// Feed consumption data with forecast
const consumptionData = [
  { date: 'May 1', actual: 45, forecast: null },
  { date: 'May 3', actual: 48, forecast: null },
  { date: 'May 5', actual: 42, forecast: null },
  { date: 'May 7', actual: 51, forecast: null },
  { date: 'May 9', actual: 47, forecast: null },
  { date: 'May 11', actual: 49, forecast: null },
  { date: 'May 13', actual: 46, forecast: null },
  { date: 'May 15', actual: null, forecast: 48 },
  { date: 'May 17', actual: null, forecast: 50 },
  { date: 'May 19', actual: null, forecast: 47 },
  { date: 'May 21', actual: null, forecast: 49 },
];

// Determine feed type based on pig age (days)
const getFeedTypeForAge = (day) => {
  if (day <= 21) return 'starter';
  if (day <= 49) return 'grower';
  return 'finisher';
};

// Get display name for feed type
const getFeedTypeName = (feedType) => {
  const names = {
    starter: 'Starter Mash',
    grower: 'Grower Pellet',
    finisher: 'Finisher'
  };
  return names[feedType];
};

// Calculate days until feed change
const getDaysUntilFeedChange = (day) => {
  if (day <= 21) return 22 - day;
  if (day <= 49) return 50 - day;
  return null;
};

// Calculate daily feed requirement per pig based on age (kg/pig/day)
const getDailyFeedPerPig = (day) => {
  if (day <= 7) return 0.3;
  if (day <= 14) return 0.5;
  if (day <= 21) return 0.8;
  if (day <= 35) return 1.5;
  if (day <= 49) return 2.2;
  return 2.8;
};

export default function FeedsInventoryScreen() {
  const navigate = useNavigate();

  const [isOnline] = useState(true);
  const [pendingSync] = useState(2);
  const [showRecordUsage, setShowRecordUsage] = useState(false);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [showEditPrice, setShowEditPrice] = useState(false);
  const [editingFeed, setEditingFeed] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');

  // Mock batch data - in production, this would come from props or global state
  const batches = [
    { id: 'A', name: 'Batch A', day: 34, pigCount: 12 },
    { id: 'B', name: 'Batch B', day: 21, pigCount: 8 },
    { id: 'C', name: 'Batch C', day: 48, pigCount: 15 },
  ];

  // Feed stock state
  const [feedStocks, setFeedStocks] = useState([
    { type: 'Starter Mash', price: 29.00, stock: 48, lastUpdated: 'May 5, 2026' },
    { type: 'Grower Pellet', price: 28.50, stock: 245, lastUpdated: 'May 1, 2026' },
    { type: 'Finisher', price: 27.00, stock: 120, lastUpdated: 'Apr 28, 2026' },
  ]);

  // Feed records per batch
  const [feedRecords, setFeedRecords] = useState([
    { id: '1', batchId: 'A', batchName: 'Batch A', feedType: 'Grower Pellet', amount: 48, date: 'May 11, 2026', notes: 'Regular feeding' },
    { id: '2', batchId: 'B', batchName: 'Batch B', feedType: 'Starter Mash', amount: 32, date: 'May 10, 2026' },
    { id: '3', batchId: 'A', batchName: 'Batch A', feedType: 'Grower Pellet', amount: 45, date: 'May 9, 2026' },
    { id: '4', batchId: 'C', batchName: 'Batch C', feedType: 'Grower Pellet', amount: 60, date: 'May 8, 2026' },
  ]);

  const handleEditPrice = (feedType, currentPrice) => {
    setEditingFeed(feedType);
    setNewPrice(currentPrice.toString());
    setShowEditPrice(true);
  };

  const handleSavePrice = () => {
    if (editingFeed && newPrice) {
      setFeedStocks(feedStocks.map(feed =>
        feed.type === editingFeed
          ? { ...feed, price: parseFloat(newPrice), lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
          : feed
      ));
      setShowEditPrice(false);
      setEditingFeed(null);
      setNewPrice('');
    }
  };

  const [usageForm, setUsageForm] = useState({
    batch: '',
    feedType: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleSaveFeedUsage = () => {
    if (usageForm.batch && usageForm.feedType && usageForm.amount) {
      const batch = batches.find(b => b.id === usageForm.batch);
      const feedTypeName = usageForm.feedType === 'starter' ? 'Starter Mash' :
                          usageForm.feedType === 'grower' ? 'Grower Pellet' : 'Finisher';

      const newRecord = {
        id: Date.now().toString(),
        batchId: usageForm.batch,
        batchName: batch?.name || '',
        feedType: feedTypeName,
        amount: parseFloat(usageForm.amount),
        date: new Date(usageForm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        notes: usageForm.notes,
      };

      setFeedRecords([newRecord, ...feedRecords]);

      setFeedStocks(feedStocks.map(feed =>
        feed.type === feedTypeName
          ? { ...feed, stock: feed.stock - parseFloat(usageForm.amount) }
          : feed
      ));

      setShowRecordUsage(false);
      setUsageForm({ batch: '', feedType: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });
    }
  };

  // Calculate batch-specific feed expenses
  const calculateBatchFeedExpense = (batchId) => {
    return feedRecords
      .filter(record => batchId === 'all' ? true : record.batchId === batchId)
      .reduce((total, record) => {
        const feedStock = feedStocks.find(f => f.type === record.feedType);
        return total + (record.amount * (feedStock?.price || 0));
      }, 0);
  };

  // Filter records by selected batch
  const filteredRecords = selectedBatch === 'all'
    ? feedRecords
    : feedRecords.filter(r => r.batchId === selectedBatch);

  const selectedBatchData = batches.find(b => b.id === selectedBatch);
  const batchExpense = calculateBatchFeedExpense(selectedBatch);

  const [purchaseForm, setPurchaseForm] = useState({
    feedType: '',
    quantity: '',
    unitCost: '',
    date: new Date().toISOString().split('T')[0],
  });

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={backgroundImage} alt="Farm Background" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">
        {/* Status Bar */}
        <div className="px-4 md:px-8 lg:px-12 pt-3 pb-2 flex items-center justify-between">
          <div className="text-sm font-semibold">10:09</div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 border border-black/70 rounded-sm">
              <div className="w-2 h-full bg-black/70"></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="px-4 md:px-8 lg:px-12 pt-2 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-9 h-9 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Feeds Inventory</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all">
              {isOnline ? (
                <>
                  <Cloud className="w-5 h-5 text-green-600" />
                  <Check className="w-3 h-3 text-green-600 absolute top-0 right-0" />
                </>
              ) : (
                <CloudOff className="w-5 h-5 text-gray-500" />
              )}
              {pendingSync > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingSync}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Batch Selector */}
        <div className="px-4 md:px-8 lg:px-12 mb-4">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-3 shadow-lg">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedBatch('all')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  selectedBatch === 'all'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                    : 'bg-white/30 text-gray-700'
                }`}
              >
                All Batches
              </button>
              {batches.map((batch) => (
                <button
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch.id)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    selectedBatch === batch.id
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                      : 'bg-white/30 text-gray-700'
                  }`}
                >
                  {batch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-4 md:px-8 lg:px-12 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Current Feed Stock Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-emerald-100/80 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-xs text-gray-700 font-semibold">Current Stock</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">245 kg left</div>
              <div className="text-xs text-gray-600 mb-3">30% of capacity</div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            {/* Feed Expense Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100/80 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xs text-gray-700 font-semibold">
                  {selectedBatch === 'all' ? 'All Batches' : selectedBatchData?.name}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₱{batchExpense.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-gray-600">
                {selectedBatch === 'all' ? 'Total feed expenses' : 'Feed expenses for this batch'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 pb-24">
          <div className="space-y-4">
            {/* Feed Stock by Type Table */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-white/20">
                <h3 className="font-semibold text-gray-900">Feed Stock by Type</h3>
              </div>
              <div className="divide-y divide-white/20">
                {feedStocks.map((feed) => (
                  <div
                    key={feed.type}
                    className={`p-4 flex items-center justify-between ${
                      feed.stock < 50 ? 'bg-orange-50/40' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{feed.type}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">
                          ₱{feed.price.toFixed(2)}/kg · {feed.lastUpdated}
                        </span>
                        <button
                          onClick={() => handleEditPrice(feed.type, feed.price)}
                          className="w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/60 transition-all"
                        >
                          <Edit className="w-3 h-3 text-gray-700" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${feed.stock < 50 ? 'text-orange-600' : 'text-emerald-600'}`}>
                        {feed.stock} kg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <button
                onClick={() => setShowRecordUsage(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 rounded-xl shadow-[6px_6px_12px_rgba(16,185,129,0.3),-6px_-6px_12px_rgba(255,255,255,0.5)] active:shadow-[inset_3px_3px_6px_rgba(5,150,105,0.4),inset_-3px_-3px_6px_rgba(110,231,183,0.4)] transition-all"
              >
                Record Feed Usage
              </button>
              <button
                onClick={() => setShowAddPurchase(true)}
                className="bg-white/30 backdrop-blur-lg border border-white/40 text-emerald-700 font-bold py-3 rounded-xl shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all"
              >
                Add Feed Purchase
              </button>
            </div>

            {/* Feed Consumption & Forecast Chart */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Feed Consumption & Forecast</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={consumptionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fill: '#4B5563', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} label={{ value: 'kg', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '12px',
                      color: '#1F2937',
                    }}
                  />
                  <Line
                    key="actual-line"
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: '#10B981', r: 4 }}
                    connectNulls={false}
                  />
                  <Line
                    key="forecast-line"
                    type="monotone"
                    dataKey="forecast"
                    stroke="#14B8A6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#14B8A6', r: 3 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-600 text-center mt-2">Forecast based on historical data (TensorFlow.js)</p>
            </div>

            {/* Automated Feed Schedules */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">
                  Automated Feeding Schedule
                  {selectedBatch !== 'all' && ` - ${selectedBatchData?.name}`}
                </h3>
                <div className="px-2 py-1 bg-green-100/80 border border-green-300/50 rounded-full text-xs text-green-700 font-semibold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  Auto
                </div>
              </div>
              <div className="space-y-3">
                {batches
                  .filter(batch => selectedBatch === 'all' ? true : batch.id === selectedBatch)
                  .map((batch, index) => {
                  const feedType = getFeedTypeForAge(batch.day);
                  const feedName = getFeedTypeName(feedType);
                  const dailyAmount = Math.round(getDailyFeedPerPig(batch.day) * batch.pigCount);
                  const daysUntilChange = getDaysUntilFeedChange(batch.day);
                  const scheduleTime = index === 0 ? 'Today, 5:00 PM' : index === 1 ? 'Tomorrow, 7:00 AM' : 'Tomorrow, 6:00 PM';
                  const status = index === 0 ? 'pending' : 'scheduled';

                  return (
                    <div key={batch.id} className="bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm">{batch.name} – Day {batch.day}</div>
                          <div className="text-xs text-gray-600 mt-1">Next feeding: {scheduleTime}</div>
                          <div className="text-xs text-gray-600">{feedName}, {dailyAmount} kg</div>
                          {daysUntilChange !== null && daysUntilChange <= 5 && (
                            <div className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                              <span>🔄</span>
                              Feed change in {daysUntilChange} day{daysUntilChange !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 ${
                          status === 'pending'
                            ? 'bg-yellow-100/80 border border-yellow-300/50 text-yellow-700'
                            : 'bg-blue-100/80 border border-blue-300/50 text-blue-700'
                        } rounded-full text-xs font-semibold`}>
                          {status === 'pending' ? 'Pending' : 'Scheduled'}
                        </span>
                      </div>
                      {status === 'pending' && (
                        <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold py-2 rounded-lg shadow-lg active:scale-95 transition-all">
                          Mark as Done
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-blue-50/40 rounded-xl border border-blue-200/50">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 text-sm">ℹ️</div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-900 font-medium">Feed types auto-adjust by age:</p>
                    <ul className="text-xs text-blue-800 mt-1 space-y-0.5 ml-2">
                      <li>• Days 1-21: Starter Mash</li>
                      <li>• Days 22-49: Grower Pellet</li>
                      <li>• Days 50+: Finisher</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Consumption History by Batch */}
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-white/20">
                <h3 className="font-semibold text-gray-900">
                  Feed Consumption History
                  {selectedBatch !== 'all' && ` - ${selectedBatchData?.name}`}
                </h3>
              </div>
              <div className="divide-y divide-white/20">
                {filteredRecords.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No feed records for this batch yet
                  </div>
                ) : (
                  filteredRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{record.batchName}</div>
                        <div className="text-xs text-gray-700 mt-1">{record.feedType} · {record.amount} kg</div>
                        <div className="text-xs text-gray-500 mt-1">{record.date}</div>
                        {record.notes && (
                          <div className="text-xs text-gray-600 mt-1 italic">"{record.notes}"</div>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-green-100/80 border border-green-300/50 rounded-full text-xs text-green-700 font-semibold">
                        {record.batchId}
                      </span>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Record Feed Usage Modal */}
        {showRecordUsage && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[80%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Record Feed Consumption</h2>
                <button
                  onClick={() => {
                    setShowRecordUsage(false);
                    setUsageForm({ batch: '', feedType: '', amount: '', date: new Date().toISOString().split('T')[0], notes: '' });
                  }}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Batch</label>
                  <select
                    value={usageForm.batch}
                    onChange={(e) => setUsageForm({ ...usageForm, batch: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Select batch...</option>
                    <option value="A">Batch A</option>
                    <option value="B">Batch B</option>
                    <option value="C">Batch C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Feed Type</label>
                  <select
                    value={usageForm.feedType}
                    onChange={(e) => setUsageForm({ ...usageForm, feedType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Select feed type...</option>
                    <option value="starter">Starter Mash</option>
                    <option value="grower">Grower Pellet</option>
                    <option value="finisher">Finisher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Amount (kg)</label>
                  <input
                    type="number"
                    value={usageForm.amount}
                    onChange={(e) => setUsageForm({ ...usageForm, amount: e.target.value })}
                    placeholder="48"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Date</label>
                  <input
                    type="date"
                    value={usageForm.date}
                    onChange={(e) => setUsageForm({ ...usageForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Notes (Optional)</label>
                  <textarea
                    value={usageForm.notes}
                    onChange={(e) => setUsageForm({ ...usageForm, notes: e.target.value })}
                    placeholder="Add any observations..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-none"
                  />
                </div>

                {!isOnline && (
                  <p className="text-xs text-gray-600 bg-yellow-50/50 p-2 rounded-lg">
                    Saved locally if offline – will sync later
                  </p>
                )}

                <button
                  onClick={handleSaveFeedUsage}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                  Save Usage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Feed Purchase Modal */}
        {showAddPurchase && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Record Feed Purchase</h2>
                <button
                  onClick={() => {
                    setShowAddPurchase(false);
                    setPurchaseForm({ feedType: '', quantity: '', unitCost: '', date: new Date().toISOString().split('T')[0] });
                  }}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Feed Type</label>
                  <select
                    value={purchaseForm.feedType}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, feedType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Select feed type...</option>
                    <option value="starter">Starter Mash</option>
                    <option value="grower">Grower Pellet</option>
                    <option value="finisher">Finisher</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Quantity (kg)</label>
                  <input
                    type="number"
                    value={purchaseForm.quantity}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })}
                    placeholder="250"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Unit Cost (₱ per kg)</label>
                  <input
                    type="number"
                    value={purchaseForm.unitCost}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, unitCost: e.target.value })}
                    placeholder="28.50"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Date of Purchase</label>
                  <input
                    type="date"
                    value={purchaseForm.date}
                    onChange={(e) => setPurchaseForm({ ...purchaseForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
                  Record Purchase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Feed Price Modal */}
        {showEditPrice && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg">
              <div className="flex items-center justify-between p-5 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Edit Feed Price</h2>
                <button
                  onClick={() => {
                    setShowEditPrice(false);
                    setEditingFeed(null);
                    setNewPrice('');
                  }}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Feed Type</label>
                  <input
                    type="text"
                    value={editingFeed || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Price per kg (₱)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="28.50"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <button
                  onClick={handleSavePrice}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                  Save Price
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30 px-4 md:px-8 lg:px-12 py-3 shadow-2xl z-50">
          <div className="flex items-center justify-around md:justify-center md:gap-8 lg:gap-16">
            <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <Home className="w-6 h-6 text-gray-500" />
              </div>
              <span className="text-xs text-gray-600">Home</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(59,130,246,0.3),-6px_-6px_12px_rgba(191,219,254,0.5)] active:shadow-[inset_3px_3px_6px_rgba(37,99,235,0.4),inset_-3px_-3px_6px_rgba(147,197,253,0.4)] transition-all">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-600">Feeds</span>
            </button>

            <button onClick={() => navigate('/vaccination')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <Syringe className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-xs text-gray-600">Vaccination</span>
            </button>

            <button onClick={() => navigate('/reports')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-gray-600">Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}