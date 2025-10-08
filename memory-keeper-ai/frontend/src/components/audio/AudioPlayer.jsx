// src/components/audio/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiDownload } from 'react-icons/fi';

const AudioPlayer = ({ audioUrl, ttsAudioUrl, title = 'Audio Story' }) => {
  // ✅ NEW: State for which audio source is active
  const [activeSource, setActiveSource] = useState(ttsAudioUrl ? 'tts' : 'original');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef(null);
  
  // ✅ NEW: Get current audio URL based on active source
  const currentAudioUrl = activeSource === 'tts' ? ttsAudioUrl : audioUrl;
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
    };
    
    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [currentAudioUrl]); // ✅ Updated dependency
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  // ✅ NEW: Switch between audio sources
  const switchAudioSource = (source) => {
    const wasPlaying = isPlaying;
    if (isPlaying) {
      audioRef.current.pause();
    }
    setActiveSource(source);
    setIsPlaying(false);
    setCurrentTime(0);
    
    // Auto-play new source if previous was playing
    if (wasPlaying) {
      setTimeout(() => {
        audioRef.current.play();
        setIsPlaying(true);
      }, 100);
    }
  };
  
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    audioRef.current.volume = vol;
    setVolume(vol);
  };
  
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const downloadAudio = () => {
    const link = document.createElement('a');
    link.href = currentAudioUrl;
    link.download = `${title}.mp3`;
    link.click();
  };
  
  // ✅ NEW: Don't render if no audio available
  if (!audioUrl && !ttsAudioUrl) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
      {/* ✅ Updated audio element to use currentAudioUrl */}
      <audio ref={audioRef} src={currentAudioUrl} preload="metadata" />
      
      {/* ✅ NEW: Audio Source Toggle (only show if both exist) */}
      {audioUrl && ttsAudioUrl && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => switchAudioSource('original')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeSource === 'original'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🎤 Original Recording
          </button>
          <button
            onClick={() => switchAudioSource('tts')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              activeSource === 'tts'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🤖 AI Narration
          </button>
        </div>
      )}
      
      {/* ✅ NEW: Single source label */}
      {audioUrl && !ttsAudioUrl && (
        <div className="mb-4 text-center text-sm text-gray-600 font-medium">
          🎤 Original Recording
        </div>
      )}
      {!audioUrl && ttsAudioUrl && (
        <div className="mb-4 text-center text-sm text-gray-600 font-medium">
          🤖 AI Narration
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-all"
        >
          {isPlaying ? <FiPause className="w-6 h-6" /> : <FiPlay className="w-6 h-6 ml-1" />}
        </button>
        
        {/* Title */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        
        {/* Download */}
        <button
          onClick={downloadAudio}
          className="p-3 hover:bg-white rounded-full transition-colors"
          title="Download"
        >
          <FiDownload className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      {/* Progress Bar */}
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4"
        style={{
          background: `linear-gradient(to right, rgb(147, 51, 234) 0%, rgb(147, 51, 234) ${(currentTime / duration) * 100}%, rgb(229, 231, 235) ${(currentTime / duration) * 100}%, rgb(229, 231, 235) 100%)`
        }}
      />
      
      {/* Volume Control */}
      <div className="flex items-center gap-3">
        <FiVolume2 className="w-5 h-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      
      {/* ✅ NEW: Info badge for TTS */}
      {activeSource === 'tts' && (
        <div className="mt-4 text-center text-xs text-gray-500 italic">
          🎙️ AI-narrated in a warm, natural voice
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;