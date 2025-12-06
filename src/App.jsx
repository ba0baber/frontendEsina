
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologiesPage from './pages/TechnologiesPage';
import StatisticsPage from './pages/StatisticsPage';
import SettingsPage from './pages/SettingsPage';
import TechnologyDetail from './pages/TechnologyDetail';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <Navigation />
                <div className="main-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/technologies" element={<TechnologiesPage />} />
                        <Route path="/technology/:techId" element={<TechnologyDetail />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;