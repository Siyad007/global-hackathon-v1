// src/components/audio/AudioRecorder.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiMic, FiSquare, FiCheck, FiX } from 'react-icons/fi';
import Button from '../common/Button';

const AudioRecorder = ({
  isRecording,
  audioBlob,
  duration,
  onStart,
  onStop,
  onReset,
  onConfirm
}) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-center py-8">
      {!isRecording && !audioBlob && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <button
            onClick={onStart}
            className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all mx-auto group"
          >
            <FiMic className="w-16 h-16 group-hover:scale-110 transition-transform" />
          </button>
          <p className="mt-6 text-gray-600 font-medium">
            Click to start recording
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Speak naturally, we'll transcribe everything
          </p>
        </motion.div>
      )}
      
      {isRecording && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="relative inline-block mb-6">
            <button
              onClick={onStop}
              className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-2xl mx-auto relative overflow-hidden"
            >
              <FiSquare className="w-12 h-12 relative z-10" />
              <div className="absolute inset-0 bg-red-500 animate-pulse opacity-30" />
            </button>
            {/* Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-75" />
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-red-600">
              {formatDuration(duration)}
            </p>
            <p className="text-gray-600">
              Recording... Click to stop
            </p>
            
            {/* Waveform Animation */}
            <div className="flex items-center justify-center gap-1 h-12">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-red-500 rounded-full"
                  animate={{
                    height: [20, Math.random() * 40 + 20, 20]
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
      
      {audioBlob && !isRecording && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="text-6xl mb-4">✅</div>
          <p className="text-xl font-semibold text-gray-900">
            Recording Complete!
          </p>
          
          {/* Audio Player */}
          <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
            <audio
              controls
              src={URL.createObjectURL(audioBlob)}
              className="w-full"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onConfirm}
              variant="primary"
              size="lg"
            >
              <FiCheck className="mr-2" />
              Use This Recording
            </Button>
            
            <Button
              onClick={onReset}
              variant="secondary"
              size="lg"
            >
              <FiX className="mr-2" />
              Record Again
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AudioRecorder;