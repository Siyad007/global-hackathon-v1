// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    
    setIsSupported(true);
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep listening
    recognition.interimResults = true; // Get results as they come
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      // --- START OF FIX ---
      // Build the full transcript from scratch from the event results
      // This prevents any duplication from state updates.
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece;
        } else {
          interimTranscript += transcriptPiece;
        }
      }
      
      // Update the state with the full, correctly constructed string
      setTranscript(finalTranscript + interimTranscript);
      // --- END OF FIX ---
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // When it stops for any reason, update the listening state.
      setIsListening(false);
    };
    
    recognitionRef.current = recognition;
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []); // This effect should only run once on mount

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript(''); // Clear previous transcript before starting
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    transcript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};