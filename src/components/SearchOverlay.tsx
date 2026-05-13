import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, MapPin, Landmark, Users, ArrowRight } from 'lucide-react';
import { SITES } from '../data/mockData';
import { cn } from '../lib/utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSite: (site: any) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, onSelectSite }) => {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    
    return SITES.filter(site => {
      // Search in all languages
      const nameMatch = Object.values(site.name).some(val => val.toLowerCase().includes(q));
      const locationMatch = site.governorateId.toLowerCase().includes(q);
      const descriptionMatch = Object.values(site.description || {}).some(val => val.toLowerCase().includes(q));
      
      return nameMatch || locationMatch || descriptionMatch;
    });
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background-dark/95 backdrop-blur-md p-4 md:p-20 flex flex-col items-center"
        >
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-egyptian-gold/40 hover:text-egyptian-gold transition-colors"
          >
            <X size={32} />
          </button>

          <div className="w-full max-w-4xl">
            <div className="relative mb-12">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-egyptian-gold/60" size={32} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-background-offset border-b-2 border-egyptian-gold/20 py-8 pl-20 pr-8 text-3xl font-serif text-egyptian-gold outline-none focus:border-egyptian-gold transition-all placeholder:text-egyptian-gold/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {results.map((site) => (
                <motion.button
                  key={site.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    onSelectSite(site);
                    onClose();
                  }}
                  className="bg-background-offset/50 border border-egyptian-gold/10 p-6 flex flex-col items-start gap-3 hover:bg-egyptian-gold/5 hover:border-egyptian-gold/30 transition-all text-left group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-egyptian-gold/40">
                      {site.governorateId}
                    </span>
                    <ArrowRight size={14} className="text-egyptian-gold opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <h3 className="text-xl font-serif text-egyptian-gold-light group-hover:text-egyptian-gold transition-colors">
                    {site.name[i18n.language as keyof typeof site.name] || site.name.en}
                  </h3>
                  <div className="flex items-center gap-4 text-[10px] text-egyptian-gold/40 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} />
                      {t(site.governorateId.toLowerCase())}
                    </div>
                    <div className="flex items-center gap-1">
                      <Landmark size={10} />
                      {t('artifacts')}
                    </div>
                  </div>
                </motion.button>
              ))}

              {query && results.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="text-egyptian-gold/20 text-6xl mb-6">𓈖𓍿𓂋</div>
                  <p className="text-egyptian-gold/40 font-serif text-xl italic">{t('no_results')} "{query}"</p>
                </div>
              )}

              {!query && (
                <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-8 p-12">
                   <div className="text-center space-y-4">
                      <Landmark className="mx-auto text-egyptian-gold/20" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-egyptian-gold/40">{t('search_kings')}</p>
                   </div>
                   <div className="text-center space-y-4">
                      <MapPin className="mx-auto text-egyptian-gold/20" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-egyptian-gold/40">{t('search_locations')}</p>
                   </div>
                   <div className="text-center space-y-4">
                      <Users className="mx-auto text-egyptian-gold/20" size={48} />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-egyptian-gold/40">{t('search_mummies')}</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
