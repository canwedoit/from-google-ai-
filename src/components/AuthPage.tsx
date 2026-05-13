import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck, Languages } from 'lucide-react';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          role: 'user',
          createdAt: serverTimestamp(),
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 pb-20 px-4 flex items-center justify-center min-h-screen bg-background-dark relative overflow-hidden">
      {/* Language Selector Fixed to Top */}
      <div className={`absolute top-24 ${i18n.language === 'ar' ? 'left-8' : 'right-8'} z-50`}>
        <button 
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-background-offset border border-egyptian-gold/30 text-egyptian-gold hover:bg-egyptian-gold hover:text-background-dark transition-all text-xs font-black uppercase tracking-widest min-w-[120px] justify-between"
        >
          <Languages size={14} />
          {i18n.language.toUpperCase()}
        </button>
        
        <AnimatePresence>
          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute top-full mt-2 w-full bg-background-offset border border-egyptian-gold/20 shadow-2xl z-50 p-1 ${i18n.language === 'ar' ? 'right-0' : 'left-0'}`}
            >
              {languages.map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => toggleLanguage(lng.code)}
                  className="w-full text-left px-3 py-2 text-[10px] font-black uppercase tracking-widest text-egyptian-gold/60 hover:text-egyptian-gold hover:bg-egyptian-gold/10 transition-all"
                >
                  {lng.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Ornaments */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-egyptian-gold to-transparent opacity-20" />
      <div className="absolute top-20 right-[10%] text-egyptian-gold/5 text-[15rem] pointer-events-none select-none font-serif">𓇳</div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-background-offset border-2 border-egyptian-gold-dim p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 border-2 border-egyptian-gold mb-6">
            {isLogin ? <LogIn className="text-egyptian-gold" size={32} /> : <UserPlus className="text-egyptian-gold" size={32} />}
          </div>
          <h2 className="text-3xl font-serif font-bold text-egyptian-gold-light uppercase tracking-tighter mb-2">
            {isLogin ? t('login_title') : t('signup_title')}
          </h2>
          <p className="text-[10px] text-egyptian-gold/60 uppercase tracking-[0.3em] font-black">
            {t('secure_clearance')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-egyptian-gold/40`} size={18} />
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_label')}
              className={`w-full bg-background-dark border border-egyptian-gold/20 py-4 ${i18n.language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-egyptian-gold-light focus:border-egyptian-gold outline-none transition-all placeholder:text-egyptian-gold/20 text-sm`}
              required
            />
          </div>

          <div className="relative">
            <Lock className={`absolute ${i18n.language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-egyptian-gold/40`} size={18} />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password_label')}
              className={`w-full bg-background-dark border border-egyptian-gold/20 py-4 ${i18n.language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-egyptian-gold-light focus:border-egyptian-gold outline-none transition-all placeholder:text-egyptian-gold/20 text-sm`}
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/50 p-4 text-red-500 text-[10px] uppercase font-bold tracking-widest text-center">
              {t('clearance_revoked')}: {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-egyptian-gold text-background-dark py-4 text-xs font-black uppercase tracking-[0.4em] hover:bg-egyptian-gold-light transition-all shadow-[0_0_20px_rgba(197,160,89,0.3)] disabled:opacity-50"
          >
            {loading ? t('processing') : (isLogin ? t('initiate_sequence') : t('create_credentials'))}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-egyptian-gold/10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[9px] uppercase font-bold text-egyptian-gold/60 hover:text-egyptian-gold tracking-widest transition-colors"
          >
            {isLogin ? t('need_clearance') : t('already_registered')}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 opacity-20 group grayscale hover:grayscale-0 transition-all cursor-default">
           <ShieldCheck size={16} className="text-egyptian-gold" />
           <span className="text-[8px] font-black uppercase tracking-[0.5em] text-egyptian-gold">{t('cryptography_enabled')}</span>
        </div>
      </motion.div>
    </div>
  );
};
