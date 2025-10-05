// src/components/ai/AIEnhancer.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';

const AIEnhancer = ({ isProcessing }) => {
  if (!isProcessing) {
    return null;
  }

  return (
    <motion.div
      key="enhance"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl shadow-lg p-12 text-center"
    >
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <FiLoader className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">AI is Crafting Your Story ✨</h2>
        <p className="text-gray-500 mt-8">This may take a few moments...</p>
      </div>
    </motion.div>
  );
};

export default AIEnhancer; // <-- THIS LINE FIXES THE ERROR