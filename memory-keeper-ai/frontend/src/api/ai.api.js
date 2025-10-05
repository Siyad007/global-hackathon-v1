// src/api/ai.api.js
import axios from './axios.config';

export const aiAPI = {
  enhanceStory: (transcript, additionalAnswers = '') => 
    axios.post('/ai/enhance', { transcript, additionalAnswers }),
  
  chatWithGrandparent: (stories, question, grandparentName) => 
    axios.post('/ai/chat', { stories, question, grandparentName }),
  
  getDailyPrompt: (category = 'GENERAL') => 
    axios.get(`/ai/prompt?category=${category}`)
};