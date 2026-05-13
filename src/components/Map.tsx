import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Governorate, Site } from '../types';
import { GOVERNORATES } from '../data/mockData';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface MapProps {
  onSelectSite: (site: Site) => void;
}

const EgyptMap: React.FC<MapProps> = ({ onSelectSite }) => {
  const { t, i18n } = useTranslation();
  const [zoom, setZoom] = useState(1);
  const [selectedGov, setSelectedGov] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  const lang = i18n.language as 'ar' | 'en' | 'ru';

  useEffect(() => {
    const fetchSites = async () => {
      const path = 'sites';
      try {
        const snap = await getDocs(collection(db, path));
        setSites(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Site)));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  return (
    <div className="pt-24 h-screen flex flex-col bg-background-dark">
      <div className="px-8 py-6 flex items-center justify-between glass-morphism border-b border-egyptian-gold-dim">
        <div>
          <h2 className="text-2xl font-serif font-bold text-egyptian-gold flex items-center gap-3 uppercase tracking-widest">
            <MapPin className="text-egyptian-gold" size={24} />
            {t('map_title')}
          </h2>
          <p className="text-[10px] text-egyptian-gold-light opacity-60 font-bold uppercase tracking-[0.2em] mt-1">
            {t('map_subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setZoom(Math.min(zoom + 0.2, 3))} className="w-10 h-10 flex items-center justify-center bg-background-card border border-egyptian-gold-dim text-egyptian-gold hover:border-egyptian-gold transition-all">
            <ZoomIn size={18} />
          </button>
          <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.5))} className="w-10 h-10 flex items-center justify-center bg-background-card border border-egyptian-gold-dim text-egyptian-gold hover:border-egyptian-gold transition-all">
            <ZoomOut size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-background-card border border-egyptian-gold-dim text-egyptian-gold hover:border-egyptian-gold transition-all">
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden bg-[#080808] perspective-1000">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#c5a059 1px, transparent 1px), linear-gradient(90deg, #c5a059 1px, transparent 1px)', 
               backgroundSize: '100px 100px',
               transform: 'rotateX(60deg) translateY(-200px) scale(3)',
               transformOrigin: 'top'
             }}></div>

        <div className="absolute inset-0 map-container flex items-center justify-center pointer-events-none">
          <motion.div 
            className="relative pointer-events-auto"
            animate={{ 
              scale: zoom,
              rotateX: 45,
              rotateZ: -15,
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 80 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* 3D Depth Layers */}
            <div className="absolute inset-0 bg-[#0a0a0a] translate-z-[-10px] border border-egyptian-gold/20" />
            <div className="absolute inset-0 bg-[#121212] translate-z-[-20px] border border-egyptian-gold/10" />
            <div className="absolute inset-0 bg-background-dark translate-z-[-30px] shadow-[0_50px_100px_rgba(0,0,0,0.8)]" />

            {/* Egypt Visual Representation */}
            <div className="relative w-[500px] h-[600px] bg-background-offset/90 border-2 border-egyptian-gold/30 overflow-hidden" 
                 style={{ transformStyle: 'preserve-3d' }}>
              
              <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
                   style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dark-leather.png")' }} />

              <div className="absolute left-[54%] top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-egyptian-blue/10 to-transparent -translate-x-1/2 blur-3xl" />
              <div className="absolute left-[54%] top-0 bottom-0 w-[4px] bg-egyptian-blue/20 -translate-x-1/2 shadow-[0_0_15px_rgba(30,58,138,0.5)]" />
              
              {GOVERNORATES.map((gov) => (
                <motion.div
                  key={gov.id}
                  className="absolute"
                  style={{ left: `${gov.coordinates.x}%`, top: `${gov.coordinates.y}%`, translateZ: '10px' }}
                  onMouseEnter={() => setSelectedGov(gov.id)}
                  onMouseLeave={() => setSelectedGov(null)}
                >
                  <div className="relative group cursor-pointer">
                    <motion.div 
                      className="w-2 h-2 bg-egyptian-gold/40 rounded-full"
                      whileHover={{ scale: 2, backgroundColor: "#c5a059", boxShadow: "0 0 15px #c5a059" }}
                    />
                  </div>
                </motion.div>
              ))}

              {sites.map((site) => (
                <motion.div
                  key={site.id}
                  className="absolute z-20"
                  style={{ 
                    left: `${site.coordinates.x}%`, 
                    top: `${site.coordinates.y}%`,
                  }}
                  onClick={() => onSelectSite(site)}
                >
                  <div className="relative group cursor-pointer flex flex-col items-center" style={{ transformStyle: 'preserve-3d' }}>
                    <motion.div 
                      className="relative z-30"
                      initial={{ translateZ: 40 }}
                      whileHover={{ translateZ: 60 }}
                      transition={{ type: 'spring', damping: 10 }}
                    >
                      <div className="text-egyptian-gold text-2xl drop-shadow-[0_0_10px_rgba(197,160,89,0.8)] filter drop-shadow(0 2px 2px black)">
                         𓉶
                      </div>
                      
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap bg-background-dark/90 border border-egyptian-gold px-2 py-1 text-[8px] font-black uppercase tracking-widest text-egyptian-gold opacity-0 group-hover:opacity-100 transition-all shadow-xl backdrop-blur-sm">
                        {site.name?.[lang]}
                      </div>
                    </motion.div>

                    <div className="absolute top-[10px] w-[1px] h-10 bg-gradient-to-t from-egyptian-gold via-egyptian-gold/20 to-transparent origin-top" 
                         style={{ transform: 'rotateX(-45deg)' }} />

                    <div className="w-2 h-2 bg-black/40 rounded-full blur-[2px] mt-2 translate-y-2 opacity-50 group-hover:opacity-80 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info Panel Overlays */}
        <div className="absolute top-8 left-8 w-64 bg-background-dark/80 backdrop-blur-md border border-egyptian-gold-dim p-6">
           <h3 className="text-[10px] uppercase tracking-[0.3em] text-egyptian-gold mb-4 border-b border-egyptian-gold-dim pb-2 font-bold">Region Explorer</h3>
           <div className="space-y-4">
              {GOVERNORATES.slice(0, 4).map(gov => (
                <div key={gov.id} className="flex justify-between items-center group cursor-pointer">
                   <span className="text-xs text-egyptian-gold-light hover:text-egyptian-gold transition-colors tracking-wide">{gov.name[lang]}</span>
                   <span className="text-[9px] opacity-40 font-bold">{gov.sitesCount} Sites</span>
                </div>
              ))}
           </div>
        </div>

        <div className="absolute bottom-8 right-8 p-8 bg-background-dark/95 border border-egyptian-gold overflow-hidden w-80 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
           <div className="absolute top-0 left-0 w-1 h-full bg-egyptian-gold"></div>
           {selectedGov ? (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 1 }}>
               <span className="text-[9px] font-bold text-egyptian-gold uppercase tracking-[0.2em] mb-2 block">Region Analysis</span>
               <h4 className="font-serif font-black text-2xl text-egyptian-gold-light uppercase tracking-wide mb-4">
                 {GOVERNORATES.find(g => g.id === selectedGov)?.name?.[lang]}
               </h4>
               <p className="text-xs text-egyptian-gold-light/60 font-medium mb-6 italic leading-relaxed">
                  {GOVERNORATES.find(g => g.id === selectedGov)?.sitesCount} {t('sites_found')} across the valley.
               </p>
               <button className="w-full bg-egyptian-gold text-background-dark text-[10px] font-black uppercase tracking-[0.2em] py-3 hover:bg-egyptian-gold-light transition-all">
                 {t('explore_governorate')}
               </button>
             </motion.div>
           ) : (
             <div className="text-[10px] text-egyptian-gold font-bold tracking-widest uppercase opacity-40 italic">
               {t('hover_governorate')}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default EgyptMap;
