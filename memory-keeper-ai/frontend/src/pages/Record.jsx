// src/pages/Record.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createStory } from '../redux/slices/storySlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMic, 
  FiType, 
  FiArrowRight, 
  FiLoader, 
  FiCheck, 
  FiRefreshCw, 
  FiPlay, 
  FiPause, 
  FiDownload, 
  FiEdit3, 
  FiBook, 
  FiClock, 
  FiBarChart2, 
  FiX 
} from 'react-icons/fi';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { aiAPI } from '../api/ai.api';
import { uploadAPI } from '../api/upload.api';

// Clean transcript function
const cleanTranscript = (text) => {
  if (!text || typeof text !== 'string') return '';
  const words = text.trim().split(/\s+/);
  const uniqueWordsInOrder = [];
  const seen = new Set();
  for (let i = words.length - 1; i >= 0; i--) {
    const word = words[i].toLowerCase().replace(/[.,!?]/g, '');
    if (word && !seen.has(word)) {
      uniqueWordsInOrder.unshift(words[i]);
      seen.add(word);
    }
  }
  let cleanedText = uniqueWordsInOrder.join(' ');
  if (cleanedText.length > 0) {
    cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
    if (!/[.!?]$/.test(cleanedText)) cleanedText += '.';
  }
  if (cleanedText.length < 20 || cleanedText.split(' ').length < 5) {
    toast.warn("Recording was too short. Please try to speak for at least a few seconds.");
    return null;
  }
  return cleanedText;
};

