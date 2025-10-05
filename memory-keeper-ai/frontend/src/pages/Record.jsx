// src/pages/Record.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createStory } from '../redux/slices/storySlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiType, FiArrowRight, FiCheck } from 'react-icons/fi';

import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import AIEnhancer from '../components/ai/AIEnhancer';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { aiAPI } from '../api/ai.api';
import { uploadAPI } from '../api/upload.api';

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
  
  const [step, setStep] = useState('record');
  const [mode, setMode] = useState('voice');
  const [transcript, setTranscript] = useState(''); // Unified state for both voice and text
  const [aiResponse, setAiResponse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState('');
  
  const { isRecording, audioBlob, duration, startRecording, stopRecording, resetRecording } = useAudioRecorder();
  const { transcript: speechTranscript, isListening, isSupported, startListening, stopRecording: stopSpeechListening, resetTranscript } = useSpeechRecognition();
  
  useEffect(() => {
    const prompts = ["What was your favorite meal as a child?", "Describe your first day at school.", "Tell me about a time you felt proud."];
    setTodayPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);
  
  // --- START OF CHANGE ---
  // This is the only change needed for the state logic.
  // It directly syncs the component's transcript state with the hook's output.
  useEffect(() => {
    if (mode === 'voice') {
      setTranscript(speechTranscript);
    }
  }, [speechTranscript, mode]);
  // --- END OF CHANGE ---
  
  const handleStartRecording = async () => {
    await startRecording();
    if (isSupported) {
      startListening(); // The hook now handles resetting its internal transcript
    }
  };
  
  const handleStopRecording = () => {
    stopRecording();
    if (isListening) {
      stopSpeechListening();
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Reset everything when switching modes
    setTranscript('');
    resetTranscript();
    resetRecording();
  };
  
  const handleContinue = async () => {
    const cleanedTranscript = cleanTranscript(transcript);
    if (!cleanedTranscript) return;
    
    setProcessing(true);
    setStep('enhance');
    
    try {
      let audioUrl = '';
      if (audioBlob) {
        toast.info('📤 Uploading audio...');
        const uploadResponse = await uploadAPI.uploadAudio(audioBlob);
        audioUrl = uploadResponse.data.data;
        toast.success('✅ Audio uploaded!');
      }
      
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
    }
  };
  
  const handleSaveStory = async () => {
    // ... (This function is correct and does not need changes)
    setProcessing(true);
    try {
        const storyData = { userId: user.id, title: aiResponse.title, transcript: aiResponse.cleanedTranscript, enhancedStory: aiResponse.enhancedStory, summary: aiResponse.summary, audioUrl: aiResponse.audioUrl, imageUrl: aiResponse.imageUrl, category: aiResponse.category, sentimentLabel: aiResponse.sentimentLabel, sentimentScore: aiResponse.sentimentScore, wordCount: aiResponse.wordCount, tags: aiResponse.tags, emotions: aiResponse.emotions, isPublic: false };
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Progress steps UI */}
        <div className="mb-8">
            {/* ... (no changes needed here) ... */}
        </div>
        
        <AnimatePresence mode="wait">
          {step === 'record' && (
            <motion.div key="record" className="space-y-6">
              {/* Prompt Card */}
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-6">
                  {/* ... (no changes needed here) ... */}
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Choose Your Method</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <button onClick={() => handleModeChange('voice')} className={`p-6 rounded-xl border-2 transition-all ${mode === 'voice' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                    <FiMic className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                    <h3 className="font-bold text-lg mb-1">Voice Recording</h3>
                    <p className="text-sm text-gray-600">Speak naturally, we'll transcribe</p>
                  </button>
                  <button onClick={() => handleModeChange('text')} className={`p-6 rounded-xl border-2 transition-all ${mode === 'text' ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                    <FiType className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                    <h3 className="font-bold text-lg mb-1">Type Your Story</h3>
                    <p className="text-sm text-gray-600">Prefer to type? That works too!</p>
                  </button>
                </div>
                
                {mode === 'voice' && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      {!isRecording && !audioBlob && (
                        <div>
                          <button onClick={handleStartRecording} className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl hover:shadow-2xl transform hover:scale-110 transition-all mx-auto"><FiMic/></button>
                          <p className="mt-4 text-gray-600">Click to start recording</p>
                        </div>
                      )}
                      {isRecording && (
                        <div>
                          <button onClick={handleStopRecording} className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-white text-5xl animate-pulse hover:shadow-2xl mx-auto"><FiCheck/></button>
                          <p className="mt-4 text-red-600 font-bold text-lg">Recording... {formatDuration(duration)}</p>
                          <p className="text-gray-500 text-sm">Click to stop</p>
                        </div>
                      )}
                      {audioBlob && !isRecording && (
                        <div className="space-y-4">
                          <div className="text-5xl mb-4">✅</div>
                          <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-md mx-auto" />
                          <div className="flex gap-3 justify-center">
                            <Button variant="secondary" onClick={() => { resetRecording(); resetTranscript(); setTranscript(''); }}>🔄 Record Again</Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {transcript && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">📝 Live Transcription:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {mode === 'text' && (
                  <div>
                    <textarea value={transcript} onChange={(e) => setTranscript(e.target.value)} className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors resize-none" placeholder="Type your story here..." />
                    <div className="mt-2 text-sm text-gray-500 text-right">{transcript.split(/\s+/).filter(w => w).length} words</div>
                  </div>
                )}
                
                {transcript.trim() && (
                  <motion.div className="mt-6">
                    <Button onClick={handleContinue} variant="primary" size="lg" className="w-full" disabled={processing}>
                      Continue to AI Enhancement <FiArrowRight className="ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ... (The rest of your JSX for 'enhance' and 'preview' steps are fine) ... */}
          
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Record;