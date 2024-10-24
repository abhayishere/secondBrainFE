import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import "./App.css"

function App() {
  return (
    <div className="background">
      <Router basename="/secondBrain">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router> 
    </div>
    
  );
}

export default App;
