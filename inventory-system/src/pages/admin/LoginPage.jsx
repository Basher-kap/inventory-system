import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBg from '../../assets/loginBg.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-[#050B14]"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace"
      }}
    >
      {/* Background Dark & Blur Overlay */}
      <div className="absolute inset-0 bg-[#050B14]/40 backdrop-blur-md z-0"></div>

      {/* Clean, Flat Glass Card */}
      <div className="z-10 w-full max-w-[420px] p-10 bg-gradient-to-br from-white/10 to-[#0a1128]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col relative overflow-hidden">

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl text-white font-semibold tracking-tight mb-2">
            Sign in
          </h1>
          <p className="text-blue-100/50 text-sm">
            Secure Admin Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ fontFamily: 'inherit' }}
            // Softened the focus ring to white/30 for harmony
            className="w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:bg-black/60 transition-all"
            placeholder="Email address"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ fontFamily: 'inherit' }}
            // Softened the focus ring to white/30 for harmony
            className="w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:bg-black/60 transition-all"
            placeholder="Password"
          />

          {/* Harmonized Glassmorphism Button */}
          <button
            type="submit"
            style={{ fontFamily: 'inherit' }}
            className="mt-4 bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 px-6 py-4 rounded-[1.2rem] text-lg font-semibold transition-all duration-300 w-full"
          >
            Continue
          </button>
        </form>

      </div>
    </div>
  );
}