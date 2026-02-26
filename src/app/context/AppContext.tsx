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
  updateProfile: (updates: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  // State for profile data
  const [farmerName, setFarmerNameVal] = useState('Ramesh Patil');
  const [stateVal, setStateValVal] = useState('Maharashtra');
  const [district, setDistrictVal] = useState('Nagpur');
  const [crop, setCropVal] = useState('Cotton');
  const [cropEmoji, setCropEmoji] = useState('🌿');
  const [farmSize, setFarmSizeVal] = useState('3.5');
  const [hasStorage, setHasStorageVal] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      else clearProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setFarmerNameVal(data.full_name || '');
        setStateValVal(data.state || '');
        setDistrictVal(data.district || '');
        setCropVal(data.crop || '');
        setCropEmoji(data.crop_emoji || '🌿');
        setFarmSizeVal(data.farm_size || '');
        setHasStorageVal(data.has_storage ?? true);
      }
    } catch (err) {
      console.warn('Profile sync: Table or record not found yet.');
    }
  };

  const clearProfile = () => {
    setFarmerNameVal('Ramesh Patil');
    setStateValVal('Maharashtra');
    setDistrictVal('Nagpur');
    setCropVal('Cotton');
    setCropEmoji('🌿');
    setFarmSizeVal('3.5');
    setHasStorageVal(true);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return;
    try {
      await supabase.from('profiles').upsert({
        id: user.id,
        updated_at: new Date().toISOString(),
        ...updates
      });
    } catch (err) {
      console.error('Profile sync failed');
    }
  };

  const setLanguage = (lang: Language) => setLang(lang);

  const setFarmerName = (val: string) => { setFarmerNameVal(val); updateProfile({ full_name: val }); };
  const setStateVal = (val: string) => { setStateValVal(val); updateProfile({ state: val }); };
  const setDistrict = (val: string) => { setDistrictVal(val); updateProfile({ district: val }); };
  const setFarmSize = (val: string) => { setFarmSizeVal(val); updateProfile({ farm_size: val }); };
  const setHasStorage = (val: boolean) => { setHasStorageVal(val); updateProfile({ has_storage: val }); };
  const setCrop = (c: string, e: string) => {
    setCropVal(c);
    setCropEmoji(e);
    updateProfile({ crop: c, crop_emoji: e });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearProfile();
  };

  const t = TRANSLATIONS[language] as T;

  return (
    <AppContext.Provider value={{
      language, user, farmerName, stateVal, district, crop, cropEmoji, farmSize, hasStorage, t,
      setLanguage, setUser, setFarmerName, setStateVal, setDistrict, setCrop, setFarmSize, setHasStorage, updateProfile, signOut
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
