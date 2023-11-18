import React, { createContext, useContext, useState } from 'react';

// Crea un contesto
const AppContext = createContext();

// Crea un provider per il contesto
export function AppContextProvider({ children }) {
  const [data, setData] = useState({}); // Sostituisci {} con i tuoi dati iniziali

  // Funzione per aggiornare i dati
  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <AppContext.Provider value={{ data, updateData }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personalizzato per accedere al contesto
export function useAppContext() {
  return useContext(AppContext);
}
