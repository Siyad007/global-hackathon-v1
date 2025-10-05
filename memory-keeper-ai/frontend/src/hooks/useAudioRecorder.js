// src/hooks/useAudioRecorder.js
import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        clearInterval(timerRef.current);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      toast.success('🎤 Recording started!');
      
    } catch (error) {
      toast.error('Microphone access denied');
      console.error('Recording error:', error);
    }
  }, []);
  
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped!');
    }
  }, [isRecording]);
  
  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setDuration(0);
  }, []);
  
  return {
    isRecording,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    resetRecording
  };
};