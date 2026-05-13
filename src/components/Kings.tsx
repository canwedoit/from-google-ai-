import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { KINGS } from '../data/mockData';
import { User, Crown, Calendar, MapPin, Share2 } from 'lucide-react';
import { FamilyTree } from './FamilyTree';

const Kings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en' | 'ru';

  const handleSelectPerson = useCallback((id: string) => {
    const element = document.getElementById(`king-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight effect if needed
    }
  }, []);

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-serif font-bold text-egyptian-gold mb-4 uppercase tracking-[0.3em]">
          {t('kings_queens_title')}
        </h2>
        <p className="text-egyptian-gold-light/60 font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto text-xs italic">
          {t('kings_queens_subtitle')}
        </p>
        <div className="w-48 h-0.5 bg-egyptian-gold/30 mx-auto mt-8" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {KINGS.map((king) => (
          <motion.div
            key={king.id}
            id={`king-${king.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-background-offset border border-egyptian-gold-dim overflow-hidden shadow-2xl group relative"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-5/12 relative h-96 md:h-auto overflow-hidden">
                <img 
                  src={king.images[0]} 
                  alt={king.name?.[lang] || ''} 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-offset to-transparent opacity-40" />
                <div className="absolute top-4 left-4 border border-egyptian-gold/40 bg-background-dark/80 px-4 py-1 text-[9px] font-bold uppercase tracking-widest text-egyptian-gold">
                  {king.period?.[lang]}
                </div>
              </div>
              
              <div className="p-10 md:w-7/12 flex flex-col justify-center">
                <div className="mb-8">
                  <span className="hieroglyphic-font text-egyptian-gold text-3xl block mb-4 opacity-70 group-hover:opacity-100 transition-all">
                    {king.hieroglyphicName}
                  </span>
                  <h3 className="text-4xl font-serif font-bold text-egyptian-gold-light mb-2 tracking-wide uppercase">
                    {king.name?.[lang]}
                  </h3>
                  <p className="text-egyptian-gold text-xs font-bold tracking-[0.2em] uppercase opacity-60 italic">
                    {king.title?.[lang]}
                  </p>
                </div>
  
                <div className="space-y-6 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="p-2 border border-egyptian-gold/20 rounded-full shrink-0">
                      <Crown size={16} className="text-egyptian-gold" />
                    </div>
                    <p className="text-xs text-text-primary/70 leading-relaxed italic">
                      {king.description?.[lang]}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="p-2 border border-egyptian-gold/20 rounded-full shrink-0">
                      <User size={16} className="text-egyptian-gold" />
                    </div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-egyptian-gold-light/60">
                      Location: <span className="text-egyptian-gold">{king.mummyLocation ? king.mummyLocation?.[lang] : 'Unknown'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 pt-0">
               <div className="w-full h-px bg-egyptian-gold/20 mb-8" />
               <FamilyTree 
                 person={king} 
                 allPersons={KINGS} 
                 onSelectPerson={handleSelectPerson} 
               />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Kings;
