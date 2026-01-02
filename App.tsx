import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Reader } from './pages/Reader';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/read/:storyId/:chapterId" element={<Reader />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans antialiased">
          <Header />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          
          <footer className="py-8 text-center text-sm text-slate-500 dark:text-slate-600">
            <p>&copy; 2026 Lumina Readers. Built by Jigyasu Patel.</p>
          </footer>
        </div>
      </HashRouter>
    </AppProvider>
  );
};

export default App;