import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { getSortedStories } from '../services/storyService';
import { Link } from 'react-router-dom';
import { Clock, Book, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Story } from '../types';

export const Home: React.FC = () => {
  const { language, theme } = useApp();
  const [stories, setStories] = useState<Story[]>([]);

  const refreshStories = () => {
    setStories(getSortedStories());
  };

  useEffect(() => {
    refreshStories();
    // Listen for rating updates
    window.addEventListener('ratingUpdated', refreshStories);
    return () => window.removeEventListener('ratingUpdated', refreshStories);
  }, []);

  if (stories.length === 0) return null;

  const featuredStory = stories[0];
  const otherStories = stories.slice(1);

  const renderStars = (rating: number, count: number) => {
    if (count === 0) {
       return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'}`}>
          {language === 'en' ? 'New' : 'नया'}
        </span>
       );
    }
    return (
      <div className="flex items-center space-x-1">
        <Star size={14} className="text-amber-500 fill-amber-500" />
        <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
          {rating}
        </span>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Hero Section */}
      <div className={`relative overflow-hidden border-b ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-amber-50/50 border-amber-100'}`}>
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center space-x-3 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-700'
                }`}>
                  #{language === 'en' ? 'Featured' : 'विशेष रुप से प्रदर्शित'}
                </span>
                {renderStars(featuredStory.rating, featuredStory.reviewCount)}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6">
                {featuredStory.title[language]}
              </h1>
              <p className={`text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {featuredStory.description[language]}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/read/${featuredStory.id}/ch-1`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-amber-600 hover:bg-amber-700 transition-colors"
                >
                  {language === 'en' ? 'Start Reading' : 'पढ़ना शुरू करें'}
                  <ArrowRight className="ml-2 -mr-1" size={18} />
                </Link>
                <div className="flex items-center space-x-4 px-4 py-2">
                   <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                      <Book size={16} className="mr-2" />
                      {featuredStory.chapters.length} {language === 'en' ? 'Chapters' : 'अध्याय'}
                   </div>
                   <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>
                      <Clock size={16} className="mr-2" />
                      24 {language === 'en' ? 'Mins' : 'मिनट'}
                   </div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block lg:col-span-5 mt-10 lg:mt-0">
               <div className={`relative rounded-2xl overflow-hidden shadow-2xl aspect-[2/3] max-w-xs mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500 ${theme === 'dark' ? 'shadow-amber-900/20' : 'shadow-amber-200/50'}`}>
                  <img 
                    src={featuredStory.coverImage} 
                    alt="Cover" 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of stories */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold font-serif">
            {language === 'en' ? 'More Stories' : 'और कहानियां'}
          </h2>
        </div>
        
        {otherStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherStories.map((story, index) => (
               <Link 
                  key={story.id} 
                  to={`/read/${story.id}/${story.chapters[0].id}`} 
                  className={`group block rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                    theme === 'dark' 
                      ? 'bg-slate-900 border-slate-800 hover:border-amber-900/50' 
                      : 'bg-white border-slate-200 hover:border-amber-200'
                  }`}
               >
                 <div className="aspect-[3/2] overflow-hidden relative">
                    <img 
                      src={story.coverImage} 
                      alt={story.title[language]} 
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                    
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md flex items-center space-x-1">
                      {story.reviewCount > 0 ? (
                        <>
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-white text-xs font-bold">{story.rating}</span>
                        </>
                      ) : (
                        <span className="text-white text-xs font-bold">New</span>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                       <h3 className="text-white font-bold font-serif text-xl line-clamp-1">{story.title[language]}</h3>
                       <p className="text-white/80 text-sm mt-1">{story.author[language]}</p>
                    </div>
                 </div>
                 <div className="p-6">
                    <p className={`text-sm line-clamp-3 mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                       {story.description[language]}
                    </p>
                    <div className="flex items-center justify-between text-xs font-medium text-amber-600 dark:text-amber-500">
                       <span className="flex items-center"><Book size={14} className="mr-1"/> {story.chapters.length} Parts</span>
                       <span className="flex items-center">Read Now <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform"/></span>
                    </div>
                 </div>
               </Link>
            ))}
          </div>
        ) : (
           <div className={`p-8 rounded-xl text-center border border-dashed ${theme === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'}`}>
             <p className="text-slate-500">
               {language === 'en' ? 'More adventures coming soon...' : 'और भी रोमांचक कहानियां जल्द आ रही हैं...'}
             </p>
           </div>
        )}
      </div>
    </motion.div>
  );
};