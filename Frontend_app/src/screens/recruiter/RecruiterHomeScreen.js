import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Text } from "react-native-paper";
import RecruiterHomeTab from "./tabs/RecruiterHomeTab";
import JobDescriptionTab from "./tabs/JobDescriptionTab";
import RankingTab from "./tabs/RankingTab";
import RecruiterProfileTab from "./tabs/RecruiterProfileTab";
import Ionicons from "@react-native-vector-icons/ionicons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfileScreen from "../EditProfileScreen";
import ChangePasswordScreen from "../ChangePasswordScreen";
import ResultDetailsScreen from "../ResultDetailsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RecruiterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: "#5B5FEF",
        tabBarInactiveTintColor: "#8A90A6",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
          marginBottom: 6,
        },
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0,
          shadowColor: "#1E245F",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 12,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";

          if (route.name === "Home") iconName = "home-outline";
          if (route.name === "JD") iconName = "document-text-outline";
          if (route.name === "Rankings") iconName = "trophy-outline";
          if (route.name === "Profile") iconName = "person-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={RecruiterHomeTab} />
      <Tab.Screen name="JD" component={JobDescriptionTab} />
      <Tab.Screen name="Rankings" component={RankingTab} />
      <Tab.Screen name="Profile" component={RecruiterProfileTab} />
    </Tab.Navigator>
  );
}

function RecruiterHomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecruiterTabs" component={RecruiterTabs} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ResultDetails" component={ResultDetailsScreen} />
    </Stack.Navigator>
  );
}

export default RecruiterHomeScreen;
