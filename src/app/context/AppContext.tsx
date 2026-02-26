import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, TRANSLATIONS, T } from '../data/translations';

interface AppState {
  language: Language;
  farmerName: string;
  stateVal: string;
  district: string;
  crop: string;
  cropEmoji: string;
  farmSize: string;
  hasStorage: boolean;
  t: T;
  setLanguage: (lang: Language) => void;
  setFarmerName: (name: string) => void;
  setStateVal: (s: string) => void;
  setDistrict: (d: string) => void;
  setCrop: (crop: string, emoji: string) => void;
  setFarmSize: (size: string) => void;
  setHasStorage: (has: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>('en');
  const [farmerName, setFarmerName] = useState('Ramesh Patil');
  const [stateVal, setStateVal] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nagpur');
  const [crop, setCropVal] = useState('Cotton');
  const [cropEmoji, setCropEmoji] = useState('🌿');
  const [farmSize, setFarmSize] = useState('3.5');
  const [hasStorage, setHasStorage] = useState(true);

  const setLanguage = (lang: Language) => setLang(lang);
  const setCrop = (c: string, e: string) => { setCropVal(c); setCropEmoji(e); };

  const t = TRANSLATIONS[language] as T;

  return (
    <AppContext.Provider value={{
      language, farmerName, stateVal, district, crop, cropEmoji, farmSize, hasStorage, t,
      setLanguage, setFarmerName, setStateVal, setDistrict, setCrop, setFarmSize, setHasStorage,
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
