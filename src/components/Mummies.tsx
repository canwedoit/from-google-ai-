import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Wind, Shield, Droplets, Thermometer } from 'lucide-react';
import { cn } from '../lib/utils';

const Mummies: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en' | 'ru';
  const isRtl = i18n.language === 'ar';

  const steps = [
    { 
      id: 1, 
      title: { ar: 'التحنيط', en: 'Mummification', ru: 'Мумификация' }, 
      icon: Droplets,
      desc: { 
        ar: 'عملية معقدة استغرقت حوالي 70 يومًا للحفاظ على الجسد للحياة الآخرة.', 
        en: 'A complex process taking about 70 days to preserve the body for the afterlife.',
        ru: 'Сложный процесс, занимающий около 70 дней, для сохранения тела для загробной жизни.'
      }
    },
    { 
      id: 2, 
      title: { ar: 'النزع', en: 'Evisceration', ru: 'Эвисцерация' }, 
      icon: Wind,
      desc: { 
        ar: 'إزالة الأعضاء الداخلية وحفظها في أواني كانوبية خاصة.', 
        en: 'Removal of internal organs and preserving them in special canopic jars.',
        ru: 'Удаление внутренних органов и их сохранение в специальных канопах.'
      }
    }
  ];

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-5xl font-serif font-bold text-egyptian-gold mb-4 uppercase tracking-[0.3em]">
          {t('mummification_title')}
        </h2>
        <div className="w-48 h-0.5 bg-egyptian-gold/30 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {steps.map((step) => (
          <div key={step.id} className="egyptian-card bg-background-offset p-12 border border-egyptian-gold-dim flex flex-col items-center text-center group hover:border-egyptian-gold transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-egyptian-gold/5 flex items-center justify-center text-5xl text-egyptian-gold/10 font-serif">
              0{step.id}
            </div>
            <div className="w-20 h-20 border border-egyptian-gold flex items-center justify-center text-egyptian-gold mb-8 group-hover:bg-egyptian-gold group-hover:text-background-dark transition-all duration-500">
              <step.icon size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-egyptian-gold-light mb-6 uppercase tracking-wider">{step.title?.[lang]}</h3>
            <p className="text-xs text-text-primary/70 leading-relaxed italic max-w-sm mx-auto">{step.desc?.[lang]}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 bg-background-offset p-16 border border-egyptian-gold-dim shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-2 h-full bg-egyptian-gold opacity-60"></div>
         <div className={cn("flex flex-col lg:flex-row items-center gap-16", isRtl ? "lg:flex-row-reverse" : "")}>
            <div className="lg:w-1/2 space-y-8">
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-egyptian-gold block">National Museum Case Dossier</span>
               <h3 className="text-4xl md:text-5xl font-serif font-bold text-egyptian-gold-light uppercase tracking-wide leading-tight">
                 {t('mummy_list_title')}
               </h3>
               <p className="text-sm text-text-primary/70 leading-relaxed italic border-l border-egyptian-gold/10 pl-6">
                 {t('mummy_list_description')}
               </p>
               <button className="bg-egyptian-gold text-background-dark px-12 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-egyptian-gold-light transition-all shadow-lg">
                 {t('explore_mummies')}
               </button>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute -inset-4 border border-egyptian-gold-dim pointer-events-none"></div>
               <img 
                 src="https://images.unsplash.com/photo-1544473426-58674989e83f" 
                 alt="Ancient Sarcophagus"
                 className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 object-cover h-96 w-full"
               />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Mummies;
