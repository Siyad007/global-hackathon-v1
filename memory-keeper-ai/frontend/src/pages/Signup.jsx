// src/pages/Signup.jsx
import React,{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiUsers } from 'react-icons/fi';
import Button from '../components/common/Button'; // Assuming Button component exists

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'GRANDPARENT',
    inviteCode: '', // State for the new invite code field
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleRoleChange = (newRole) => {
    setFormData({ 
      ...formData, 
      role: newRole,
      inviteCode: newRole === 'GRANDPARENT' ? '' : formData.inviteCode // Clear invite code if switching back
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'FAMILY_MEMBER' && !formData.inviteCode.trim()) {
      toast.error('An invite code is required to sign up as a family member.');
      return;
    }

    // This is the data that will be sent to the backend API
    const { confirmPassword, ...signupData } = formData;
    dispatch(signup(signupData));
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <span className="text-4xl">📖</span>
            <span className="text-2xl font-bold gradient-text">Memory Keeper</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Start preserving memories today</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am signing up as a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('GRANDPARENT')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'GRANDPARENT'
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-300'
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <div className="text-3xl mb-2">👵</div>
                  <div className="font-semibold">Storyteller</div>
                  <div className="text-xs text-gray-500">(Grandparent)</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleRoleChange('FAMILY_MEMBER')}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    formData.role === 'FAMILY_MEMBER'
                      ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-300'
                      : 'border-gray-300 hover:border-primary-400'
                  }`}
                >
                  <div className="text-3xl mb-2">👨‍👩‍👧</div>
                  <div className="font-semibold">Family Member</div>
                  <div className="text-xs text-gray-500">(Child, etc.)</div>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {formData.role === 'FAMILY_MEMBER' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Invite Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUsers className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="inviteCode"
                      value={formData.inviteCode}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="e.g., ABC-123"
                      required={formData.role === 'FAMILY_MEMBER'}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Get this code from the Storyteller in your family.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiUser className="text-gray-400" /></div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiMail className="text-gray-400" /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="text-gray-400" /></div>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" required minLength={6} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiLock className="text-gray-400" /></div>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg" required />
              </div>
            </div>
            
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              {loading ? 'Creating account...' : <>Create Account <FiArrowRight className="ml-2" /></>}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Login</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;