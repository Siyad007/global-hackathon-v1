// src/pages/StoryView.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoryById } from '../redux/slices/storySlice';
import { storyAPI } from '../api/story.api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiMessageCircle, FiShare2, FiCalendar, FiEye } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Spinner from '../components/common/Spinner';
import AudioPlayer from '../components/audio/AudioPlayer'; 
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { format } from 'date-fns';

const StoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { currentStory, loading } = useSelector(state => state.story);
  
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  useEffect(() => {
    dispatch(fetchStoryById(id));
  }, [id, dispatch]);
  
  const handleReact = async (reactionType = 'HEART') => {
    try {
      await storyAPI.addReaction(id, user.id, reactionType);
      toast.success('❤️');
      dispatch(fetchStoryById(id)); // Refresh
    } catch (error) {
      toast.error('Failed to react');
    }
  };
  
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    setSubmittingComment(true);
    try {
      await storyAPI.addComment(id, user.id, comment);
      setComment('');
      toast.success('Comment added!');
      dispatch(fetchStoryById(id)); // Refresh
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentStory?.title,
        text: currentStory?.summary,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }
  
  if (!currentStory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Story Not Found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft />
          Back to Dashboard
        </Link>
        
        {/* Story Card */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Image */}
          {currentStory.imageUrl && (
            <div className="relative h-96 overflow-hidden">
              <img
                src={currentStory.imageUrl}
                alt={currentStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{currentStory.title}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <FiCalendar />
                    {format(new Date(currentStory.createdAt), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiEye />
                    {currentStory.viewsCount} views
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Content */}
          <div className="p-8">
            {!currentStory.imageUrl && (
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {currentStory.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiCalendar />
                    {format(new Date(currentStory.createdAt), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiEye />
                    {currentStory.viewsCount} views
                  </span>
                </div>
              </div>
            )}
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentStory.tags?.map(tag => (
                <Badge key={tag} variant="default">
                  {tag}
                </Badge>
              ))}
              {currentStory.category && (
                <Badge variant="primary">
                  {currentStory.category}
                </Badge>
              )}
              {currentStory.sentimentLabel && (
                <Badge
                  variant={
                    currentStory.sentimentLabel === 'POSITIVE' ? 'success' :
                    currentStory.sentimentLabel === 'NEGATIVE' ? 'danger' : 'warning'
                  }
                >
                  {currentStory.sentimentLabel === 'POSITIVE' && '😊'}
                  {currentStory.sentimentLabel === 'NEGATIVE' && '😢'}
                  {currentStory.sentimentLabel === 'NEUTRAL' && '😐'}
                  {' '}{currentStory.sentimentLabel}
                </Badge>
              )}
            </div>
            
            {/* Emotions */}
            {currentStory.emotions && currentStory.emotions.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Emotions:</h3>
                <div className="flex flex-wrap gap-2">
                  {currentStory.emotions.map((emotion, index) => (
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
            
           {/* Audio Player */}
 {(currentStory.audioUrl || currentStory.ttsAudioUrl) && (
  <div className="mb-8">
    <h3 className="font-semibold mb-3 text-gray-900">🎧 Listen to the Story:</h3>
    <AudioPlayer
      audioUrl={currentStory.audioUrl}
      ttsAudioUrl={currentStory.ttsAudioUrl}
      title={currentStory.title}
    />
  </div>
)}
            
            {/* Story Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {currentStory.enhancedStory.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            
            {/* Original Transcript */}
            <details className="mb-8 bg-gray-50 rounded-lg p-4">
              <summary className="font-semibold cursor-pointer text-gray-700">
                View Original Recording Transcript
              </summary>
              <p className="mt-4 text-gray-600 whitespace-pre-wrap">
                {currentStory.transcript}
              </p>
            </details>
            
            {/* Actions */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleReact('HEART')}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <FiHeart className="fill-current" />
                    <span className="font-semibold">
                      {currentStory.reactionCounts?.hearts || 0}
                    </span>
                  </button>
                  
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                    <FiMessageCircle />
                    <span className="font-semibold">
                      {currentStory.commentsCount || 0}
                    </span>
                  </button>
                </div>
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <FiShare2 />
                  Share
                </button>
              </div>
              
              {/* Comments */}
              <div>
                <h3 className="text-xl font-bold mb-4">Comments</h3>
                
                {/* Add Comment Form */}
                <form onSubmit={handleComment} className="mb-6">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows="3"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={submittingComment}
                      disabled={!comment.trim()}
                    >
                      Post Comment
                    </Button>
                  </div>
                </form>
                
                {/* Comments List */}
                {currentStory.commentsCount > 0 ? (
                  <div className="space-y-4">
                    {/* Comments would be loaded here */}
                    <p className="text-gray-500 text-center py-4">
                      {currentStory.commentsCount} comment(s)
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.article>
      </main>
    </div>
  );
};

export default StoryView;