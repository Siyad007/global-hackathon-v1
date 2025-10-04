// src/pages/Analytics.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import Header from '../components/layout/Header';
import { FiTrendingUp, FiHeart, FiClock, FiAward } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { stories } = useSelector(state => state.story);
  const { user } = useSelector(state => state.auth);
  
  // Calculate analytics
  const totalStories = stories.length;
  const totalHearts = stories.reduce((acc, s) => acc + (s.reactionCounts?.hearts || 0), 0);
  const totalViews = stories.reduce((acc, s) => acc + (s.viewsCount || 0), 0);
  const avgWordsPerStory = stories.reduce((acc, s) => acc + (s.wordCount || 0), 0) / totalStories || 0;
  
  // Category distribution
  const categoryData = stories.reduce((acc, story) => {
    const category = story.category || 'GENERAL';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  
  // Sentiment distribution
  const sentimentData = stories.reduce((acc, story) => {
    const sentiment = story.sentimentLabel || 'NEUTRAL';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});
  
  // Emotions distribution
  const emotionsData = stories.reduce((acc, story) => {
    story.emotions?.forEach(emotion => {
      acc[emotion.label] = (acc[emotion.label] || 0) + 1;
    });
    return acc;
  }, {});
  
  const categoryChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Stories by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
      },
    ],
  };
  
  const sentimentChartData = {
    labels: Object.keys(sentimentData),
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: Object.values(sentimentData),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(234, 179, 8, 0.8)',
        ],
      },
    ],
  };
  
  const emotionsChartData = {
    labels: Object.keys(emotionsData).slice(0, 6),
    datasets: [
      {
        label: 'Top Emotions',
        data: Object.values(emotionsData).slice(0, 6),
        backgroundColor: 'rgba(168, 85, 247, 0.8)',
      },
    ],
  };
  
  const stats = [
    { label: 'Total Stories', value: totalStories, icon: FiTrendingUp, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Hearts', value: totalHearts, icon: FiHeart, color: 'from-pink-500 to-rose-500' },
    { label: 'Total Views', value: totalViews, icon: FiClock, color: 'from-purple-500 to-indigo-500' },
    { label: 'Avg Words', value: Math.round(avgWordsPerStory), icon: FiAward, color: 'from-orange-500 to-amber-500' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Analytics Dashboard 📊
          </h1>
          <p className="text-gray-600 text-lg">
            Insights into your storytelling journey
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
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Stories by Category</h2>
            <Pie data={categoryChartData} />
          </motion.div>
          
          {/* Sentiment Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
            <Pie data={sentimentChartData} />
          </motion.div>
        </div>
        
        {/* Emotions Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-xl font-bold mb-4">Top Emotions in Your Stories</h2>
          <Bar data={emotionsChartData} options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }} />
        </motion.div>
      </main>
    </div>
  );
};

export default Analytics;