import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import config from '../utils/config';

const LoginContext = createContext(null);

// Prevent splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

function AuthProvider({ children }) {
    const [loginStatus, setLoginStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            const remember = await AsyncStorage.getItem(config.KEY_REMEMBER_ME);

            setLoginStatus(remember === 'true');
        } catch (error) {
            console.log('Auth initialization error:', error);
            setLoginStatus(false);
        } finally {
            setIsLoading(false);
            await SplashScreen.hideAsync();
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <LoginContext.Provider
            value={{
                loginStatus,
                setLoginStatus,
            }}
        >
            {children}
        </LoginContext.Provider>
    );
}

export const useLoginContext = () => {
    return useContext(LoginContext);
};

export default AuthProvider;