import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, ArrowRight, Star } from 'lucide-react';
import { GOVERNORATES } from '../data/mockData';
import { Site } from '../types';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

import { cn } from '../lib/utils';

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectSite: (site: Site) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onSelectSite }) => {
  const { t, i18n } = useTranslation();
  const [sites, setSites] = useState<Site[]>([]);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    const fetchSites = async () => {
      const path = 'sites';
      try {
        const q = query(collection(db, path), limit(6));
        const snap = await getDocs(q);
        setSites(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site)));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    };
    fetchSites();
  }, []);

  return (
    <div className="pt-16 pb-12">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden shadow-2xl border-b border-egyptian-gold/20">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1544473426-58674989e83f" 
            alt="Ancient Egypt"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        </motion.div>

        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-12 md:p-20 text-text-primary",
          isRtl ? "text-right" : "text-left"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="inline-block px-4 py-1 border border-egyptian-gold text-[10px] font-bold uppercase tracking-[0.3em] text-egyptian-gold mb-6">
              {t('tagline')}
            </span>
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8 max-w-4xl leading-[1.1] text-egyptian-gold-light uppercase tracking-tight">
              {t('app_name')}
            </h2>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => onNavigate('map')}
                className="bg-egyptian-gold hover:bg-egyptian-gold-light text-background-dark px-10 py-4 rounded-none text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-105"
              >
                {t('map')}
              </button>
              <button className="border border-egyptian-gold/40 hover:border-egyptian-gold text-egyptian-gold px-10 py-4 rounded-none text-xs font-bold uppercase tracking-widest transition-all backdrop-blur-sm">
                {t('explore_tours')}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 mt-24">
        {/* Highlights */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-12 border-b border-egyptian-gold-dim pb-4">
            <h3 className="text-2xl font-serif font-bold text-egyptian-gold uppercase tracking-[0.2em]">
              {t('popular_sites')}
            </h3>
            <button className="text-egyptian-gold-light text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-egyptian-gold transition-all">
              {t('view_all')}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sites.map((site) => (
              <motion.div
                key={site.id}
                whileHover={{ y: -8 }}
                onClick={() => onSelectSite(site)}
                className="egyptian-card cursor-pointer group flex flex-col h-full overflow-hidden bg-background-offset border border-egyptian-gold-dim"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={site.images[0]} 
                    alt={site.name?.[i18n.language as 'ar'|'en'|'ru'] || ''} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background-offset to-transparent opacity-60" />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-bold text-egyptian-gold uppercase tracking-widest">
                      {GOVERNORATES.find(g => g.id === site.governorateId)?.name?.[i18n.language as 'ar'|'en'|'ru'] || 'Egypt'}
                    </span>
                    <div className="flex items-center gap-1 text-egyptian-gold">
                      <Star size={10} fill="currentColor" />
                      <span className="text-[10px] font-bold">4.9</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-serif font-bold mb-4 text-egyptian-gold-light group-hover:text-egyptian-gold transition-colors tracking-wide">
                    {site.name?.[i18n.language as 'ar'|'en'|'ru']}
                  </h4>
                  <p className="text-xs text-egyptian-gold-light/60 line-clamp-3 leading-relaxed mb-6 italic">
                     {site.description?.[i18n.language as 'ar'|'en'|'ru']}
                  </p>
                  <div className="text-[9px] uppercase tracking-widest text-egyptian-gold font-bold opacity-0 group-hover:opacity-100 transition-all">
                    Explore Details
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-background-offset border border-egyptian-gold-dim p-16 text-center relative overflow-hidden mb-24">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
             <div className="absolute top-10 left-10 text-9xl">𓋹</div>
             <div className="absolute bottom-10 right-10 text-9xl">𓁹</div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-serif font-bold mb-6 text-egyptian-gold uppercase tracking-widest">{t('ready_to_explore')}</h3>
            <p className="text-text-primary/70 max-w-2xl mx-auto mb-10 text-sm leading-relaxed italic">
              {t('cta_description')}
            </p>
            <button className="bg-transparent border border-egyptian-gold text-egyptian-gold px-12 py-4 rounded-none text-xs font-bold uppercase tracking-[0.3em] hover:bg-egyptian-gold hover:text-background-dark transition-all">
              {t('start_journey')}
            </button>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Home;
