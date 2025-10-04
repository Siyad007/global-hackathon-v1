// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStories } from '../redux/slices/storySlice';
import { motion } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiHeart, FiBook, FiZap } from 'react-icons/fi';
import Header from '../components/layout/Header';
import StoryCard from '../components/story/StoryCard';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { stories, loading } = useSelector(state => state.story);
  const [todayPrompt, setTodayPrompt] = useState('');
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserStories(user.id));
    }
    
    // Set daily prompt
    const prompts = [
      "What was your favorite meal as a child, and who made it?",
      "Describe your first day at school. What do you remember?",
      "Tell me about a time you felt extremely proud of yourself.",
      "What was your wedding day like? Share every detail.",
      "Describe the house you grew up in. Which room was your favorite?"
    ];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setTodayPrompt(randomPrompt);
  }, [user, dispatch]);
  
  const totalHearts = stories.reduce((acc, story) => 
    acc + (story.reactionCounts?.hearts || 0), 0);
  
  const totalViews = stories.reduce((acc, story) => 
    acc + (story.viewsCount || 0), 0);
  
  const stats = [
    { label: 'Stories', value: stories.length, icon: FiBook, color: 'from-blue-500 to-cyan-500' },
    { label: 'Hearts', value: totalHearts, icon: FiHeart, color: 'from-pink-500 to-rose-500' },
    { label: 'Views', value: totalViews, icon: FiTrendingUp, color: 'from-purple-500 to-indigo-500' },
    { label: 'Streak', value: user?.streakCount || 0, icon: FiZap, color: 'from-orange-500 to-amber-500' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {stories.length > 0 
              ? `You have ${stories.length} precious ${stories.length === 1 ? 'memory' : 'memories'} preserved` 
              : "Let's start preserving your precious memories"}
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Today's Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white shadow-xl"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💭</span>
                <h2 className="text-2xl font-bold">Today's Memory Prompt</h2>
              </div>
              <p className="text-xl text-white/90 mb-6 leading-relaxed">
                "{todayPrompt}"
              </p>
              <Link
                to="/record"
                className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <FiPlus />
                Record Your Story
              </Link>
            </div>
            <div className="hidden md:block text-6xl opacity-20">
              🎤
            </div>
          </div>
        </motion.div>
        
        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Stories</h2>
            {stories.length > 0 && (
              <Link
                to="/record"
                className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
              >
                <FiPlus />
                Add New
              </Link>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="xl" />
            </div>
          ) : stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-md p-12 text-center"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No stories yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start preserving your precious memories today. Every story matters,
                every memory is a treasure.
              </p>
              <Link
                to="/record"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <FiPlus />
                Record Your First Story
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;