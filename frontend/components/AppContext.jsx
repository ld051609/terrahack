// src/contexts/AppContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
    const [desc, setDesc] = useState('');
    const [result, setResult] = useState('');

    return (
        <AppContext.Provider value={{ desc, setDesc, result, setResult }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);
