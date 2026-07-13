import { useState } from "react";
import { User, Lock } from "lucide-react";
import { api } from '../api.js'; // adjust path
import pigImage from "../../src/assets/Gemini_Generated_Image_92oun292oun292ou.png";
import backgroundImage from "../../src/assets/Gemini_Generated_Image_o4e5bbo4e5bbo4e5.png";

export function LoginScreen({ onLogin }) {
  const [farmerId, setFarmerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!farmerId || !password) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.login(farmerId, password);
      // Store token (if using JWT) – e.g., localStorage
      localStorage.setItem('token', data.token);
      // optionally store user info
      onLogin(); // parent can update auth state
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Farm Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid layout: title row auto, content row fills remaining space */}
      <div className="relative z-10 h-full grid grid-rows-[auto_1fr] gap-y-75 px-6 pb-12 pt-25">
        {/* Title row - takes only as much height as needed */}
        <div className="text-center">
          <h1
            className="text-5xl font-extrabold"
            style={{
              fontFamily: "'Erica One', cursive",
            }}
          >
            <span style={{ color: "#67bed9" }}>PrepA</span>
            <span style={{ color: "#f77f9f" }}>Pig</span>
          </h1>
        </div>

        {/* Content row - fills remaining height and centers pig+card vertically */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[340px]">
            {/* 3D Pig Asset - Overlapping the card */}
            <div className="relative z-0 mx-auto -mb-49 pointer-events-none">
              <img
                src={pigImage}
                alt="Pig Character"
                className="drop-shadow-xl origin-bottom"
                style={{
                  transform: "scale(2.2)",
                  filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.12))",
                }}
              />
            </div>

            {/* Glassmorphic Panel - Corner Radius 48px */}
            <div
              className="relative z-10 pt-28 pb-8 px-8"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(40px)",
                borderRadius: "48px",
                border: "1.5px solid rgba(255, 255, 255, 0.5)",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.05)",
              }}
            >
              {/* Login Title */}
              <div className="flex items-center justify-center gap-2 mb-6 -mt-20">
                <div className="h-px w-8 bg-[#E91E63]/30" />
                <h2
                  className="text-2xl font-bold tracking-wide"
                  style={{
                    fontFamily: "'Erica One', cursive",
                    color: "#E91E63",
                  }}
                >
                  Login
                </h2>
                <div className="h-px w-8 bg-[#E91E63]/30" />
              </div>

              <div className="space-y-4">
                {/* Farmer ID Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <User className="w-5 h-5 text-[#E91E63]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Farmer ID"
                    value={farmerId}
                    onChange={(e) => setFarmerId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none transition-all"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      borderRadius: "20px",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>

                {/* Access Key Input */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <Lock className="w-5 h-5 text-[#E91E63]" />
                  </div>
                  <input
                    type="password"
                    placeholder="Access Key ••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none transition-all"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      borderRadius: "20px",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>

                {/* 3D Claymorphic Button */}
                <button
                  onClick={handleLogin}
                  className="w-full py-4 text-white font-bold uppercase tracking-wide relative active:translate-y-1 transition-transform mt-2"
                  style={{
                    backgroundColor: "#E91E63",
                    borderRadius: "20px",
                    boxShadow: "0 8px 0 #AD1457",
                  }}
                >
                  START TRACKING
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-black/20 rounded-full z-20"></div>
    </div>
  );
}
export default LoginScreen;