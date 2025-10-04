// src/components/story/StoryTimeline.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const StoryTimeline = ({ stories }) => {
  
  // Group stories by year
  const storiesByYear = stories.reduce((acc, story) => {
    const year = new Date(story.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(story);
    return acc;
  }, {});
  
  const years = Object.keys(storiesByYear).sort((a, b) => b - a);
  
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-600 to-secondary-600" />
      
      {/* Timeline Items */}
      <div className="space-y-12">
        {years.map((year) => (
          <div key={year} className="relative">
            {/* Year Badge */}
            <div className="sticky top-20 z-10 mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-full shadow-lg ml-4">
                <span className="text-xl font-bold">{year}</span>
                <span className="text-sm">({storiesByYear[year].length} stories)</span>
              </div>
            </div>
            
            {/* Stories for this year */}
            <div className="space-y-8 ml-20">
              {storiesByYear[year].map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div className="absolute -left-16 top-4 w-8 h-8 bg-white border-4 border-primary-600 rounded-full shadow-lg" />
                  
                  {/* Story Card */}
                  <Link to={`/story/${story.id}`}>
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all">
                      <div className="flex items-start gap-4">
                        {/* Date */}
                        <div className="text-center min-w-[60px]">
                          <div className="text-2xl font-bold text-primary-600">
                            {new Date(story.createdAt).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(story.createdAt).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                          <p className="text-gray-600 line-clamp-2 mb-3">
                            {story.summary || story.enhancedStory?.substring(0, 150)}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {story.tags?.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Meta */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>❤️ {story.reactionCounts?.hearts || 0}</span>
                            <span>💬 {story.commentsCount || 0}</span>
                            <span>{formatDistanceToNow(new Date(story.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        
                        {/* Thumbnail */}
                        {story.imageUrl && (
                          <img 
                            src={story.imageUrl} 
                            alt={story.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryTimeline;