import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../services/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Site, Booking, AppUser } from '../types';
import { 
  Settings, Users, MapPin, Ticket, Plus, Save, Trash2, 
  UserPlus, Shield, TrendingUp, DollarSign, Percent, ChevronRight 
} from 'lucide-react';
import { cn } from '../lib/utils';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sites' | 'bookings' | 'users' | 'addAdmin'>('sites');
  const [sites, setSites] = useState<Site[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [editingSite, setEditingSite] = useState<Partial<Site> | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'sites') {
        const snap = await getDocs(collection(db, 'sites'));
        setSites(snap.docs.map(d => ({ id: d.id, ...d.data() } as Site)));
      } else if (activeTab === 'bookings') {
        const snap = await getDocs(collection(db, 'bookings'));
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
      } else if (activeTab === 'users') {
        const snap = await getDocs(collection(db, 'users'));
        setUsers(snap.docs.map(d => ({ ...d.data() } as AppUser)));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSaveSite = async () => {
    if (!editingSite?.id) return;
    try {
      await setDoc(doc(db, 'sites', editingSite.id), editingSite, { merge: true });
      setEditingSite(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSite = async (id: string) => {
    if (!confirm('Are you sure you want to delete this site?')) return;
    try {
      await deleteDoc(doc(db, 'sites', id));
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // NOTE: Creating a new user logs the current user out in standard Firebase Auth if we use standard Flow.
      // In a real app we'd use a cloud function or different strategy.
      // For this demo, let's assume we use a specialized logic or just warn.
      alert('In a real environment, this would call a Cloud Function to prevent current session logout.');
      // Simulating...
      console.log('Creating admin:', newAdminEmail);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Nav */}
        <div className="md:w-64 shrink-0">
          <div className="bg-background-offset border-2 border-egyptian-gold-dim p-6 mb-8">
            <h2 className="text-egyptian-gold font-serif font-bold text-2xl uppercase tracking-tighter mb-1">Command Center</h2>
            <p className="text-[8px] uppercase tracking-[0.4em] font-black text-egyptian-gold/40">Authorized Personnel Only</p>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'sites', icon: MapPin, label: 'Historical Sites' },
              { id: 'bookings', icon: Ticket, label: 'Ledger: Bookings' },
              { id: 'users', icon: Users, label: 'Registry: Users' },
              { id: 'addAdmin', icon: UserPlus, label: 'Delegate Power' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  activeTab === tab.id 
                    ? "bg-egyptian-gold text-background-dark shadow-xl" 
                    : "text-egyptian-gold/60 hover:text-egyptian-gold bg-background-offset/50 border border-egyptian-gold-dim"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-background-offset border-2 border-egyptian-gold-dim p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-serif select-none pointer-events-none">
            𓇳
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10"
            >
              {activeTab === 'sites' && (
                <div>
                  <div className="flex items-center justify-between mb-10 pb-4 border-b border-egyptian-gold/20">
                    <h3 className="text-2xl font-serif text-egyptian-gold-light uppercase">Oversee Sites</h3>
                    <button className="flex items-center gap-2 bg-egyptian-gold/10 border border-egyptian-gold/30 text-egyptian-gold px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-egyptian-gold hover:text-background-dark transition-all">
                      <Plus size={14} /> New Monument
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {sites.map(site => (
                      <div key={site.id} className="bg-background-dark border border-egyptian-gold/20 p-6 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-background-offset border border-egyptian-gold-dim overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                            <img src={site.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-egyptian-gold font-bold uppercase tracking-widest text-sm">{site.name.en}</h4>
                            <div className="flex items-center gap-4 mt-2">
                               <div className="flex items-center gap-1 text-[9px] text-egyptian-gold/40">
                                 <DollarSign size={10} /> Base: {site.basePrice} EGP
                               </div>
                               <div className="flex items-center gap-1 text-[9px] text-egyptian-gold/40">
                                 <Percent size={10} /> Discount: {site.studentDiscount}%
                               </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <button 
                             onClick={() => setEditingSite(site)}
                             className="p-3 text-egyptian-gold hover:bg-egyptian-gold/10 transition-all"
                           >
                             <Settings size={18} />
                           </button>
                           <button 
                             onClick={() => handleDeleteSite(site.id)}
                             className="p-3 text-red-500 hover:bg-red-500/10 transition-all"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {editingSite && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-background-dark/95 backdrop-blur-md">
                      <div className="w-full max-w-2xl bg-background-offset border-2 border-egyptian-gold p-10 shadow-2xl relative">
                        <h4 className="text-xl font-serif text-egyptian-gold mb-8 uppercase tracking-tighter">Modify Monument: {editingSite.name?.en}</h4>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                           <div className="space-y-2">
                             <label className="text-[9px] uppercase font-black tracking-widest text-egyptian-gold/60">Base Price (EGP)</label>
                             <input 
                               type="number"
                               value={editingSite.basePrice || 0}
                               onChange={e => setEditingSite({...editingSite, basePrice: Number(e.target.value)})}
                               className="w-full bg-background-dark border border-egyptian-gold/20 p-3 text-egyptian-gold"
                             />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[9px] uppercase font-black tracking-widest text-egyptian-gold/60">Student Discount (%)</label>
                             <input 
                               type="number"
                               value={editingSite.studentDiscount || 0}
                               onChange={e => setEditingSite({...editingSite, studentDiscount: Number(e.target.value)})}
                               className="w-full bg-background-dark border border-egyptian-gold/20 p-3 text-egyptian-gold"
                             />
                           </div>
                        </div>
                        <div className="flex gap-4">
                           <button 
                             onClick={handleSaveSite}
                             className="flex-1 bg-egyptian-gold text-background-dark py-4 text-[10px] font-black uppercase tracking-widest"
                           >
                             Save Changes
                           </button>
                           <button 
                             onClick={() => setEditingSite(null)}
                             className="flex-1 border border-egyptian-gold/30 text-egyptian-gold py-4 text-[10px] font-black uppercase tracking-widest"
                           >
                             Dismiss
                           </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bookings' && (
                <div>
                  <h3 className="text-2xl font-serif text-egyptian-gold-light uppercase mb-10 pb-4 border-b border-egyptian-gold/20">Ticket Registry</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-egyptian-gold/20 text-[9px] uppercase tracking-[0.2em] text-egyptian-gold/40">
                          <th className="p-4 text-left">Explorer</th>
                          <th className="p-4 text-left">Manifestation</th>
                          <th className="p-4 text-left">Timeline</th>
                          <th className="p-4 text-left">Class</th>
                          <th className="p-4 text-left">Collection</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(booking => (
                          <tr key={booking.id} className="border-b border-egyptian-gold/10 hover:bg-egyptian-gold/5 transition-all group">
                             <td className="p-4 text-[11px] text-egyptian-gold-light font-bold uppercase">{booking.userName}</td>
                             <td className="p-4 text-[10px] text-egyptian-gold/60 uppercase">{booking.siteName.en}</td>
                             <td className="p-4 text-[10px] text-egyptian-gold/60">{booking.bookingDate}</td>
                             <td className="p-4 text-[10px] text-egyptian-gold/60 uppercase">{booking.category}</td>
                             <td className="p-4 text-[11px] text-egyptian-gold font-black">{booking.price} EGP</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                   <h3 className="text-2xl font-serif text-egyptian-gold-light uppercase mb-10 pb-4 border-b border-egyptian-gold/20">Registry of Souls</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {users.map(user => (
                        <div key={user.uid} className="bg-background-dark border border-egyptian-gold-dim p-6 flex items-center justify-between">
                           <div>
                             <p className="text-egyptian-gold-light text-sm font-bold">{user.email}</p>
                             <div className="flex items-center gap-3 mt-1">
                               <span className={cn(
                                 "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border",
                                 user.role === 'admin' ? "bg-egyptian-gold text-background-dark border-egyptian-gold" : "text-egyptian-gold/40 border-egyptian-gold/20"
                               )}>
                                 {user.role}
                               </span>
                             </div>
                           </div>
                           <Shield className={cn(user.role === 'admin' ? "text-egyptian-gold" : "text-egyptian-gold/10")} size={20} />
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeTab === 'addAdmin' && (
                <div className="max-w-md mx-auto">
                   <div className="text-center mb-10">
                      <div className="inline-flex p-4 border border-egyptian-gold mb-6 animate-pulse">
                        <UserPlus className="text-egyptian-gold" size={32} />
                      </div>
                      <h3 className="text-2xl font-serif text-egyptian-gold-light uppercase tracking-tighter">Anoint New Overseer</h3>
                      <p className="text-[9px] uppercase tracking-[0.3em] font-black text-egyptian-gold/40 mt-2">Grant administrative clearance</p>
                   </div>
                   <form onSubmit={handleCreateAdmin} className="space-y-6">
                      <input 
                        placeholder="Email Address"
                        className="w-full bg-background-dark border border-egyptian-gold/20 p-4 text-egyptian-gold-light placeholder:text-egyptian-gold/20 outline-none focus:border-egyptian-gold"
                      />
                      <input 
                        type="password"
                        placeholder="Private Key"
                        className="w-full bg-background-dark border border-egyptian-gold/20 p-4 text-egyptian-gold-light placeholder:text-egyptian-gold/20 outline-none focus:border-egyptian-gold"
                      />
                      <button className="w-full bg-egyptian-gold text-background-dark py-4 text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-egyptian-gold-light transition-all">
                        Finalize Succession
                      </button>
                   </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
