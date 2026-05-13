/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './components/Home';
import EgyptMap from './components/Map';
import Kings from './components/Kings';
import Mummies from './components/Mummies';
import SiteModal from './components/SiteModal';
import Sidebar from './components/Sidebar';
import SearchOverlay from './components/SearchOverlay';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FirebaseInitializer } from './components/FirebaseInitializer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Site } from './types';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { i18n } = useTranslation();
  const { isAdmin, user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('home');
  const [selectedSite, setSelectedSite] = React.useState<Site | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  React.useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <FirebaseInitializer />
      
      <Navbar 
        onNavigate={handleNavigate} 
        currentPage={currentPage}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSite={setSelectedSite}
      />
      
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && (
              <Home 
                onNavigate={handleNavigate} 
                onSelectSite={setSelectedSite} 
              />
            )}
            {currentPage === 'map' && <EgyptMap onSelectSite={setSelectedSite} />}
            {currentPage === 'kings' && <Kings />}
            {currentPage === 'mummies' && <Mummies />}
            {currentPage === 'auth' && <AuthPage onSuccess={() => setCurrentPage('home')} />}
            {currentPage === 'admin' && isAdmin && <AdminDashboard />}
            
            {currentPage === 'artifacts' && (
              <div className="pt-32 text-center text-egyptian-earth">
                <h2 className="text-4xl font-display font-bold text-egyptian-gold">Artifacts Database</h2>
                <p className="mt-4 text-egyptian-gold/60">Registry of Eternal Findings</p>
              </div>
            )}
            {currentPage === 'bookings' && (
              <div className="pt-32 text-center text-egyptian-earth">
                 {!user ? (
                   <AuthPage onSuccess={() => {}} />
                 ) : (
                   <div className="max-w-4xl mx-auto px-4">
                     <h2 className="text-4xl font-display font-bold text-egyptian-gold mb-12 uppercase tracking-tighter">Your Eternal Ledger</h2>
                     <p className="text-egyptian-gold/40 text-xs tracking-[0.3em] uppercase mb-12 font-black">History of your passages</p>
                     <div className="bg-background-offset border border-egyptian-gold-dim p-12 text-center italic text-egyptian-gold/40">
                        View your booked certificates here or check your email for access codes.
                     </div>
                   </div>
                 )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteModal site={selectedSite} onClose={() => setSelectedSite(null)} />

      <footer className="py-12 mt-20 border-t border-egyptian-gold/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-egyptian-gold/30">
           <div className="text-[10px] font-black uppercase tracking-widest mb-4 md:mb-0">
             © 2026 Egypt Eternals - All Rights Reserved
           </div>
           <div className="flex gap-8 text-2xl group transition-all">
             <span className="hover:text-egyptian-gold cursor-default transition-all">𓋹</span>
             <span className="hover:text-egyptian-gold cursor-default transition-all">𓋴</span>
             <span className="hover:text-egyptian-gold cursor-default transition-all">𓄚</span>
             <span className="hover:text-egyptian-gold cursor-default transition-all">𓇳</span>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
