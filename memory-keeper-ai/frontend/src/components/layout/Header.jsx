// src/components/layout/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiBarChart, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">📖</span>
            <span className="text-xl font-bold gradient-text">Memory Keeper</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FiHome className="inline mr-2" />
              Dashboard
            </Link>
            
            <Link
              to="/analytics"
              className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <FiBarChart className="inline mr-2" />
              Analytics
            </Link>
            
            <Link
              to="/record"
              className="btn-primary"
            >
              <FiPlus className="inline" />
              New Story
            </Link>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user?.avatarUrl || 'https://ui-avatars.com/api/?name=' + user?.name}
                  alt="avatar"
                  className="h-10 w-10 rounded-full border-2 border-primary-600"
                />
              </button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiUser className="inline mr-2" />
                      Profile
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition-colors"
                    >
                      <FiLogOut className="inline mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="px-4 py-2 space-y-2">
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiHome className="inline mr-2" />
                Dashboard
              </Link>
              
              <Link
                to="/analytics"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiBarChart className="inline mr-2" />
                Analytics
              </Link>
              
              <Link
                to="/record"
                className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiPlus className="inline mr-2" />
                New Story
              </Link>
              
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="inline mr-2" />
                Profile
              </Link>
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded-lg"
              >
                <FiLogOut className="inline mr-2" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;