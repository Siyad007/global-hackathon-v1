// src/api/story.api.js
import axios from './axios.config';

export const storyAPI = {
  getUserStories: (userId, page = 0, size = 10) => 
    axios.get(`/stories/user/${userId}?page=${page}&size=${size}`),
  
  getStory: (id) => 
    axios.get(`/stories/${id}`),
  
  createStory: (storyData) => 
    axios.post('/stories', storyData),
  
  addReaction: (storyId, userId, reactionType = 'HEART') => 
    axios.patch(`/stories/${storyId}/react?userId=${userId}&reactionType=${reactionType}`),
  
  addComment: (storyId, userId, content) => 
    axios.post(`/stories/${storyId}/comment?userId=${userId}&content=${encodeURIComponent(content)}`),
  
  searchStories: (query, page = 0) => 
    axios.get(`/stories/search?query=${query}&page=${page}`),
  
  deleteStory: (id) => 
    axios.delete(`/stories/${id}`)
};