import React, { useEffect } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';
import { SITES } from '../data/mockData';

export const FirebaseInitializer: React.FC = () => {
  useEffect(() => {
    const initApp = async () => {
      console.log('Firebase Initializer: Starting initialization sequence...');
      const SITES_PATH = 'sites';
      try {
        console.log('Firebase Initializer: Checking sites collection at path:', SITES_PATH);
        console.log('Firebase Initializer: Auth state:', auth.currentUser ? `Signed in as ${auth.currentUser.email}` : 'Signed out');
        const sitesSnap = await getDocs(collection(db, SITES_PATH));
        console.log('Firebase Initializer: Sites check result:', sitesSnap.empty ? 'Empty' : `Found ${sitesSnap.size} sites`);
        
        if (sitesSnap.empty) {
          console.log('Firebase Initializer: Seeding sites...');
          for (const site of SITES) {
             const { id, ...siteData } = site;
             const siteRef = doc(db, SITES_PATH, id);
             try {
                await setDoc(siteRef, {
                  ...siteData,
                  basePrice: 200,
                  createdAt: serverTimestamp()
                });
                console.log(`Firebase Initializer: Seeded site ${id}`);
             } catch (e) {
                console.warn(`Failed to seed site ${id}:`, e);
                // Don't throw here to continue seeding others
             }
          }
          console.log('Firebase Initializer: Seeding complete.');
        }
      } catch (err) {
        console.error('Firebase Initializer: Critical failure during sites check');
        handleFirestoreError(err, OperationType.LIST, SITES_PATH);
      }
    };

    initApp();
  }, []);

  return null;
};
