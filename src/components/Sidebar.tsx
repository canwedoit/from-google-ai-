import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Map as MapIcon, Landmark, Ticket, Shield, Users, Compass } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const { t, i18n } = useTranslation();
  const { user, profile, isAdmin } = useAuth();

  const navItems = [
    { id: 'home', label: t('home'), icon: Globe },
    { id: 'map', label: t('map'), icon: MapIcon },
    { id: 'bookings', label: t('booking_title'), icon: Ticket },
    { id: 'kings', label: t('kings'), icon: Landmark },
    { id: 'mummies', label: t('mummies'), icon: Users },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: i18n.language === 'ar' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: i18n.language === 'ar' ? '100%' : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 w-80 bg-background-dark border-egyptian-gold/20 z-[70] p-8 flex flex-col",
              i18n.language === 'ar' ? "right-0 border-l" : "left-0 border-r"
            )}
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border border-egyptian-gold rounded-full flex items-center justify-center text-egyptian-gold font-serif">𓋹</div>
                <h2 className="text-egyptian-gold font-serif tracking-widest uppercase text-sm">{t('app_name')}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-egyptian-gold/40 hover:text-egyptian-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-egyptian-gold/30 mb-6 px-2">{t('menu')}</p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-4 transition-all group relative overflow-hidden",
                    currentPage === item.id 
                      ? "text-egyptian-gold bg-egyptian-gold/5" 
                      : "text-egyptian-gold-light/40 hover:text-egyptian-gold hover:bg-egyptian-gold/5"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "transition-transform group-hover:scale-110",
                    currentPage === item.id ? "text-egyptian-gold" : "text-egyptian-gold/40"
                  )} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                  {currentPage === item.id && (
                    <motion.div 
                      layoutId="active-pill"
                      className={cn(
                        "absolute w-1 h-full bg-egyptian-gold top-0",
                        i18n.language === 'ar' ? "right-0" : "left-0"
                      )}
                    />
                  )}
                </button>
              ))}

              {isAdmin && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-4 px-4 py-4 transition-all group text-red-500/60 hover:text-red-500 hover:bg-red-500/5 mt-8",
                    currentPage === 'admin' && "bg-red-500/5 text-red-500"
                  )}
                >
                  <Shield size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Command Center</span>
                </button>
              )}
            </div>

            <div className="pt-8 border-t border-egyptian-gold/10">
              <div className="flex items-center gap-4 px-4 py-3 bg-egyptian-gold/5 border border-egyptian-gold/10">
                <Compass className="text-egyptian-gold animate-spin-slow" size={20} />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-egyptian-gold/40">Status</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-egyptian-gold">Exploring Eternity</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
