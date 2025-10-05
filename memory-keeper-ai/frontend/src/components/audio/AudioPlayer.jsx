// src/components/audio/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiVolume2, FiDownload } from 'react-icons/fi';

const AudioPlayer = ({ audioUrl, title = 'Audio Story' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const audioRef = useRef(null);
  
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
  }, []);
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
    link.href = audioUrl;
    link.download = `${title}.mp3`;
    link.click();
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
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
    </div>
  );
};

export default AudioPlayer;