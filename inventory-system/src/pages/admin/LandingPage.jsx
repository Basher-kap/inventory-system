import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../../assets/loginBg.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050B14] text-white"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace"
      }}
    >
      <div className="text-center max-w-4xl px-6 flex flex-col items-center">

        <h1 className="text-7xl md:text-8xl font-bold tracking-tighter mb-6 leading-none">
          Inventory
        </h1>

        <p className="text-lg md:text-xl text-blue-100/70 mb-14 max-w-2xl">
          Easily manage lab equipment and monitor status in real-time.
        </p>

        {/* Harmonized Glassmorphism Button */}
        <button
          onClick={() => navigate('/login')}
          style={{ fontFamily: 'inherit' }}
          className="inline-flex items-center justify-center whitespace-nowrap bg-white/10 backdrop-blur-md border border-white/20 text-white px-12 py-5 rounded-full text-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:border-white/40 shadow-lg"
        >
          Get Started
        </button>

      </div>
    </div>
  );
}