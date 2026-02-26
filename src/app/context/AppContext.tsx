import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, TRANSLATIONS, T } from '../data/translations';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

interface AppState {
  language: Language;
  user: User | null;
  farmerName: string;
  stateVal: string;
  district: string;
  crop: string;
  cropEmoji: string;
  farmSize: string;
  hasStorage: boolean;
  t: T;
  setLanguage: (lang: Language) => void;
  setUser: (user: User | null) => void;
  setFarmerName: (name: string) => void;
  setStateVal: (s: string) => void;
  setDistrict: (d: string) => void;
  setCrop: (crop: string, emoji: string) => void;
  setFarmSize: (size: string) => void;
  setHasStorage: (has: boolean) => void;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [farmerName, setFarmerName] = useState('Ramesh Patil');
  const [stateVal, setStateVal] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nagpur');
  const [crop, setCropVal] = useState('Cotton');
  const [cropEmoji, setCropEmoji] = useState('🌿');
  const [farmSize, setFarmSize] = useState('3.5');
  const [hasStorage, setHasStorage] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.full_name) {
        setFarmerName(session.user.user_metadata.full_name);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.full_name) {
        setFarmerName(session.user.user_metadata.full_name);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setLanguage = (lang: Language) => setLang(lang);
  const setCrop = (c: string, e: string) => { setCropVal(c); setCropEmoji(e); };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const t = TRANSLATIONS[language] as T;

  return (
    <AppContext.Provider value={{
      language, user, farmerName, stateVal, district, crop, cropEmoji, farmSize, hasStorage, t,
      setLanguage, setUser, setFarmerName, setStateVal, setDistrict, setCrop, setFarmSize, setHasStorage, signOut
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
