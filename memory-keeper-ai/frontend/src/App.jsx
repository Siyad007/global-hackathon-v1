// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Record from './pages/Record';
import StoryView from './pages/StoryView';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';

// Components
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug: Simple test to see if anything renders */}
      <div style={{backgroundColor: 'red', color: 'white', padding: '10px', textAlign: 'center'}}>
        APP IS RENDERING - If you see this, React is working!
      </div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Private Routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/record" element={
          <PrivateRoute>
            <Record />
          </PrivateRoute>
        } />
        
        <Route path="/story/:id" element={
          <PrivateRoute>
            <StoryView />
          </PrivateRoute>
        } />
        
        <Route path="/analytics" element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </div>
  );
}

export default App;