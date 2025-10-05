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
    { label: 'Stories', value: stories.length, icon: FiBook },
    { label: 'Hearts', value: totalHearts, icon: FiHeart },
    { label: 'Views', value: totalViews, icon: FiTrendingUp },
    { label: 'Streak', value: user?.streakCount || 0, icon: FiZap }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-600 text-xl">
            {stories.length > 0 
              ? `You have ${stories.length} precious ${stories.length === 1 ? 'memory' : 'memories'} preserved` 
              : "Let's start preserving your precious memories"}
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{stat.value}</p>
              <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Today's Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 rounded-2xl p-8 md:p-10 mb-12 text-white shadow-xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">💭</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Today's Memory Prompt</h2>
              </div>
              <p className="text-xl text-slate-200 mb-8 leading-relaxed max-w-3xl">
                "{todayPrompt}"
              </p>
              <Link
                to="/record"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                Record Your Story
              </Link>
            </div>
            <div className="hidden md:block text-6xl opacity-10 ml-6">
              🎤
            </div>
          </div>
        </motion.div>
        
        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1">Your Stories</h2>
              <p className="text-slate-600">Your preserved memories and family narratives</p>
            </div>
            {stories.length > 0 && (
              <Link
                to="/record"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md"
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
              className="bg-white border border-slate-200 rounded-2xl p-12 md:p-16 text-center"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiBook className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                No stories yet
              </h3>
              <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                Start preserving your precious memories today. Every story matters,
                every memory is a treasure.
              </p>
              <Link
                to="/record"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
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