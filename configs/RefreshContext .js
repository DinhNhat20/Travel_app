import React, { createContext, useContext, useState } from 'react';

const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
    const [refreshCallback, setRefreshCallback] = useState(null);

    const registerRefreshCallback = (callback) => {
        setRefreshCallback(() => callback);
    };

    return (
        <RefreshContext.Provider value={{ refreshCallback, registerRefreshCallback }}>
            {children}
        </RefreshContext.Provider>
    );
};

export const useRefresh = () => useContext(RefreshContext);
