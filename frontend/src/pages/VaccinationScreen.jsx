import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, CloudOff, Syringe, DollarSign, TrendingUp, Home, Package, X, AlertTriangle, Calendar, Check } from 'lucide-react';
import backgroundImage from "../../src/assets/Gemini_Generated_Image_o4e5bbo4e5bbo4e5.png";

// Standard vaccination schedule by age
const vaccinationSchedule = [
  { vaccine: 'Swine Fever', minDay: 7, maxDay: 10, dosePerPig: 1 },
  { vaccine: 'E. Coli', minDay: 14, maxDay: 21, dosePerPig: 1 },
  { vaccine: 'PRRS', minDay: 28, maxDay: 35, dosePerPig: 1 },
  { vaccine: 'Porcine Circovirus', minDay: 42, maxDay: 49, dosePerPig: 1 },
];

// Get next required vaccination for a batch
const getNextVaccination = (day) => {
  for (const vax of vaccinationSchedule) {
    if (day < vax.maxDay) {
      return vax;
    }
  }
  return null;
};

// Get completed vaccinations for a batch
const getCompletedVaccinations = (day) => {
  return vaccinationSchedule.filter(vax => day > vax.maxDay);
};

// Check if vaccination is due (within window)
const isVaccinationDue = (day, vaccine) => {
  return day >= vaccine.minDay && day <= vaccine.maxDay;
};

// Check if vaccination is overdue
const isVaccinationOverdue = (day, vaccine) => {
  return day > vaccine.maxDay;
};

// Get days until vaccination
const getDaysUntilVaccination = (day, vaccine) => {
  if (day < vaccine.minDay) {
    return vaccine.minDay - day;
  }
  return 0;
};

