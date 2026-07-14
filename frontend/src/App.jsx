import { useState } from 'react';
import {LoginScreen} from './pages/LoginPage.jsx'; 
import {DashboardScreen} from './pages/DashboardScreen.jsx'; 
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    // Ensure the container takes full viewport height
    <div className="h-screen w-full">
      {isLoggedIn ? (
        <DashboardScreen />
      ) : (
        <LoginScreen onLogin={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;