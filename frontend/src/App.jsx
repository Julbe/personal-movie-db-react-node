import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

// import './App.css'
import Home from "./pages/Home";
import AppLayout from './components/Layout/AppLayout';
import WatchlistPage from './pages/WatchlistPage';
import ComparePage from './pages/ComparePage';


function App() {

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

export default App
