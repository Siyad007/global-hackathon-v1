  // src/pages/Profile.jsx
  import React from 'react';
  import { useSelector, useDispatch } from 'react-redux';
  import { logout } from '../redux/slices/authSlice';
  import { useNavigate } from 'react-router-dom';
  import { motion } from 'framer-motion';
  import { FiUser, FiMail, FiCalendar, FiLogOut, FiShare2, FiCopy, FiBookOpen, FiHeart, FiEye } from 'react-icons/fi';
  import Header from '../components/layout/Header';
  import Button from '../components/common/Button';
  import { toast } from 'react-toastify';

  const Profile = () => {
    // Get all auth data, including the new family info from Redux
    const { user, familyInviteCode } = useSelector(state => state.auth);
    const { stories } = useSelector(state => state.story);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const isGrandparent = user?.role === 'GRANDPARENT';

    const handleLogout = () => {
      dispatch(logout());
      navigate('/');
    };

    const handleCopyCode = () => {
      if (familyInviteCode) {
        navigator.clipboard.writeText(familyInviteCode);
        toast.success("✅ Invite code copied to clipboard!");
      }
    };

    // Calculate stats
    const totalStories = stories?.length || 0;
    const totalHearts = stories?.reduce((acc, s) => acc + (s.reactionCounts?.hearts || 0), 0) || 0;
    const totalViews = stories?.reduce((acc, s) => acc + (s.viewsCount || 0), 0) || 0;
    
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Profile Header */}
            <div className="relative p-8 bg-gradient-to-r from-primary-600 to-secondary-600">
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.name}&size=128&background=e0f2fe&color=075985`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                />
                <div className="text-center sm:text-left text-white">
                  <h1 className="text-4xl font-bold tracking-tight mb-1">{user?.name}</h1>
                  <p className="flex items-center justify-center sm:justify-start gap-2 text-white/80">
                    <FiMail />
                    {user?.email}
                  </p>
                  <span className="mt-3 inline-block px-4 py-1 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur-sm">
                    {user?.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-px bg-gray-200">
              <div className="text-center bg-white p-4">
                <p className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2"><FiBookOpen/> {totalStories}</p>
                <p className="text-sm text-gray-500">Stories</p>
              </div>
              <div className="text-center bg-white p-4">
                <p className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2"><FiHeart className="text-red-500"/> {totalHearts}</p>
                <p className="text-sm text-gray-500">Hearts Received</p>
              </div>
              <div className="text-center bg-white p-4">
                <p className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2"><FiEye/> {totalViews}</p>
                <p className="text-sm text-gray-500">Total Views</p>
              </div>
            </div>
            
            {/* Invite Code Section (Conditional) */}
            {isGrandparent && familyInviteCode && (
              <div className="bg-primary-50 px-8 py-6 border-t border-b border-primary-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FiShare2 className="text-primary-600"/>
                      Share Your Family Invite Code
                    </h3>
                    <p className="text-gray-600">Give this code to family members so they can join.</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white border-2 border-dashed border-primary-300 rounded-lg shadow-sm">
                    <span className="text-2xl font-bold tracking-widest text-secondary-700">
                      {familyInviteCode}
                    </span>
                    <button onClick={handleCopyCode} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-md transition-colors" title="Copy code">
                      <FiCopy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Details */}
            <div className="px-8 py-6 space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg text-gray-800">{user?.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg text-gray-800">{user?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Member Since</label>
                    <p className="text-lg text-gray-800 flex items-center gap-2">
                      <FiCalendar />
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A'}
                    </p>
                  </div>
              </div>
            </div>
            
            {/* Logout Action */}
            <div className="px-8 py-6 border-t bg-gray-50">
              <Button onClick={handleLogout} variant="danger" className="w-full sm:w-auto">
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