export default function VaccinationScreen() {
  const navigate = useNavigate();

  const [isOnline] = useState(true);
  const [pendingSync] = useState(1);
  const [showRecordVaccination, setShowRecordVaccination] = useState(false);
  const [showRestockVaccine, setShowRestockVaccine] = useState(false);
  const [scheduleView, setScheduleView] = useState('upcoming');
  const [selectedBatch, setSelectedBatch] = useState('all');

  // Mock batch data - in production, this would come from props or global state
  const batches = [
    { id: 'A', name: 'Batch A', day: 34, pigCount: 12 },
    { id: 'B', name: 'Batch B', day: 21, pigCount: 8 },
    { id: 'C', name: 'Batch C', day: 48, pigCount: 15 },
  ];

  // Vaccine pricing data
  const vaccineStocks = [
    { type: 'Swine Fever', pricePerDose: 45.00 },
    { type: 'E. Coli', pricePerDose: 38.50 },
    { type: 'PRRS', pricePerDose: 52.00 },
    { type: 'Porcine Circovirus', pricePerDose: 48.00 },
  ];

  // Vaccination records per batch
  const [vaccinationRecords, setVaccinationRecords] = useState([
    { id: '1', batchId: 'A', batchName: 'Batch A', vaccineType: 'Swine Fever', doses: 12, date: 'May 10, 2026', notes: 'Booster shot' },
    { id: '2', batchId: 'B', batchName: 'Batch B', vaccineType: 'E. Coli', doses: 8, date: 'May 5, 2026' },
    { id: '3', batchId: 'A', batchName: 'Batch A', vaccineType: 'PRRS', doses: 12, date: 'Apr 28, 2026' },
  ]);

  // Calculate batch-specific vaccination expenses
  const calculateBatchVaccinationExpense = (batchId) => {
    return vaccinationRecords
      .filter(record => batchId === 'all' ? true : record.batchId === batchId)
      .reduce((total, record) => {
        const vaccineStock = vaccineStocks.find(v => v.type === record.vaccineType);
        return total + (record.doses * (vaccineStock?.pricePerDose || 0));
      }, 0);
  };

  // Filter records by selected batch
  const filteredRecords = selectedBatch === 'all'
    ? vaccinationRecords
    : vaccinationRecords.filter(r => r.batchId === selectedBatch);

  const selectedBatchData = batches.find(b => b.id === selectedBatch);
  const batchExpense = calculateBatchVaccinationExpense(selectedBatch);

  const [vaccinationForm, setVaccinationForm] = useState({
    batch: '',
    vaccineType: '',
    doses: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [restockForm, setRestockForm] = useState({
    vaccineType: '',
    doses: '',
    cost: '',
    expiryDate: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  const handleSaveVaccination = () => {
    if (vaccinationForm.batch && vaccinationForm.vaccineType && vaccinationForm.doses) {
      const batch = batches.find(b => b.id === vaccinationForm.batch);

      const newRecord = {
        id: Date.now().toString(),
        batchId: vaccinationForm.batch,
        batchName: batch?.name || '',
        vaccineType: vaccinationForm.vaccineType,
        doses: parseInt(vaccinationForm.doses),
        date: new Date(vaccinationForm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        notes: vaccinationForm.notes,
      };

      setVaccinationRecords([newRecord, ...vaccinationRecords]);
      setShowRecordVaccination(false);
      setVaccinationForm({ batch: '', vaccineType: '', doses: '', date: new Date().toISOString().split('T')[0], notes: '' });
    }
  };

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
              <h1 className="text-xl font-bold text-gray-900">Vaccination Manager</h1>
            </div>
            <div className="relative">
              {isOnline ? (
                <Cloud className="w-5 h-5 text-green-600" />
              ) : (
                <CloudOff className="w-5 h-5 text-gray-400" />
              )}
              {pendingSync > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingSync}
                </span>
              )}
            </div>
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
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
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
                      ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                      : 'bg-white/30 text-gray-700'
                  }`}
                >
                  {batch.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 pb-24">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-100/80 rounded-lg flex items-center justify-center">
                  <Syringe className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xs text-gray-700 font-semibold">Vaccine Stock</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">48 doses</div>
              <div className="text-xs text-gray-600">Across 3 vaccine types</div>
              <div className="mt-2">
                <span className="px-2 py-1 bg-orange-100/80 border border-orange-300/50 rounded-full text-xs text-orange-700 font-semibold">
                  Low stock
                </span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-purple-100/80 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xs text-gray-700 font-semibold">
                  {selectedBatch === 'all' ? 'All Batches' : selectedBatchData?.name}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₱{batchExpense.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</div>
              <div className="text-xs text-gray-600">
                {selectedBatch === 'all' ? 'Total vaccination expenses' : 'Vaccination expenses for this batch'}
              </div>
            </div>
          </div>

          {/* Vaccine Stock Table */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg mb-4">
            <div className="p-4 border-b border-white/20">
              <h3 className="font-semibold text-gray-900">Vaccine Stock</h3>
            </div>
            <div className="divide-y divide-white/20">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">Swine Fever</div>
                  <span className="px-3 py-1 bg-green-100/80 border border-green-300/50 rounded-full text-xs text-green-700 font-semibold">
                    OK
                  </span>
                </div>
                <div className="text-xs text-gray-600">48 doses · Exp: Dec 15, 2026</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">E. Coli</div>
                  <span className="px-3 py-1 bg-orange-100/80 border border-orange-300/50 rounded-full text-xs text-orange-700 font-semibold">
                    Expiring Soon
                  </span>
                </div>
                <div className="text-xs text-gray-600">12 doses · Exp: Jun 10, 2026</div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-900">PRRS</div>
                  <span className="px-3 py-1 bg-red-100/80 border border-red-300/50 rounded-full text-xs text-red-700 font-semibold">
                    Low Stock
                  </span>
                </div>
                <div className="text-xs text-gray-600">5 doses · Exp: May 20, 2026</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <button
              onClick={() => setShowRecordVaccination(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              Record Vaccination
            </button>
            <button
              onClick={() => setShowRestockVaccine(true)}
              className="bg-white/30 backdrop-blur-lg border border-white/40 text-green-700 font-bold py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
            >
              Restock Vaccine
            </button>
          </div>

          {/* Automated Vaccination Schedule */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 p-4 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Automated Vaccination Schedule
                {selectedBatch !== 'all' && ` - ${selectedBatchData?.name}`}
              </h3>
              <div className="px-2 py-1 bg-blue-100/80 border border-blue-300/50 rounded-full text-xs text-blue-700 font-semibold flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                Auto
              </div>
            </div>
            <div className="space-y-3">
              {batches
                .filter(batch => selectedBatch === 'all' ? true : batch.id === selectedBatch)
                .map((batch) => {
                const nextVax = getNextVaccination(batch.day);
                const completedVaxes = getCompletedVaccinations(batch.day);
                const isDue = nextVax ? isVaccinationDue(batch.day, nextVax) : false;
                const isOverdue = nextVax ? isVaccinationOverdue(batch.day, nextVax) : false;
                const daysUntil = nextVax ? getDaysUntilVaccination(batch.day, nextVax) : null;
                const totalDoses = nextVax ? nextVax.dosePerPig * batch.pigCount : 0;

                return (
                  <div
                    key={batch.id}
                    className={`bg-white/30 backdrop-blur-sm rounded-xl p-3 border border-white/30 ${
                      isOverdue ? 'bg-red-50/40 border-red-200/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{batch.name} – Day {batch.day}</div>

                        {/* Vaccination Progress */}
                        <div className="flex items-center gap-1 mt-2 mb-2">
                          {vaccinationSchedule.map((vax) => {
                            const completed = batch.day > vax.maxDay;
                            const current = batch.day >= vax.minDay && batch.day <= vax.maxDay;

                            return (
                              <div
                                key={vax.vaccine}
                                className={`flex-1 h-1.5 rounded-full transition-all ${
                                  completed
                                    ? 'bg-green-500'
                                    : current
                                    ? 'bg-yellow-500'
                                    : 'bg-gray-300'
                                }`}
                                title={vax.vaccine}
                              />
                            );
                          })}
                        </div>

                        <div className="text-xs text-gray-600">
                          Completed: {completedVaxes.length}/4 vaccines
                        </div>

                        {nextVax && (
                          <>
                            <div className="text-sm text-gray-700 mt-2">
                              Next: {nextVax.vaccine}
                            </div>
                            <div className="text-xs text-gray-600">
                              Day {nextVax.minDay}-{nextVax.maxDay} · {totalDoses} doses needed
                            </div>
                            {isOverdue && (
                              <div className="text-xs text-red-600 font-semibold mt-1">
                                ⚠️ Overdue by {batch.day - nextVax.maxDay} day{batch.day - nextVax.maxDay > 1 ? 's' : ''}
                              </div>
                            )}
                            {isDue && !isOverdue && (
                              <div className="text-xs text-yellow-700 font-semibold mt-1 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Due now
                              </div>
                            )}
                            {!isDue && !isOverdue && daysUntil !== null && (
                              <div className="text-xs text-blue-600 font-medium mt-1">
                                In {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                              </div>
                            )}
                          </>
                        )}

                        {!nextVax && (
                          <div className="text-xs text-green-600 font-semibold mt-2 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            All vaccinations complete
                          </div>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isOverdue
                          ? 'bg-red-100/80 border border-red-300/50 text-red-700'
                          : isDue
                          ? 'bg-yellow-100/80 border border-yellow-300/50 text-yellow-700'
                          : nextVax
                          ? 'bg-blue-100/80 border border-blue-300/50 text-blue-700'
                          : 'bg-green-100/80 border border-green-300/50 text-green-700'
                      }`}>
                        {isOverdue ? 'Overdue' : isDue ? 'Due Now' : nextVax ? 'Scheduled' : 'Complete'}
                      </span>
                    </div>
                    {(isDue || isOverdue) && (
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
                  <p className="text-xs text-blue-900 font-medium">Standard vaccination schedule:</p>
                  <ul className="text-xs text-blue-800 mt-1 space-y-0.5 ml-2">
                    <li>• Days 7-10: Swine Fever</li>
                    <li>• Days 14-21: E. Coli</li>
                    <li>• Days 28-35: PRRS</li>
                    <li>• Days 42-49: Porcine Circovirus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination History by Batch */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-lg mb-4">
            <div className="p-4 border-b border-white/20">
              <h3 className="font-semibold text-gray-900">
                Vaccination History
                {selectedBatch !== 'all' && ` - ${selectedBatchData?.name}`}
              </h3>
            </div>
            <div className="divide-y divide-white/20">
              {filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No vaccination records for this batch yet
                </div>
              ) : (
                filteredRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{record.batchName}</div>
                        <div className="text-xs text-gray-700 mt-1">{record.vaccineType} · {record.doses} doses</div>
                        <div className="text-xs text-gray-500 mt-1">{record.date}</div>
                        {record.notes && (
                          <div className="text-xs text-gray-600 mt-1 italic">"{record.notes}"</div>
                        )}
                      </div>
                      <span className="px-2 py-1 bg-blue-100/80 border border-blue-300/50 rounded-full text-xs text-blue-700 font-semibold">
                        {record.batchId}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Record Vaccination Modal */}
        {showRecordVaccination && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[80%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Record Vaccination</h2>
                <button
                  onClick={() => setShowRecordVaccination(false)}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Batch</label>
                  <select
                    value={vaccinationForm.batch}
                    onChange={(e) => setVaccinationForm({ ...vaccinationForm, batch: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Select batch...</option>
                    <option value="A">Batch A</option>
                    <option value="B">Batch B</option>
                    <option value="C">Batch C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Vaccine Type</label>
                  <select
                    value={vaccinationForm.vaccineType}
                    onChange={(e) => setVaccinationForm({ ...vaccinationForm, vaccineType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Select vaccine...</option>
                    <option value="Swine Fever">Swine Fever</option>
                    <option value="E. Coli">E. Coli</option>
                    <option value="PRRS">PRRS</option>
                    <option value="Porcine Circovirus">Porcine Circovirus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Doses Administered</label>
                  <input
                    type="number"
                    value={vaccinationForm.doses}
                    onChange={(e) => setVaccinationForm({ ...vaccinationForm, doses: e.target.value })}
                    placeholder="12"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Date</label>
                  <input
                    type="date"
                    value={vaccinationForm.date}
                    onChange={(e) => setVaccinationForm({ ...vaccinationForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Notes (optional)</label>
                  <textarea
                    value={vaccinationForm.notes}
                    onChange={(e) => setVaccinationForm({ ...vaccinationForm, notes: e.target.value })}
                    placeholder="e.g., Booster dose"
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all resize-none"
                  />
                </div>

                {!isOnline && (
                  <div className="text-xs text-gray-600 bg-yellow-50/50 p-2 rounded-lg">
                    Saved locally – will sync later
                  </div>
                )}

                <button
                  onClick={handleSaveVaccination}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
                >
                  Save Vaccination
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Restock Vaccine Modal */}
        {showRestockVaccine && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg max-h-[80%] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-white/30">
                <h2 className="text-lg font-bold text-gray-900">Restock Vaccine</h2>
                <button
                  onClick={() => setShowRestockVaccine(false)}
                  className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-lg flex items-center justify-center shadow-[4px_4px_8px_rgba(0,0,0,0.15),-4px_-4px_8px_rgba(255,255,255,0.7)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.15),inset_-2px_-2px_4px_rgba(255,255,255,0.7)] transition-all"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Vaccine Type</label>
                  <select
                    value={restockForm.vaccineType}
                    onChange={(e) => setRestockForm({ ...restockForm, vaccineType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  >
                    <option value="">Select vaccine...</option>
                    <option value="swine-fever">Swine Fever</option>
                    <option value="ecoli">E. Coli</option>
                    <option value="prrs">PRRS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Doses Added</label>
                  <input
                    type="number"
                    value={restockForm.doses}
                    onChange={(e) => setRestockForm({ ...restockForm, doses: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Cost (₱)</label>
                  <input
                    type="number"
                    value={restockForm.cost}
                    onChange={(e) => setRestockForm({ ...restockForm, cost: e.target.value })}
                    placeholder="3250"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={restockForm.expiryDate}
                    onChange={(e) => setRestockForm({ ...restockForm, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/40 backdrop-blur-lg border border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Date of Purchase</label>
                  <input
                    type="date"
                    value={restockForm.purchaseDate}
                    onChange={(e) => setRestockForm({ ...restockForm, purchaseDate: e.target.value })}
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

            <button className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(236,72,153,0.3),-6px_-6px_12px_rgba(251,207,232,0.5)] active:shadow-[inset_3px_3px_6px_rgba(219,39,119,0.4),inset_-3px_-3px_6px_rgba(249,168,212,0.4)] transition-all">
                <Syringe className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-pink-600">Vaccination</span>
            </button>

            <button onClick={() => navigate('/reports')} className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.8)] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.8)] transition-all">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs text-gray-600">Reports</span>
            </button>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/30 rounded-full"></div>
      </div>
    </div>
  );
}