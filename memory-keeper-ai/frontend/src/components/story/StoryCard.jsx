// src/components/story/StoryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiMessageCircle, FiEye, FiClock } from 'react-icons/fi';
import Badge from '../common/Badge';
import { formatDistanceToNow } from 'date-fns';

const StoryCard = ({ story }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
    >
      {/* Image */}
      {story.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {story.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {story.summary || story.enhancedStory?.substring(0, 150) + '...'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
          {story.category && (
            <Badge variant="primary">
              {story.category}
            </Badge>
          )}
        </div>
        
        {/* Sentiment Badge */}
        {story.sentimentLabel && (
          <div className="mb-4">
            <Badge
              variant={
                story.sentimentLabel === 'POSITIVE' ? 'success' :
                story.sentimentLabel === 'NEGATIVE' ? 'danger' : 'warning'
              }
            >
              {story.sentimentLabel === 'POSITIVE' && '😊'}
              {story.sentimentLabel === 'NEGATIVE' && '😢'}
              {story.sentimentLabel === 'NEUTRAL' && '😐'}
              {' '}{story.sentimentLabel}
            </Badge>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiHeart className="text-red-500" />
              {story.reactionCounts?.hearts || 0}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageCircle className="text-blue-500" />
              {story.commentsCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <FiEye className="text-gray-400" />
              {story.viewsCount || 0}
            </span>
          </div>
          
          <Link
            to={`/story/${story.id}`}
            className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
          >
            Read More →
          </Link>
        </div>
        
        {/* Timestamp */}
        <div className="mt-3 flex items-center gap-1 text-xs text-gray-400">
          <FiClock />
          {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;