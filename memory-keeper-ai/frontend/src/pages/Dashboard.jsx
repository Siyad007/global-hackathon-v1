// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStories } from '../redux/slices/storySlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiHeart, FiBook, FiZap, FiAward, FiCalendar, FiFilter, FiSearch, FiGrid, FiList, FiClock, FiStar, FiUsers, FiMessageCircle } from 'react-icons/fi';
import Header from '../components/layout/Header';
import StoryCard from '../components/story/StoryCard';
import Spinner from '../components/common/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { stories, loading } = useSelector(state => state.story);
  const [todayPrompt, setTodayPrompt] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserStories(user.id));
    }
    
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

  const totalComments = stories.reduce((acc, story) => 
    acc + (story.commentsCount || 0), 0);
  
  // Calculate achievements
  const achievements = [
    { id: 1, name: "First Story", icon: "🎉", unlocked: stories.length >= 1, description: "Record your first memory" },
    { id: 2, name: "Storyteller", icon: "📚", unlocked: stories.length >= 5, description: "Share 5 stories" },
    { id: 3, name: "Beloved", icon: "❤️", unlocked: totalHearts >= 50, description: "Receive 50 hearts" },
    { id: 4, name: "Popular", icon: "👥", unlocked: totalViews >= 100, description: "Get 100 views" },
    { id: 5, name: "Week Streak", icon: "🔥", unlocked: (user?.streakCount || 0) >= 7, description: "7-day recording streak" },
    { id: 6, name: "Legend", icon: "🏆", unlocked: stories.length >= 10, description: "Share 10 stories" },
  ];

  const categories = ['all', 'Childhood', 'Family', 'Career', 'Romance', 'Adventure', 'Wisdom'];
  
  const filteredStories = stories.filter(story => {
    const matchesCategory = filterCategory === 'all' || story.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      story.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { label: 'Stories', value: stories.length, icon: FiBook, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Hearts', value: totalHearts, icon: FiHeart, color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50', textColor: 'text-red-600' },
    { label: 'Views', value: totalViews, icon: FiTrendingUp, color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { label: 'Streak', value: user?.streakCount || 0, icon: FiZap, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-600' }
  ];

  const recentActivity = [
    { type: 'heart', user: 'Sarah', story: 'The Day I Met Your Grandmother', time: '2h ago' },
    { type: 'comment', user: 'Michael', story: 'My First Job', time: '5h ago' },
    { type: 'view', user: 'Emily', story: 'The Great Storm of 85', time: '1d ago' },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header />
      
      {/* Floating Particles Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Welcome Section with Animated Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 mb-3 tracking-tight">
                  Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-slate-600 text-xl flex items-center gap-2">
                  {stories.length > 0 
                    ? `You have ${stories.length} precious ${stories.length === 1 ? 'memory' : 'memories'} preserved` 
                    : "Let's start preserving your precious memories"}
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAchievements(true)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <FiAward className="w-5 h-5" />
                  Achievements
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCalendar(true)}
                  className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <FiCalendar className="w-5 h-5" />
                  Calendar
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Enhanced Stats Grid with Hover Effects */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
            >
              {/* Animated Background Gradient */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              
              {/* Icon with Animated Background */}
              <div className={`relative w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
              </div>
              
              {/* Stats Content */}
              <div className="relative">
                <motion.p 
                  className="text-4xl font-black text-slate-900 mb-1 tracking-tight"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase">{stat.label}</p>
              </div>

              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{ translateX: ['100%', '-100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {/* Today's Prompt - Takes 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden">
              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              
              {/* Floating Orbs */}
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-3xl">💭</span>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">Today's Memory Prompt</h2>
                      <p className="text-blue-200 text-sm">Unlock a new memory</p>
                    </div>
                  </div>
                  <motion.p 
                    className="text-xl text-slate-100 mb-8 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    "{todayPrompt}"
                  </motion.p>
                  <Link
                    to="/record"
                    className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl group"
                  >
                    <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    Record Your Story
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
                <motion.div 
                  className="hidden md:block text-8xl opacity-20"
                  animate={{ rotate: [0, 10, 0], y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  🎤
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity - Takes 1 column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FiClock className="w-5 h-5 text-blue-500" />
                Recent Activity
              </h3>
            </div>
            <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'heart' ? 'bg-red-100' :
                    activity.type === 'comment' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'heart' && <FiHeart className="w-5 h-5 text-red-500" />}
                    {activity.type === 'comment' && <FiMessageCircle className="w-5 h-5 text-blue-500" />}
                    {activity.type === 'view' && <FiTrendingUp className="w-5 h-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {activity.user}
                      <span className="font-normal text-slate-600">
                        {activity.type === 'heart' ? ' loved' : 
                         activity.type === 'comment' ? ' commented on' : ' viewed'}
                      </span>
                    </p>
                    <p className="text-sm text-slate-500 truncate">{activity.story}</p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <FiClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No recent activity yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Stories Section with Enhanced Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-1 flex items-center gap-3">
                Your Stories
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {filteredStories.length}
                </span>
              </h2>
              <p className="text-slate-600">Your preserved memories and family narratives</p>
            </div>
            
            {stories.length > 0 && (
              <div className="flex items-center gap-3">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'grid' 
                        ? 'bg-white shadow-sm text-slate-900' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white shadow-sm text-slate-900' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>

                <Link
                  to="/record"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FiPlus />
                  Add New
                </Link>
              </div>
            )}
          </div>

          {/* Search and Filter Bar */}
          {stories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 space-y-4"
            >
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search your stories..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-slate-700"
                />
              </div>

              {/* Category Filters */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(category => (
                  <motion.button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-5 py-2.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                      filterCategory === category
                        ? 'bg-slate-900 text-white shadow-lg'
                        : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {category === 'all' ? '📚 All' : category}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
          
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="xl" />
            </div>
          ) : stories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gradient-to-br from-white to-blue-50/30 border-2 border-dashed border-slate-300 rounded-3xl p-12 md:p-20 text-center overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
              />
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <FiBook className="w-12 h-12 text-blue-600" />
                </motion.div>
                <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                  No stories yet
                </h3>
                <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Start preserving your precious memories today. Every story matters,
                  every memory is a treasure. ✨
                </p>
                <Link
                  to="/record"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-900 to-blue-900 text-white px-10 py-5 rounded-xl font-bold hover:shadow-2xl transition-all duration-300 shadow-xl group"
                >
                  <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                  Record Your First Story
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              <AnimatePresence>
                {filteredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <StoryCard story={story} viewMode={viewMode} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredStories.length === 0 && stories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FiSearch className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No stories found</h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </div>
      </main>

      {/* Achievements Modal */}
      <AnimatePresence>
        {showAchievements && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAchievements(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                      <FiAward className="w-7 h-7 text-amber-500" />
                      Your Achievements
                    </h3>
                    <p className="text-slate-600 mt-1">
                      {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAchievements(false)}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <FiPlus className="w-6 h-6 text-slate-400 rotate-45" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh] grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-6 rounded-2xl border-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-lg'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    {achievement.unlocked && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <FiCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-bold text-slate-900 mb-1">{achievement.name}</h4>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;