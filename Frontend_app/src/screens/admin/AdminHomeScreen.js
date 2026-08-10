import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import DashboardTab from './tabs/DashboardTab';
import UsersTab from './tabs/UsersTab';
import JobDescriptionsTab from './tabs/JobDescriptionsTab';


import AdminProfileTab from './tabs/AdminProfileTab';
import UserDetailsScreen from '../UserDetailsScreen';
import EditJobDescriptionScreen from '../EditJobDescriptionScreen';
import ResultDetailsScreen from '../ResultDetailsScreen';
import SystemLogsScreen from '../SystemLogsScreen';
import EditProfileScreen from '../EditProfileScreen';
import ChangePasswordScreen from '../ChangePasswordScreen';
import SettingsScreen from '../SettingsScreen';
import ResumeTab from './tabs/ResumeTab';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const tabIcons = {
  Dashboard: 'grid',
  Users: 'people',
  Jobs: 'briefcase',
  Resume: 'document-text',
  Profile: 'person-circle',
};

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#5B5FEF',
        tabBarInactiveTintColor: '#7A8194',
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={tabIcons[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardTab} />
      <Tab.Screen name="Users" component={UsersTab} />
      <Tab.Screen
        name="Jobs"
        component={JobDescriptionsTab}
        options={{ title: 'Job Descriptions' }}
      />
      <Tab.Screen name="Resume" component={ResumeTab} />
      <Tab.Screen name="Profile" component={AdminProfileTab} />
    </Tab.Navigator>
  );
}

export default function AdminHomeScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: styles.stackContent,
      }}
    >
      <Stack.Screen name="AdminTabs" component={AdminTabs} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="EditJobDescription" component={EditJobDescriptionScreen} />
      <Stack.Screen name="ResultDetails" component={ResultDetailsScreen} />
      <Stack.Screen name="SystemLogs" component={SystemLogsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  stackContent: {
    backgroundColor: '#F5F7FF',
  },
  tabBar: {
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#ECECEC',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
