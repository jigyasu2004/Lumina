import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getStory, rateStory } from '../services/storyService';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Type, Home as HomeIcon, Volume2, Square, Star } from 'lucide-react';
import Markdown from 'react-markdown';

export const Reader: React.FC = () => {
  const { storyId, chapterId } = useParams();
  const navigate = useNavigate();
  const { theme, language, fontSize, setFontSize } = useApp();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  const story = getStory(storyId || '');
  const chapterIndex = story?.chapters.findIndex(c => c.id === chapterId);
  const chapter = story?.chapters[chapterIndex !== undefined ? chapterIndex : -1];

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Check for existing rating
  useEffect(() => {
    const savedRatings = localStorage.getItem('user_ratings');
    if (savedRatings && storyId) {
      const parsed = JSON.parse(savedRatings);
      if (parsed[storyId]) {
        setUserRating(parsed[storyId]);
        setHasRated(true);
      }
    }
  }, [storyId]);

  // Stop speech when chapter or language changes or component unmounts
  useEffect(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [chapterId, language]);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId]);

  if (!story || !chapter) {
    return <div className="p-10 text-center">Chapter not found</div>;
  }

  const nextChapter = story.chapters[chapterIndex! + 1];
  const prevChapter = story.chapters[chapterIndex! - 1];
  const isLastChapter = !nextChapter;

  const handleRate = (rating: number) => {
    rateStory(story.id, rating);
    setUserRating(rating);
    setHasRated(true);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      let textToRead = chapter.content[language];
      textToRead = textToRead
        .replace(/[#*`_~]/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/>/g, '')
        .replace(/\n+/g, '. ');
        
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const targetLang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.lang = targetLang;
      
      const availableVoices = voices.filter(v => v.lang.startsWith(language === 'hi' ? 'hi' : 'en'));
      const preferredKeywords = ['Google', 'Zira', 'Samantha', 'Female', 'Kajal', 'Veena'];
      const selectedVoice = availableVoices.find(v => 
        preferredKeywords.some(keyword => v.name.includes(keyword))
      ) || availableVoices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950' : 'bg-brand-50'}`}
    >
      {/* Reader Controls Sticky Bar */}
      <div className={`sticky top-16 z-40 border-b backdrop-blur-sm transition-colors ${
        theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-brand-50/80 border-brand-200'
      }`}>
        <div className="max-w-3xl mx-auto px-4 h-12 flex justify-between items-center">
          <Link to="/" className={`p-2 rounded-full hover:bg-slate-200/20 transition ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            <HomeIcon size={18} />
          </Link>
          
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
               {language === 'en' ? 'Chapter' : 'अध्याय'} {chapterIndex! + 1}
            </span>
          </div>

          <div className="flex items-center space-x-4">
             <button 
                onClick={toggleSpeech}
                className={`flex items-center space-x-1 px-2 py-1.5 rounded transition ${
                  isSpeaking 
                    ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                    : theme === 'dark' ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-amber-100'
                }`}
             >
               {isSpeaking ? <Square size={16} fill="currentColor" /> : <Volume2 size={18} />}
               <span className="text-xs font-medium hidden sm:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
             </button>

             <div className="flex items-center space-x-1 border-l pl-4 border-slate-300 dark:border-slate-700">
               <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className={`p-1.5 rounded hover:bg-slate-200/20 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
               >
                 <Type size={14} />
               </button>
               <button 
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className={`p-1.5 rounded hover:bg-slate-200/20 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
               >
                 <Type size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-3xl mx-auto px-6 py-12 sm:px-8 sm:py-16">
        <header className="mb-10 text-center">
          <h1 className={`font-serif font-bold mb-4 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`} style={{ fontSize: `${fontSize * 1.5}px` }}>
            {chapter.title[language]}
          </h1>
          <div className={`h-1 w-20 mx-auto rounded-full ${theme === 'dark' ? 'bg-amber-900' : 'bg-amber-200'}`}></div>
        </header>

        <div 
          ref={contentRef}
          className={`prose prose-lg max-w-none font-serif leading-relaxed ${
            theme === 'dark' ? 'prose-invert prose-p:text-slate-300 prose-headings:text-slate-100' : 'prose-p:text-slate-800 prose-headings:text-slate-900'
          } ${language === 'hi' ? 'font-hindi' : ''}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          <Markdown
            components={{
              blockquote: ({node, ...props}) => (
                <blockquote 
                  className={`border-l-4 pl-4 py-1 my-6 italic not-italic:text-sm font-sans ${theme === 'dark' ? 'border-amber-600 bg-slate-900/50 text-slate-400' : 'border-amber-400 bg-amber-50 text-slate-600'}`} 
                  {...props} 
                />
              )
            }}
          >
            {chapter.content[language]}
          </Markdown>
        </div>

        {/* Rating Section (Visible on all chapters, but emphasized on last) */}
        <div className={`mt-16 py-8 border-y ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
           <div className="text-center">
              <h3 className={`font-serif text-lg mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                {language === 'en' ? 'Rate this Story' : 'इस कहानी को रेट करें'}
              </h3>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    className={`p-1 transition-transform hover:scale-110 ${hasRated ? 'cursor-default' : 'cursor-pointer'}`}
                    disabled={hasRated}
                  >
                    <Star 
                      size={32} 
                      className={`
                        ${star <= userRating 
                          ? 'fill-amber-500 text-amber-500' 
                          : theme === 'dark' ? 'text-slate-700' : 'text-slate-300'
                        }
                      `} 
                    />
                  </button>
                ))}
              </div>
              {hasRated && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-500 mt-2 font-medium"
                >
                  {language === 'en' ? 'Thanks for your feedback!' : 'आपकी प्रतिक्रिया के लिए धन्यवाद!'}
                </motion.p>
              )}
           </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 pt-8 grid grid-cols-2 gap-4">
          <div>
            {prevChapter ? (
              <button
                onClick={() => navigate(`/read/${story.id}/${prevChapter.id}`)}
                className={`group flex flex-col items-start text-left w-full p-4 rounded-xl border transition-all ${
                  theme === 'dark' 
                    ? 'border-slate-800 hover:bg-slate-900 hover:border-amber-900/50' 
                    : 'border-slate-200 hover:bg-white hover:border-amber-200'
                }`}
              >
                <span className="text-xs text-slate-500 mb-1 flex items-center">
                  <ChevronLeft size={12} className="mr-1" /> {language === 'en' ? 'Previous' : 'पिछला'}
                </span>
                <span className={`font-medium ${theme === 'dark' ? 'text-slate-300 group-hover:text-amber-500' : 'text-slate-700 group-hover:text-amber-700'}`}>
                  {prevChapter.title[language]}
                </span>
              </button>
            ) : null}
          </div>

          <div className="flex justify-end">
            {nextChapter ? (
              <button
                onClick={() => navigate(`/read/${story.id}/${nextChapter.id}`)}
                className={`group flex flex-col items-end text-right w-full p-4 rounded-xl border transition-all ${
                  theme === 'dark' 
                    ? 'border-slate-800 hover:bg-slate-900 hover:border-amber-900/50' 
                    : 'border-slate-200 hover:bg-white hover:border-amber-200'
                }`}
              >
                <span className="text-xs text-slate-500 mb-1 flex items-center">
                  {language === 'en' ? 'Next' : 'अगला'} <ChevronRight size={12} className="ml-1" />
                </span>
                <span className={`font-medium ${theme === 'dark' ? 'text-slate-300 group-hover:text-amber-500' : 'text-slate-700 group-hover:text-amber-700'}`}>
                  {nextChapter.title[language]}
                </span>
              </button>
            ) : (
               <Link to="/" className={`text-center w-full p-4 rounded-xl border border-dashed flex flex-col items-center justify-center transition-colors ${theme === 'dark' ? 'border-slate-800 text-slate-500 hover:bg-slate-900' : 'border-slate-300 text-slate-500 hover:bg-white'}`}>
                  <span className="font-medium">{language === 'en' ? 'Return to Home' : 'घर जाओ'}</span>
               </Link>
            )}
          </div>
        </div>
      </article>
    </motion.div>
  );
};