import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/admin/LandingPage';
import LoginPage from './pages/admin/LoginPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The first screen users see */}
        <Route path="/" element={<LandingPage />} />

        {/* The form they go to after clicking "Let's get started" */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}