import { useState } from 'react';
import { LoginScreen } from './pages/LoginPage.jsx';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Optionally navigate to dashboard using react-router
  };

  return (
    <>
      {isLoggedIn ? (
        <div>Dashboard (replace with your dashboard component)</div>
      ) : (
        <LoginScreen onLogin={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;