const Record = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [step, setStep] = useState('record'); // record, enhance, preview
  const [mode, setMode] = useState('voice'); // voice or text
  const [transcript, setTranscript] = useState(''); // Unified state for both voice and text
  const [aiResponse, setAiResponse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const [todayPrompt, setTodayPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(true);
  
  const {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();
  
  const {
    transcript: speechTranscript,
    setTranscript: setSpeechTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();
  
  // Daily prompts database
  const prompts = [
    { text: "What was your favorite meal as a child, and who made it?", category: "Childhood" },
    { text: "Describe your first day at school. What do you remember?", category: "Education" },
    { text: "Tell me about a time you felt extremely proud of yourself.", category: "Achievement" },
    { text: "What was your wedding day like? Share every detail.", category: "Milestone" },
    { text: "Describe the house you grew up in. Which room was your favorite?", category: "Home" },
    { text: "Who was the most influential person in your life and why?", category: "Relationships" },
    { text: "What was your first job? What did you learn from it?", category: "Career" },
    { text: "Describe a tradition your family has always followed.", category: "Culture" }
  ];
  
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setCurrentPromptIndex(randomIndex);
    setTodayPrompt(prompts[randomIndex]);
  }, []);
  
  // Sync speech transcript with component state (only in voice mode)
  useEffect(() => {
    if (mode === 'voice') {
      setTranscript(speechTranscript);
    }
  }, [speechTranscript, mode]);
  
  const shufflePrompt = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * prompts.length);
    } while (newIndex === currentPromptIndex);
    setCurrentPromptIndex(newIndex);
    setTodayPrompt(prompts[newIndex]);
  };
  
  const handleStartRecording = async () => {
    await startRecording();
    if (isSupported) {
      startListening();
    }
  };
  
  const handleStopRecording = () => {
    stopRecording();
    if (isListening) {
      stopListening();
    }
  };
  
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Reset everything when switching modes
    setTranscript('');
    resetTranscript();
    resetRecording();
  };
  
  const processingStages = [
    { id: 0, label: 'Analyzing content', icon: FiBarChart2 },
    { id: 1, label: 'Enhancing narrative', icon: FiEdit3 },
    { id: 2, label: 'Generating imagery', icon: FiBook },
    { id: 3, label: 'Detecting emotions', icon: FiClock },
    { id: 4, label: 'Finalizing story', icon: FiCheck }
  ];
  
  const handleContinue = async () => {
    const cleanedTranscript = cleanTranscript(transcript);
    if (!cleanedTranscript) return;
    
    setProcessing(true);
    setStep('enhance');
    
    try {
      // Upload audio if exists
      let audioUrl = '';
      if (audioBlob) {
        setProcessingStage(0);
        toast.info('📤 Uploading audio...');
        const uploadResponse = await uploadAPI.uploadAudio(audioBlob);
        audioUrl = uploadResponse.data.data;
        toast.success('✅ Audio uploaded!');
      }
      
      // Simulate processing stages
      for (let i = 1; i <= 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProcessingStage(i);
      }
      
      // Enhance with AI
      toast.info('🤖 AI is enhancing your story...');
      const response = await aiAPI.enhanceStory(cleanedTranscript);
      
      const enhancedData = {
        ...response.data.data,
        audioUrl,
        originalTranscript: transcript,
        cleanedTranscript: cleanedTranscript,
      };
      
      setAiResponse(enhancedData);
      setStep('preview');
      toast.success('✨ Story enhanced!');
      
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(error.response?.data?.message || 'Failed to process story. Please try again.');
      setStep('record');
    } finally {
      setProcessing(false);
      setProcessingStage(0);
    }
  };
  
  const handleSaveStory = async () => {
    setProcessing(true);
    
    try {
      const storyData = {
        userId: user.id,
        title: aiResponse.title,
        transcript: aiResponse.cleanedTranscript,
        enhancedStory: aiResponse.enhancedStory,
        summary: aiResponse.summary,
        audioUrl: aiResponse.audioUrl,
        imageUrl: aiResponse.imageUrl,
        category: aiResponse.category,
        sentimentLabel: aiResponse.sentimentLabel,
        sentimentScore: aiResponse.sentimentScore,
        wordCount: aiResponse.wordCount,
        tags: aiResponse.tags,
        emotions: aiResponse.emotions,
        isPublic: false
      };
      
      await dispatch(createStory(storyData)).unwrap();
      
      toast.success('🎉 Story saved successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save story');
    } finally {
      setProcessing(false);
    }
  };
  
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const wordCount = transcript.split(/\s+/).filter(w => w).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  const getStepIcon = (stepName) => {
    const icons = {
      record: FiMic,
      enhance: FiLoader,
      preview: FiBook
    };
    return icons[stepName] || FiCheck;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
              <motion.div
                className="h-full bg-gradient-to-r from-slate-900 to-slate-700"
                initial={{ width: '0%' }}
                animate={{
                  width: step === 'record' ? '0%' : step === 'enhance' ? '50%' : '100%'
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            {/* Steps */}
            <div className="relative flex items-center justify-between">
              {['record', 'enhance', 'preview'].map((stepName, index) => {
                const StepIcon = getStepIcon(stepName);
                const isActive = step === stepName;
                const isCompleted = 
                  (step === 'enhance' && index === 0) ||
                  (step === 'preview' && index < 2);
                
                return (
                  <div key={stepName} className="flex flex-col items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-slate-900 text-white'
                          : isActive
                          ? 'bg-slate-900 text-white ring-4 ring-slate-200'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {isCompleted ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </motion.div>
                    <span className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {stepName.charAt(0).toUpperCase() + stepName.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {/* STEP 1: RECORD */}
          {step === 'record' && (
            <motion.div
              key="record"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Prompt Card */}
              {showPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                >
                  <button
                    onClick={() => setShowPrompt(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-start gap-4 pr-8">
                    <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center">
                      <FiBook className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                          Suggested Prompt
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                          {todayPrompt.category}
                        </span>
                      </div>
                      <p className="text-lg text-slate-700 leading-relaxed mb-4">
                        "{todayPrompt.text}"
                      </p>
                      <button
                        onClick={shufflePrompt}
                        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                      >
                        <FiRefreshCw className="w-4 h-4" />
                        Get another prompt
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Mode Selection */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-semibold text-slate-900">Recording Method</h2>
                  <p className="text-sm text-slate-600 mt-1">Choose how you'd like to capture your story</p>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <motion.button
                      onClick={() => handleModeChange('voice')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        mode === 'voice'
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {mode === 'voice' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center"
                        >
                          <FiCheck className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                          <FiMic className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1 text-slate-900">Voice Recording</h3>
                        <p className="text-sm text-slate-600">
                          Speak naturally with live transcription
                        </p>
                      </div>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => handleModeChange('text')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        mode === 'text'
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {mode === 'text' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center"
                        >
                          <FiCheck className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                      <div className="flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-3">
                          <FiType className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1 text-slate-900">Text Input</h3>
                        <p className="text-sm text-slate-600">
                          Type your story directly
                        </p>
                      </div>
                    </motion.button>
                  </div>
                  
                  {/* Voice Recording UI */}
                  {mode === 'voice' && (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl">
                        {!isRecording && !audioBlob && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                          >
                            <motion.button
                              onClick={handleStartRecording}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white hover:bg-slate-800 transition-colors shadow-lg mb-4 mx-auto"
                            >
                              <FiMic className="w-10 h-10" />
                            </motion.button>
                            <p className="text-slate-600 font-medium">
                              Click to start recording
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              Speak clearly and take your time
                            </p>
                          </motion.div>
                        )}
                        
                        {isRecording && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center"
                          >
                            <div className="relative mb-6">
                              {/* Pulsing rings */}
                              {[0, 1, 2].map((i) => (
                                <motion.div
                                  key={i}
                                  className="absolute inset-0 border-4 border-red-500 rounded-full"
                                  initial={{ scale: 1, opacity: 0.6 }}
                                  animate={{
                                    scale: [1, 1.5, 2],
                                    opacity: [0.6, 0.3, 0]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.6
                                  }}
                                  style={{
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                />
                              ))}
                              
                              <motion.button
                                onClick={handleStopRecording}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors shadow-xl"
                              >
                                <div className="w-8 h-8 bg-white rounded"></div>
                              </motion.button>
                            </div>
                            
                            <div className="space-y-2">
                              <p className="text-2xl font-mono font-bold text-slate-900">
                                {formatDuration(duration)}
                              </p>
                              <p className="text-red-600 font-medium flex items-center justify-center gap-2">
                                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                                Recording in progress
                              </p>
                              <p className="text-sm text-slate-500">
                                Click to stop recording
                              </p>
                            </div>
                          </motion.div>
                        )}
                        
                        {audioBlob && !isRecording && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md space-y-4"
                          >
                            <div className="flex items-center justify-center gap-2 mb-4">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <FiCheck className="w-6 h-6 text-green-600" />
                              </div>
                              <div className="text-left">
                                <p className="font-semibold text-slate-900">Recording Complete</p>
                                <p className="text-sm text-slate-600">Duration: {formatDuration(duration)}</p>
                              </div>
                            </div>
                            
                            <audio
                              controls
                              src={URL.createObjectURL(audioBlob)}
                              className="w-full"
                            />
                            
                            <button
                              onClick={() => {
                                resetRecording();
                                resetTranscript();
                                setTranscript('');
                              }}
                              className="w-full py-3 px-4 border-2 border-slate-300 text-slate-700 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all font-medium flex items-center justify-center gap-2"
                            >
                              <FiRefreshCw className="w-4 h-4" />
                              Record Again
                            </button>
                          </motion.div>
                        )}
                      </div>
                      
                      {/* Live Transcript */}
                      {transcript && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="bg-white border border-slate-200 rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                              <FiEdit3 className="w-4 h-4" />
                              Live Transcription
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>{wordCount} words</span>
                              <span>{readingTime} min read</span>
                            </div>
                          </div>
                          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {transcript}
                            {isRecording && (
                              <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-0.5 h-5 bg-slate-900 ml-1"
                              />
                            )}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}
                  
                  {/* Text Input UI */}
                  {mode === 'text' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <textarea
                          value={transcript}
                          onChange={(e) => setTranscript(e.target.value)}
                          className="w-full h-80 p-6 border-2 border-slate-200 rounded-xl focus:border-slate-900 focus:ring-4 focus:ring-slate-100 transition-all resize-none text-slate-700 leading-relaxed"
                          placeholder="Begin writing your story here. Take your time and include as much detail as you remember..."
                        />
                        {transcript && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute bottom-4 right-4 flex items-center gap-4 text-sm text-slate-500"
                          >
                            <span className="font-medium">{wordCount} words</span>
                            <span>•</span>
                            <span>{readingTime} min read</span>
                          </motion.div>
                        )}
                      </div>
                      
                      {transcript && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                          <FiClock className="w-4 h-4" />
                          <span>Auto-saved locally</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Continue Button */}
                  {transcript.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8"
                    >
                      <button
                        onClick={handleContinue}
                        disabled={processing}
                        className="w-full py-4 px-6 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                      >
                        Continue to Enhancement
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
          
          {/* STEP 2: ENHANCE (Processing) */}
          {step === 'enhance' && (
            <motion.div
              key="enhance"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-slate-200 rounded-xl shadow-sm p-12"
            >
              <div className="max-w-md mx-auto text-center">
                {/* Processing Animation */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <motion.div
                    className="absolute inset-0 border-4 border-slate-200 rounded-full"
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {React.createElement(processingStages[processingStage].icon, {
                        className: "w-12 h-12 text-slate-900"
                      })}
                    </motion.div>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-2 text-slate-900">
                  Processing Your Story
                </h2>
                <p className="text-slate-600 mb-8">
                  Our AI is analyzing and enhancing your narrative
                </p>
                
                {/* Processing Stages */}
                <div className="space-y-3 text-left">
                  {processingStages.map((stage, index) => {
                    const StageIcon = stage.icon;
                    const isCompleted = index < processingStage;
                    const isActive = index === processingStage;
                    
                    return (
                      <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isActive ? 'bg-slate-50' : ''
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          isCompleted
                            ? 'bg-slate-900 text-white'
                            : isActive
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {isCompleted ? (
                            <FiCheck className="w-4 h-4" />
                          ) : (
                            <StageIcon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`font-medium ${
                          isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'
                        }`}>
                          {stage.label}
                        </span>
                        {isActive && (
                          <motion.div
                            className="ml-auto flex gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-slate-400 rounded-full"
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.2
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                
                <p className="text-sm text-slate-500 mt-8">
                  Processing typically takes 15-30 seconds
                </p>
              </div>
            </motion.div>
          )}
          
          {/* STEP 3: PREVIEW */}
          {step === 'preview' && aiResponse && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* AI Generated Image */}
              {aiResponse.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    {/* Image Loading Skeleton */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
                    
                    <motion.img
                      src={aiResponse.imageUrl}
                      alt={aiResponse.title}
                      className="relative w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* AI Generated Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-medium text-slate-700 flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                      AI Generated
                    </div>
                    
                    {/* Image Controls Overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors shadow-lg"
                        title="Download Image"
                      >
                        <FiDownload className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-colors shadow-lg"
                        title="Regenerate Image"
                      >
                        <FiRefreshCw className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
              
              {/* Enhanced Story Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  {/* Story Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight"
                  >
                    {aiResponse.title}
                  </motion.h1>
                  
                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-slate-200"
                  >
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiBook className="w-4 h-4" />
                      <span className="text-sm font-medium">{aiResponse.wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <FiClock className="w-4 h-4" />
                      <span className="text-sm font-medium">{Math.ceil(aiResponse.wordCount / 200)} min read</span>
                    </div>
                    {aiResponse.audioUrl && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <FiMic className="w-4 h-4" />
                        <span className="text-sm font-medium">{formatDuration(duration)} audio</span>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Metadata Tags */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-2 mb-8"
                  >
                    {/* Category */}
                    {aiResponse.category && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold flex items-center gap-2"
                      >
                        <FiBook className="w-3.5 h-3.5" />
                        {aiResponse.category}
                      </motion.span>
                    )}
                    
                    {/* Sentiment */}
                    {aiResponse.sentimentLabel && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                          aiResponse.sentimentLabel === 'POSITIVE'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : aiResponse.sentimentLabel === 'NEGATIVE'
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}
                      >
                        <span className="text-base">
                          {aiResponse.sentimentLabel === 'POSITIVE' && '😊'}
                          {aiResponse.sentimentLabel === 'NEGATIVE' && '😢'}
                          {aiResponse.sentimentLabel === 'NEUTRAL' && '😐'}
                        </span>
                        {aiResponse.sentimentLabel}
                      </motion.span>
                    )}
                    
                    {/* Tags */}
                    {aiResponse.tags?.slice(0, 5).map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        whileHover={{ scale: 1.05, backgroundColor: '#f1f5f9' }}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium cursor-pointer transition-colors"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                  
                  {/* Emotions Visualization */}
                  {aiResponse.emotions && aiResponse.emotions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100"
                    >
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <FiBarChart2 className="w-4 h-4" />
                        Detected Emotions
                      </h3>
                      <div className="space-y-3">
                        {aiResponse.emotions.slice(0, 5).map((emotion, index) => {
                          const emotionEmojis = {
                            joy: '😊',
                            sadness: '😢',
                            anger: '😠',
                            fear: '😰',
                            surprise: '😲',
                            love: '❤️',
                            gratitude: '🙏',
                            pride: '🌟'
                          };
                          
                          const emotionColors = {
                            joy: 'from-yellow-400 to-orange-400',
                            sadness: 'from-blue-400 to-blue-600',
                            anger: 'from-red-400 to-red-600',
                            fear: 'from-purple-400 to-purple-600',
                            surprise: 'from-pink-400 to-pink-600',
                            love: 'from-rose-400 to-rose-600',
                            gratitude: 'from-green-400 to-green-600',
                            pride: 'from-amber-400 to-amber-600'
                          };
                          
                          const percentage = Math.round(emotion.score * 100);
                          
                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-slate-700 flex items-center gap-2">
                                  <span className="text-lg">
                                    {emotionEmojis[emotion.label.toLowerCase()] || '💭'}
                                  </span>
                                  {emotion.label}
                                </span>
                                <span className="text-slate-600 font-semibold">{percentage}%</span>
                              </div>
                              <div className="h-2 bg-white rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                                  className={`h-full bg-gradient-to-r ${emotionColors[emotion.label.toLowerCase()] || 'from-slate-400 to-slate-600'} rounded-full`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Enhanced Story Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="prose prose-lg max-w-none"
                  >
                    {aiResponse.enhancedStory.split('\n\n').map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="mb-6 text-slate-700 leading-relaxed text-lg"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </motion.div>
                  
                  {/* Story Actions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 pt-8 border-t border-slate-200 flex flex-wrap gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                      <FiPlay className="w-4 h-4" />
                      Listen to Story
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                      <FiDownload className="w-4 h-4" />
                      Download
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      Edit Story
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Original Transcript Accordion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
              >
                <details className="group">
                  <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <FiEdit3 className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Original Transcript</h3>
                        <p className="text-sm text-slate-600">View your original recording</p>
                      </div>
                    </div>
                    <motion.div
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.div>
                  </summary>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-6 py-4 bg-amber-50 border-t border-amber-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-amber-800 font-medium">Raw Transcription</span>
                      <button className="px-3 py-1.5 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors flex items-center gap-2">
                        <FiEdit3 className="w-3.5 h-3.5" />
                        Copy
                      </button>
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {aiResponse.originalTranscript || aiResponse.cleanedTranscript}
                    </p>
                  </motion.div>
                </details>
              </motion.div>
              
              {/* Follow-up Questions */}
              {aiResponse.questions && aiResponse.questions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Deepen Your Story
                      </h3>
                      <p className="text-sm text-slate-600">
                        AI suggests adding these details
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {aiResponse.questions.map((question, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-blue-700 text-xs font-bold">{index + 1}</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{question}</p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-shrink-0 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5"
                          >
                            <FiMic className="w-3.5 h-3.5" />
                            Answer
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={handleSaveStory}
                  disabled={processing}
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  className="flex-1 relative overflow-hidden py-4 px-6 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  {processing ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin" />
                      <span>Saving Story</span>
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ...
                      </motion.span>
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Save & Share Story</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                  
                  {/* Success animation overlay */}
                  {processing && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    setStep('record');
                    setAiResponse(null);
                    setTranscript('');
                    resetRecording();
                    resetTranscript();
                  }}
                  disabled={processing}
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  className="sm:w-auto py-4 px-6 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <FiRefreshCw className="w-5 h-5" />
                  Start Over
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Floating Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-slate-900 text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center z-40"
        title="Need help?"
      >
        <span className="text-2xl">?</span>
      </motion.button>
      
      {/* Keyboard Shortcuts Hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-8 left-8 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-lg text-sm text-slate-600 hidden lg:block"
      >
        Press <kbd className="px-2 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-mono">?</kbd> for shortcuts
      </motion.div>
    </div>
  );
};

export default Record;