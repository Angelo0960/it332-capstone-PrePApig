import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, DollarSign, Package, TrendingUp, Tag, Syringe, Bell, X, Plus, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import pigImage from "../../src/assets/Gemini_Generated_Image_92oun292oun292ou.png";
import backgroundImage from "../../src/assets/Gemini_Generated_Image_o4e5bbo4e5bbo4e5.png";

const weightData = [
  { time: 0, weight: 15 },
  { time: 7, weight: 18 },
  { time: 14, weight: 22 },
  { time: 21, weight: 27 },
  { time: 28, weight: 32 },
  { time: 34, weight: 38 },
];

// Calculate profit in pesos
const calculateProfit = (weight, pricePerKg, expenses) => {
  if (!weight || !pricePerKg || weight === 0 || pricePerKg === 0) return 0;
  if (expenses === undefined || expenses === null) return 0;

  const revenue = weight * pricePerKg;
  const profit = revenue - expenses;
  return Math.round(Math.max(0, profit));
};

// Format number with commas
const formatPeso = (amount) => {
  return amount.toLocaleString('en-PH');
};

// Calculate pig size based on age (day)
const calculatePigScale = (day) => {
  if (day <= 15) {
    return 0.8 + (day / 15) * 0.4;
  }
  else if (day <= 35) {
    return 1.2 + ((day - 15) / 20) * 0.7;
  }
  else if (day <= 50) {
    return 1.9 + ((day - 35) / 15) * 0.4;
  }
  else {
    return Math.min(2.5, 2.3 + ((day - 50) / 20) * 0.2);
  }
};

const initialBatches = [
  {
    id: 'A',
    name: 'Batch A',
    pigCount: 12,
    day: 34,
    growth: 68,
    vaccination: 75,
    health: 68,
    feed: 30,
    weight: 864,
    pricePerKg: 180,
    expenses: 55728,
  },
  {
    id: 'B',
    name: 'Batch B',
    pigCount: 8,
    day: 21,
    growth: 45,
    vaccination: 50,
    health: 85,
    feed: 60,
    weight: 400,
    pricePerKg: 180,
    expenses: 34560,
  },
  {
    id: 'C',
    name: 'Batch C',
    pigCount: 15,
    day: 48,
    growth: 82,
    vaccination: 90,
    health: 78,
    feed: 25,
    weight: 1350,
    pricePerKg: 180,
    expenses: 70470,
  },
];

