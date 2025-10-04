// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiEdit2 } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Button from '../common/Button';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const { stories } = useSelector(state => state.story);
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  
  const totalHearts = stories.reduce((acc, s) => acc + (s.reactionCounts?.hearts || 0), 0);
  const totalViews = stories.reduce((acc, s) => acc + (s.viewsCount || 0), 0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <img
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&size=128`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <FiMail />
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 px-8 py-6 border-b">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stories.length}</p>
              <p className="text-sm text-gray-500">Stories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalHearts}</p>
              <p className="text-sm text-gray-500">Hearts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
              <p className="text-sm text-gray-500">Views</p>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="px-8 py-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiUser className="text-gray-400" />
                <span>{user?.name}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiMail className="text-gray-400" />
                <span>{user?.email}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                  {user?.role}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiCalendar className="text-gray-400" />
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t">
            <Button
              onClick={handleLogout}
              variant="danger"
              className="w-full"
            >
              <FiLogOut className="mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;