// src/api/upload.api.js
import axios from './axios.config';

export const uploadAPI = {
  uploadAudio: (audioBlob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    
    return axios.post('/upload/audio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  uploadImage: (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    return axios.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};