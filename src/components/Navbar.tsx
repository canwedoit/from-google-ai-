import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Menu, Globe, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  onOpenSidebar: () => void;
  onOpenSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage, onOpenSidebar, onOpenSearch }) => {
  const { t, i18n } = useTranslation();
  const { user, profile, isAdmin } = useAuth();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  const languages = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' }
  ];

  const currentLangLabel = languages.find(l => l.code === i18n.language)?.label || 'EN';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism py-4 px-4 md:px-8 flex items-center justify-between border-b border-egyptian-gold/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSidebar}
          className="p-3 bg-egyptian-gold/5 border border-egyptian-gold/20 text-egyptian-gold hover:bg-egyptian-gold hover:text-background-dark transition-all rounded-none"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate('home')}>
          <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-egyptian-gold rounded-full flex items-center justify-center text-egyptian-gold font-bold text-lg md:text-xl shadow-[0_0_15px_rgba(197,160,89,0.3)] group-hover:scale-110 transition-transform">
            𓋹
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-serif tracking-widest text-egyptian-gold uppercase leading-none">
              {t('app_name')}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search Trigger */}
        <button 
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 md:px-4 py-3 text-egyptian-gold/60 hover:text-egyptian-gold hover:bg-egyptian-gold/5 transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <Search size={18} />
          <span className="hidden sm:inline">{t('search_placeholder')}</span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 md:px-4 py-3 bg-background-dark border border-egyptian-gold/20 text-egyptian-gold hover:border-egyptian-gold transition-all text-[10px] font-black uppercase tracking-widest min-w-[100px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Globe size={14} />
              <span>{i18n.language.toUpperCase()}</span>
            </div>
            <ChevronDown size={14} className={cn("transition-transform", isLangOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full mt-2 right-0 w-40 bg-background-dark border border-egyptian-gold/20 shadow-2xl z-50 p-2"
              >
                {languages.map((lng) => (
                  <button
                    key={lng.code}
                    onClick={() => toggleLanguage(lng.code)}
                    className={cn(
                      "w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-egyptian-gold hover:text-background-dark flex items-center justify-between",
                      i18n.language === lng.code ? "text-egyptian-gold" : "text-egyptian-gold/40"
                    )}
                  >
                    {lng.label}
                    {i18n.language === lng.code && <div className="w-1 h-1 bg-current rounded-full" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auth Button */}
        <div className="flex items-center">
          {user ? (
            <div className="flex items-center gap-2">
               <button 
                 onClick={() => onNavigate('auth')} // Use as profile link if needed, or keeping it simple
                 className="hidden sm:flex items-center gap-2 px-4 py-3 text-egyptian-gold/60 hover:text-egyptian-gold transition-all text-[10px] font-black uppercase tracking-widest"
               >
                 <User size={16} />
                 <span>{profile?.email.split('@')[0]}</span>
               </button>
               <button 
                 onClick={() => signOut(auth)}
                 className="p-3 bg-red-900/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
               >
                 <LogOut size={16} />
               </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-3 bg-egyptian-gold text-background-dark px-4 md:px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-egyptian-gold-light transition-all shadow-xl"
            >
              <User size={14} />
              <span className="hidden md:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
