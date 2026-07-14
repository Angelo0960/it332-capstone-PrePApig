import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './pages/LoginPage.jsx';
import DashboardScreen from './pages/DashboardScreen.jsx';
import FeedsInventoryScreen from './pages/FeedsInventoryScreen.jsx';
import AnalyticsReportsScreen from './pages/AnalyticsReportScreen.jsx';
import VaccinationScreen from './pages/VaccinationScreen.jsx';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginScreen onLogin={() => setIsLoggedIn(true)} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feeds"
          element={
            <ProtectedRoute>
              <FeedsInventoryScreen />
            </ProtectedRoute>
          }
        
        ></Route>
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AnalyticsReportsScreen />
            </ProtectedRoute>
          }
        
        ></Route>
        <Route
          path="/vaccination"
          element={
            <ProtectedRoute>
              <VaccinationScreen />
            </ProtectedRoute>
          }
        
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;