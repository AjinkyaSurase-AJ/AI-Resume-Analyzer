import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import config from '../utils/config';
import { useLoginContext } from '../provider/AuthProvider';

import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';

import CandidateHomeScreen from './candidate/CandidateHomeScreen';
import RecruiterHomeScreen from './recruiter/RecruiterHomeScreen';
import AdminHomeScreen from './admin/AdminHomeScreen';

const Stack = createNativeStackNavigator();

function AppScreen() {
    const { loginStatus } = useLoginContext();

    const [initialRoute, setInitialRoute] = useState(null);

    useEffect(() => {
        determineInitialRoute();
    }, [loginStatus]);

    const determineInitialRoute = async () => {
        try {
            if (!loginStatus) {
                setInitialRoute('Login');
                return;
            }

            const token = await AsyncStorage.getItem(config.KEY_TOKEN);
            const userString = await AsyncStorage.getItem('user');

            if (!token || !userString) {
                setInitialRoute('Login');
                return;
            }

            const user = JSON.parse(userString);

            switch (user.role) {
                case 'candidate':
                    setInitialRoute('Home');
                    break;

                case 'recruiter':
                    setInitialRoute('RecruiterHome');
                    break;

                case 'admin':
                    setInitialRoute('AdminHome');
                    break;

                default:
                    setInitialRoute('Login');
            }
        } catch (error) {
            console.log('Navigation initialization error:', error);
            setInitialRoute('Login');
        }
    };

    if (initialRoute === null) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName={initialRoute}
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                    />

                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                    />

                    <Stack.Screen
                        name="Home"
                        component={CandidateHomeScreen}
                    />

                    <Stack.Screen
                        name="RecruiterHome"
                        component={RecruiterHomeScreen}
                    />

                    <Stack.Screen
                        name="AdminHome"
                        component={AdminHomeScreen}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default AppScreen;