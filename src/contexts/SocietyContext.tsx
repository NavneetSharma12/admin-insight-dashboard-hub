
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Society } from '../types/society';

interface SocietyContextType {
  selectedSociety: Society | null;
  setSelectedSociety: (society: Society | null) => void;
}

const SocietyContext = createContext<SocietyContextType | undefined>(undefined);

export const SocietyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedSociety, setSelectedSociety] = useState<Society | null>(null);

  return (
    <SocietyContext.Provider value={{ selectedSociety, setSelectedSociety }}>
      {children}
    </SocietyContext.Provider>
  );
};

export const useSociety = () => {
  const context = useContext(SocietyContext);
  if (context === undefined) {
    throw new Error('useSociety must be used within a SocietyProvider');
  }
  return context;
};
