import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, Calendar, User, Box, ExternalLink, Image as LucideImage, Ticket, Download, QrCode } from 'lucide-react';
import { Site, Booking } from '../types';
import { GOVERNORATES } from '../data/mockData';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

interface SiteModalProps {
  site: Site | null;
  onClose: () => void;
}

const SiteModal: React.FC<SiteModalProps> = ({ site, onClose }) => {
  const { t, i18n } = useTranslation();
  const { user, profile } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'adult' | 'student' | 'child'>('adult');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedTicket, setBookedTicket] = useState<Booking | null>(null);

  if (!site) return null;

  const lang = i18n.language as 'ar' | 'en' | 'ru';
  const gov = GOVERNORATES.find(g => g.id === site.governorateId);
  const isRtl = i18n.language === 'ar';

  const calculatePrice = () => {
    const base = site.basePrice || 200;
    if (category === 'student') return base * (1 - (site.studentDiscount || 50) / 100);
    if (category === 'child') return base * (1 - (site.childDiscount || 50) / 100);
    return base;
  };

  const handleBook = async () => {
    if (!user) {
      alert('Please log in to book tickets');
      return;
    }
    setIsBooking(true);
    const price = calculatePrice();
    const qrCode = `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const bookingData: Omit<Booking, 'id'> = {
      userId: user.uid,
      userName: profile?.email || user.email || 'Anonymous Traveler',
      siteId: site.id,
      siteName: site.name,
      bookingDate,
      category,
      price,
      qrCode,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      setBookedTicket({ id: docRef.id, ...bookingData });
    } catch (err) {
      console.error(err);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const generatePDF = () => {
    if (!bookedTicket) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(26, 26, 26);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(197, 160, 89);
    doc.setFontSize(24);
    doc.text('EGYPT ETERNALS - OFFICIAL TICKET', 105, 25, { align: 'center' });
    
    // Body
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(16);
    doc.text(`Location: ${bookedTicket.siteName.en}`, 20, 60);
    doc.text(`Date of Visit: ${bookedTicket.bookingDate}`, 20, 75);
    doc.text(`Visitor: ${bookedTicket.userName}`, 20, 90);
    doc.text(`Class: ${bookedTicket.category}`, 20, 105);
    doc.text(`Price: ${bookedTicket.price} EGP`, 20, 120);
    
    // Footer
    doc.setFontSize(10);
    doc.text('This ticket bears the seal of the eternal archives. Present at registry.', 105, 280, { align: 'center' });
    
    doc.save(`Ticket-${bookedTicket.siteName.en}-${bookedTicket.qrCode}.pdf`);
  };

  return (
    <>
      <AnimatePresence>
        {site && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!showBooking) onClose();
                else setShowBooking(false);
              }}
              className="absolute inset-0 bg-background-dark/95 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={`site-${site.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-6xl bg-background-dark border border-egyptian-gold-dim overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 z-50 p-3 bg-background-dark/80 border border-egyptian-gold/30 text-egyptian-gold hover:bg-egyptian-gold hover:text-background-dark transition-all"
              >
                <X size={20} />
              </button>

              {/* Left: Visual Gallery Headline */}
              <div className="md:w-1/2 h-80 md:h-full relative bg-background-offset border-r border-egyptian-gold-dim">
                <img 
                  src={site.images[0]} 
                  alt={site.name?.[lang] || ''} 
                  className="w-full h-full object-cover grayscale-[0.2] opacity-80"
                />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
                
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 border border-egyptian-gold flex items-center justify-center text-egyptian-gold">𓉶</div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-egyptian-gold">Archaeological Dossier</span>
                   </div>
                   <h2 className="text-4xl md:text-6xl font-serif font-black text-egyptian-gold-light uppercase tracking-tighter leading-none mb-2">
                      {site.name?.[lang]}
                    </h2>
                    <div className="hieroglyphic-font text-egyptian-gold/60 text-2xl mb-4 italic">
                      {site.hieroglyphicName || '𓋹𓏪𓐍𓂋𓏏𓊃'}
                    </div>
                </div>
              </div>

              {/* Right: Data & Chronicles */}
              <div className={cn(
                "md:w-1/2 p-10 md:p-16 overflow-y-auto bg-background-dark border-l border-egyptian-gold-dim relative",
                isRtl ? "text-right" : "text-left"
              )}>
                
                <AnimatePresence mode="wait">
                  {!showBooking ? (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                           <span className="text-[9px] font-black bg-egyptian-gold text-background-dark px-3 py-0.5 uppercase tracking-widest leading-normal">
                            {gov?.name?.[lang] || 'Egypt'}
                          </span>
                           <span className="text-egyptian-gold/40 text-[9px] font-black uppercase tracking-[0.2em]">
                            Timeline: {site.period?.[lang] || 'Ancient'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-text-primary/70 leading-relaxed italic border-l-2 border-egyptian-gold/20 pl-6 mb-10 first-letter:text-4xl first-letter:font-serif first-letter:text-egyptian-gold">
                          {site.description?.[lang]}
                        </p>
                      </div>

                      {/* Photo Gallery Section */}
                      <div className="space-y-8 mb-12">
                         <div className="flex items-center justify-between border-b border-egyptian-gold-dim pb-4">
                            <h4 className="text-[10px] uppercase font-black text-egyptian-gold tracking-[0.3em]">{t('photo_gallery')}</h4>
                            <LucideImage size={14} className="text-egyptian-gold/40" />
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                            {site.images.map((img, index) => (
                              <motion.div 
                                key={index} 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedImage(img)}
                                className="aspect-square bg-background-offset border border-egyptian-gold-dim overflow-hidden cursor-pointer group"
                              >
                                 <img 
                                   src={img} 
                                   alt={`${site.name?.[lang]} ${index + 1}`} 
                                   className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                                 />
                              </motion.div>
                            ))}
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="bg-background-offset p-6 border border-egyptian-gold-dim hover:border-egyptian-gold transition-all group">
                           <div className="flex items-center justify-between text-egyptian-gold mb-4 opacity-60 group-hover:opacity-100">
                             <Calendar size={18} />
                             <span className="text-[8px] font-black uppercase tracking-widest">Excavation</span>
                           </div>
                           <p className="text-xs font-bold text-egyptian-gold-light uppercase tracking-widest">{site.discoveryDate || t('ancient')}</p>
                        </div>
                        <div className="bg-background-offset p-6 border border-egyptian-gold-dim hover:border-egyptian-gold transition-all group">
                           <div className="flex items-center justify-between text-egyptian-gold mb-4 opacity-60 group-hover:opacity-100">
                             <User size={18} />
                             <span className="text-[8px] font-black uppercase tracking-widest">Archivists</span>
                           </div>
                           <p className="text-xs font-bold text-egyptian-gold-light uppercase tracking-widest">
                             {site.discoverers?.[0]?.[lang] || 'Royal Scribes'}
                           </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 mt-auto">
                        <button 
                          onClick={() => setShowBooking(true)}
                          className="w-full bg-egyptian-gold text-background-dark py-6 text-xs font-black uppercase tracking-[0.5em] hover:bg-egyptian-gold-light transition-all shadow-2xl flex items-center justify-center gap-4"
                        >
                          <Ticket size={20} />
                          Secure Passage (Book Ticket)
                        </button>
                        {site.virtualTourUrl && (
                          <button 
                            onClick={() => window.open(site.virtualTourUrl, '_blank', 'noopener,noreferrer')}
                            className="w-full border-2 border-egyptian-gold text-egyptian-gold py-4 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-egyptian-gold/10 transition-all flex items-center justify-center gap-3"
                          >
                            <ExternalLink size={16} />
                            {t('open_virtual_tour')}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="booking"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <button 
                        onClick={() => setShowBooking(false)}
                        className="mb-8 text-egyptian-gold text-[10px] uppercase font-black tracking-widest flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                      >
                        ← Back to Manifest
                      </button>
                      
                      <h3 className="text-3xl font-serif text-egyptian-gold mb-10 uppercase tracking-tighter">Initiate Booking</h3>
                      
                      {!bookedTicket ? (
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-widest text-egyptian-gold/60">Choose Timeline (Date)</label>
                            <input 
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full bg-background-offset border border-egyptian-gold/20 p-4 text-egyptian-gold-light focus:border-egyptian-gold outline-none"
                            />
                          </div>

                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-widest text-egyptian-gold/60">Explorer Category</label>
                            <div className="grid grid-cols-3 gap-4">
                               {['adult', 'student', 'child'].map(cat => (
                                 <button
                                   key={cat}
                                   onClick={() => setCategory(cat as any)}
                                   className={cn(
                                     "py-4 text-[9px] font-black uppercase tracking-widest border transition-all",
                                     category === cat 
                                      ? "bg-egyptian-gold text-background-dark border-egyptian-gold" 
                                      : "bg-background-offset text-egyptian-gold/60 border-egyptian-gold/20 hover:border-egyptian-gold/60"
                                   )}
                                 >
                                   {cat}
                                 </button>
                               ))}
                            </div>
                          </div>

                          <div className="p-8 bg-background-offset border border-egyptian-gold/20 text-center">
                             <p className="text-[9px] uppercase tracking-widest text-egyptian-gold/40 mb-2">Calculated Offering</p>
                             <div className="text-4xl font-serif text-egyptian-gold font-bold">{calculatePrice()} EGP</div>
                          </div>

                          {!user ? (
                             <div className="text-center p-6 bg-red-900/10 border border-red-500/30 text-red-500 text-[10px] uppercase font-black tracking-widest">
                               Authentication Required to Finalize
                             </div>
                          ) : (
                            <button 
                              onClick={handleBook}
                              disabled={isBooking}
                              className="w-full bg-egyptian-gold text-background-dark py-6 text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-egyptian-gold-light"
                            >
                              {isBooking ? 'Finalizing Scroll...' : 'Confirm Offering & Book'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-center space-y-10 py-10 scale-in">
                           <div className="inline-flex p-8 bg-white mb-6 border-4 border-egyptian-gold">
                              <QRCodeSVG value={bookedTicket.qrCode} size={200} />
                           </div>
                           <div>
                             <h4 className="text-2xl font-serif text-egyptian-gold uppercase mb-2">Registry Confirmed</h4>
                             <p className="text-xs text-egyptian-gold/60 italic">Your entry token has been etched into the eternal ledger.</p>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                             <button 
                               onClick={generatePDF}
                               className="bg-egyptian-gold text-background-dark py-4 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                             >
                               <Download size={14} /> Manifest PDF
                             </button>
                             <button 
                               onClick={() => setShowBooking(false)}
                               className="border border-egyptian-gold text-egyptian-gold py-4 text-[9px] font-black uppercase tracking-widest"
                             >
                               Close
                             </button>
                           </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 md:p-20"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              className="absolute top-10 right-10 text-egyptian-gold p-4 hover:scale-110 transition-transform bg-background-dark/50 rounded-full border border-egyptian-gold/20"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </motion.button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage} 
              className="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(197,160,89,0.2)]"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SiteModal;
