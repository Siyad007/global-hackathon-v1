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
          'rgba(15, 23, 42, 0.9)',    // slate-900
          'rgba(51, 65, 85, 0.9)',    // slate-700
          'rgba(100, 116, 139, 0.9)', // slate-500
          'rgba(148, 163, 184, 0.9)', // slate-400
          'rgba(203, 213, 225, 0.9)', // slate-300
        ],
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 1,
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
          'rgba(34, 197, 94, 0.9)',  // green for positive
          'rgba(239, 68, 68, 0.9)',  // red for negative
          'rgba(148, 163, 184, 0.9)', // slate for neutral
        ],
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const emotionsChartData = {
    labels: Object.keys(emotionsData).slice(0, 6),
    datasets: [
      {
        label: 'Top Emotions',
        data: Object.values(emotionsData).slice(0, 6),
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(15, 23, 42, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          font: {
            family: 'system-ui, -apple-system, sans-serif',
            size: 12,
            weight: '500'
          },
          color: '#475569',
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#fff',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 13,
          weight: '600'
        },
        bodyFont: {
          size: 12
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(226, 232, 240, 0.5)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };
  
  const stats = [
    { label: 'Total Stories', value: totalStories, icon: FiTrendingUp },
    { label: 'Total Hearts', value: totalHearts, icon: FiHeart },
    { label: 'Total Views', value: totalViews, icon: FiClock },
    { label: 'Avg Words', value: Math.round(avgWordsPerStory), icon: FiAward }
  ];
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
            Analytics Dashboard 📊
          </h1>
          <p className="text-slate-600 text-xl">
            Insights into your storytelling journey
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
        
        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Stories by Category</h2>
            <div className="flex items-center justify-center">
              <Pie data={categoryChartData} options={chartOptions} />
            </div>
          </motion.div>
          
          {/* Sentiment Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Sentiment Analysis</h2>
            <div className="flex items-center justify-center">
              <Pie data={sentimentChartData} options={chartOptions} />
            </div>
          </motion.div>
        </div>
        
        {/* Emotions Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Top Emotions in Your Stories</h2>
          <Bar data={emotionsChartData} options={barChartOptions} />
        </motion.div>

        {/* No Data State */}
        {stories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-12 md:p-16 text-center mt-8"
          >
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiTrendingUp className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
              No Analytics Yet
            </h3>
            <p className="text-slate-600 text-lg max-w-md mx-auto leading-relaxed">
              Start recording your stories to see detailed analytics and insights about your storytelling journey.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Analytics;