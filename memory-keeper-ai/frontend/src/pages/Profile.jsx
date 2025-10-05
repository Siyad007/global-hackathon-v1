// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiLogOut, FiEdit2 } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
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
      
      <main className="max-w-4xl px-4 py-8 mx-auto mt-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden bg-white shadow-xl rounded-2xl"
        >
          {/* Header */}
          <div className="px-8 py-12 text-white bg-gradient-to-r from-primary-600 to-secondary-600">
            <div className="flex items-center gap-6">
              <img
                src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&size=128`}
                alt="Profile"
                className="w-32 h-32 border-4 border-white rounded-full shadow-lg"
              />
              <div>
                <h1 className="mb-2 text-3xl font-bold">{user?.name}</h1>
                <p className="flex items-center gap-2 text-white/80">
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
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiUser className="text-gray-400" />
                <span>{user?.name}</span>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiMail className="text-gray-400" />
                <span>{user?.email}</span>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-primary-100 text-primary-700">
                  {user?.role}
                </span>
              </div>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Member Since
              </label>
              <div className="flex items-center gap-3 text-gray-900">
                <FiCalendar className="text-gray-400" />
                <span>{new Date().getFullYear()}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="px-8 py-6 border-t bg-gray-50">
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