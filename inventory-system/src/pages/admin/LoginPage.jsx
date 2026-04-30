import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Import Firebase Authentication tools
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase.config'; // Make sure your config file has your API keys!

import loginBg from '../../assets/loginBg.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for errors and loading UI
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 2. Pass the credentials to Firebase
      await signInWithEmailAndPassword(auth, email, password);

      // 3. If successful, send them to the Dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.code);
      // Catch Firebase errors and show a clean message
      setError('You are not the admin! Try Again.');
    } finally {
      setIsLoading(false);
    }
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

          {/* Error Message UI */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ fontFamily: 'inherit' }}
            className="w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:bg-black/60 transition-all"
            placeholder="Admin Email"
          />

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ fontFamily: 'inherit' }}
            className="w-full bg-black/40 border border-white/10 rounded-[1.2rem] px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 focus:bg-black/60 transition-all"
            placeholder="Password"
          />

          {/* Harmonized Button with Loading State */}
          <button
            type="submit"
            disabled={isLoading}
            style={{ fontFamily: 'inherit' }}
            className={`mt-4 border border-white/10 px-6 py-4 rounded-[1.2rem] text-lg font-semibold transition-all duration-300 w-full ${
              isLoading
                ? 'bg-white/5 text-white/50 cursor-not-allowed'
                : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20'
            }`}
          >
            {isLoading ? 'Authenticating...' : 'Continue'}
          </button>
        </form>

      </div>
    </div>
  );
}