export default function DashboardScreen() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState(initialBatches);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState(0);

  const [newBatch, setNewBatch] = useState({
    name: '',
    pigCount: '',
    day: '',
    weight: '',
  });

  const currentBatch = batches[currentBatchIndex];

  // Feed stock data - mock data, in production this would come from shared state
  const feedStocks = [
    { type: 'Starter Mash', stock: 48 },
    { type: 'Grower Pellet', stock: 245 },
    { type: 'Finisher', stock: 120 },
  ];

  // Helper functions for feed scheduling
  const getFeedTypeForAge = (day) => {
    if (day <= 21) return 'starter';
    if (day <= 49) return 'grower';
    return 'finisher';
  };

  const getFeedTypeName = (feedType) => {
    const names = {
      starter: 'Starter Mash',
      grower: 'Grower Pellet',
      finisher: 'Finisher'
    };
    return names[feedType];
  };

  const getDaysUntilFeedChange = (day) => {
    if (day <= 21) return 22 - day;
    if (day <= 49) return 50 - day;
    return null;
  };

  // Vaccination scheduling
  const vaccinationSchedule = [
    { vaccine: 'Swine Fever', minDay: 7, maxDay: 10 },
    { vaccine: 'E. Coli', minDay: 14, maxDay: 21 },
    { vaccine: 'PRRS', minDay: 28, maxDay: 35 },
    { vaccine: 'Porcine Circovirus', minDay: 42, maxDay: 49 },
  ];

  const getNextVaccination = (day) => {
    for (const vax of vaccinationSchedule) {
      if (day < vax.maxDay) {
        return vax;
      }
    }
    return null;
  };

  const isVaccinationDue = (day, vaccine) => {
    return day >= vaccine.minDay && day <= vaccine.maxDay;
  };

  const isVaccinationOverdue = (day, vaccine) => {
    return day > vaccine.maxDay;
  };

  // Generate notifications
  const getNotifications = () => {
    const notifications = [];

    // Batch ready notification
    notifications.push({
      id: 'batch-ready',
      type: 'success',
      icon: '🎉',
      iconBg: 'bg-green-500/80',
      gradient: true,
      title: 'Batch A is ready!',
      message: 'Your batch has reached optimal conditions',
      time: '2 minutes ago',
    });

    // Low stock notifications
    feedStocks.forEach(feed => {
      if (feed.stock < 50) {
        notifications.push({
          id: `low-stock-${feed.type}`,
          type: 'warning',
          icon: '⚠️',
          iconBg: 'bg-orange-100/50',
          title: `${feed.type} Stock Low`,
          message: `Only ${feed.stock} kg remaining. Please reorder.`,
          time: '1 hour ago',
        });
      }
    });

    // Feed change notifications
    batches.forEach(batch => {
      const daysUntilChange = getDaysUntilFeedChange(batch.day);
      if (daysUntilChange !== null && daysUntilChange <= 3 && daysUntilChange > 0) {
        const currentFeed = getFeedTypeForAge(batch.day);
        const nextFeedDay = batch.day <= 21 ? 22 : 50;
        const nextFeed = getFeedTypeForAge(nextFeedDay);
        notifications.push({
          id: `feed-change-${batch.id}`,
          type: 'info',
          icon: '🔄',
          iconBg: 'bg-blue-100/50',
          title: `Feed Change for ${batch.name}`,
          message: `Will transition to ${getFeedTypeName(nextFeed)} in ${daysUntilChange} day${daysUntilChange !== 1 ? 's' : ''} (Day ${nextFeedDay})`,
          time: '30 minutes ago',
        });
      }
    });

    // Automated vaccination notifications
    batches.forEach(batch => {
      const nextVax = getNextVaccination(batch.day);
      if (nextVax) {
        const isDue = isVaccinationDue(batch.day, nextVax);
        const isOverdue = isVaccinationOverdue(batch.day, nextVax);

        if (isOverdue) {
          const daysOverdue = batch.day - nextVax.maxDay;
          notifications.push({
            id: `vaccination-overdue-${batch.id}`,
            type: 'critical',
            icon: '🚨',
            iconBg: 'bg-red-100/50',
            title: 'Vaccination Overdue',
            message: `${batch.name}: ${nextVax.vaccine} overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} - immediate attention required`,
            time: '2 hours ago',
          });
        } else if (isDue) {
          notifications.push({
            id: `vaccination-due-${batch.id}`,
            type: 'warning',
            icon: '💉',
            iconBg: 'bg-yellow-100/50',
            title: 'Vaccination Due Now',
            message: `${batch.name}: ${nextVax.vaccine} should be administered (Day ${nextVax.minDay}-${nextVax.maxDay})`,
            time: '1 hour ago',
          });
        } else if (batch.day >= nextVax.minDay - 3 && batch.day < nextVax.minDay) {
          const daysUntil = nextVax.minDay - batch.day;
          notifications.push({
            id: `vaccination-upcoming-${batch.id}`,
            type: 'info',
            icon: '💉',
            iconBg: 'bg-blue-100/50',
            title: 'Vaccination Upcoming',
            message: `${batch.name}: ${nextVax.vaccine} in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
            time: '3 hours ago',
          });
        }
      }
    });

    // Vaccine stock warnings
    notifications.push({
      id: 'vaccine-stock-low',
      type: 'warning',
      icon: '⚠️',
      iconBg: 'bg-orange-100/50',
      title: 'Vaccine Stock Low',
      message: 'PRRS vaccine: 5 doses left. E. Coli expires in 30 days.',
      time: '4 hours ago',
    });

    // Feed level low (general batch feed warning)
    if (currentBatch.feed <= 30) {
      notifications.push({
        id: 'feed-level-low',
        type: 'warning',
        icon: '⚠️',
        iconBg: 'bg-orange-100/50',
        title: 'Feed Level Low',
        message: `${currentBatch.name}: Only ${currentBatch.feed}% feed remaining. Restock soon`,
        time: '3 hours ago',
      });
    }

    return notifications;
  };

  const notifications = getNotifications();

  // Safety check: if no batches exist, don't render
  if (!currentBatch || batches.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">No batches available</div>
      </div>
    );
  }

  const getNextBatchLetter = () => {
    const lastBatch = batches[batches.length - 1];
    const lastLetter = lastBatch.id;
    return String.fromCharCode(lastLetter.charCodeAt(0) + 1);
  };

  const handleAddBatch = () => {
    if (!newBatch.name || !newBatch.pigCount || !newBatch.day || !newBatch.weight) {
      return;
    }

    const nextLetter = getNextBatchLetter();
    const pigCount = parseInt(newBatch.pigCount);
    const batch = {
      id: nextLetter,
      name: newBatch.name,
      pigCount: pigCount,
      day: parseInt(newBatch.day),
      growth: 0,
      vaccination: 0,
      health: 100,
      feed: 100,
      weight: parseFloat(newBatch.weight),
      pricePerKg: 180,
      expenses: pigCount * 1000,
    };

    setBatches([...batches, batch]);
    setShowAddBatch(false);
    setNewBatch({ name: '', pigCount: '', day: '', weight: '' });

    setDragDirection(-1);
    setCurrentBatchIndex(batches.length);
  };

  const handleDragEnd = (_event, info) => {
    const swipeThreshold = 50;

    if (info.offset.x > swipeThreshold) {
      setDragDirection(1);
      setCurrentBatchIndex((prev) => (prev > 0 ? prev - 1 : batches.length - 1));
    } else if (info.offset.x < -swipeThreshold) {
      setDragDirection(-1);
      setCurrentBatchIndex((prev) => (prev < batches.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Farm Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
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
        <div className="px-4 md:px-8 lg:px-12 pt-2 pb-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Prep<span className="text-pink-500">A</span>Pig
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all relative"
              >
                <Bell className="w-4 h-4 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">{notifications.length}</span>
              </button>
              <button className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all">
                <span className="text-pink-500 text-sm">👤</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden px-4 md:px-8 lg:px-12 pb-20">
          {/* Batch Info Cards - Compact at top */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBatch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 mb-4"
            >
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 p-3">
                <div className="text-xs text-gray-700 mb-1 font-medium">{currentBatch.name}: {currentBatch.pigCount} Pigs</div>
                <div className="text-sm font-bold text-gray-900">Day {currentBatch.day}</div>
              </div>
              <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 p-3">
                <div className="text-xs text-gray-700 mb-1 font-medium">Estimated Profit</div>
                <div className="text-sm font-bold text-green-600">
                  ₱{currentBatch?.weight !== undefined && currentBatch?.pricePerKg !== undefined && currentBatch?.expenses !== undefined
                    ? formatPeso(calculateProfit(currentBatch.weight, currentBatch.pricePerKg, currentBatch.expenses))
                    : '0'}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Icons */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`progress-${currentBatch.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 mb-4"
            >
              {/* Vaccination - 4 syringe icons */}
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-800">Vaccination</span>
                  <span className="text-xs font-bold text-blue-600">{Math.round(currentBatch.vaccination / 25)}/4 shots</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((shot) => (
                    <motion.div
                      key={`vac-${shot}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: shot * 0.1 }}
                    >
                      <Syringe
                        className={`w-5 h-5 ${
                          currentBatch.vaccination >= shot * 25
                            ? 'text-blue-500 fill-blue-500'
                            : 'text-gray-800/30'
                        } transition-colors duration-300`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Avg Weight - 4 scale icons */}
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-800">Avg Weight</span>
                  <span className="text-xs font-bold text-purple-600">{Math.round(currentBatch.weight / currentBatch.pigCount)} kg/pig</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((level) => {
                    const avgWeight = currentBatch.weight / currentBatch.pigCount;
                    const targetWeight = currentBatch.day <= 21 ? 30 : currentBatch.day <= 49 ? 60 : 90;
                    const weightProgress = Math.min(100, (avgWeight / targetWeight) * 100);

                    return (
                      <motion.div
                        key={`weight-${level}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: level * 0.1 }}
                      >
                        <Scale
                          className={`w-5 h-5 ${
                            weightProgress >= level * 25
                              ? 'text-purple-500 fill-purple-500'
                              : 'text-gray-800/30'
                          } transition-colors duration-300`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Feed Level - 4 package icons with feed type */}
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-800">Feed: {getFeedTypeName(getFeedTypeForAge(currentBatch.day))}</span>
                  <span className="text-xs font-bold text-orange-600">{currentBatch.feed}%</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((bag) => (
                    <motion.div
                      key={`feed-${bag}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: bag * 0.1 }}
                    >
                      <Package
                        className={`w-5 h-5 ${
                          currentBatch.feed >= bag * 25
                            ? 'text-orange-500 fill-orange-500'
                            : 'text-gray-800/30'
                        } transition-colors duration-300`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipeable Pig Character */}
          <div className="flex items-center justify-center py-8 mb-4 relative min-h-[200px] md:min-h-[240px] lg:min-h-[288px]">
            <AnimatePresence mode="wait" custom={dragDirection}>
              <motion.div
                key={currentBatch.id}
                custom={dragDirection}
                initial={{ x: dragDirection * 300, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -dragDirection * 300, opacity: 0, scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="relative w-64 h-48 md:w-80 md:h-60 lg:w-96 lg:h-72 cursor-grab active:cursor-grabbing"
              >
                <motion.img
                  src={pigImage}
                  alt="Pig Character"
                  className="w-full h-full object-cover pointer-events-none"
                  animate={{
                    scale: calculatePigScale(currentBatch.day)
                  }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Swipe indicator dots */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
              {batches.map((batch, index) => (
                <button
                  key={batch.id}
                  onClick={() => {
                    setDragDirection(index > currentBatchIndex ? -1 : 1);
                    setCurrentBatchIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBatchIndex
                      ? 'bg-white w-6 shadow-lg'
                      : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Fixed */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30 px-4 md:px-8 lg:px-12 py-3 shadow-2xl">
          <div className="flex items-center justify-around md:justify-center md:gap-8 lg:gap-16">
            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(139,92,246,0.3),-6px_-6px_12px_rgba(196,181,253,0.5)] active:shadow-[inset_3px_3px_6px_rgba(109,40,217,0.4),inset_-3px_-3px_6px_rgba(233,213,255,0.4)] transition-all">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-600">Home</span>
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

            <button onClick={() => navigate('/reports')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-gray-600">Reports</span>
            </button>
          </div>
        </div>

        {/* Floating Add Button */}
        <button
          onClick={() => setShowAddBatch(true)}
          className="absolute bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-[8px_8px_16px_rgba(0,0,0,0.3),-8px_-8px_16px_rgba(255,255,255,0.1)] active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.1)] transition-all z-40"
        >
          <Plus className="w-7 h-7 text-white" />
        </button>

        {/* Add Batch Modal */}
        {showAddBatch && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Add New Batch</h2>
                <button
                  onClick={() => {
                    setShowAddBatch(false);
                    setNewBatch({ name: '', pigCount: '', day: '', weight: '' });
                  }}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Form */}
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Batch Name</label>
                  <input
                    type="text"
                    value={newBatch.name}
                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                    placeholder={`Batch ${getNextBatchLetter()}`}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Number of Pigs</label>
                  <input
                    type="number"
                    value={newBatch.pigCount}
                    onChange={(e) => setNewBatch({ ...newBatch, pigCount: e.target.value })}
                    placeholder="12"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Current Day</label>
                  <input
                    type="number"
                    value={newBatch.day}
                    onChange={(e) => setNewBatch({ ...newBatch, day: e.target.value })}
                    placeholder="1"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Total Weight (kg)</label>
                  <input
                    type="number"
                    value={newBatch.weight}
                    onChange={(e) => setNewBatch({ ...newBatch, weight: e.target.value })}
                    placeholder="180"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <button
                  onClick={handleAddBatch}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                  Add Batch
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification Panel */}
        {showNotifications && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-16">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-[90%] md:w-[70%] lg:w-[50%] max-h-[70%] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="p-4 space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`${
                      notif.gradient
                        ? 'bg-gradient-to-r from-green-500/80 to-green-600/80'
                        : 'bg-white/20'
                    } backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/30`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${notif.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl">{notif.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-sm mb-1 ${notif.gradient ? 'text-white' : 'text-gray-900'}`}>
                          {notif.title}
                        </h3>
                        <p className={`text-xs ${notif.gradient ? 'text-white/90' : 'text-gray-700'}`}>
                          {notif.message}
                        </p>
                        <p className={`text-xs mt-1 ${notif.gradient ? 'text-white/70' : 'text-gray-500'}`}>
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}