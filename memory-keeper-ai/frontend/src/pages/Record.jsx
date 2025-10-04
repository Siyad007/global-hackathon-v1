// src/pages/Record.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createStory } from '../redux/slices/storySlice';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiType, FiArrowRight, FiLoader } from 'react-icons/fi';
import Header from '../components/layout/Header';
import AudioRecorder from '../components/audio/AudioRecorder';
import Button from '../components/common/Button';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { aiAPI } from '../api/ai.api';
import { uploadAPI } from '../api/upload.api';

const Record = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [step, setStep] = useState('record'); // record, enhance, preview
  const [mode, setMode] = useState('voice'); // voice or text
  const [transcript, setTranscriptState] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState('');
  
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
    stopListening
  } = useSpeechRecognition();
  
  useEffect(() => {
    // Set daily prompt
    const prompts = [
      "What was your favorite meal as a child, and who made it?",
      "Describe your first day at school. What do you remember?",
      "Tell me about a time you felt extremely proud of yourself.",
      "What was your wedding day like? Share every detail.",
      "Describe the house you grew up in. Which room was your favorite?"
    ];
    setTodayPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, []);
  
  useEffect(() => {
    setTranscriptState(speechTranscript);
  }, [speechTranscript]);
  
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
  
  const handleContinue = async () => {
    if (!transcript.trim()) {
      toast.error('Please record or type your story first');
      return;
    }
    
    setProcessing(true);
    setStep('enhance');
    
    try {
      // Upload audio if exists
      let audioUrl = '';
      if (audioBlob) {
        toast.info('📤 Uploading audio...');
        const uploadResponse = await uploadAPI.uploadAudio(audioBlob);
        audioUrl = uploadResponse.data.data;
        toast.success('✅ Audio uploaded!');
      }
      
      // Enhance with AI
      toast.info('🤖 AI is enhancing your story...');
      const response = await aiAPI.enhanceStory(transcript);
      
      const enhancedData = {
        ...response.data.data,
        audioUrl,
        transcript
      };
      
      setAiResponse(enhancedData);
      setStep('preview');
      toast.success('✨ Story enhanced!');
      
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process story. Please try again.');
      setStep('record');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleSaveStory = async () => {
    setProcessing(true);
    
    try {
      const storyData = {
        userId: user.id,
        title: aiResponse.title,
        transcript: transcript,
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
      
      await dispatch(createStory(storyData));
      
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {['Record', 'Enhance', 'Preview'].map((label, index) => (
              <div key={label} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  step === label.toLowerCase() || 
                  (step === 'preview' && index < 2) ||
                  (step === 'enhance' && index < 1)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 font-medium ${
                  step === label.toLowerCase() ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {label}
                </span>
                {index < 2 && (
                  <div className={`w-20 h-1 mx-4 ${
                    (step === 'preview' && index < 2) || (step === 'enhance' && index < 1)
                      ? 'bg-primary-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {/* STEP 1: RECORD */}
          {step === 'record' && (
            <motion.div
              key="record"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Prompt Card */}
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💭</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Today's Prompt
                    </h3>
                    <p className="text-gray-700 text-lg">
                      "{todayPrompt}"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mode Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Choose Your Method</h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setMode('voice')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      mode === 'voice'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <FiMic className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                    <h3 className="font-bold text-lg mb-1">Voice Recording</h3>
                    <p className="text-sm text-gray-600">
                      Speak naturally, we'll transcribe
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setMode('text')}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      mode === 'text'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <FiType className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                    <h3 className="font-bold text-lg mb-1">Type Your Story</h3>
                    <p className="text-sm text-gray-600">
                      Prefer to type? That works too!
                    </p>
                  </button>
                </div>
                
                {/* Voice Recording UI */}
                {mode === 'voice' && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      {!isRecording && !audioBlob && (
                        <div>
                          <button
                            onClick={handleStartRecording}
                            className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl hover:shadow-2xl transform hover:scale-110 transition-all mx-auto"
                          >
                            🎤
                          </button>
                          <p className="mt-4 text-gray-600">
                            Click to start recording
                          </p>
                        </div>
                      )}
                      
                      {isRecording && (
                        <div>
                          <button
                            onClick={handleStopRecording}
                            className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center text-white text-5xl animate-pulse hover:shadow-2xl mx-auto"
                          >
                            ⏹️
                          </button>
                          <p className="mt-4 text-red-600 font-bold text-lg">
                            Recording... {formatDuration(duration)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Click to stop
                          </p>
                        </div>
                      )}
                      
                      {audioBlob && !isRecording && (
                        <div className="space-y-4">
                          <div className="text-5xl mb-4">✅</div>
                          <audio
                            controls
                            src={URL.createObjectURL(audioBlob)}
                            className="w-full max-w-md mx-auto"
                          />
                          <div className="flex gap-3 justify-center">
                            <Button variant="secondary" onClick={resetRecording}>
                              🔄 Record Again
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Live Transcript */}
                    {transcript && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">📝 Live Transcription:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {transcript}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Text Input UI */}
                {mode === 'text' && (
                  <div>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscriptState(e.target.value)}
                      className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors resize-none"
                      placeholder="Type your story here... Share your memories, your feelings, every detail you remember."
                    />
                    <div className="mt-2 text-sm text-gray-500 text-right">
                      {transcript.split(/\s+/).filter(w => w).length} words
                    </div>
                  </div>
                )}
                
                {/* Continue Button */}
                {transcript.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={handleContinue}
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Continue to AI Enhancement
                      <FiArrowRight className="ml-2" />
                    </Button>
                  </motion.div>
                )}
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
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse" />
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <FiLoader className="w-12 h-12 text-primary-600 animate-spin" />
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold mb-4">
                  AI is Crafting Your Story ✨
                </h2>
                
                <div className="space-y-3 text-left">
                  {[
                    { text: 'Analyzing emotions', delay: 0 },
                    { text: 'Enhancing narrative', delay: 2000 },
                    { text: 'Generating imagery', delay: 4000 },
                    { text: 'Adding details', delay: 6000 }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.5 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
                      <span className="text-gray-600">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-gray-500 mt-8">
                  This may take 15-30 seconds...
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
              className="space-y-6"
            >
              {/* AI Generated Image */}
              {aiResponse.imageUrl && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <img
                    src={aiResponse.imageUrl}
                    alt={aiResponse.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              {/* Enhanced Story */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-4xl font-bold mb-4">{aiResponse.title}</h1>
                
                {/* Metadata */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {aiResponse.tags?.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                  {aiResponse.category && (
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                      {aiResponse.category}
                    </span>
                  )}
                  {aiResponse.sentimentLabel && (
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      aiResponse.sentimentLabel === 'POSITIVE'
                        ? 'bg-green-100 text-green-700'
                        : aiResponse.sentimentLabel === 'NEGATIVE'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {aiResponse.sentimentLabel === 'POSITIVE' && '😊'}
                      {aiResponse.sentimentLabel === 'NEGATIVE' && '😢'}
                      {aiResponse.sentimentLabel === 'NEUTRAL' && '😐'}
                      {' '}{aiResponse.sentimentLabel}
                    </span>
                  )}
                </div>
                
                {/* Emotions */}
                {aiResponse.emotions && aiResponse.emotions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Detected Emotions:</h3>
                    <div className="flex flex-wrap gap-2">
                      {aiResponse.emotions.map((emotion, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                        >
                          {emotion.label} ({Math.round(emotion.score * 100)}%)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Enhanced Story Text */}
                <div className="prose prose-lg max-w-none">
                  {aiResponse.enhancedStory.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {/* Original Transcript */}
                <details className="mt-8 bg-gray-50 rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer text-gray-700">
                    View Original Recording
                  </summary>
                  <p className="mt-4 text-gray-600 whitespace-pre-wrap">
                    {transcript}
                  </p>
                </details>
              </div>
              
              {/* Follow-up Questions */}
              {aiResponse.questions && aiResponse.questions.length > 0 && (
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">
                    💡 AI Suggests Adding More Details:
                  </h3>
                  <ul className="space-y-2">
                    {aiResponse.questions.map((question, index) => (
                      <li key={index} className="text-gray-700">
                        • {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSaveStory}
                  variant="primary"
                  size="lg"
                  loading={processing}
                  className="flex-1"
                >
                  {processing ? 'Saving...' : 'Save & Share Story'}
                </Button>
                
                <Button
                  onClick={() => {
                    setStep('record');
                    setAiResponse(null);
                  }}
                  variant="secondary"
                  size="lg"
                  disabled={processing}
                >
                  Start Over
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Record;