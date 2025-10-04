// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMic, FiCpu, FiHeart, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const Landing = () => {
  const features = [
    {
      icon: <FiMic className="w-12 h-12" />,
      title: 'Record Your Story',
      description: 'Voice or text recording with live transcription. No downloads needed.'
    },
    {
      icon: <FiCpu className="w-12 h-12" />,
      title: 'AI Enhancement',
      description: 'Transform raw memories into beautiful stories with AI magic.'
    },
    {
      icon: <FiHeart className="w-12 h-12" />,
      title: 'Share Forever',
      description: 'Stories preserved forever. Family can access from anywhere.'
    }
  ];
  
  const benefits = [
    '100% Free Forever',
    'AI-Powered Story Enhancement',
    'Voice Recording & Transcription',
    'Sentiment Analysis',
    'Image Generation',
    'Family Sharing',
    'Analytics Dashboard',
    'Search & Filter Stories'
  ];
  
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📖</span>
              <span className="text-xl font-bold gradient-text">Memory Keeper</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn-primary"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-primary-800">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Don't Let Memories Die 🕊️
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Turn conversations into immortality. AI-powered platform that preserves 
              family stories forever.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Start Free ✨
                <FiArrowRight />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/20 transition-all duration-200"
              >
                Login
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-white"
            >
              {benefits.slice(0, 4).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-400 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to preserve memories forever
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Everything You Need, 100% Free
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Advanced AI features without spending a penny. We believe everyone 
                deserves to preserve their family legacy.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link
                to="/signup"
                className="mt-8 inline-block btn-primary"
              >
                Get Started Free
                <FiArrowRight className="inline ml-2" />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="text-6xl mb-4">👵📖❤️👨‍👩‍👧‍👦</div>
                <p className="text-lg text-gray-700">
                  "This app helped me preserve my grandmother's stories before it was too late. 
                  Now my kids can hear her voice anytime they want."
                </p>
                <p className="mt-4 font-semibold">- Sarah M.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Preserve Your Legacy?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands preserving family memories with AI
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started Free 🚀
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Memory Keeper. Made with ❤️ for preserving family stories.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;